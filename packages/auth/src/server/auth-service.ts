import { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from './config';
import type { AuthTokenPayload, AuthError, SupabaseUserProfile } from '../types';

// JWT 토큰 검증
export async function verifyIdToken(idToken: string): Promise<{
  payload: DecodedIdToken | null;
  error?: AuthError;
}> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return { payload: decodedToken };
  } catch (error: any) {
    console.error('토큰 검증 실패:', error);
    
    return {
      payload: null,
      error: {
        code: error.code || 'auth/invalid-token',
        message: error.message || '유효하지 않은 토큰입니다.',
        details: error
      }
    };
  }
}

// 세션 쿠키 생성 (선택적)
export async function createSessionCookie(
  idToken: string,
  expiresIn: number = 60 * 60 * 24 * 5 * 1000 // 5일
): Promise<{ sessionCookie: string | null; error?: AuthError }> {
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    return { sessionCookie };
  } catch (error: any) {
    return {
      sessionCookie: null,
      error: {
        code: error.code || 'auth/session-create-failed',
        message: error.message || '세션 생성에 실패했습니다.',
        details: error
      }
    };
  }
}

// 세션 쿠키 검증
export async function verifySessionCookie(sessionCookie: string): Promise<{
  payload: DecodedIdToken | null;
  error?: AuthError;
}> {
  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return { payload: decodedToken };
  } catch (error: any) {
    return {
      payload: null,
      error: {
        code: error.code || 'auth/invalid-session',
        message: error.message || '유효하지 않은 세션입니다.',
        details: error
      }
    };
  }
}

// 사용자 정보 조회 (Firebase)
export async function getFirebaseUser(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid);
    return {
      user: {
        uid: userRecord.uid,
        email: userRecord.email || null,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName || null,
        photoURL: userRecord.photoURL || null,
        phoneNumber: userRecord.phoneNumber || null,
        disabled: userRecord.disabled,
        metadata: {
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime,
          lastRefreshTime: userRecord.metadata.lastRefreshTime
        },
        customClaims: userRecord.customClaims || {},
        providerData: userRecord.providerData
      },
      error: null
    };
  } catch (error: any) {
    return {
      user: null,
      error: {
        code: error.code || 'auth/user-not-found',
        message: error.message || '사용자를 찾을 수 없습니다.',
        details: error
      }
    };
  }
}

// 커스텀 클레임 설정 (역할 관리용)
export async function setCustomClaims(
  uid: string, 
  claims: Record<string, any>
): Promise<{ error?: AuthError }> {
  try {
    await adminAuth.setCustomUserClaims(uid, claims);
    return {};
  } catch (error: any) {
    return {
      error: {
        code: error.code || 'auth/claims-update-failed',
        message: error.message || '사용자 권한 업데이트에 실패했습니다.',
        details: error
      }
    };
  }
}

// 사용자 비활성화/활성화
export async function updateUserStatus(
  uid: string, 
  disabled: boolean
): Promise<{ error?: AuthError }> {
  try {
    await adminAuth.updateUser(uid, { disabled });
    return {};
  } catch (error: any) {
    return {
      error: {
        code: error.code || 'auth/user-update-failed',
        message: error.message || '사용자 상태 업데이트에 실패했습니다.',
        details: error
      }
    };
  }
}

// 사용자 삭제
export async function deleteFirebaseUser(uid: string): Promise<{ error?: AuthError }> {
  try {
    await adminAuth.deleteUser(uid);
    return {};
  } catch (error: any) {
    return {
      error: {
        code: error.code || 'auth/user-delete-failed',
        message: error.message || '사용자 삭제에 실패했습니다.',
        details: error
      }
    };
  }
}

// Request에서 토큰 추출
export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

// Next.js Request에서 토큰 추출 (API Routes용)
export function extractTokenFromNextRequest(
  req: { headers: { authorization?: string; cookie?: string } }
): string | null {
  // Authorization 헤더에서 추출
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.substring(7);
  }
  
  // 쿠키에서 추출 (세션 쿠키 사용 시)
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    
    return cookies['session'] || null;
  }
  
  return null;
}

// 토큰에서 사용자 ID 추출 (빠른 검증용)
export function extractUidFromToken(token: string): string | null {
  try {
    // JWT 페이로드를 base64 디코딩 (검증 없이)
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.uid || payload.sub || null;
  } catch {
    return null;
  }
}

// 미들웨어 헬퍼: 인증된 사용자만 접근 허용
export async function requireAuth(token: string | null): Promise<{
  user: DecodedIdToken | null;
  error?: AuthError;
}> {
  if (!token) {
    return {
      user: null,
      error: {
        code: 'auth/no-token',
        message: '인증 토큰이 필요합니다.',
        details: null
      }
    };
  }

  const { payload, error } = await verifyIdToken(token);
  
  return {
    user: payload,
    error
  };
}

// 미들웨어 헬퍼: 특정 역할을 가진 사용자만 접근 허용
export async function requireRole(
  token: string | null, 
  requiredRoles: string[]
): Promise<{
  user: DecodedIdToken | null;
  error?: AuthError;
}> {
  const { user, error } = await requireAuth(token);
  
  if (error) return { user, error };
  if (!user) return { user: null, error: { code: 'auth/no-user', message: '사용자 정보가 없습니다.', details: null } };
  
  const userRole = user.customClaims?.role;
  
  if (!userRole || !requiredRoles.includes(userRole)) {
    return {
      user: null,
      error: {
        code: 'auth/insufficient-permissions',
        message: '접근 권한이 없습니다.',
        details: { requiredRoles, userRole }
      }
    };
  }
  
  return { user, error: undefined };
}

// 관리자 권한 확인
export async function requireAdmin(token: string | null) {
  return requireRole(token, ['admin']);
} 