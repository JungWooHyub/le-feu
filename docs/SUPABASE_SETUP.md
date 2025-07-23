# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

### 단계별 진행

1. **Supabase 계정 생성**
   - [https://supabase.com](https://supabase.com) 접속
   - GitHub 또는 이메일로 계정 생성

2. **새 프로젝트 생성**
   - 대시보드에서 "New Project" 클릭
   - Organization 선택 (개인 계정 사용)
   - 프로젝트 정보 입력:
     - **Name**: `le-feu`
     - **Database Password**: 강력한 비밀번호 설정 (기록해둘 것)
     - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스이므로)
   - "Create new project" 클릭

3. **프로젝트 초기화 대기**
   - 프로젝트 생성까지 약 2-3분 소요
   - 완료되면 대시보드로 자동 이동

## 2. API 키 및 URL 확인

### Settings > API 페이지에서 확인

1. **Project URL** 복사
   ```
   https://your-project-id.supabase.co
   ```

2. **API Keys** 확인 및 복사
   - **anon public**: 클라이언트에서 사용하는 공개 키
   - **service_role**: 서버에서 사용하는 관리자 키 (비공개)

## 3. 환경변수 설정

### .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database 직접 연결 (필요시)
SUPABASE_DB_PASSWORD=your-database-password
```

### 보안 주의사항

- `NEXT_PUBLIC_*` 변수는 클라이언트에서 접근 가능
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 측에서만 사용
- `.env.local` 파일은 절대 git에 커밋하지 말 것

## 4. 연결 테스트

### 테스트 스크립트 실행

```bash
# Supabase 연결 테스트
npm run test:supabase
```

### 예상 출력

```
🔗 Supabase 연결 테스트를 시작합니다...

✅ 환경변수 확인 완료
📍 Supabase URL: https://your-project.supabase.co
🔑 API Key: eyJhbGciOiJIUzI1NiIs...

🚀 Supabase 클라이언트 생성 완료
✅ 데이터베이스 연결 성공!
⚠️  인증 상태: 비로그인 (정상)

🎉 모든 연결 테스트가 성공적으로 완료되었습니다!
```

## 5. Supabase CLI 설정 (선택사항)

### Node.js 18+ 환경에서만 지원

현재 프로젝트는 Node.js 16 환경이므로 Supabase CLI 전역 설치가 제한됩니다.

#### 방법 1: npx 사용 (권장)

```bash
# CLI 명령어 실행시마다 npx 사용
npx supabase --help
npx supabase init
npx supabase login
```

#### 방법 2: Node.js 업그레이드 후 설치

```bash
# Node.js 18+ 업그레이드 후
npm install -g supabase
supabase --help
```

### 프로젝트 초기화 (CLI 사용시)

```bash
# 프로젝트 루트에서 실행
npx supabase init

# Supabase 로그인
npx supabase login

# 기존 프로젝트 연결
npx supabase link --project-ref your-project-id
```

## 6. 다음 단계

### T-005: 기본 테이블 스키마 설계

- 사용자 테이블 (users)
- 콘텐츠 테이블 (curations)
- 커뮤니티 테이블 (posts, comments)
- 채용 테이블 (jobs, applications)

### T-006: Auth 인증 인프라 구축

- Firebase Auth와 Supabase 연동
- 사용자 역할 기반 접근 제어 (RLS)
- 프로필 정보 동기화

## 문제 해결

### 자주 발생하는 오류

1. **"Invalid API key"**
   - API 키가 올바른지 확인
   - 환경변수명이 정확한지 확인

2. **"Network error"**
   - 인터넷 연결 확인
   - Supabase 서비스 상태 확인

3. **"Project not found"**
   - Project URL이 정확한지 확인
   - 프로젝트가 활성화되어 있는지 확인

### 도움 받기

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- 프로젝트 Issues 페이지

---

**주의**: 이 설정은 T-004 작업의 일부이며, 실제 데이터베이스 스키마는 T-005에서 설계됩니다. 