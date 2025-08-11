import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { validateComment } from '../../../../../lib/validation';
import { commentRateLimit } from '../../../../../lib/rateLimit';

// Firebase Admin 초기화
if (getApps().length === 0 && process.env.FIREBASE_PROJECT_ID) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const adminAuth = getAuth();

// Supabase 클라이언트
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 댓글 목록 조회 API
 * GET /api/community/[id]/comments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    let currentUserId: string | null = null;

    // 인증 토큰 확인 (선택사항)
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decodedToken = await adminAuth.verifyIdToken(token);
        currentUserId = decodedToken.uid;
      } catch (error) {
        console.log('Invalid token, proceeding as guest');
      }
    }

    // 댓글 조회 (부모 댓글만, 답글은 별도 조회)
    const { data: comments, error: commentsError } = await supabase
      .from('community_comments')
      .select(`
        *,
        author:profiles(id, display_name, avatar_url, role)
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    if (commentsError) {
      return NextResponse.json(
        { error: '댓글을 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 각 댓글의 답글도 조회
    const commentsWithReplies = await Promise.all(
      (comments || []).map(async (comment) => {
        // 답글 조회
        const { data: replies } = await supabase
          .from('community_comments')
          .select(`
            *,
            author:profiles(id, display_name, avatar_url, role)
          `)
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });

        // 댓글 좋아요 수 조회
        const { count: likeCount } = await supabase
          .from('community_comment_likes')
          .select('*', { count: 'exact' })
          .eq('comment_id', comment.id);

        // 사용자의 좋아요 상태 확인
        let isLiked = false;
        if (currentUserId) {
          const { data: userLike } = await supabase
            .from('community_comment_likes')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', currentUserId)
            .single();
          
          isLiked = !!userLike;
        }

        // 답글들의 좋아요 정보도 처리
        const repliesWithLikes = await Promise.all(
          (replies || []).map(async (reply) => {
            const { count: replyLikeCount } = await supabase
              .from('community_comment_likes')
              .select('*', { count: 'exact' })
              .eq('comment_id', reply.id);

            let isReplyLiked = false;
            if (currentUserId) {
              const { data: userReplyLike } = await supabase
                .from('community_comment_likes')
                .select('id')
                .eq('comment_id', reply.id)
                .eq('user_id', currentUserId)
                .single();
              
              isReplyLiked = !!userReplyLike;
            }

            return {
              ...reply,
              like_count: replyLikeCount || 0,
              is_liked: isReplyLiked
            };
          })
        );

        return {
          ...comment,
          like_count: likeCount || 0,
          is_liked: isLiked,
          replies: repliesWithLikes
        };
      })
    );

    return NextResponse.json({
      data: commentsWithReplies
    });

  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 댓글 작성 API
 * POST /api/community/[id]/comments
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // Rate limiting 확인
    const rateLimitResult = commentRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: '너무 많은 댓글 작성 요청입니다. 잠시 후 다시 시도해주세요.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 요청 데이터 파싱
    const body = await request.json();
    const { content, parent_id } = body;

    // 입력 검증
    const validation = validateComment(content);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // 게시글 존재 확인
    const { data: post } = await supabase
      .from('community_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 부모 댓글 존재 확인 (답글인 경우)
    if (parent_id) {
      const { data: parentComment } = await supabase
        .from('community_comments')
        .select('id')
        .eq('id', parent_id)
        .eq('post_id', postId)
        .single();

      if (!parentComment) {
        return NextResponse.json(
          { error: '부모 댓글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
    }

    // 댓글 생성
    const { data: newComment, error: insertError } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        author_id: decodedToken.uid,
        content: content.trim(),
        parent_id: parent_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        author:profiles(id, display_name, avatar_url, role)
      `)
      .single();

    if (insertError) {
      console.error('Comment insert error:', insertError);
      return NextResponse.json(
        { error: '댓글 작성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 게시글의 댓글 수 업데이트
    const { count: totalComments } = await supabase
      .from('community_comments')
      .select('*', { count: 'exact' })
      .eq('post_id', postId);

    await supabase
      .from('community_posts')
      .update({ 
        comment_count: totalComments || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    return NextResponse.json({
      data: {
        ...newComment,
        like_count: 0,
        is_liked: false,
        replies: []
      },
      message: '댓글이 작성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('Comment create API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 