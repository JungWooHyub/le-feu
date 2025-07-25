import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * 셰프 큐레이션 목록 조회 API
 * GET /api/curations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버에서는 Service Role Key 사용
    );

    // 쿼리 빌더 시작
    let query = supabase
      .from('curations')
      .select(`
        id,
        title,
        content,
        excerpt,
        featured_image_url,
        category,
        tags,
        is_featured,
        view_count,
        like_count,
        created_at,
        updated_at,
        author:profiles(
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // 필터 적용
    if (category) {
      query = query.eq('category', category);
    }
    
    if (featured) {
      query = query.eq('is_featured', true);
    }

    // 페이지네이션 적용
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: curations, error, count } = await query;

    if (error) {
      console.error('큐레이션 조회 오류:', error);
      return NextResponse.json(
        { error: '큐레이션을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 총 개수 조회 (페이지네이션용)
    const { count: totalCount } = await supabase
      .from('curations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      data: curations,
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
    console.error('큐레이션 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 새로운 큐레이션 생성 API
 * POST /api/curations
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const { title, content, excerpt, category, tags, featured_image_url, is_featured } = body;

    // 입력 검증
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: '제목, 내용, 카테고리는 필수입니다.' },
        { status: 400 }
      );
    }

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버에서는 Service Role Key 사용
    );

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자 권한 확인 (관리자만 큐레이션 작성 가능)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'curator'].includes(profile.role)) {
      return NextResponse.json(
        { error: '큐레이션 작성 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 큐레이션 생성
    const { data: newCuration, error: insertError } = await supabase
      .from('curations')
      .insert({
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + '...',
        category,
        tags: tags || [],
        featured_image_url,
        is_featured: is_featured || false,
        author_id: user.id,
        status: 'published'
      })
      .select(`
        id,
        title,
        content,
        excerpt,
        featured_image_url,
        category,
        tags,
        is_featured,
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
      console.error('큐레이션 생성 오류:', insertError);
      return NextResponse.json(
        { error: '큐레이션 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: newCuration,
      message: '큐레이션이 성공적으로 생성되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('큐레이션 생성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 