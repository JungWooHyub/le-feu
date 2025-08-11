import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin 초기화 (환경변수가 있을 때만)
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
 * 게시글 북마크 토글 API
 * POST /api/community/[id]/bookmark
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
    
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin이 초기화되지 않았습니다.' },
        { status: 500 }
      );
    }
    
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
      .from('community_posts')
      .select('id, bookmark_count')
      .eq('id', postId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 기존 북마크 확인
    const { data: existingBookmark } = await supabase
      .from('community_bookmarks')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    let isBookmarked = false;
    let newBookmarkCount = post.bookmark_count || 0;

    if (existingBookmark) {
      // 북마크 제거
      const { error: deleteError } = await supabase
        .from('community_bookmarks')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (deleteError) {
        throw new Error('북마크 제거에 실패했습니다.');
      }

      isBookmarked = false;
      newBookmarkCount = Math.max(0, newBookmarkCount - 1);
    } else {
      // 북마크 추가
      const { error: insertError } = await supabase
        .from('community_bookmarks')
        .insert({
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('북마크 추가에 실패했습니다.');
      }

      isBookmarked = true;
      newBookmarkCount = newBookmarkCount + 1;
    }

    // 게시글의 북마크 수 업데이트
    const { error: updateError } = await supabase
      .from('community_posts')
      .update({
        bookmark_count: newBookmarkCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId);

    if (updateError) {
      throw new Error('게시글 업데이트에 실패했습니다.');
    }

    return NextResponse.json({
      data: {
        is_bookmarked: isBookmarked,
        bookmark_count: newBookmarkCount
      },
      message: isBookmarked ? '북마크를 추가했습니다.' : '북마크를 제거했습니다.'
    });

  } catch (error: any) {
    console.error('Bookmark API error:', error);
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 