'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getFirebaseAuth } from '../../../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuthListener = async () => {
      const { auth, isConfigured } = getFirebaseAuth();
      if (!auth || !isConfigured) {
        console.warn('Firebase Auth가 설정되지 않았습니다.');
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
              // 토큰을 로컬 스토리지에 저장
              localStorage.setItem('auth_token', token);
            } else {
              // 프로필이 없는 경우 (소셜 로그인 등) 회원가입으로 리다이렉트는 페이지에서 처리
              setUser(firebaseUser);
            }
          } else {
            setUser(null);
            // 로그아웃 시 토큰 제거
            localStorage.removeItem('auth_token');
          }
        } catch (error) {
          console.error('인증 상태 확인 중 오류:', error);
          setUser(null);
          localStorage.removeItem('auth_token');
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
      const { auth, isConfigured } = getFirebaseAuth();
      if (!auth || !isConfigured) {
        console.warn('Firebase Auth가 설정되지 않았습니다.');
        return;
      }

      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
      
      // 로컬 상태 정리
      setUser(null);
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 