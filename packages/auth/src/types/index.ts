// Firebase Auth 관련 타입 정의

export interface AuthUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerData: AuthProviderData[];
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface AuthProviderData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string;
}

export interface AuthConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export interface AuthResult {
  user: AuthUser | null;
  token: string | null;
  error?: string;
}

export interface SignInOptions {
  email?: string;
  password?: string;
  phoneNumber?: string;
  verificationCode?: string;
  provider?: 'google' | 'apple';
}

export interface SignUpOptions {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

export interface AuthContext {
  user: AuthUser | null;
  loading: boolean;
  signIn: (options: SignInOptions) => Promise<AuthResult>;
  signUp: (options: SignUpOptions) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<string>; // returns verification ID
  verifyPhoneCode: (verificationId: string, code: string) => Promise<AuthResult>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

// Supabase User 연동 타입
export interface SupabaseUserProfile {
  id: string; // Firebase UID와 매칭
  email: string;
  name?: string;
  nickname?: string;
  role: 'chef' | 'helper' | 'manager' | 'owner' | 'student' | 'admin';
  avatar_url?: string;
  bio?: string;
  business_type?: string;
  specialties?: string[];
  location?: {
    city: string;
    district?: string;
  };
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// JWT 토큰 페이로드
export interface AuthTokenPayload {
  uid: string;
  email: string;
  email_verified: boolean;
  auth_time: number;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}

// 인증 상태
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

// 에러 타입
export interface AuthError {
  code: string;
  message: string;
  details?: any;
} 