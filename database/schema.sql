-- le feu 데이터베이스 스키마
-- 전체 스키마를 순서대로 실행

-- 1. 확장 기능 활성화
\i database/schema/00_extensions.sql

-- 2. 사용자 테이블
\i database/schema/01_users.sql

-- 3. 셰프 큐레이션 테이블
\i database/schema/02_curations.sql

-- 4. 커뮤니티 테이블
\i database/schema/03_community.sql

-- 5. 채용 관련 테이블
\i database/schema/04_jobs.sql

-- 6. 초기 데이터 삽입 (개발용)
-- \i database/seed.sql 