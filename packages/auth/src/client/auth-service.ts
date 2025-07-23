import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  ApplicationVerifier,
  RecaptchaVerifier,
  ConfirmationResult,
  UserCredential
} from 'firebase/auth';

import { auth } from './config';
import type { 
  AuthUser, 
  AuthResult, 
  SignInOptions, 
  SignUpOptions, 
  AuthError 
} from '../types';

// Provider 인스턴스들
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Firebase User를 AuthUser로 변환
export function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    providerData: user.providerData.map(provider => ({
      uid: provider.uid,
      email: provider.email,
      displayName: provider.displayName,
      photoURL: provider.photoURL,
      phoneNumber: provider.phoneNumber,
      providerId: provider.providerId
    })),
    metadata: {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    }
  };
}

// 에러 처리 헬퍼
function handleAuthError(error: any): AuthError {
  const errorMap: Record<string, string> = {
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 잘못되었습니다.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
    'auth/invalid-email': '유효하지 않은 이메일 형식입니다.',
    'auth/too-many-requests': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
    'auth/popup-closed-by-user': '로그인이 취소되었습니다.',
    'auth/cancelled-popup-request': '로그인이 취소되었습니다.'
  };

  return {
    code: error.code || 'unknown',
    message: errorMap[error.code] || error.message || '로그인 중 오류가 발생했습니다.',
    details: error
  };
}

// 이메일/비밀번호 로그인
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    return {
      user: mapFirebaseUser(userCredential.user),
      token,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      error: handleAuthError(error).message
    };
  }
}

// 이메일/비밀번호 회원가입
export async function signUpWithEmail(options: SignUpOptions): Promise<AuthResult> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      options.email, 
      options.password
    );

    // 프로필 업데이트
    if (options.displayName) {
      await updateProfile(userCredential.user, {
        displayName: options.displayName
      });
    }

    const token = await userCredential.user.getIdToken();
    
    return {
      user: mapFirebaseUser(userCredential.user),
      token,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      error: handleAuthError(error).message
    };
  }
}

// Google 로그인
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const token = await userCredential.user.getIdToken();
    
    return {
      user: mapFirebaseUser(userCredential.user),
      token,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      error: handleAuthError(error).message
    };
  }
}

// Apple 로그인
export async function signInWithApple(): Promise<AuthResult> {
  try {
    // Apple 로그인은 iOS Safari 또는 macOS에서만 완전히 작동
    const userCredential = await signInWithPopup(auth, appleProvider);
    const token = await userCredential.user.getIdToken();
    
    return {
      user: mapFirebaseUser(userCredential.user),
      token,
    };
  } catch (error) {
    return {
      user: null,
      token: null,
      error: handleAuthError(error).message
    };
  }
}

// 전화번호 인증 (1단계: 인증번호 발송)
export async function sendPhoneVerification(
  phoneNumber: string, 
  recaptchaVerifier: ApplicationVerifier
): Promise<{ verificationId: string; error?: string }> {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { verificationId: confirmationResult.verificationId };
  } catch (error) {
    return { 
      verificationId: '', 
      error: handleAuthError(error).message 
    };
  }
}

// 전화번호 인증 (2단계: 인증번호 확인)
export async function verifyPhoneCode(
  verificationId: string,
  code: string
): Promise<AuthResult> {
  try {
    // ConfirmationResult를 전역에서 관리해야 하는 제약이 있음
    // 실제 구현에서는 상태 관리 필요
    throw new Error('전화번호 인증은 추후 구현 예정입니다.');
  } catch (error) {
    return {
      user: null,
      token: null,
      error: handleAuthError(error).message
    };
  }
}

// 로그아웃
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// 비밀번호 재설정
export async function sendPasswordReset(email: string): Promise<{ error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error) {
    return { error: handleAuthError(error).message };
  }
}

// 현재 사용자 토큰 가져오기
export async function getCurrentUserToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    return await user.getIdToken();
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
}

// 현재 사용자 정보 가져오기
export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  return user ? mapFirebaseUser(user) : null;
}

// 프로필 업데이트
export async function updateUserProfile(data: { 
  displayName?: string; 
  photoURL?: string; 
}): Promise<{ error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('로그인이 필요합니다.');
    
    await updateProfile(user, data);
    return {};
  } catch (error) {
    return { error: handleAuthError(error).message };
  }
} 