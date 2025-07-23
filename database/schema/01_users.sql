-- 사용자 테이블
-- le feu 플랫폼의 모든 사용자 정보를 관리
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 기본 정보
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(100),
  nickname VARCHAR(50),
  
  -- 프로필 정보
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('chef', 'helper', 'manager', 'owner', 'student', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  
  -- 업계 정보
  business_type VARCHAR(20) CHECK (business_type IN ('restaurant', 'cafe', 'bakery', 'bar', 'hotel', 'catering', 'food_truck', 'others')),
  specialties TEXT[], -- 전문 분야 (배열)
  location JSONB, -- 지역 정보 {"city": "서울", "district": "강남구"}
  
  -- 시스템 정보
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_business_type ON users(business_type);
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING gin(location);
CREATE INDEX IF NOT EXISTS idx_users_specialties ON users USING gin(specialties);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 정보만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 관리자는 모든 사용자 정보 접근 가능
CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  ); 