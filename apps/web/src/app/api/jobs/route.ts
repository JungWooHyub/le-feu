import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 채용공고 목록 조회 API
 * GET /api/jobs
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const position = searchParams.get('position'); // helper, extra, regular, manager
    const location = searchParams.get('location');
    const experience = searchParams.get('experience'); // beginner, intermediate, experienced
    const salary_min = searchParams.get('salary_min');
    const salary_max = searchParams.get('salary_max');
    const urgent = searchParams.get('urgent') === 'true';

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 공개 조회는 anon key 사용
    );

    // 쿼리 빌더 시작
    let query = supabase
      .from('job_postings')
      .select(`
        id,
        title,
        company_name,
        position_type,
        location,
        salary_type,
        salary_min,
        salary_max,
        experience_required,
        description,
        requirements,
        benefits,
        is_urgent,
        deadline,
        view_count,
        application_count,
        created_at,
        updated_at,
        employer:profiles(
          id,
          display_name,
          company_name,
          avatar_url
        )
      `)
      .eq('status', 'active')
      .gte('deadline', new Date().toISOString()); // 마감되지 않은 공고만

    // 필터 적용
    if (position) {
      query = query.eq('position_type', position);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (experience) {
      query = query.eq('experience_required', experience);
    }

    if (salary_min) {
      query = query.gte('salary_min', parseInt(salary_min));
    }

    if (salary_max) {
      query = query.lte('salary_max', parseInt(salary_max));
    }

    if (urgent) {
      query = query.eq('is_urgent', true);
    }

    // 정렬: 긴급공고 → 최신순
    query = query.order('is_urgent', { ascending: false })
                 .order('created_at', { ascending: false });

    // 페이지네이션 적용
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: jobs, error } = await query;

    if (error) {
      console.error('채용공고 조회 오류:', error);
      return NextResponse.json(
        { error: '채용공고를 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 총 개수 조회 (페이지네이션용)
    const { count: totalCount } = await supabase
      .from('job_postings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('deadline', new Date().toISOString());

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return NextResponse.json({
      data: jobs,
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
    console.error('채용공고 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 새로운 채용공고 등록 API
 * POST /api/jobs
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body = await request.json();
    const {
      title,
      company_name,
      position_type,
      location,
      salary_type,
      salary_min,
      salary_max,
      experience_required,
      description,
      requirements,
      benefits,
      is_urgent,
      deadline
    } = body;

    // 입력 검증
    if (!title || !company_name || !position_type || !location || !description) {
      return NextResponse.json(
        { error: '제목, 회사명, 포지션, 위치, 설명은 필수입니다.' },
        { status: 400 }
      );
    }

    // 포지션 유효성 검증
    const validPositions = ['helper', 'extra', 'regular', 'manager', 'chef'];
    if (!validPositions.includes(position_type)) {
      return NextResponse.json(
        { error: '유효하지 않은 포지션 타입입니다.' },
        { status: 400 }
      );
    }

    // 마감일 검증
    if (deadline && new Date(deadline) <= new Date()) {
      return NextResponse.json(
        { error: '마감일은 현재 시간보다 미래여야 합니다.' },
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

    // 사용자 권한 확인 (사업주 또는 관리자만 공고 등록 가능)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['employer', 'admin'].includes(profile.role)) {
      return NextResponse.json(
        { error: '채용공고 등록 권한이 없습니다.' },
        { status: 403 }
      );
    }

    // 기본 마감일 설정 (30일 후)
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);

    // 채용공고 생성
    const { data: newJob, error: insertError } = await supabase
      .from('job_postings')
      .insert({
        title,
        company_name,
        position_type,
        location,
        salary_type: salary_type || 'hourly',
        salary_min: salary_min || null,
        salary_max: salary_max || null,
        experience_required: experience_required || 'beginner',
        description,
        requirements: requirements || [],
        benefits: benefits || [],
        is_urgent: is_urgent || false,
        deadline: deadline || defaultDeadline.toISOString(),
        employer_id: user.id,
        status: 'active'
      })
      .select(`
        id,
        title,
        company_name,
        position_type,
        location,
        salary_type,
        salary_min,
        salary_max,
        is_urgent,
        deadline,
        created_at,
        employer:profiles(
          id,
          display_name,
          company_name
        )
      `)
      .single();

    if (insertError) {
      console.error('채용공고 생성 오류:', insertError);
      return NextResponse.json(
        { error: '채용공고 등록 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: newJob,
      message: '채용공고가 성공적으로 등록되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('채용공고 등록 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 