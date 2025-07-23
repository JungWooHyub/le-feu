# le feu 🔥

요식업 업계 종사자들을 위한 셰프 중심의 콘텐츠 큐레이션 + 업계 전용 커뮤니티 + 직무 맞춤 채용보드 플랫폼

## 프로젝트 개요

le feu는 셰프 스토리 중심의 고품질 콘텐츠, 실질적인 업계 커뮤니티, 현장 용어 기반 채용 정보를 한번에 제공하는 통합 플랫폼입니다.

### 주요 기능

- 🍳 **셰프 큐레이션**: 세계 각지의 셰프들의 스토리와 레시피, 업계 트렌드
- 👥 **업계 전용 커뮤니티**: 요식업 종사자들만의 폐쇄형 커뮤니티
- 💼 **직무 맞춤 채용**: 업계 용어와 포지션에 특화된 구인·구직 서비스

## 기술 스택

### 프론트엔드
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **UI**: React, Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Query, Zustand
- **Forms**: React Hook Form + Zod

### 백엔드
- **API**: Next.js API Routes (서버리스)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Firebase Auth
- **Realtime**: Supabase Realtime
- **CMS**: Airtable (초기 콘텐츠 관리)

### 외부 서비스
- **이미지**: Cloudinary
- **이메일**: SendGrid
- **푸시 알림**: Firebase Cloud Messaging
- **분석**: Google Analytics 4

### 개발 도구
- **Monorepo**: Turborepo + pnpm
- **배포**: Vercel
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library

## 프로젝트 구조

```
le-feu/
├── apps/
│   ├── web/                 # 메인 웹 애플리케이션
│   └── admin/               # 관리자 대시보드
├── packages/
│   ├── ui/                  # 공통 UI 컴포넌트
│   ├── auth/                # 인증 로직
│   ├── utils/               # 공통 유틸리티
│   └── config/              # 공통 설정
├── database/
│   ├── schema/              # 데이터베이스 스키마 파일
│   └── migrations/          # 마이그레이션 파일
├── scripts/                 # 유틸리티 스크립트
├── .vooster/                # Vooster AI 프로젝트 설정
└── docs/                    # 프로젝트 문서
```

## 시작하기

### 필수 요구사항

- Node.js 18.0.0+ (권장: 18.17.0+)
- pnpm 8.0.0+ (권장) 또는 npm

### 설치

```bash
# 의존성 설치
npm install  # 또는 pnpm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 환경변수를 설정하세요

# 개발 서버 실행
npm run dev  # 또는 pnpm dev
```

### 환경변수 설정

`.env.local` 파일에 다음 환경변수들을 설정해야 합니다:

#### Supabase (필수)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Firebase Auth (필수)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY=your-admin-private-key
FIREBASE_ADMIN_CLIENT_EMAIL=your-admin-client-email
```

#### 기타 서비스 (선택)
```bash
# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@lefeu.kr

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Airtable
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your-ga-tracking-id
```

## Supabase 설정 가이드

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트 대시보드에서 다음 정보를 확인합니다:
   - **Project URL**: `Settings > API > Project URL`
   - **anon key**: `Settings > API > Project API keys > anon public`
   - **service_role key**: `Settings > API > Project API keys > service_role`

### 2. 환경변수 설정

```bash
# .env.local 파일에 추가
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 연결 테스트

```bash
# Supabase 연결 테스트 실행
npm run test:supabase
```

### 4. 데이터베이스 스키마 적용

```bash
# 스키마 적용
npm run db:schema

# 스키마 테스트
npm run test:schema
```

## 데이터베이스 스키마

le feu 플랫폼은 4개 핵심 도메인을 중심으로 설계된 PostgreSQL 데이터베이스를 사용합니다:

### 핵심 테이블

1. **사용자 관리**
   - `users`: 사용자 프로필 및 역할 정보

2. **셰프 큐레이션**
   - `curations`: 셰프 스토리, 레시피, 트렌드 콘텐츠

3. **커뮤니티**
   - `community_posts`: 게시글
   - `community_comments`: 댓글 (대댓글 지원)
   - `community_likes`: 좋아요
   - `community_bookmarks`: 북마크

4. **채용 보드**
   - `jobs`: 채용 공고
   - `job_applications`: 지원서
   - `job_saves`: 관심 공고 저장
   - `job_salary_ranges`: 급여 범위 통계

### 보안 및 성능

- **Row Level Security (RLS)**: 모든 테이블에 적용
- **인덱스 최적화**: GIN, BTREE 인덱스로 검색 성능 향상
- **한국어 전문 검색**: pg_trgm 확장 활용
- **자동 트리거**: 카운터 필드 및 타임스탬프 자동 관리

상세한 스키마 정보는 [데이터베이스 스키마 문서](docs/DATABASE_SCHEMA.md)를 참조하세요.

### 스크립트

```bash
# 개발 모드
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check

# 린팅
npm run lint

# 테스트
npm run test

# 데이터베이스
npm run test:supabase    # Supabase 연결 테스트
npm run db:schema        # 스키마 적용
npm run test:schema      # 스키마 테스트

# 클린
npm run clean
```

## 개발 가이드라인

### 코딩 컨벤션

- **PascalCase**: React 컴포넌트, 타입/인터페이스
- **camelCase**: 함수, 변수, state
- **snake_case**: DB 컬럼명
- **kebab-case**: Tailwind 커스텀 className

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 커밋 메시지 형식

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

예시:
```
feat(auth): add phone number verification
fix(ui): resolve button styling issue
docs(readme): update installation guide
```

## 기여하기

1. 이슈를 확인하거나 새로운 이슈를 생성합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 팀

- **le feu Team** - *초기 개발* - [GitHub](https://github.com/le-feu)

## 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 다음을 통해 연락해 주세요:

- 이메일: wjddnguiq0121@gmail.com
- 전화번호 : 010-4042-9481
- GitHub Issues: [Issues](https://github.com/le-feu/le-feu/issues)

---

**le feu**로 요식업계의 새로운 연결을 만들어보세요! 🔥 
