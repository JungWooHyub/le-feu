'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Mail, Lock, Eye, EyeOff, User, Building, Crown } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

// Firebase 설정 검증
const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Firebase 설정 (개발용 기본값 포함)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo'
};

// Firebase 앱 초기화 (중복 방지)
let auth: any = null;
if (isFirebaseConfigured) {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
}

type UserRole = 'user' | 'employer' | 'curator';

interface RoleOption {
  id: UserRole;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'user',
    name: '일반 사용자',
    description: '셰프, 주방보조, 매니저 등',
    icon: User,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  {
    id: 'employer',
    name: '사업주',
    description: '음식점 운영자, 인사 담당자',
    icon: Building,
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  {
    id: 'curator',
    name: '큐레이터',
    description: '콘텐츠 작성자, 업계 전문가',
    icon: Crown,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  }
];

export default function RegisterPage() {
  const [step, setStep] = useState<'info' | 'role'>('info');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: '' as UserRole | ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.displayName) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    
    return true;
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('role');
      setError('');
    }
  };

  const handleRoleSelect = async (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
    await handleRegister(role);
  };

  const handleRegister = async (selectedRole: UserRole) => {
    setLoading(true);
    setError('');
    
    try {
      // Firebase Auth로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // Supabase profiles 테이블에 사용자 정보 저장
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          id: user.uid,
          email: formData.email,
          display_name: formData.displayName,
          role: selectedRole,
          is_verified: false,
          metadata: {
            signUpMethod: 'email',
            createdAt: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('프로필 생성에 실패했습니다.');
      }

      setMessage('회원가입이 완료되었습니다!');
      setTimeout(() => router.push('/'), 1500);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Google 로그인 시 바로 역할 선택으로 이동
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        displayName: user.displayName || ''
      }));
      setStep('role');
      
    } catch (error: any) {
      console.error('Google signup error:', error);
      setError('Google 회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Apple 로그인 시 바로 역할 선택으로 이동
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || ''
      }));
      setStep('role');
      
    } catch (error: any) {
      console.error('Apple signup error:', error);
      setError('Apple 회원가입 중 오류가 발생했습니다.');
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
            {step === 'info' ? '회원가입' : '역할 선택'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'info' 
              ? 'le feu에서 새로운 여정을 시작하세요' 
              : '어떤 역할로 활동하시겠나요?'}
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

        {step === 'info' ? (
          /* 기본 정보 입력 단계 */
          <div>
            {/* 소셜 로그인 버튼 */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 회원가입
              </button>

              <button
                type="button"
                onClick={handleAppleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple로 회원가입
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-primary-50 to-secondary-50 text-gray-500">또는 이메일로 가입</span>
              </div>
            </div>

            {/* 이메일 회원가입 폼 */}
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              {/* 이름 입력 */}
              <div>
                <label htmlFor="displayName" className="sr-only">이름</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="이름"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
              </div>

              {/* 이메일 입력 */}
              <div>
                <label htmlFor="email" className="sr-only">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="이메일 주소"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div>
                <label htmlFor="password" className="sr-only">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="비밀번호 (6자 이상)"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '다음 단계'}
              </button>
            </form>
          </div>
        ) : (
          /* 역할 선택 단계 */
          <div className="space-y-4">
            <div className="mb-6">
              <button
                onClick={() => setStep('info')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
              >
                ← 이전 단계로
              </button>
            </div>

            <div className="space-y-3">
              {roleOptions.map((role) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    disabled={loading}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${role.color} hover:shadow-md`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-6 w-6 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm opacity-75">{role.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                <p className="mt-2 text-sm text-gray-600">계정을 생성하는 중...</p>
              </div>
            )}
          </div>
        )}

        {/* 로그인 링크 */}
        {step === 'info' && (
          <div className="text-center">
            <span className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                로그인
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 