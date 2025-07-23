# 데이터베이스 스키마 설계

## 개요

le feu 플랫폼의 데이터베이스 스키마는 다음 4개 핵심 도메인을 중심으로 설계되었습니다:

1. **사용자 관리** (Users)
2. **셰프 큐레이션** (Curations)  
3. **커뮤니티** (Community)
4. **채용 보드** (Jobs)

## 기술 스택

- **데이터베이스**: PostgreSQL 15+ (Supabase)
- **보안**: Row Level Security (RLS) 적용
- **검색**: 한국어 전문 검색 지원 (pg_trgm)
- **인덱싱**: BTREE, GIN 인덱스 최적화

## 테이블 구조

### 1. 사용자 관리 (Users Domain)

#### `users` 테이블
**목적**: 플랫폼의 모든 사용자 정보 관리

**주요 컬럼**:
- `id`: UUID 기본키
- `email`: 이메일 (UNIQUE)
- `role`: 사용자 역할 (chef, helper, manager, owner, student, admin)
- `business_type`: 업체 유형 (restaurant, cafe, bakery, bar, hotel, catering, food_truck, others)
- `specialties`: 전문 분야 배열
- `location`: 지역 정보 (JSONB)

**인덱스**:
- `idx_users_email`: 이메일 검색
- `idx_users_role`: 역할별 필터링
- `idx_users_business_type`: 업체 유형별 필터링
- `idx_users_location`: 지역 검색 (GIN)
- `idx_users_specialties`: 전문 분야 검색 (GIN)

**RLS 정책**:
- 사용자는 자신의 프로필만 조회/수정 가능
- 관리자는 모든 사용자 정보 접근 가능

### 2. 셰프 큐레이션 (Curations Domain)

#### `curations` 테이블
**목적**: 셰프 스토리, 레시피, 업계 트렌드 등 큐레이션 콘텐츠

**주요 컬럼**:
- `id`: UUID 기본키
- `title`, `subtitle`, `content`: 콘텐츠 기본 정보
- `author_id`: 작성자 (users 참조)
- `category`: 콘텐츠 분류 (story, recipe, trend, technique, interview, event)
- `tags`: 태그 배열
- `status`: 상태 (draft, published, archived, featured)
- `source_type`: 출처 유형 (internal, airtable, external)

**인덱스**:
- `idx_curations_category`: 카테고리별 필터링
- `idx_curations_tags`: 태그 검색 (GIN)
- `idx_curations_search`: 전문 검색 (GIN)
- `idx_curations_published_at`: 발행일순 정렬
- `idx_curations_is_featured`: 추천 콘텐츠

**RLS 정책**:
- 발행된 콘텐츠는 모든 사용자 조회 가능
- 작성자는 자신의 콘텐츠 관리 가능
- 관리자는 모든 콘텐츠 관리 가능

### 3. 커뮤니티 (Community Domain)

#### `community_posts` 테이블
**목적**: 커뮤니티 게시글

**주요 컬럼**:
- `id`: UUID 기본키
- `title`, `content`: 게시글 내용
- `author_id`: 작성자 (users 참조)
- `category`: 카테고리 (question, review, free, job, recipe, trend)
- `is_anonymous`: 익명 게시 여부
- `status`: 상태 (draft, published, hidden, deleted)

#### `community_comments` 테이블
**목적**: 댓글 시스템 (대댓글 지원)

**주요 컬럼**:
- `post_id`: 게시글 참조
- `parent_id`: 부모 댓글 (대댓글용)
- `depth`: 댓글 깊이 (최대 3단계)
- `is_best`: 베스트 댓글 여부

#### `community_likes`, `community_bookmarks` 테이블
**목적**: 좋아요 및 북마크 기능

**RLS 정책**:
- 발행된 게시글/댓글은 모든 사용자 조회 가능
- 작성자는 자신의 콘텐츠 관리 가능
- 좋아요/북마크는 각자만 관리 가능

### 4. 채용 보드 (Jobs Domain)

#### `jobs` 테이블
**목적**: 채용 공고

**주요 컬럼**:
- `employer_id`: 고용주 (users 참조)
- `job_type`: 고용 형태 (full_time, part_time, extra, internship, contract)
- `position`: 포지션명
- `business_type`: 업체 유형
- `location`: 근무 지역 (JSONB)
- `salary_type`, `salary_min`, `salary_max`: 급여 정보
- `application_deadline`: 지원 마감일

#### `job_applications` 테이블
**목적**: 지원서 관리

**주요 컬럼**:
- `job_id`: 채용공고 참조
- `applicant_id`: 지원자 (users 참조)
- `status`: 지원 상태 (pending, reviewed, interviewed, accepted, rejected, withdrawn)
- `cover_letter`: 자기소개서

#### `job_saves` 테이블
**목적**: 관심 공고 저장

#### `job_salary_ranges` 테이블
**목적**: 급여 범위 데이터 (통계용)

**인덱스**:
- `idx_jobs_job_type`: 고용 형태별 필터링
- `idx_jobs_business_type`: 업체 유형별 필터링
- `idx_jobs_location`: 지역별 검색 (GIN)
- `idx_jobs_search`: 전문 검색 (GIN)

**RLS 정책**:
- 발행된 공고는 모든 사용자 조회 가능
- 고용주는 자신의 공고 관리 가능
- 지원자는 자신의 지원서만 조회 가능
- 고용주는 자신의 공고 지원서 조회 가능

## 성능 최적화

### 인덱스 전략

1. **기본 인덱스**: 자주 조회되는 컬럼 (created_at, status, role 등)
2. **복합 인덱스**: 정렬과 필터링이 함께 사용되는 경우
3. **GIN 인덱스**: 배열, JSONB, 전문 검색용
4. **부분 인덱스**: 특정 조건의 데이터만 인덱싱

### 트리거 활용

1. **updated_at 자동 업데이트**: 모든 테이블에 적용
2. **카운터 필드 관리**: 댓글 수, 지원 수, 저장 수 자동 업데이트
3. **데이터 무결성**: 비즈니스 규칙 자동 적용

## 보안

### Row Level Security (RLS)

- 모든 테이블에 RLS 활성화
- 사용자별 데이터 접근 제어
- 역할 기반 권한 관리

### 데이터 보호

- 개인정보 마스킹
- 소프트 삭제 지원
- 감사 로그 (향후 구현)

## 스키마 관리

### 마이그레이션

```bash
# 스키마 적용
npm run db:schema

# 스키마 테스트
npm run test:schema

# Supabase CLI 사용
npm run supabase -- db push
```

### 백업 전략

1. **자동 백업**: Supabase 자동 백업 활용
2. **수동 백업**: 중요 작업 전 수동 백업
3. **스키마 버전 관리**: Git을 통한 스키마 변경 추적

## 확장 계획

### 단기 (T-006~T-010)
- 인증 시스템 연동
- API 엔드포인트 구현
- 실시간 기능 추가

### 중기 (향후 3개월)
- 검색 엔진 최적화
- 캐싱 계층 추가
- 성능 모니터링

### 장기 (향후 6개월)
- 파티셔닝 적용
- 읽기 전용 복제본
- 데이터 웨어하우스 연동

---

**참고 문서**:
- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 성능 튜닝 가이드](https://www.postgresql.org/docs/current/performance-tips.html)
- [RLS 보안 가이드](https://supabase.com/docs/guides/auth/row-level-security) 