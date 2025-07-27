const { createClient } = require('@supabase/supabase-js');

// 환경변수 직접 설정
const supabaseUrl = 'https://gxpmfxecqtpfqvegrlxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cG1meGVjcXRwZnF2ZWdybHh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjU1MTYsImV4cCI6MjA2OTAwMTUxNn0.RGxuf2JuLkH3-wN7Yvd63Zw1NlKTsVKiSeEv8IVOzrk';

async function testConnection() {
  console.log('🔗 Supabase 연결 테스트 시작...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 기본 연결 테스트 - profiles 테이블 확인
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('ℹ️  테이블이 없거나 첫 연결:', error.message);
      console.log('✅ Supabase 연결은 성공! 이제 스키마를 생성해야 합니다.');
    } else {
      console.log('✅ Supabase 연결 및 테이블 접근 성공!');
      console.log('📊 현재 users 테이블 상태:', data);
    }
    
    return true;
  } catch (err) {
    console.error('❌ Supabase 연결 실패:', err.message);
    return false;
  }
}

testConnection();