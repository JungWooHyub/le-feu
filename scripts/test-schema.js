const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSchema() {
  console.log('🧪 데이터베이스 스키마 테스트를 시작합니다...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 환경변수가 설정되지 않았습니다.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 테이블 존재 확인
    const expectedTables = [
      'users',
      'curations', 
      'community_posts',
      'community_comments',
      'community_likes',
      'community_bookmarks',
      'jobs',
      'job_applications',
      'job_saves',
      'job_salary_ranges'
    ];

    console.log('📋 테이블 존재 여부 확인...');
    for (const tableName of expectedTables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: 정상`);
      }
    }

    // 기본 CRUD 테스트 (users 테이블)
    console.log('\n🔧 기본 CRUD 테스트 (users 테이블)...');
    
    // 임시 사용자 데이터 생성
    const testUser = {
      email: 'test@lefeu.kr',
      name: '테스트 사용자',
      role: 'chef',
      business_type: 'restaurant'
    };

    // 생성 테스트
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select()
      .single();

    if (insertError) {
      console.log(`❌ 사용자 생성 실패: ${insertError.message}`);
    } else {
      console.log(`✅ 사용자 생성 성공: ${insertData.id}`);
      
      // 조회 테스트
      const { data: selectData, error: selectError } = await supabase
        .from('users')
        .select('*')
        .eq('id', insertData.id)
        .single();

      if (selectError) {
        console.log(`❌ 사용자 조회 실패: ${selectError.message}`);
      } else {
        console.log(`✅ 사용자 조회 성공: ${selectData.email}`);
      }

      // 수정 테스트
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update({ nickname: '업데이트된닉네임' })
        .eq('id', insertData.id)
        .select()
        .single();

      if (updateError) {
        console.log(`❌ 사용자 수정 실패: ${updateError.message}`);
      } else {
        console.log(`✅ 사용자 수정 성공: ${updateData.nickname}`);
      }

      // 삭제 테스트
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.log(`❌ 사용자 삭제 실패: ${deleteError.message}`);
      } else {
        console.log(`✅ 사용자 삭제 성공`);
      }
    }

    // 인덱스 존재 확인
    console.log('\n📊 인덱스 존재 여부 확인...');
    const { data: indexes, error: indexError } = await supabase
      .rpc('exec_sql', {
        sql_query: `
          SELECT schemaname, tablename, indexname, indexdef 
          FROM pg_indexes 
          WHERE schemaname = 'public' 
          AND indexname LIKE 'idx_%'
          ORDER BY tablename, indexname;
        `
      });

    if (indexError) {
      console.log(`❌ 인덱스 조회 실패: ${indexError.message}`);
    } else {
      console.log(`✅ 인덱스 ${indexes?.length || 0}개 확인됨`);
    }

    // RLS 정책 확인
    console.log('\n🔒 RLS 정책 확인...');
    const { data: policies, error: policyError } = await supabase
      .rpc('exec_sql', {
        sql_query: `
          SELECT schemaname, tablename, policyname, roles, cmd, qual 
          FROM pg_policies 
          WHERE schemaname = 'public'
          ORDER BY tablename, policyname;
        `
      });

    if (policyError) {
      console.log(`❌ RLS 정책 조회 실패: ${policyError.message}`);
    } else {
      console.log(`✅ RLS 정책 ${policies?.length || 0}개 확인됨`);
    }

    console.log('\n🎉 모든 스키마 테스트가 완료되었습니다!');

  } catch (error) {
    console.error('💥 테스트 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  testSchema()
    .then(() => {
      console.log('\n✨ 스키마 테스트가 성공적으로 완료되었습니다!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = { testSchema }; 