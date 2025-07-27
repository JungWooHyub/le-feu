const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gxpmfxecqtpfqvegrlxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cG1meGVjcXRwZnF2ZWdybHh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzQyNTUxNiwiZXhwIjoyMDY5MDAxNTE2fQ.-q06FI7Q1U4ludx9fm2W5x0nS274Q6BhmipLxvFocsM';

async function setupSchema() {
  console.log('🚀 데이터베이스 스키마 설정 시작...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 1. 확장 기능 활성화
  console.log('1️⃣ 확장 기능 활성화...');
  const extensionsSQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  `;
  
  try {
    await supabase.rpc('exec_sql', { sql: extensionsSQL });
    console.log('✅ 확장 기능 활성화 완료');
  } catch (error) {
    console.log('ℹ️  확장 기능은 이미 활성화되었거나 권한 문제:', error.message);
  }
  
  // 2. profiles 테이블 생성 (users 대신 profiles로 변경 - Supabase auth와 연동)
  console.log('2️⃣ profiles 테이블 생성...');
  const profilesSQL = `
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY,
      
      -- 기본 정보
      email VARCHAR(255) NOT NULL,
      display_name VARCHAR(100),
      nickname VARCHAR(50),
      
      -- 프로필 정보
      role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('chef', 'helper', 'manager', 'owner', 'student', 'admin')),
      avatar_url TEXT,
      bio TEXT,
      experience_years INTEGER DEFAULT 0,
      
      -- 업계 정보
      business_type VARCHAR(20) CHECK (business_type IN ('restaurant', 'cafe', 'bakery', 'bar', 'hotel', 'catering', 'food_truck', 'others')),
      specialties TEXT[],
      location JSONB,
      
      -- 시스템 정보
      is_active BOOLEAN DEFAULT true,
      is_verified BOOLEAN DEFAULT false,
      last_login_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
    CREATE INDEX IF NOT EXISTS idx_profiles_business_type ON profiles(business_type);
    CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING gin(location);
    CREATE INDEX IF NOT EXISTS idx_profiles_specialties ON profiles USING gin(specialties);
    CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
  `;
  
  const { error: profilesError } = await supabase.rpc('exec_sql', { sql: profilesSQL });
  if (profilesError) {
    console.log('❌ profiles 테이블 생성 실패:', profilesError.message);
  } else {
    console.log('✅ profiles 테이블 생성 완료');
  }
  
  // 3. 커뮤니티 테이블 생성
  console.log('3️⃣ community_posts 테이블 생성...');
  const communitySQL = `
    CREATE TABLE IF NOT EXISTS community_posts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- 기본 정보
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(20) NOT NULL CHECK (category IN ('question', 'review', 'free', 'job_posting')),
      tags TEXT[] DEFAULT '{}',
      
      -- 작성자 정보
      author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      is_anonymous BOOLEAN DEFAULT false,
      
      -- 상태 및 메타데이터
      status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden', 'deleted')),
      is_pinned BOOLEAN DEFAULT false,
      
      -- 통계
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      bookmark_count INTEGER DEFAULT 0,
      
      -- 타임스탬프
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- 인덱스 생성
    CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
    CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
    CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
    CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING gin(tags);
    CREATE INDEX IF NOT EXISTS idx_community_posts_search ON community_posts USING gin(to_tsvector('korean', title || ' ' || content));
  `;
  
  const { error: communityError } = await supabase.rpc('exec_sql', { sql: communitySQL });
  if (communityError) {
    console.log('❌ community_posts 테이블 생성 실패:', communityError.message);
  } else {
    console.log('✅ community_posts 테이블 생성 완료');
  }
  
  console.log('🎉 기본 스키마 설정 완료!');
  console.log('이제 인증 기능을 테스트할 수 있습니다.');
}

// rpc 함수가 없을 경우 직접 SQL 실행
async function setupSchemaAlternative() {
  console.log('🚀 대안 방법으로 스키마 설정...');
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // profiles 테이블 생성
  const { error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error && error.message.includes('does not exist')) {
    console.log('profiles 테이블이 없습니다. Supabase 대시보드에서 수동으로 생성해야 합니다.');
    console.log('📋 다음 SQL을 Supabase SQL Editor에서 실행하세요:');
    console.log(`
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
    `);
  }
}

setupSchemaAlternative();