'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider, 
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirebaseAuth } from '../../../lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!isFirebaseConfigured || !auth) {
      setError('Firebase가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 사용자 토큰 저장
      const token = await user.getIdToken();
      localStorage.setItem('auth_token', token);
      
      setMessage('로그인 성공!');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Firebase 에러 메시지 한국어 변환
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = '존재하지 않는 계정입니다.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = '비밀번호가 올바르지 않습니다.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '올바르지 않은 이메일 형식입니다.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    if (!isFirebaseConfigured || !auth) {
      setError('Firebase가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      setLoading(false);
      return;
    }
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 프로필 확인 - 처음 로그인이면 회원가입으로 리다이렉트
      const profileResponse = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      
      if (!profileResponse.ok) {
        // 프로필이 없으면 회원가입으로 리다이렉트 (역할 선택)
        router.push('/auth/register');
        return;
      }
      
      // 사용자 토큰 저장
      const token = await user.getIdToken();
      localStorage.setItem('auth_token', token);
      
      setMessage('Google 로그인 성공!');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Google 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError('');
    
    if (!isFirebaseConfigured || !auth) {
      setError('Firebase가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      setLoading(false);
      return;
    }
    
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // 프로필 확인
      const profileResponse = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });
      
      if (!profileResponse.ok) {
        // 프로필이 없으면 회원가입으로 리다이렉트
        router.push('/auth/register');
        return;
      }
      
      // 사용자 토큰 저장
      const token = await user.getIdToken();
      localStorage.setItem('auth_token', token);
      
      setMessage('Apple 로그인 성공!');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      console.error('Apple login error:', err);
      setError('Apple 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('비밀번호 재설정을 위해 이메일을 입력해주세요.');
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      setError('Firebase가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('비밀번호 재설정 이메일이 발송되었습니다.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      
      let errorMessage = '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = '존재하지 않는 이메일 주소입니다.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '올바르지 않은 이메일 형식입니다.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="h-10 w-10 text-primary-500" />
            <span className="text-3xl font-bold text-gray-900">le feu</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            계정에 로그인하여 le feu를 시작하세요
          </p>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="sr-only">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 비밀번호 찾기 */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-500"
              onClick={handlePasswordReset}
              disabled={loading}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          {/* 구분선 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">또는</span>
              </div>
            </div>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple로 로그인
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <a href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
                회원가입
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
} 