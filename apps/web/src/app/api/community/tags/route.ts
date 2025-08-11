import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * 인기 태그 목록 조회 API
 * GET /api/community/tags
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');

    // Supabase 클라이언트 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // PostgreSQL의 unnest와 array_agg를 사용하여 태그 집계
    const { data: tagData, error } = await supabase
      .rpc('get_popular_tags', { tag_limit: limit });

    if (error) {
      console.error('인기 태그 조회 오류:', error);
      
      // 기본 태그 목록 반환
      const defaultTags = [
        '신입', '경력', '면접', '레시피', '팁', '창업', '프랜차이즈',
        '급여', '근무환경', '교육', '자격증', '트렌드', '메뉴개발',
        '카페', '레스토랑', '베이커리', '호텔', '급식', '케이터링'
      ];

      return NextResponse.json({
        data: defaultTags.map((tag, index) => ({
          tag,
          count: 10 - index // 임시 카운트
        }))
      });
    }

    return NextResponse.json({
      data: tagData || []
    });

  } catch (error) {
    console.error('태그 API 오류:', error);
    
    // 오류 시 기본 태그 반환
    const defaultTags = [
      '신입', '경력', '면접', '레시피', '팁', '창업', '프랜차이즈',
      '급여', '근무환경', '교육', '자격증', '트렌드', '메뉴개발',
      '카페', '레스토랑', '베이커리', '호텔', '급식', '케이터링'
    ];

    return NextResponse.json({
      data: defaultTags.map((tag, index) => ({
        tag,
        count: 10 - index
      }))
    });
  }
}