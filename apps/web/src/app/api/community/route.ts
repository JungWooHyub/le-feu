import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePostData } from '../../../lib/validation';
import { postRateLimit } from '../../../lib/rateLimit';

/**
 * 커뮤니티 게시물 목록 조회 API
 * GET /api/community
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const category = searchParams.get('category'); // question, review, free, job_posting
    const sort = searchParams.get('sort') || 'latest'; // latest, popular, oldest
    const search = searchParams.get('search'); // 검색어
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []; // 태그 필터
    const dateRange = searchParams.get('dateRange') || 'all'; // 날짜 범위 필터
    const minLikes = parseInt(searchParams.get('minLikes') || '0'); // 최소 좋아요 수

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

    // 검색 필터 적용 (제목, 내용에서 검색)
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 태그 필터 적용
    if (tags.length > 0) {
      // PostgreSQL의 배열 연산자 사용
      query = query.overlaps('tags', tags);
    }

    // 날짜 범위 필터 적용
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      query = query.gte('created_at', startDate.toISOString());
    }

    // 최소 좋아요 수 필터 적용
    if (minLikes > 0) {
      query = query.gte('like_count', minLikes);
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

    // 총 개수 조회 (페이지네이션용) - 같은 필터 적용
    let countQuery = supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    // 카테고리 필터 적용
    if (category) {
      countQuery = countQuery.eq('category', category);
    }

    // 검색 필터 적용
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // 태그 필터 적용
    if (tags.length > 0) {
      countQuery = countQuery.overlaps('tags', tags);
    }

    // 날짜 범위 필터 적용
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      countQuery = countQuery.gte('created_at', startDate.toISOString());
    }

    // 최소 좋아요 수 필터 적용
    if (minLikes > 0) {
      countQuery = countQuery.gte('like_count', minLikes);
    }

    const { count: totalCount } = await countQuery;

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
    // Rate limiting 확인
    const rateLimitResult = postRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: '너무 많은 게시글 작성 요청입니다. 잠시 후 다시 시도해주세요.',
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

    // 요청 본문 파싱
    const body = await request.json();

    // 입력 검증 및 정제
    const validation = validatePostData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { title, content, category, tags } = validation.sanitized!;

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