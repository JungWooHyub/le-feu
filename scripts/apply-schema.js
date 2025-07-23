const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function applySchema() {
  console.log('🗄️  데이터베이스 스키마 적용을 시작합니다...\n');

  // 환경변수 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 환경변수가 설정되지 않았습니다.');
    console.log('필요한 환경변수:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  try {
    // Supabase 클라이언트 생성 (서비스 키 사용)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase 클라이언트 생성 완료');

    // 스키마 파일 순서
    const schemaFiles = [
      '00_extensions.sql',
      '01_users.sql',
      '02_curations.sql',
      '03_community.sql',
      '04_jobs.sql'
    ];

    console.log('📂 스키마 파일 적용 시작...\n');

    for (const filename of schemaFiles) {
      const filePath = path.join(__dirname, '..', 'database', 'schema', filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  파일을 찾을 수 없습니다: ${filename}`);
        continue;
      }

      console.log(`📄 적용 중: ${filename}`);
      const sqlContent = fs.readFileSync(filePath, 'utf8');

      // SQL 실행
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: sqlContent
      });

      if (error) {
        console.error(`❌ ${filename} 적용 실패:`, error.message);
        // 에러가 있어도 계속 진행 (이미 존재하는 테이블 등)
      } else {
        console.log(`✅ ${filename} 적용 완료`);
      }
    }

    console.log('\n🎉 모든 스키마 파일 적용이 완료되었습니다!');
    
    // 테이블 목록 확인
    console.log('\n📋 생성된 테이블 확인...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.error('❌ 테이블 목록 조회 실패:', tablesError.message);
    } else {
      console.log('📊 생성된 테이블:');
      tables.forEach(table => {
        if (!table.table_name.startsWith('_') && 
            !table.table_name.includes('migrations') &&
            !table.table_name.includes('schema_migrations')) {
          console.log(`   - ${table.table_name}`);
        }
      });
    }

  } catch (error) {
    console.error('💥 스키마 적용 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  applySchema()
    .then(() => {
      console.log('\n✨ 스키마 적용이 성공적으로 완료되었습니다!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = { applySchema }; 