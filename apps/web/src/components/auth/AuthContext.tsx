'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';

// Firebase 초기화 함수 (기존과 동일)
async function initializeFirebaseAuth() {
  if (typeof window === 'undefined') return null;
  
  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''
    };
    
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      console.warn('Firebase 환경변수가 설정되지 않았습니다.');
      return null;
    }
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    return getAuth(app);
  } catch (error) {
    console.error('Firebase 초기화 실패:', error);
    return null;
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuthListener = async () => {
      const auth = await initializeFirebaseAuth();
      if (!auth) {
        setLoading(false);
        return;
      }

      const { onAuthStateChanged } = await import('firebase/auth');
      
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // 토큰 갱신 및 유효성 검증
            const token = await firebaseUser.getIdToken(true);
            
            // 프로필 정보 확인
            const profileResponse = await fetch('/api/auth/profile', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (profileResponse.ok) {
              setUser(firebaseUser);
            } else {
              // 프로필이 없는 경우 (소셜 로그인 등) 회원가입으로 리다이렉트는 페이지에서 처리
              setUser(firebaseUser);
            }
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('인증 상태 확인 중 오류:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      const auth = await initializeFirebaseAuth();
      if (!auth) return;

      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
      
      // 로컬 상태 정리
      setUser(null);
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      throw error;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      if (!user) return null;
      
      const token = await user.getIdToken(true);
      return token;
    } catch (error) {
      console.error('토큰 갱신 중 오류:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 