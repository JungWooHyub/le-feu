# RBAC 보안 시스템 가이드

> **le feu 프로젝트의 역할 기반 접근 제어(RBAC) 시스템 사용법과 보안 가이드라인**

## 📋 목차
1. [RBAC 시스템 개요](#rbac-시스템-개요)
2. [역할 및 권한 구조](#역할-및-권한-구조)
3. [API 미들웨어 사용법](#api-미들웨어-사용법)
4. [보안 가이드라인](#보안-가이드라인)
5. [감사 및 모니터링](#감사-및-모니터링)

---

## RBAC 시스템 개요

le feu의 RBAC 시스템은 **ISMS-P 보안 가이드라인**을 준수하며, 요식업 업계에 특화된 역할 기반 접근 제어를 제공합니다.

### 🔑 핵심 원칙
- **최소 권한 원칙 (Principle of Least Privilege)**: 업무 수행에 필요한 최소한의 권한만 부여
- **역할 분리 (Separation of Duties)**: 중요한 작업은 여러 역할로 분산
- **소유자 기반 접근**: 본인이 생성한 리소스에 대한 추가 권한 부여
- **감사 추적성**: 모든 권한 체크 및 중요 작업 로깅

---

## 역할 및 권한 구조

### 👥 사용자 역할 계층구조

```
SUPER_ADMIN (5) ← 시스템 전체 관리
    ↑
ADMIN (4) ← 플랫폼 운영 관리
    ↑
CURATOR (3) ← 콘텐츠 관리
    ↑
EMPLOYER (2) ← 채용공고 관리
    ↑
USER (1) ← 기본 사용자
```

### 🎯 역할별 상세 권한

#### 1. USER (일반 사용자)
**대상**: 셰프, 주방보조, 매니저, 지망생 등
```typescript
- 큐레이션 읽기 (curations:read)
- 커뮤니티 읽기/작성 (community:read, community:create)
- 본인 커뮤니티 글 수정/삭제 (community:update_own, community:delete_own)
- 채용공고 읽기 (jobs:read)
- 본인 프로필 수정 (users:update_own)
```

#### 2. EMPLOYER (사업주)
**대상**: 음식점 운영자, 인사 담당자
```typescript
- USER 권한 + 추가 권한:
- 채용공고 작성/관리 (jobs:create, jobs:update_own, jobs:delete_own)
- 지원자 정보 조회 (users:read)
```

#### 3. CURATOR (큐레이터)
**대상**: 콘텐츠 작성자, 업계 전문가
```typescript
- USER 권한 + 추가 권한:
- 큐레이션 작성/수정 (curations:create, curations:update, curations:delete)
- 커뮤니티 모더레이션 (community:moderate, community:pin)
- 기본 분석 조회 (analytics:read)
```

#### 4. ADMIN (관리자)
**대상**: 플랫폼 운영진
```typescript
- CURATOR 권한 + 추가 권한:
- 추천 콘텐츠 설정 (curations:feature)
- 모든 커뮤니티 관리 (community:update_any, community:delete_any)
- 모든 채용공고 관리 (jobs:update_any, jobs:delete_any, jobs:approve)
- 사용자 관리 (users:update_any, users:ban)
- 분석 데이터 내보내기 (analytics:export)
```

#### 5. SUPER_ADMIN (슈퍼 관리자)
**대상**: 시스템 관리자
```typescript
- 모든 권한 (전체 시스템 제어)
- 시스템 설정 (system:settings)
- 백업 관리 (system:backup)
- 시스템 로그 조회 (system:logs)
```

---

## API 미들웨어 사용법

### 🛡️ 기본 인증 미들웨어

#### 1. 간단한 인증 체크
```typescript
import { AuthMiddleware } from '@repo/auth/server';

export const GET = AuthMiddleware.withAuth(
  async (request, { user }) => {
    // user 객체는 인증된 사용자 정보
    return NextResponse.json({ 
      message: `안녕하세요, ${user?.email}님!` 
    });
  },
  { requireAuth: true }
);
```

#### 2. 역할 기반 접근 제어
```typescript
export const POST = AuthMiddleware.withAuth(
  async (request, { user }) => {
    // 큐레이터 이상만 접근 가능
    return NextResponse.json({ message: '큐레이션 생성 성공' });
  },
  { 
    requireAuth: true,
    requiredRole: UserRole.CURATOR 
  }
);
```

#### 3. 세부 권한 체크
```typescript
export const DELETE = AuthMiddleware.withAuth(
  async (request, { user }) => {
    // 특정 권한이 있는 사용자만 접근
    return NextResponse.json({ message: '삭제 완료' });
  },
  { 
    requireAuth: true,
    requiredPermission: Permission.CURATIONS_DELETE 
  }
);
```

#### 4. 소유자 접근 허용
```typescript
// /api/community/[postId]/route.ts
export const PUT = AuthMiddleware.withAuth(
  async (request, { user, params }) => {
    // 관리자이거나 게시물 작성자만 수정 가능
    return NextResponse.json({ message: '수정 완료' });
  },
  { 
    requireAuth: true,
    requiredPermission: Permission.COMMUNITY_UPDATE_ANY,
    allowOwnerAccess: true // 본인 글은 UPDATE_OWN 권한으로 허용
  }
);
```

### 🔍 고급 권한 체크

#### 수동 권한 체크
```typescript
import { RBACService, UserRole, Permission } from '@repo/auth/server';

export async function POST(request: NextRequest) {
  // 수동 인증
  const authResult = await AuthMiddleware.authenticate(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error.message },
      { status: authResult.error.status }
    );
  }

  const user = authResult.user!;
  
  // 복잡한 권한 로직
  const context = {
    userRole: user.role,
    userId: user.id,
    resourceOwnerId: 'some-resource-owner-id'
  };

  const canEdit = RBACService.checkPermission(context, Permission.CURATIONS_UPDATE);
  if (!canEdit.allowed) {
    return NextResponse.json(
      { error: canEdit.reason },
      { status: 403 }
    );
  }

  // 비즈니스 로직 실행
  return NextResponse.json({ success: true });
}
```

---

## 보안 가이드라인

### 🔒 필수 보안 규칙

#### 1. 인증 토큰 처리
```typescript
// ✅ 올바른 방법
const authHeader = request.headers.get('authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return new Response('Unauthorized', { status: 401 });
}

// ❌ 잘못된 방법
const token = request.url.searchParams.get('token'); // URL에 토큰 노출
```

#### 2. 권한 체크 순서
```typescript
// ✅ 올바른 순서
export const handler = AuthMiddleware.withAuth(
  async (request, { user }) => {
    // 1. 인증 체크 (미들웨어가 자동 처리)
    // 2. 권한 체크 (미들웨어가 자동 처리)
    // 3. 리소스 존재 확인
    // 4. 소유자 확인 (필요시)
    // 5. 비즈니스 로직 실행
  },
  { requiredPermission: Permission.SOME_PERMISSION }
);
```

#### 3. 민감한 정보 접근
```typescript
// ✅ 관리자만 접근 가능한 민감 정보
export const GET = AuthMiddleware.withAuth(
  async (request, { user }) => {
    // 사용자 목록에서 민감 정보 제거
    const users = await getUsers();
    return NextResponse.json({
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        // 전화번호, 주소 등 민감 정보 제외
      }))
    });
  },
  { requiredRole: UserRole.ADMIN }
);
```

### 🛡️ Rate Limiting 적용

```typescript
export const POST = AuthMiddleware.withAuth(
  async (request, { user }) => {
    // Rate limiting 체크
    const rateLimit = await AuthMiddleware.checkRateLimit(
      user.id,
      'post_creation',
      10, // 10회 제한
      60 * 1000 // 1분 윈도우
    );

    if (rateLimit.limited) {
      return NextResponse.json(
        { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    // 정상 처리
    return NextResponse.json({ success: true });
  }
);
```

### 🚨 보안 점검 체크리스트

#### API 개발 시 확인사항
- [ ] 모든 민감한 API에 인증 미들웨어 적용
- [ ] 적절한 권한 수준 설정 (최소 권한 원칙)
- [ ] 소유자 접근 권한 올바르게 설정
- [ ] Rate limiting 적용 (필요시)
- [ ] 입력 데이터 검증 및 sanitization
- [ ] 에러 메시지에 민감 정보 노출 방지

#### 프로덕션 배포 전 확인
- [ ] 모든 API 엔드포인트 권한 테스트
- [ ] 관리자 계정 2FA 설정
- [ ] 로그 모니터링 시스템 구축
- [ ] 비정상 접근 패턴 알림 설정

---

## 감사 및 모니터링

### 📊 자동 로깅

RBAC 시스템은 다음 이벤트를 자동으로 로깅합니다:

```typescript
// 권한 체크 로그 예시
{
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "user-123",
  "userRole": "curator",
  "permission": "curations:create",
  "action": "API_ACCESS",
  "allowed": true,
  "resourceOwnerId": null
}
```

### 🔍 모니터링 대상

#### 1. 권한 위반 시도
```typescript
// 실패한 권한 체크 모니터링
if (!permissionResult.allowed) {
  console.warn('SECURITY_ALERT:', {
    userId: context.userId,
    attemptedPermission: permission,
    userRole: context.userRole,
    reason: permissionResult.reason
  });
}
```

#### 2. 비정상 접근 패턴
- 단시간 내 다수 권한 거부
- 일반 사용자의 관리자 권한 시도
- 비정상적인 시간대 접근

#### 3. 역할 변경 추적
```typescript
// 역할 변경 로그
{
  "event": "ROLE_CHANGED",
  "targetUserId": "user-456",
  "previousRole": "user",
  "newRole": "curator",
  "changedBy": "admin-123",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 📈 대시보드 메트릭

관리자 대시보드에서 확인 가능한 보안 지표:

1. **권한 체크 통계**
   - 성공/실패율
   - 자주 거부되는 권한
   - 사용자별 접근 패턴

2. **사용자 활동**
   - 활성 사용자 수
   - 역할별 분포
   - 권한 사용 빈도

3. **보안 이벤트**
   - 권한 위반 시도
   - 계정 잠금
   - 비정상 접근

---

## 문제해결 가이드

### 🚨 자주 발생하는 문제

#### 1. "권한이 없습니다" 오류
**원인**: 사용자 역할에 필요한 권한이 없음
**해결**:
```typescript
// 현재 사용자 권한 확인
const userPermissions = ROLE_PERMISSIONS[userRole];
console.log('사용자 권한:', userPermissions);

// 필요한 권한 확인
const hasPermission = RBACService.hasPermission(userRole, requiredPermission);
```

#### 2. 토큰 인증 실패
**원인**: 만료되었거나 잘못된 JWT 토큰
**해결**:
```typescript
// 토큰 유효성 수동 확인
const { data, error } = await supabase.auth.getUser(token);
if (error) {
  console.error('토큰 오류:', error.message);
}
```

#### 3. 소유자 권한 체크 실패
**원인**: resourceOwnerId가 올바르게 전달되지 않음
**해결**:
```typescript
// URL 파라미터에서 올바른 소유자 ID 추출
const resourceOwnerId = params?.authorId || params?.userId;
console.log('리소스 소유자 ID:', resourceOwnerId);
```

---

## 개발자 참고사항

### 📚 관련 파일
- `packages/auth/src/types/roles.ts` - 역할 및 권한 정의
- `packages/auth/src/server/rbac-service.ts` - RBAC 핵심 로직
- `packages/auth/src/server/auth-middleware.ts` - API 미들웨어
- `database/schema/01_users.sql` - 사용자 테이블 스키마

### 🔗 외부 문서
- [ISMS-P 보안 가이드](https://isms-p.kisa.or.kr)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP 인증 가이드](https://owasp.org/www-project-authentication-cheat-sheet/)

---

> 💡 **보안 팁**: 권한 체크는 클라이언트와 서버 양쪽에서 수행하되, 서버 측 체크를 신뢰 기준으로 삼으세요. 클라이언트 측은 UX 개선 목적으로만 사용하세요. 