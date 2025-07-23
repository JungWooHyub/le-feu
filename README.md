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
├── .vooster/                # Vooster AI 프로젝트 설정
└── docs/                    # 프로젝트 문서
```

## 시작하기

### 필수 요구사항

- Node.js 18.0.0+
- pnpm 8.0.0+

### 설치

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 환경변수를 설정하세요

# 개발 서버 실행
pnpm dev
```

### 환경변수 설정

`.env.local` 파일에 다음 환경변수들을 설정해야 합니다:

- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Firebase**: `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_*`
- **SendGrid**: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- **Cloudinary**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Airtable**: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

### 스크립트

```bash
# 개발 모드
pnpm dev

# 빌드
pnpm build

# 타입 체크
pnpm type-check

# 린팅
pnpm lint

# 테스트
pnpm test

# 클린
pnpm clean
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

- 이메일: contact@lefeu.kr
- GitHub Issues: [Issues](https://github.com/le-feu/le-feu/issues)

---

**le feu**로 요식업계의 새로운 연결을 만들어보세요! 🔥 