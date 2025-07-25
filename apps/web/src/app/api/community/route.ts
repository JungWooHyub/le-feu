import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 커뮤니티 게시물 목록 조회 API
 * GET /api/community
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const category = searchParams.get('category'); // question, review, free, job_posting
    const sort = searchParams.get('sort') || 'latest'; // latest, popular, oldest

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 공개 조회는 anon key 사용
    );

    // 쿼리 빌더 시작
    let query = supabase
      .from('community_posts')
      .select(`
        id,
        title,
        content,
        category,
        tags,
        view_count,
        like_count,
        comment_count,
        is_pinned,
        created_at,
        updated_at,
        author:profiles(
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .eq('status', 'published');

    // 카테고리 필터 적용
    if (category) {
      query = query.eq('category', category);
    }

    // 정렬 조건 적용
    switch (sort) {
      case 'popular':
        query = query.order('like_count', { ascending: false })
                    .order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      default: // latest
        query = query.order('is_pinned', { ascending: false })
                    .order('created_at', { ascending: false });
    }

    // 페이지네이션 적용
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: posts, error } = await query;

    if (error) {
      console.error('커뮤니티 게시물 조회 오류:', error);
      return NextResponse.json(
        { error: '게시물을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 총 개수 조회 (페이지네이션용)
    const { count: totalCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('커뮤니티 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 새로운 커뮤니티 게시물 작성 API
 * POST /api/community
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { title, content, category, tags } = body;

    // 입력 검증
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리는 필수입니다.' },
        { status: 400 }
      );
    }

    // 카테고리 유효성 검증
    const validCategories = ['question', 'review', 'free', 'job_posting'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: '유효하지 않은 카테고리입니다.' },
        { status: 400 }
      );
    }

    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Supabase 클라이언트 생성 (인증된 요청)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 토큰으로 사용자 인증
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '유효하지 않은 인증 토큰입니다.' },
        { status: 401 }
      );
    }

    // 게시물 생성
    const { data: newPost, error: insertError } = await supabase
      .from('community_posts')
      .insert({
        title,
        content,
        category,
        tags: tags || [],
        author_id: user.id,
        status: 'published'
      })
      .select(`
        id,
        title,
        content,
        category,
        tags,
        created_at,
        author:profiles(
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .single();

    if (insertError) {
      console.error('게시물 생성 오류:', insertError);
      return NextResponse.json(
        { error: '게시물 작성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: newPost,
      message: '게시물이 성공적으로 작성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('커뮤니티 게시물 작성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 