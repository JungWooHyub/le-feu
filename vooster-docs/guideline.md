# le feu: 코드 가이드라인 문서 (Code Guideline)

> **목적:** 이 문서는 `le feu` 프로젝트의 코드 품질과 유지보수성을 보장하기 위해 모든 팀원이 따라야 할 개발 표준을 정의합니다.

---

## 1. 프로젝트 개요

le feu는 요식업 종사자 전용 콘텐츠 큐레이션 + 커뮤니티 + 구인/구직 기능을 제공하는 웹 기반 플랫폼입니다.

**핵심 기술 스택 및 구조:**
- **Monorepo:** `Turborepo + pnpm`
- **Frontend:** `Next.js`, `React`, `TypeScript`, `Tailwind CSS`
- **Backend/API:** `Next.js API Routes` (Serverless) + `Supabase` (PostgreSQL)
- **Auth:** `Firebase Auth + Phone 인증 (번호 인증)`
- **Realtime:** `Supabase Realtime`
- **CI/CD & Hosting:** `Vercel`
- **CMS/Analytics:** `Airtable`, `GA4`
- **3rd-party:** `SendGrid`, `Cloudinary`, `Sentry`

---

## 2. 핵심 개발 원칙 (Principles)

| 원칙 | 설명 |
|------|------|
| **가독성 (Readability)** | 누구나 이해할 수 있도록 명확하게 작성 |
| **일관성 (Consistency)** | 파일 구조, 변수명, 코드 스타일 통일 |
| **유지보수성 (Maintainability)** | 확장, 디버깅, 리팩토링이 쉬운 구조 |
| **성능 (Performance)** | 최소 로딩 시간, 최적화된 API 호출 |
| **보안 (Security)** | 사용자 데이터 보호, 인증/인가 철저 |

---

## 3. 프로젝트 구조

```
/apps
  web/           # 사용자 웹앱 (Next.js)
  admin/         # 관리자 페이지 (Next.js)
/packages
  ui/            # 디자인 시스템
  auth/          # 인증 로직 모듈화
  utils/         # 공통 유틸리티
```

---

## 4. 코드 작성 규칙

### ✅ 반드시 지켜야 할 규칙 (MUST)

- `PascalCase`: React 컴포넌트, 타입/인터페이스
- `camelCase`: 함수, 변수, state
- `snake_case`: DB 컬럼명
- `kebab-case`: Tailwind 커스텀 className

### ✅ API & 비동기 처리

- 모든 API는 `/api/*`에서 RESTful하게 구성
- `try/catch`로 에러 핸들링, 사용자 피드백 필수
- 오류는 `Sentry`, `Vercel 로그`, `console.error` 중 하나 이상으로 반드시 로깅
- 응답은 `{ data: T, message?: string }` 또는 `{ error: string }` 형식 통일

### ✅ 데이터 패칭

- 클라이언트: `React Query` (useQuery/useMutation)
- 서버사이드: `getStaticProps`, `getServerSideProps` (필요 시)
- 반드시 API 경유. React 컴포넌트 내에서 직접 DB 접근 ❌

### ✅ 상태 관리

- **서버 상태**: `React Query`
- **로컬 상태**: `useState`, `useReducer`
- **전역 상태**: `Zustand` or `React Context` (단, 최소화)

### ✅ 폼 관리

- `react-hook-form` + `Zod` 또는 `Yup`으로 validation

---

## 5. 코드 스타일 도구

- **ESLint**: Airbnb 기반 커스터마이징
- **Prettier**: 팀 통일된 포맷 자동 적용
- **Example .eslintrc.js**:
```js
module.exports = {
  extends: ["next", "airbnb", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

## 6. 테스트 & QA

| 항목 | 도구 |
|------|------|
| **단위 테스트** | `Jest` + `React Testing Library` |
| **E2E 테스트** | `Playwright` or `Cypress` |
| **CI 테스트 조건** | PR 생성 시 Lint + Test 자동 수행 (GitHub Actions 설정)

```yaml
# .github/workflows/ci.yml
- run: npm run lint
- run: npm run test
```

---

## 7. 보안 및 인증

- 모든 인증은 `Firebase Auth + Phone 인증` 사용
- 인증된 사용자만 접근 가능한 API는 `JWT` 기반으로 보호
- **RBAC**(역할 기반 권한): 관리자/사업주/일반회원 구분
- 비밀번호는 bcrypt 해시 저장, HTTPS 항상 유지
- `Supabase RLS` 활성화: 유저 소유 데이터만 접근 허용

---

## 8. 환경 변수 관리

- `.env.example`을 반드시 제공
- **Private** 정보는 클라이언트에 노출 금지
- 예시:
```
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxxx   # ❌ 클라이언트 노출 금지
SENDGRID_API_KEY=xxx
```

---

## 9. 기타 주의사항

- `getServerSideProps` 남용 금지 → `getStaticProps + ISR` 우선 고려
- Tailwind class 남용 지양. 필요한 경우 `clsx`, `classnames` 활용
- 500줄 넘는 파일은 무조건 분리 (단일 책임 원칙)
- `console.log`는 개발 중에도 최소화, 배포 시 제거

---

## 10. 마무리

이 가이드는 팀 전체의 **일관성 있는 코드 작성**, **빠른 온보딩**, **에러 최소화**, **유지보수 효율성**을 위해 반드시 준수되어야 합니다.

→ 위반 시 PR 리뷰 단계에서 수정 요청 가능
→ 보완이 필요한 내용은 GitHub Discussion 또는 Notion에서 논의 후 반영

---

> 🔐 *le feu 팀의 모든 개발자는 이 가이드라인을 기반으로 작업해야 합니다.*
> 
> ✍️ Created by ChatGPT & Vooster 기반 설계 반영