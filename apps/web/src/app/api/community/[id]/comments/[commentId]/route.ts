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
 * 댓글 수정 API
 * PATCH /api/community/[id]/comments/[commentId]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const postId = params.id;
    const commentId = params.commentId;

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

    // 댓글 소유자 확인
    const { data: comment } = await supabase
      .from('community_comments')
      .select('author_id')
      .eq('id', commentId)
      .eq('post_id', postId)
      .single();

    if (!comment || comment.author_id !== decodedToken.uid) {
      return NextResponse.json(
        { error: '댓글을 수정할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 요청 데이터 파싱
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: '댓글 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 댓글 업데이트
    const { data: updatedComment, error: updateError } = await supabase
      .from('community_comments')
      .update({
        content: content.trim(),
        is_edited: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select(`
        *,
        author:profiles(id, display_name, avatar_url, role)
      `)
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: '댓글 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: updatedComment,
      message: '댓글이 수정되었습니다.'
    });

  } catch (error) {
    console.error('Comment update API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 댓글 삭제 API
 * DELETE /api/community/[id]/comments/[commentId]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const postId = params.id;
    const commentId = params.commentId;

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

    // 댓글 소유자 확인
    const { data: comment } = await supabase
      .from('community_comments')
      .select('author_id')
      .eq('id', commentId)
      .eq('post_id', postId)
      .single();

    if (!comment || comment.author_id !== decodedToken.uid) {
      return NextResponse.json(
        { error: '댓글을 삭제할 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 댓글 삭제 (CASCADE로 대댓글도 함께 삭제)
    const { error: deleteError } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      return NextResponse.json(
        { error: '댓글 삭제에 실패했습니다.' },
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
      message: '댓글이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Comment delete API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}