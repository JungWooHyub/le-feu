# 환경변수 설정 가이드

> **le feu 프로젝트의 환경변수 설정 방법을 안내합니다.**

## 📋 목차
1. [개요](#개요)
2. [필수 설정](#필수-설정)
3. [서비스별 설정](#서비스별-설정)
4. [환경별 설정](#환경별-설정)
5. [보안 주의사항](#보안-주의사항)

---

## 개요

le feu 프로젝트는 다음과 같은 외부 서비스들과 연동됩니다:
- **Supabase**: 데이터베이스 및 실시간 기능
- **Firebase**: 사용자 인증 (OAuth, 전화번호 인증)
- **Cloudinary**: 이미지 업로드 및 최적화
- **SendGrid**: 이메일 발송
- **Airtable**: 콘텐츠 관리 시스템

## 필수 설정

### 1. 환경변수 파일 생성
```bash
# 루트 디렉토리에서 실행
cp .env.example .env.local
```

### 2. 최소 필수 환경변수
개발을 시작하기 위해 반드시 설정해야 하는 변수들:

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Firebase (필수)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# 애플리케이션 (필수)
NEXTAUTH_SECRET=
JWT_SECRET=
```

---

## 서비스별 설정

### 🗄️ Supabase 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트 생성
2. Settings → API에서 다음 값 복사:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
   ```

### 🔐 Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication → Sign-in method에서 다음 활성화:
   - Google
   - 전화번호
   - 이메일/비밀번호
3. 프로젝트 설정에서 웹앱 추가 후 구성 정보 복사:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   # ... 기타 Firebase 설정
   ```

### 🖼️ Cloudinary 설정

1. [Cloudinary](https://cloudinary.com/) 계정 생성
2. Dashboard에서 API 키 확인:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### 📧 SendGrid 설정

1. [SendGrid](https://sendgrid.com/) 계정 생성
2. API Keys에서 새 키 생성:
   ```env
   SENDGRID_API_KEY=SG.your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

### 📊 Airtable 설정

1. [Airtable](https://airtable.com/) 계정 생성
2. 콘텐츠 관리용 베이스 생성
3. Account → API에서 API 키 생성:
   ```env
   AIRTABLE_API_KEY=your-airtable-api-key
   AIRTABLE_BASE_ID=your-base-id
   ```

---

## 환경별 설정

### 🛠️ 개발 환경 (Development)
```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
```

### 🚀 스테이징 환경 (Staging)
```env
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.lefeu.co
NEXTAUTH_URL=https://staging.lefeu.co
```

### 🏭 프로덕션 환경 (Production)
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://lefeu.co
NEXTAUTH_URL=https://lefeu.co
```

---

## 보안 주의사항

### ⚠️ 절대 금지사항
- **Git에 실제 환경변수 커밋 금지**
- **클라이언트 코드에 비밀키 노출 금지**
- **개발자간 환경변수 직접 공유 금지**

### ✅ 보안 가이드라인
1. **NEXT_PUBLIC_** 접두사가 없는 변수는 서버에서만 사용
2. **비밀키는 최소 32자 이상의 랜덤 문자열 사용**
3. **프로덕션과 개발 환경의 키는 완전히 분리**
4. **주기적인 키 로테이션 (최소 6개월마다)**

### 🔐 비밀키 생성 방법
```bash
# JWT Secret 생성
openssl rand -base64 32

# Encryption Key 생성 (64 hex characters)
openssl rand -hex 32

# NextAuth Secret 생성
openssl rand -base64 32
```

---

## 환경변수 검증

개발 시작 전 다음 스크립트로 환경변수 설정을 검증하세요:

```bash
# 환경변수 테스트
npm run test:env
```

---

## 문제해결

### 자주 발생하는 문제들

1. **Supabase 연결 실패**
   - URL과 API 키가 정확한지 확인
   - RLS 정책이 올바르게 설정되었는지 확인

2. **Firebase 인증 실패**
   - 도메인이 허용 목록에 있는지 확인
   - API 키가 올바른지 확인

3. **이미지 업로드 실패**
   - Cloudinary 설정이 올바른지 확인
   - CORS 설정 확인

---

## 추가 도움이 필요한 경우

- 📚 [Supabase 문서](https://supabase.com/docs)
- 🔥 [Firebase 문서](https://firebase.google.com/docs)
- ☁️ [Cloudinary 문서](https://cloudinary.com/documentation)
- 📬 [SendGrid 문서](https://docs.sendgrid.com/)

---

> 💡 **팁**: 환경변수 설정 후 반드시 서버를 재시작하세요! 