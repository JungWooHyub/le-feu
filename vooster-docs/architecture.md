# 기술 요구사항 문서 (TRD)

## 1. 기술 개요

### 프로젝트 개요
le feu 프로젝트는 셰프 및 외식업 종사자를 위한 콘텐츠 큐레이션, 커뮤니티, 채용 정보를 통합 제공하는 웹 기반 플랫폼입니다. 본 TRD는 PRD의 요구사항을 충족시키기 위한 기술적 접근 방식과 아키텍처를 정의하며, 과도한 엔지니어링을 지양하고 효율적이고 확장 가능한 솔루션에 중점을 둡니다. Next.js, Supabase, Vercel 등 현대적인 서버리스 기술 스택을 활용하여 빠른 개발과 안정적인 운영을 목표로 합니다.

### 핵심 기술 스택
*   **프론트엔드**: Next.js (TypeScript), React, Tailwind CSS
*   **백엔드/데이터베이스**: Supabase (PostgreSQL), Next.js API Routes (서버리스 함수)
*   **콘텐츠 관리**: Airtable (초기 콘텐츠 CMS)
*   **인증**: Firebase Auth (Google, Apple, 이메일, 전화번호)
*   **실시간 통신**: Supabase Realtime
*   **알림**: Firebase Cloud Messaging (FCM), SendGrid
*   **이미지 처리**: Cloudinary
*   **배포**: Vercel
*   **모노레포**: Turborepo + pnpm

### 주요 기술 목표
*   **성능**: 95% 페이지 LCP 2.5초 이내 달성, 썸네일 3초, 상세 페이지 1초 로드 목표.
*   **확장성**: 동시 접속 1만 명 처리 가능하도록 서버리스 아키텍처 및 데이터베이스 최적화.
*   **보안**: OAuth 2.0, 전화번호 인증, HTTPS 상시 적용, 역할 기반 접근 제어(RBAC) 구현.
*   **사용성**: 모바일 우선 반응형 UI, WCAG 2.1 AA 준수.
*   **유지보수성**: 모노레포 구조를 통한 코드 재사용성 및 일관성 확보.

### 주요 기술 가정
*   Supabase의 PostgreSQL 데이터베이스는 초기 및 중기 트래픽을 충분히 감당할 수 있다.
*   Firebase Auth 및 Supabase Realtime은 실시간 기능 및 인증 요구사항을 만족한다.
*   Vercel의 서버리스 환경은 Next.js API Routes를 통해 백엔드 로직을 효율적으로 처리한다.
*   Airtable은 초기 콘텐츠 큐레이션 및 관리에 적합하며, 추후 확장 시 별도 CMS 도입을 고려한다.

## 2. 기술 스택

| Category | Technology / Library | Reasoning (Why it's chosen for this project) |
| :------- | :------------------- | :------------------------------------------- |
| **프론트엔드** | Next.js | SSR/CSR 하이브리드 렌더링, SEO 최적화, 파일 시스템 기반 라우팅, Vercel 배포와의 시너지. |
| | TypeScript | 타입 안정성 확보, 개발 생산성 향상, 대규모 프로젝트 유지보수 용이성. |
| | React | 선언적 UI 개발, 컴포넌트 기반 재사용성, 활발한 커뮤니티 및 생태계. |
| | Tailwind CSS | 유틸리티 우선 CSS 프레임워크, 빠른 UI 개발, 일관된 디자인 시스템 구축. |
| **백엔드/데이터베이스** | Supabase (PostgreSQL) | BaaS(Backend as a Service) 형태로 빠른 개발 가능, PostgreSQL 기반의 안정성 및 확장성, RLS(Row Level Security)를 통한 강력한 보안 기능, Realtime 기능 내장. |
| | Next.js API Routes | Vercel 서버리스 환경에 최적화된 백엔드 API 구현, 프론트엔드와 동일한 언어(TypeScript) 사용으로 개발 효율성 증대. |
| | Airtable | 비개발자 친화적인 인터페이스로 초기 콘텐츠 큐레이션 및 관리 용이. |
| **인증** | Firebase Auth | Google, Apple 소셜 로그인 및 이메일, 전화번호 인증 등 다양한 인증 방식 지원, Supabase와의 연동 용이성. |
| **실시간 통신** | Supabase Realtime | Supabase DB와의 연동을 통한 실시간 데이터 동기화, 커뮤니티 댓글 및 알림 기능 구현에 적합. |
| **알림** | Firebase Cloud Messaging (FCM) | 웹 푸시 알림 및 모바일 앱 푸시 알림 확장성, 공고 매칭 및 커뮤니티 반응 알림에 활용. |
| | SendGrid | 안정적인 이메일 발송 서비스, 인증 메일 및 대량 알림 메일 발송에 활용. |
| **이미지 처리** | Cloudinary | 이미지 업로드, 최적화, 리사이징, CDN 제공으로 성능 향상 및 스토리지 관리 효율화. |
| **배포** | Vercel | Next.js에 최적화된 서버리스 배포 플랫폼, CI/CD 자동화, 빠른 배포 및 스케일링. |
| **모노레포** | Turborepo + pnpm | 모노레포 빌드 시스템으로 여러 프로젝트(web, admin, packages)의 효율적인 관리, 빌드 캐싱을 통한 개발 속도 향상, pnpm을 통한 의존성 관리 최적화. |
| **분석** | Google Analytics 4 (GA4) | 사용자 행동 분석, 이벤트 기반 데이터 수집, Supabase 레포팅과 연동하여 통합 분석. |
| **기타** | React Query (또는 SWR) | 클라이언트 측 데이터 페칭 및 캐싱 관리, UI와 데이터 동기화 효율화. |

## 3. 시스템 아키텍처 설계

### 최상위 빌딩 블록
*   **클라이언트 (Next.js 웹 애플리케이션)**: 사용자 인터페이스를 제공하며, React 컴포넌트와 Next.js의 페이지 라우팅 및 데이터 페칭 기능을 활용합니다. SSR/CSR 하이브리드 렌더링을 통해 초기 로딩 성능과 SEO를 최적화합니다.
*   **백엔드 (Next.js API Routes / Supabase Edge Functions)**: 클라이언트의 요청을 처리하고 데이터베이스와 상호작용하는 서버리스 API 계층입니다. 인증, 데이터 CRUD, 비즈니스 로직을 담당합니다.
*   **데이터베이스 (Supabase PostgreSQL)**: 모든 애플리케이션 데이터를 저장하고 관리하는 관계형 데이터베이스입니다. 사용자 정보, 콘텐츠, 커뮤니티 게시물, 채용 공고 등 핵심 데이터를 포함합니다.
*   **인증 서비스 (Firebase Auth)**: 사용자 회원가입, 로그인, 세션 관리를 담당합니다. OAuth2.0 기반 소셜 로그인 및 전화번호 인증을 처리합니다.
*   **실시간 서비스 (Supabase Realtime)**: 커뮤니티 댓글, 알림 등 실시간 데이터 동기화가 필요한 기능을 지원합니다. WebSocket 기반으로 클라이언트와 서버 간 양방향 통신을 제공합니다.
*   **외부 서비스**: Cloudinary (이미지 처리), SendGrid (이메일), Firebase Cloud Messaging (푸시 알림), Airtable (콘텐츠 CMS) 등 특정 기능을 위한 외부 연동 서비스입니다.

### 최상위 컴포넌트 상호작용 다이어그램

```mermaid
graph TD
    A[사용자 (웹 브라우저)] -->|HTTPS| B[Next.js 웹 애플리케이션 (Vercel)]
    B -->|API 요청| C[Next.js API Routes (Vercel)]
    C -->|DB 쿼리| D[Supabase PostgreSQL DB]
    C -->|인증 요청| E[Firebase Auth]
    C -->|이미지 업로드/처리| F[Cloudinary]
    C -->|이메일 발송| G[SendGrid]
    C -->|푸시 알림| H[Firebase Cloud Messaging]
    B -->|실시간 구독| I[Supabase Realtime]
    I --> D
    J[콘텐츠 관리자] --> K[Airtable CMS]
    K -->|데이터 동기화 (수동/자동)| D
```

*   **사용자 (웹 브라우저)**는 HTTPS를 통해 Vercel에 배포된 Next.js 웹 애플리케이션에 접속합니다.
*   **Next.js 웹 애플리케이션**은 사용자 인터페이스를 렌더링하고, 데이터 요청을 **Next.js API Routes**로 보냅니다.
*   **Next.js API Routes**는 비즈니스 로직을 수행하며, **Supabase PostgreSQL DB**에서 데이터를 조회하거나 저장합니다. 또한, **Firebase Auth**를 통해 사용자 인증을 처리하고, **Cloudinary**로 이미지 업로드 및 처리를 위임하며, **SendGrid**로 이메일을 발송하고, **Firebase Cloud Messaging**을 통해 푸시 알림을 보냅니다.
*   **Supabase Realtime**은 **Supabase PostgreSQL DB**의 변경 사항을 실시간으로 감지하여 **Next.js 웹 애플리케이션**에 WebSocket을 통해 전달합니다.
*   **콘텐츠 관리자**는 **Airtable CMS**를 통해 콘텐츠를 관리하며, 이 데이터는 **Supabase PostgreSQL DB**로 동기화됩니다.

### 코드 조직 및 컨벤션
**도메인 주도 조직 전략**
*   **도메인 분리**: `apps/` 디렉토리 내에 `web` (메인 프론트엔드), `admin` (관리자 대시보드)과 같이 비즈니스 도메인별로 애플리케이션을 분리합니다. `packages/` 디렉토리 내에는 `ui`, `auth`, `utils` 등 공유 로직을 도메인 또는 기능 단위로 모듈화합니다.
*   **계층 기반 아키텍처**: 각 애플리케이션 내에서 `pages`, `components`, `services`, `hooks`, `types` 등 역할별로 계층을 분리하여 관심사를 명확히 합니다. API Routes는 `pages/api` 내에 도메인별로 구조화합니다.
*   **기능 기반 모듈**: 특정 기능(예: `curation`, `community`, `job`)과 관련된 컴포넌트, API 로직, 타입 정의 등을 하나의 디렉토리 내에 함께 배치하여 응집도를 높입니다.
*   **공유 컴포넌트**: `packages/ui`에는 디자인 시스템 기반의 재사용 가능한 UI 컴포넌트를, `packages/auth`에는 인증 관련 로직을, `packages/utils`에는 공통 유틸리티 함수를 정의하여 코드 중복을 최소화합니다.

**범용 파일 및 폴더 구조**
```
/
├── apps/
│   ├── web/                     # 메인 프론트엔드 애플리케이션 (Next.js)
│   │   ├── public/              # 정적 파일
│   │   ├── src/
│   │   │   ├── app/             # Next.js 13+ App Router (또는 pages/)
│   │   │   │   ├── (auth)/      # 인증 관련 라우트 그룹
│   │   │   │   ├── api/         # Next.js API Routes
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── curations/
│   │   │   │   │   ├── community/
│   │   │   │   │   └── jobs/
│   │   │   │   ├── curations/   # 셰프 큐레이션 도메인
│   │   │   │   ├── community/   # 커뮤니티 도메인
│   │   │   │   ├── jobs/        # 채용보드 도메인
│   │   │   │   ├── layout.tsx   # 공통 레이아웃
│   │   │   │   └── page.tsx     # 홈 페이지
│   │   │   ├── components/      # 공통 UI 컴포넌트 (도메인 무관)
│   │   │   ├── hooks/           # 공통 React Hooks
│   │   │   ├── lib/             # 클라이언트 측 유틸리티, API 클라이언트 등
│   │   │   ├── styles/          # 전역 스타일, Tailwind CSS 설정
│   │   │   └── types/           # 전역 타입 정의
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── admin/                   # 관리자 대시보드 애플리케이션 (Next.js)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── users/
│   │   │   │   └── ...
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── ...
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── marketing/               # 마케팅/랜딩 페이지 (선택 사항)
│       └── ...
├── packages/
│   ├── ui/                      # 공통 UI 컴포넌트 (Tailwind CSS 기반)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth/                    # 인증 관련 공통 로직 (Firebase Auth 연동)
│   │   ├── src/
│   │   │   ├── client/          # 클라이언트 측 인증 헬퍼
│   │   │   ├── server/          # 서버 측 인증 헬퍼 (API Routes용)
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/                   # 공통 유틸리티 함수 (날짜, 포맷, 유효성 검사 등)
│   │   ├── src/
│   │   │   ├── date.ts
│   │   │   ├── format.ts
│   │   │   └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── config/                  # 공통 설정 파일 (ESLint, Prettier, TypeScript 등)
│   │   ├── eslint-preset.js
│   │   ├── tsconfig-base.json
│   │   └── ...
│   └── types/                   # 전역적으로 사용되는 공통 타입 정의 (선택 사항, utils에 포함 가능)
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── .env.example
├── .gitignore
├── package.json                 # 모노레포 워크스페이스 정의 (pnpm-workspace.yaml)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml          # pnpm 워크스페이스 설정
└── turbo.json                   # Turborepo 설정
```

### 데이터 흐름 및 통신 패턴
*   **클라이언트-서버 통신**:
    *   Next.js 웹 애플리케이션은 `fetch` API 또는 `React Query`와 같은 라이브러리를 사용하여 Next.js API Routes (서버리스 함수)로 HTTP 요청(GET, POST, PUT, DELETE)을 보냅니다.
    *   API 응답은 JSON 형태로 `status`, `data`, `message` 구조를 따르며, 에러 발생 시 표준 HTTP 상태 코드(401, 403, 500 등)와 함께 에러 메시지를 반환합니다.
    *   인증이 필요한 요청에는 JWT 기반의 인증 헤더를 포함합니다.
*   **데이터베이스 상호작용**:
    *   Next.js API Routes는 Supabase 클라이언트 라이브러리(`@supabase/supabase-js`)를 사용하여 Supabase PostgreSQL 데이터베이스와 상호작용합니다.
    *   SQL 쿼리는 Supabase의 ORM 기능을 활용하거나 직접 SQL 쿼리를 작성하여 실행합니다.
    *   데이터베이스 접근은 Row Level Security (RLS) 정책을 통해 제어됩니다.
*   **외부 서비스 통합**:
    *   **인증**: 클라이언트는 Firebase Auth SDK를 통해 소셜 로그인 및 전화번호 인증을 수행하고, 성공 시 JWT 토큰을 발급받아 API 요청에 사용합니다.
    *   **이미지**: Cloudinary SDK를 사용하여 이미지를 직접 업로드하고, 반환된 URL을 Supabase DB에 저장합니다.
    *   **이메일**: Next.js API Routes에서 SendGrid API를 호출하여 이메일을 발송합니다.
    *   **푸시 알림**: Next.js API Routes에서 Firebase Admin SDK를 사용하여 FCM에 푸시 알림 메시지를 전송합니다.
    *   **콘텐츠 CMS**: Airtable에서 관리되는 콘텐츠는 주기적으로 또는 수동으로 Supabase DB로 동기화됩니다.
*   **실시간 통신**:
    *   커뮤니티 댓글, 알림 등 실시간 업데이트가 필요한 기능은 Supabase Realtime 채널을 구독하여 WebSocket을 통해 데이터를 수신합니다.
    *   클라이언트는 Supabase Realtime SDK를 사용하여 특정 테이블 또는 채널의 변경 사항을 실시간으로 반영합니다.
*   **데이터 동기화**:
    *   클라이언트 측에서는 `React Query`의 캐싱 및 `stale-while-revalidate` 전략을 활용하여 데이터 일관성을 유지하고 불필요한 API 호출을 줄입니다.
    *   서버 측에서는 ISR(Incremental Static Regeneration)을 활용하여 자주 변경되지 않는 콘텐츠(예: 큐레이션 피드)의 캐싱 및 주기적인 업데이트를 관리합니다.

## 4. 성능 및 최적화 전략

*   **이미지 최적화**: Cloudinary를 통해 모든 사용자 업로드 이미지를 최적화하고, WebP/AVIF 등 최신 포맷으로 변환하며, CDN을 통해 제공하여 로딩 속도를 단축합니다. Next.js의 `Image` 컴포넌트를 사용하여 Lazy Loading 및 반응형 이미지를 구현합니다.
*   **데이터 페칭 및 캐싱**:
    *   **SSR/ISR 활용**: 초기 로딩 속도 및 SEO를 위해 Next.js의 `getServerSideProps` 또는 `getStaticProps` (ISR 포함)를 활용하여 서버에서 데이터를 미리 페칭합니다. 특히 큐레이션 피드와 같이 자주 변경되지 않지만 중요한 콘텐츠에 ISR을 적용하여 빌드 시간을 줄이고 최신 데이터를 제공합니다.
    *   **클라이언트 캐싱**: `React Query`를 사용하여 클라이언트 측에서 API 응답을 캐싱하고, `stale-while-revalidate` 전략을 통해 사용자 경험을 개선합니다.
*   **데이터베이스 쿼리 최적화**:
    *   PostgreSQL의 인덱스를 적절히 활용하여 쿼리 성능을 최적화합니다. 특히 `created_at`, `role`, `type`, `tags` 등 필터링 및 정렬에 사용되는 컬럼에 인덱스를 생성합니다.
    *   복잡한 조인이나 집계 쿼리는 뷰(View) 또는 구체화된 뷰(Materialized View)를 활용하여 성능을 개선합니다.
*   **서버리스 함수 최적화**: Next.js API Routes는 경량화된 로직으로 구성하여 콜드 스타트(Cold Start) 시간을 최소화하고, Vercel의 엣지 캐싱 기능을 활용하여 API 응답 속도를 향상시킵니다.

## 5. 구현 로드맵 및 마일스톤

### 1단계: 기반 구축 (MVP 구현)
*   **핵심 인프라**: Next.js 프로젝트 초기 설정, Turborepo 모노레포 구성, Supabase DB 및 Firebase Auth 연동. Vercel 배포 파이프라인 구축.
*   **필수 기능**:
    *   회원 가입 및 로그인 (OAuth + 이메일 + 전화번호 인증, 역할 기반 프로필)
    *   셰프 큐레이션 피드 (카드형 썸네일, 스토리 요약, 상세 페이지)
    *   커뮤니티 (글쓰기, 댓글, 좋아요, 북마크, 카테고리)
    *   채용보드 (공고 열람, 업계 용어 기반 필터, 공고 등록, 지원, 저장)
*   **기본 보안**: HTTPS 적용, Supabase RLS 설정, JWT 기반 인증.
*   **개발 환경 설정**: 개발/스테이징/운영 환경 분리, CI/CD 초기 설정.
*   **예상 완료 기간**: 3~10주

### 2단계: 기능 강화
*   **고급 기능**:
    *   매칭 알림 (이메일, 웹 푸시)
    *   콘텐츠/공고 검색, 태그, 정렬 기능 고도화
    *   관리자 대시보드 (콘텐츠/공고/신고 관리, 사용자 차단)
    *   WCAG 2.1 AA 준수 및 다크모드 지원
*   **성능 최적화**: LCP 2.5초 이내 달성, 이미지 최적화, API 캐싱 전략 강화.
*   **보안 강화**: Rate Limiting, ReCaptcha 도입 검토, 관리자 2FA 적용.
*   **모니터링 구현**: GA4 연동, Supabase 레포팅을 통한 핵심 지표 추적.
*   **예상 완료 기간**: 11~18주

### 3단계: 확장 및 최적화
*   **확장성 구현**: 동시 접속 1만 명 처리를 위한 DB 파티셔닝 또는 샤딩 검토, Cloudflare CDN 도입.
*   **고급 통합**: Notion API 연동을 통한 콘텐츠 자동화, Zapier/Make를 통한 운영 자동화.
*   **엔터프라이즈 기능**: 셰프 포트폴리오 기능, 1:1 채팅 기능 (향후 고려).
*   **규정 준수 및 감사**: 개인정보 보호법 준수 강화, 감사 로그 시스템 구축.
*   **예상 완료 기간**: 19주~

## 6. 위험 평가 및 완화 전략

### 기술적 위험 분석
*   **기술 위험**:
    *   **잠재적 문제**: Supabase의 특정 기능(예: Realtime 성능, RLS 복잡성)이 예상보다 제한적이거나 학습 곡선이 높을 수 있음.
    *   **완화 전략**: Supabase 공식 문서 및 커뮤니티 적극 활용, 필요 시 Supabase 지원팀과 협력. 핵심 기능에 대한 PoC(개념 증명)를 통해 기술 적합성 사전 검증.
*   **성능 위험**:
    *   **잠재적 문제**: 동시 접속자 증가 시 DB 부하, API 응답 지연, 실시간 기능의 병목 현상 발생 가능성.
    *   **완화 전략**:
        *   DB: 인덱스 최적화, 쿼리 튜닝, Supabase의 스케일링 옵션 검토. 필요 시 읽기 전용 복제본(Read Replica) 도입.
        *   API: Vercel 서버리스 함수의 메모리/CPU 최적화, 엣지 캐싱 적극 활용.
        *   실시간: Supabase Realtime 채널의 효율적 사용, 불필요한 데이터 전송 최소화.
*   **보안 위험**:
    *   **잠재적 문제**: 인증 우회, 데이터 유출, 악성 사용자 활동(스팸, 어뷰징)으로 인한 서비스 품질 저하.
    *   **완화 전략**:
        *   인증: Firebase Auth의 보안 기능(다단계 인증, 세션 관리) 적극 활용.
        *   데이터: Supabase RLS를 통한 엄격한 접근 제어, 모든 민감 데이터 암호화 저장.
        *   어뷰징: Rate Limiting, ReCaptcha 도입, 관리자 대시보드를 통한 신고/차단 기능 강화, AI 기반 키워드 필터링 도입 검토.
*   **통합 위험**:
    *   **잠재적 문제**: 외부 서비스(Cloudinary, SendGrid, FCM 등)의 API 변경, 서비스 중단, 비용 증가.
    *   **완화 전략**: 각 서비스의 SLA(서비스 수준 협약) 확인, API 변경에 대한 주기적인 모니터링 및 업데이트. 핵심 기능에 대한 대체 서비스 검토(예: Cloudinary 대신 Supabase Storage 활용).

### 프로젝트 제공 위험
*   **일정 위험**:
    *   **잠재적 문제**: MVP 개발 일정 지연, 예상치 못한 기술적 난이도 발생.
    *   **완화 전략**: 애자일 개발 방법론 적용, 스프린트 단위 목표 설정 및 주기적인 진행 상황 검토. 핵심 기능 우선 개발 및 점진적 기능 확장.
*   **자원 위험**:
    *   **잠재적 문제**: 개발 인력 부족, 특정 기술 스택에 대한 전문성 부족.
    *   **완화 전략**: 핵심 개발자 역량 강화 교육, 필요 시 외부 전문가 자문 또는 채용 검토. 모노레포 구조를 통해 팀 간 협업 효율 증대.
*   **품질 위험**:
    *   **잠재적 문제**: 코드 품질 저하, 버그 발생률 증가, 사용자 경험 저해.
    *   **완화 전략**: TypeScript 적극 활용, 코드 리뷰 의무화, Jest/React Testing Library를 활용한 단위/통합 테스트 코드 작성. E2E 테스트(Playwright/Cypress) 도입 검토.
*   **배포 위험**:
    *   **잠재적 문제**: 프로덕션 환경 배포 시 문제 발생, 롤백의 어려움.
    *   **완화 전략**: Vercel의 자동화된 CI/CD 파이프라인 활용, 스테이징 환경에서 충분한 테스트 진행 후 프로덕션 배포. 배포 전 체크리스트 작성 및 준수.
*   **비상 계획**:
    *   주요 서비스 장애 시 대응 매뉴얼 수립.
    *   데이터 백업 및 복구 전략 수립 (Supabase 자동 백업 활용 및 주기적 수동 백업 검토).
    *   긴급 상황 발생 시 팀 내 비상 연락망 구축 및 역할 분담.