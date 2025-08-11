import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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
 * 게시글 상세 조회 API
 * GET /api/community/[id]
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
        // 토큰이 유효하지 않아도 계속 진행 (비로그인 사용자도 조회 가능)
        console.log('Invalid token, proceeding as guest');
      }
    }

    // 게시글 조회
    const { data: post, error: postError } = await supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles(id, display_name, avatar_url, role)
      `)
      .eq('id', postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await supabase
      .from('community_posts')
      .update({ 
        view_count: (post.view_count || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    // 사용자별 좋아요/북마크 상태 확인
    let isLiked = false;
    let isBookmarked = false;

    if (currentUserId) {
      // 좋아요 상태 확인
      const { data: likeData } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', currentUserId)
        .single();

      isLiked = !!likeData;

      // 북마크 상태 확인
      const { data: bookmarkData } = await supabase
        .from('community_bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', currentUserId)
        .single();

      isBookmarked = !!bookmarkData;
    }

    // 응답 데이터 구성
    const responseData = {
      ...post,
      view_count: (post.view_count || 0) + 1,
      is_liked: isLiked,
      is_bookmarked: isBookmarked,
      author: post.author
    };

    return NextResponse.json({
      data: responseData
    });

  } catch (error) {
    console.error('Post detail API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 게시글 수정 API
 * PATCH /api/community/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
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

    // 게시글 소유자 확인
    const { data: post } = await supabase
      .from('community_posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!post || post.author_id !== decodedToken.uid) {
      return NextResponse.json(
        { error: '게시글을 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 요청 데이터 파싱
    const body = await request.json();
    const { title, content, category } = body;

    // 게시글 업데이트
    const { data: updatedPost, error: updateError } = await supabase
      .from('community_posts')
      .update({
        title,
        content,
        category,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select(`
        *,
        author:profiles(id, display_name, avatar_url, role)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: '게시글 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedPost,
      message: '게시글이 수정되었습니다.'
    });

  } catch (error) {
    console.error('Post update API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 게시글 삭제 API
 * DELETE /api/community/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    // 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
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

    // 게시글 소유자 확인
    const { data: post } = await supabase
      .from('community_posts')
      .select('author_id')
      .eq('id', postId)
      .single();

    if (!post || post.author_id !== decodedToken.uid) {
      return NextResponse.json(
        { error: '게시글을 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 게시글 삭제 (CASCADE로 관련 데이터도 함께 삭제)
    const { error: deleteError } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (deleteError) {
      return NextResponse.json(
        { error: '게시글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '게시글이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Post delete API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 