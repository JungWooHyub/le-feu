const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseConnection() {
  console.log('🔗 Supabase 연결 테스트를 시작합니다...\n');

  // 환경변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 환경변수가 설정되지 않았습니다.');
    console.log('필요한 환경변수:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('✅ 환경변수 확인 완료');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log(`🔑 API Key: ${supabaseKey.substring(0, 20)}...`);

  try {
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('\n🚀 Supabase 클라이언트 생성 완료');

    // 기본 연결 테스트 (스키마 정보 가져오기)
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      console.error('❌ 데이터베이스 연결 실패:', error.message);
      return false;
    }

    console.log('✅ 데이터베이스 연결 성공!');
    
    // 인증 테스트
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError && authError.message !== 'JWT expired') {
      console.log('⚠️  인증 상태: 비로그인 (정상)');
    } else {
      console.log('✅ 인증 시스템 연결 확인');
    }

    console.log('\n🎉 모든 연결 테스트가 성공적으로 완료되었습니다!');
    return true;

  } catch (error) {
    console.error('❌ 연결 테스트 중 오류 발생:', error.message);
    return false;
  }
}

// 스크립트 실행
if (require.main === module) {
  testSupabaseConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = { testSupabaseConnection }; 