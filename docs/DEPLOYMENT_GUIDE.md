# Vercel 배포 가이드

> **le feu 프로젝트를 Vercel에 배포하는 방법을 설명합니다.**

## 📋 목차
1. [배포 전 준비사항](#배포-전-준비사항)
2. [Vercel 프로젝트 설정](#vercel-프로젝트-설정)
3. [환경변수 설정](#환경변수-설정)
4. [CI/CD 연동](#cicd-연동)
5. [배포 확인](#배포-확인)
6. [문제해결](#문제해결)

---

## 배포 전 준비사항

### 1. 필수 서비스 계정
다음 서비스들의 계정이 필요합니다:
- [Vercel](https://vercel.com) - 배포 플랫폼
- [Supabase](https://supabase.com) - 데이터베이스
- [Firebase](https://firebase.google.com) - 인증 서비스
- [GitHub](https://github.com) - 소스 코드 관리

### 2. 로컬 환경 확인
```bash
# 환경변수 검증
npm run test:env

# 빌드 테스트
npm run build

# 린트 체크
npm run lint
```

---

## Vercel 프로젝트 설정

### 1. Vercel CLI 설치 및 로그인
```bash
# Vercel CLI 설치
npm i -g vercel

# Vercel 로그인
vercel login
```

### 2. 프로젝트 연결
```bash
# 프로젝트 루트에서 실행
vercel

# 질문 응답:
# ? Set up and deploy "~/le feu"? [Y/n] y
# ? Which scope do you want to deploy to? [개인 계정 선택]
# ? Link to existing project? [N/y] n
# ? What's your project's name? le-feu
# ? In which directory is your code located? ./
```

### 3. 모노레포 설정
Vercel 대시보드에서 다음 설정:

**Settings → General**
- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Node.js Version: `20.x`

**Settings → Build & Output**
- Build Command: `cd ../.. && pnpm run build --filter=web`
- Output Directory: `.next`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`

---

## 환경변수 설정

### 1. Vercel 환경변수 추가
Vercel Dashboard → Settings → Environment Variables에서 추가:

#### 🔑 필수 환경변수
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# 보안
JWT_SECRET=your-production-jwt-secret
NEXTAUTH_SECRET=your-production-nextauth-secret

# 애플리케이션
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

#### 📧 선택적 환경변수
```bash
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@your-domain.com

# Airtable
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-base-id
```

### 2. 환경별 설정
- **Production**: 모든 환경변수 설정
- **Preview**: Production과 동일, 단 URL은 Preview 도메인 사용
- **Development**: 로컬 개발용 설정

---

## CI/CD 연동

### 1. GitHub Actions 자동 배포
`.github/workflows/ci.yml`에서 자동 CI/CD 구성됨:

```yaml
# main 브랜치 push 시 자동 배포
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

### 2. 배포 프로세스
1. **코드 Push** → GitHub
2. **CI 실행** → Lint, Test, Build 검증
3. **자동 배포** → Vercel (main 브랜치만)
4. **Preview 배포** → PR 생성 시 Preview URL 제공

### 3. 수동 배포
```bash
# 프로덕션 배포
vercel --prod

# Preview 배포  
vercel
```

---

## 배포 확인

### 1. 배포 상태 확인
```bash
# Vercel 프로젝트 상태
vercel ls

# 특정 배포 로그 확인
vercel logs [deployment-url]
```

### 2. 기능 테스트 체크리스트
- [ ] 메인 페이지 로딩
- [ ] 큐레이션 페이지 접근
- [ ] 커뮤니티 페이지 접근  
- [ ] 채용보드 페이지 접근
- [ ] API 엔드포인트 테스트
- [ ] 인증 플로우 테스트
- [ ] 모바일 반응형 확인

### 3. 성능 검증
```bash
# Lighthouse 성능 측정
npx lighthouse https://your-domain.vercel.app --view

# Core Web Vitals 확인
# LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

## 문제해결

### 자주 발생하는 문제들

#### 1. 빌드 실패
**증상**: `Build failed` 에러
**해결방법**:
```bash
# 로컬에서 빌드 테스트
npm run build

# TypeScript 에러 확인
npm run type-check

# 환경변수 확인
npm run test:env
```

#### 2. API 라우트 404 에러
**증상**: `/api/*` 경로에서 404 발생
**해결방법**:
- `vercel.json`의 rewrites 설정 확인
- API 파일 경로 확인 (`src/app/api/`)
- 환경변수 설정 확인

#### 3. 환경변수 미적용
**증상**: 환경변수가 undefined
**해결방법**:
- Vercel Dashboard에서 환경변수 재확인
- 클라이언트 변수는 `NEXT_PUBLIC_` 접두사 필수
- 재배포 실행: `vercel --force`

#### 4. Supabase 연결 실패
**증상**: Database connection failed
**해결방법**:
- Supabase URL/KEY 확인
- RLS 정책 설정 확인
- Supabase 프로젝트 활성 상태 확인

#### 5. Firebase 인증 오류
**증상**: Firebase auth domain error
**해결방법**:
- Firebase Console에서 승인된 도메인 추가
- Vercel 도메인을 Firebase Auth 허용 목록에 추가

---

## 도메인 설정 (선택사항)

### 1. 커스텀 도메인 연결
Vercel Dashboard → Settings → Domains:
```
lefeu.co (Primary)
www.lefeu.co (Redirect)
```

### 2. SSL 인증서
- Vercel에서 자동 SSL 인증서 제공
- Let's Encrypt 무료 SSL 사용

---

## 모니터링 설정

### 1. Vercel Analytics
```bash
# Vercel Analytics 활성화
vercel env add NEXT_PUBLIC_VERCEL_ANALYTICS_ID [your-analytics-id]
```

### 2. 에러 모니터링
- Vercel Functions 로그 모니터링
- Sentry 연동 (선택사항)

---

## 배포 체크리스트

배포 전 다음 항목들을 확인하세요:

### 🔒 보안
- [ ] 모든 API 라우트에 인증 검증
- [ ] 환경변수에 민감정보 노출 없음
- [ ] HTTPS 강제 리디렉션 설정
- [ ] CORS 정책 적절히 설정

### 🚀 성능
- [ ] 이미지 최적화 (Next.js Image 컴포넌트)
- [ ] 번들 사이즈 최적화
- [ ] LCP < 2.5초 달성
- [ ] 불필요한 로깅 제거

### 📱 사용성
- [ ] 모든 페이지 모바일 반응형
- [ ] 다크모드 지원 (필요시)
- [ ] 접근성 가이드라인 준수

### 🔧 기술
- [ ] 모든 링크 정상 작동
- [ ] 404 페이지 적절히 처리
- [ ] 에러 바운더리 설정
- [ ] 메타태그 SEO 최적화

---

## 추가 리소스

- 📚 [Vercel 문서](https://vercel.com/docs)
- 🔧 [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- 🗄️ [Supabase 프로덕션 가이드](https://supabase.com/docs/guides/platform/going-into-prod)
- 🔥 [Firebase 프로덕션 설정](https://firebase.google.com/docs/hosting)

---

> 💡 **팁**: 배포 후 반드시 실제 사용자 관점에서 전체 플로우를 테스트해보세요! 