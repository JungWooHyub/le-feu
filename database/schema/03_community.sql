-- 커뮤니티 게시글 테이블
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 기본 정보
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  
  -- 작성자 정보
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT false, -- 익명 게시 여부
  
  -- 분류
  category VARCHAR(20) NOT NULL CHECK (category IN ('question', 'review', 'free', 'job', 'recipe', 'trend')),
  tags TEXT[] DEFAULT '{}',
  
  -- 미디어
  images TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]', -- 첨부파일 메타데이터
  
  -- 상호작용
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  
  -- 상태 관리
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'hidden', 'deleted')),
  is_pinned BOOLEAN DEFAULT false,
  is_solved BOOLEAN DEFAULT false, -- 질문 해결 여부
  
  -- 신고/모더레이션
  report_count INTEGER DEFAULT 0,
  is_moderated BOOLEAN DEFAULT false,
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES users(id),
  
  -- 날짜
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 기본 정보
  content TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 댓글 구조 (대댓글 지원)
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  depth INTEGER DEFAULT 0 CHECK (depth <= 3), -- 최대 3단계 댓글
  
  -- 익명성
  is_anonymous BOOLEAN DEFAULT false,
  
  -- 상호작용
  like_count INTEGER DEFAULT 0,
  
  -- 상태 관리
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'deleted')),
  is_best BOOLEAN DEFAULT false, -- 베스트 댓글
  
  -- 신고/모더레이션
  report_count INTEGER DEFAULT 0,
  is_moderated BOOLEAN DEFAULT false,
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES users(id),
  
  -- 날짜
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 좋아요 테이블 (게시글/댓글 공통)
CREATE TABLE IF NOT EXISTS community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 좋아요 대상 (게시글 또는 댓글)
  target_type VARCHAR(10) NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- 중복 방지 제약
  UNIQUE(user_id, target_type, target_id)
);

-- 북마크 테이블
CREATE TABLE IF NOT EXISTS community_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- 중복 방지 제약
  UNIQUE(user_id, post_id)
);

-- 인덱스 생성 - Posts
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_community_posts_pinned ON community_posts(is_pinned, created_at DESC);

-- 인덱스 생성 - Comments
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author_id ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at);

-- 인덱스 생성 - Likes & Bookmarks
CREATE INDEX IF NOT EXISTS idx_community_likes_target ON community_likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_community_bookmarks_user_id ON community_bookmarks(user_id);

-- 전문 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_community_posts_search ON community_posts USING gin(
  to_tsvector('korean', title || ' ' || content)
);

-- 업데이트 트리거
CREATE TRIGGER update_community_posts_updated_at 
  BEFORE UPDATE ON community_posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at 
  BEFORE UPDATE ON community_comments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 댓글 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts 
    SET comment_count = comment_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- 댓글 수 업데이트 트리거
CREATE TRIGGER update_post_comment_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_count();

-- RLS 활성화
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS 정책 - Posts
CREATE POLICY "Published posts are viewable by everyone" ON community_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their posts" ON community_posts
  FOR ALL USING (auth.uid()::text = author_id::text);

-- RLS 정책 - Comments
CREATE POLICY "Comments are viewable by everyone" ON community_comments
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their comments" ON community_comments
  FOR ALL USING (auth.uid()::text = author_id::text);

-- RLS 정책 - Likes & Bookmarks
CREATE POLICY "Users can manage their likes" ON community_likes
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their bookmarks" ON community_bookmarks
  FOR ALL USING (auth.uid()::text = user_id::text); 