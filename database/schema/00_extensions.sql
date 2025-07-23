-- PostgreSQL 확장 기능 활성화
-- Supabase에서 기본적으로 제공되는 확장 기능들

-- UUID 생성을 위한 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 전문 검색을 위한 확장 (한국어 지원)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- JSON 처리 성능 향상
-- Supabase에서 기본 활성화되어 있음

-- 시간대 관련 함수
-- Supabase에서 기본 활성화되어 있음

-- Row Level Security 관련
-- Supabase에서 기본 활성화되어 있음 