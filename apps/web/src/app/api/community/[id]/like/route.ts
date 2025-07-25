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

const adminAuth = process.env.FIREBASE_PROJECT_ID ? getAuth() : null;

// Supabase 클라이언트
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * 게시글 좋아요 토글 API
 * POST /api/community/[id]/like
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

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

    const userId = decodedToken.uid;

    // 게시글 존재 확인
    const { data: post } = await supabase
      .from('posts')
      .select('id, like_count')
      .eq('id', postId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기존 좋아요 확인
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    let isLiked = false;
    let newLikeCount = post.like_count || 0;

    if (existingLike) {
      // 좋아요 제거
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) {
        throw new Error('좋아요 제거에 실패했습니다.');
      }

      isLiked = false;
      newLikeCount = Math.max(0, newLikeCount - 1);
    } else {
      // 좋아요 추가
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('좋아요 추가에 실패했습니다.');
      }

      isLiked = true;
      newLikeCount = newLikeCount + 1;
    }

    // 게시글의 좋아요 수 업데이트
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        like_count: newLikeCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (updateError) {
      throw new Error('게시글 업데이트에 실패했습니다.');
    }

    return NextResponse.json({
      data: {
        is_liked: isLiked,
        like_count: newLikeCount
      },
      message: isLiked ? '좋아요를 추가했습니다.' : '좋아요를 제거했습니다.'
    });

  } catch (error: any) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 