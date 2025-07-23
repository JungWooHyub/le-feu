-- 셰프 큐레이션 테이블
-- 셰프 스토리, 레시피, 업계 트렌드 등 큐레이션 콘텐츠
CREATE TABLE IF NOT EXISTS curations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 기본 정보
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  content TEXT NOT NULL,
  summary TEXT, -- 요약 (썸네일용)
  
  -- 작성자 정보
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(100), -- 외부 셰프의 경우 직접 입력
  
  -- 콘텐츠 메타데이터
  category VARCHAR(50) NOT NULL CHECK (category IN ('story', 'recipe', 'trend', 'technique', 'interview', 'event')),
  tags TEXT[] DEFAULT '{}', -- 태그 배열
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5), -- 난이도 (레시피용)
  cooking_time INTEGER, -- 조리 시간 (분 단위)
  
  -- 미디어
  thumbnail_url TEXT,
  images TEXT[] DEFAULT '{}', -- 이미지 URL 배열
  video_url TEXT,
  
  -- 상태 관리
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'featured')),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  
  -- 출처 정보
  source_type VARCHAR(20) DEFAULT 'internal' CHECK (source_type IN ('internal', 'airtable', 'external')),
  source_id VARCHAR(100), -- 외부 소스 ID
  source_url TEXT,
  
  -- 날짜 정보
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_curations_author_id ON curations(author_id);
CREATE INDEX IF NOT EXISTS idx_curations_category ON curations(category);
CREATE INDEX IF NOT EXISTS idx_curations_status ON curations(status);
CREATE INDEX IF NOT EXISTS idx_curations_tags ON curations USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_curations_published_at ON curations(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_curations_created_at ON curations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_curations_view_count ON curations(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_curations_is_featured ON curations(is_featured, published_at DESC);

-- 전문 검색용 인덱스
CREATE INDEX IF NOT EXISTS idx_curations_search ON curations USING gin(
  to_tsvector('korean', title || ' ' || coalesce(subtitle, '') || ' ' || coalesce(summary, ''))
);

-- 업데이트 트리거
CREATE TRIGGER update_curations_updated_at 
  BEFORE UPDATE ON curations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE curations ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 발행된 콘텐츠는 모든 사용자가 조회 가능
CREATE POLICY "Published curations are viewable by everyone" ON curations
  FOR SELECT USING (status = 'published');

-- 작성자는 자신의 콘텐츠 관리 가능
CREATE POLICY "Authors can manage their curations" ON curations
  FOR ALL USING (auth.uid()::text = author_id::text);

-- 관리자는 모든 콘텐츠 관리 가능
CREATE POLICY "Admins can manage all curations" ON curations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  ); 