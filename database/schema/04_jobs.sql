-- 채용 공고 테이블
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 기본 정보
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  
  -- 고용주 정보
  employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(100) NOT NULL,
  
  -- 업무 조건
  job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'extra', 'internship', 'contract')),
  position VARCHAR(50) NOT NULL, -- 포지션명 (셰프, 주방보조, 매니저 등)
  experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'junior', 'senior', 'expert')),
  
  -- 업계 정보
  business_type VARCHAR(20) NOT NULL CHECK (business_type IN ('restaurant', 'cafe', 'bakery', 'bar', 'hotel', 'catering', 'food_truck', 'others')),
  cuisine_types TEXT[] DEFAULT '{}', -- 요리 종류 (한식, 일식, 양식 등)
  required_skills TEXT[] DEFAULT '{}', -- 필요 기술
  
  -- 근무 조건
  salary_type VARCHAR(20) CHECK (salary_type IN ('hourly', 'daily', 'monthly', 'annual', 'negotiable')),
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(3) DEFAULT 'KRW',
  
  working_hours JSONB, -- {"start": "09:00", "end": "18:00", "break_time": 60}
  working_days TEXT[] DEFAULT '{}', -- 근무 요일
  
  -- 위치 정보
  location JSONB NOT NULL, -- {"city": "서울", "district": "강남구", "address": "상세주소"}
  is_remote_possible BOOLEAN DEFAULT false,
  
  -- 복지/혜택
  benefits TEXT[] DEFAULT '{}', -- 복지 혜택 목록
  meal_provided BOOLEAN DEFAULT false,
  transportation_provided BOOLEAN DEFAULT false,
  accommodation_provided BOOLEAN DEFAULT false,
  
  -- 지원 조건
  application_method VARCHAR(20) DEFAULT 'platform' CHECK (application_method IN ('platform', 'email', 'phone', 'visit')),
  contact_info JSONB, -- 연락처 정보
  required_documents TEXT[] DEFAULT '{}', -- 필요 서류
  
  -- 상태 관리
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'paused', 'closed', 'expired')),
  is_urgent BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  -- 통계
  view_count INTEGER DEFAULT 0,
  application_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  
  -- 날짜
  application_deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 지원서 테이블
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 기본 정보
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 지원 내용
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  additional_documents JSONB DEFAULT '[]',
  
  -- 지원자 추가 정보
  available_start_date TIMESTAMPTZ,
  expected_salary INTEGER,
  contact_preference VARCHAR(20) DEFAULT 'platform' CHECK (contact_preference IN ('platform', 'email', 'phone')),
  
  -- 상태 관리
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interviewed', 'accepted', 'rejected', 'withdrawn')),
  
  -- 고용주 피드백
  employer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  interview_scheduled_at TIMESTAMPTZ,
  
  -- 날짜
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- 중복 지원 방지
  UNIQUE(job_id, applicant_id)
);

-- 채용공고 저장 테이블
CREATE TABLE IF NOT EXISTS job_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- 중복 저장 방지
  UNIQUE(user_id, job_id)
);

-- 급여 정보 테이블 (별도 관리)
CREATE TABLE IF NOT EXISTS job_salary_ranges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position VARCHAR(50) NOT NULL,
  experience_level VARCHAR(20) NOT NULL,
  business_type VARCHAR(20) NOT NULL,
  location_city VARCHAR(50),
  
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  salary_type VARCHAR(20) NOT NULL,
  
  sample_count INTEGER DEFAULT 1,
  last_updated TIMESTAMPTZ DEFAULT now(),
  
  -- 유니크 제약
  UNIQUE(position, experience_level, business_type, location_city, salary_type)
);

-- 인덱스 생성 - Jobs
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_business_type ON jobs(business_type);
CREATE INDEX IF NOT EXISTS idx_jobs_position ON jobs(position);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs USING gin(location);
CREATE INDEX IF NOT EXISTS idx_jobs_cuisine_types ON jobs USING gin(cuisine_types);
CREATE INDEX IF NOT EXISTS idx_jobs_required_skills ON jobs USING gin(required_skills);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_urgent ON jobs(is_urgent, created_at DESC);

-- 인덱스 생성 - Applications
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);

-- 인덱스 생성 - Saves
CREATE INDEX IF NOT EXISTS idx_job_saves_user_id ON job_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_job_saves_job_id ON job_saves(job_id);

-- 전문 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_jobs_search ON jobs USING gin(
  to_tsvector('korean', title || ' ' || description || ' ' || company_name || ' ' || position)
);

-- 업데이트 트리거
CREATE TRIGGER update_jobs_updated_at 
  BEFORE UPDATE ON jobs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at 
  BEFORE UPDATE ON job_applications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 지원 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs 
    SET application_count = application_count + 1 
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs 
    SET application_count = application_count - 1 
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- 지원 수 업데이트 트리거
CREATE TRIGGER update_job_application_count
  AFTER INSERT OR DELETE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_application_count();

-- 저장 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs 
    SET save_count = save_count + 1 
    WHERE id = NEW.job_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs 
    SET save_count = save_count - 1 
    WHERE id = OLD.job_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- 저장 수 업데이트 트리거
CREATE TRIGGER update_job_save_count
  AFTER INSERT OR DELETE ON job_saves
  FOR EACH ROW
  EXECUTE FUNCTION update_save_count();

-- RLS 활성화
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_salary_ranges ENABLE ROW LEVEL SECURITY;

-- RLS 정책 - Jobs
CREATE POLICY "Published jobs are viewable by everyone" ON jobs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Employers can manage their jobs" ON jobs
  FOR ALL USING (auth.uid()::text = employer_id::text);

-- RLS 정책 - Applications
CREATE POLICY "Applicants can view their applications" ON job_applications
  FOR SELECT USING (auth.uid()::text = applicant_id::text);

CREATE POLICY "Employers can view applications for their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE id = job_applications.job_id 
      AND employer_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can create applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid()::text = applicant_id::text);

CREATE POLICY "Applicants can update their applications" ON job_applications
  FOR UPDATE USING (auth.uid()::text = applicant_id::text);

-- RLS 정책 - Saves
CREATE POLICY "Users can manage their saved jobs" ON job_saves
  FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS 정책 - Salary Ranges (모든 사용자 조회 가능)
CREATE POLICY "Salary ranges are viewable by everyone" ON job_salary_ranges
  FOR SELECT USING (true); 