'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Flame, Mail, Lock, Eye, EyeOff, User, Building, Crown, 
  Smartphone, ChefHat, Users, GraduationCap, Phone 
} from 'lucide-react';
import { PhoneAuth } from '../../../components/auth/PhoneAuth';
import { ProfileForm } from '../../../components/auth/ProfileForm';
import { getFirebaseAuth } from '../../../../lib/firebase';

type UserRole = 'chef' | 'helper' | 'manager' | 'owner' | 'student';

// 역할 옵션 정의
const roleOptions: Array<{
  id: UserRole;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
}> = [
  {
    id: 'chef',
    name: '셰프',
    description: '요리 전문가로 활동하고 포트폴리오를 공유하세요',
    icon: ChefHat,
    color: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
    benefits: ['레시피 공유', '셰프 스토리 발견', '전문가 네트워킹']
  },
  {
    id: 'helper',
    name: '헬퍼/어시스턴트',
    description: '주방 보조 및 서빙 업무를 담당하시는 분',
    icon: Users,
    color: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
    benefits: ['엑스트라 공고 우선 추천', '실무 팁 공유', '빠른 매칭']
  },
  {
    id: 'manager',
    name: '매니저',
    description: '매장 운영 및 관리를 담당하시는 분',
    icon: Building,
    color: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
    benefits: ['매장 운영 노하우', '관리 도구 추천', '네트워킹']
  },
  {
    id: 'owner',
    name: '사업주/점주',
    description: '레스토랑, 카페 등을 운영하시는 분',
    icon: Crown,
    color: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
    benefits: ['인재 채용', '경영 인사이트', '업계 트렌드']
  },
  {
    id: 'student',
    name: '학생/지망생',
    description: '요리를 배우고 있거나 업계 진입을 준비하는 분',
    icon: GraduationCap,
    color: 'border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100',
    benefits: ['학습 자료', '멘토링', '취업 정보']
  }
];

export default function RegisterPage() {
  const [step, setStep] = useState<'info' | 'role' | 'profile'>('info');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: '' as UserRole | ''
  });
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  // 진행률 계산
  const getProgress = () => {
    const steps = ['info', 'role', 'profile'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.displayName) {
      setError('모든 필드를 입력해주세요.');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
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

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
    setStep('profile');
  };

  const handlePhoneAuthSuccess = ({ user, needsRoleSelection }: any) => {
    setFirebaseUser(user);
    if (needsRoleSelection) {
      setStep('role');
    } else {
      // 기존 사용자라면 로그인 처리
      router.push('/');
    }
  };

  const handlePhoneAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleProfileSubmit = async (profileData: any) => {
    setLoading(true);
    setError('');
    
    try {
      let user = firebaseUser;
      
      // 이메일 회원가입인 경우 Firebase 사용자 생성
      if (!user && authMethod === 'email') {
        const { auth, isConfigured } = getFirebaseAuth();
        if (!auth || !isConfigured) {
          setError('Firebase가 설정되지 않았습니다. 환경변수를 확인해주세요.');
          return;
        }

        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        user = userCredential.user;
      }

      if (!user) {
        setError('사용자 인증 정보가 없습니다.');
        return;
      }

      // Supabase에 전체 프로필 정보 저장
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          id: user.uid,
          email: formData.email || user.email,
          name: formData.displayName,
          nickname: profileData.nickname,
          bio: profileData.bio,
          role: formData.role,
          business_type: profileData.businessType,
          specialties: profileData.specialties,
          location: profileData.location,
          experience_years: profileData.experienceYears,
          is_verified: false,
          metadata: {
            signUpMethod: authMethod,
            createdAt: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '프로필 생성에 실패했습니다.');
      }

      setMessage('회원가입이 완료되었습니다!');
      setTimeout(() => router.push('/'), 1500);
      
    } catch (error: any) {
      console.error('Profile creation error:', error);
      setError(error.message || '프로필 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSkip = () => {
    // 기본 프로필로 바로 가입 완료
    handleProfileSubmit({
      nickname: formData.displayName,
      bio: '',
      specialties: [],
      location: { city: '', district: '' },
      experienceYears: 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 에러 메시지 제거
    if (error) setError('');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'info': return '회원가입';
      case 'role': return '역할 선택';
      case 'profile': return '프로필 설정';
      default: return '회원가입';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'info': return 'le feu에서 새로운 여정을 시작하세요';
      case 'role': return '어떤 역할로 활동하시겠나요?';
      case 'profile': return '마지막 단계입니다. 프로필을 완성해주세요.';
      default: return '';
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
          <h2 className="text-2xl font-bold text-gray-900">{getStepTitle()}</h2>
          <p className="mt-2 text-sm text-gray-600">{getStepDescription()}</p>
        </div>

        {/* 진행률 표시기 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgress()}%` }}
          ></div>
        </div>

        {/* 알림 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* 단계별 콘텐츠 */}
        {step === 'info' ? (
          <>
            {/* 인증 방법 선택 */}
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  authMethod === 'email'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="h-4 w-4 mr-2" />
                이메일
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  authMethod === 'phone'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Phone className="h-4 w-4 mr-2" />
                전화번호
              </button>
            </div>

            {/* 인증 폼 */}
            {authMethod === 'email' ? (
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                {/* 이메일 */}
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
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* 이름 */}
                <div>
                  <label htmlFor="displayName" className="sr-only">이름</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      autoComplete="name"
                      required
                      className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="이름"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div>
                  <label htmlFor="password" className="sr-only">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="비밀번호 (6자 이상)"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
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
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="비밀번호 확인"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
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
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      처리 중...
                    </div>
                  ) : (
                    '다음 단계'
                  )}
                </button>
              </form>
            ) : (
              <PhoneAuth 
                mode="register"
                onSuccess={handlePhoneAuthSuccess}
                onError={handlePhoneAuthError}
              />
            )}
          </>
        ) : step === 'role' ? (
          <div className="space-y-6">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <button
                onClick={() => setStep('info')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center transition-colors"
                disabled={loading}
              >
                ← 이전 단계로
              </button>
            </div>

            {/* 역할 선택 카드들 */}
            <div className="space-y-3">
              {roleOptions.map((role) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    disabled={loading}
                    className={`w-full p-6 border-2 rounded-xl text-left transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${role.color}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{role.name}</h3>
                        <p className="text-sm opacity-90 mb-3">{role.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {role.benefits.map((benefit, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-60"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
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
        ) : (
          /* 프로필 입력 단계 */
          <div className="space-y-4">
            <div className="mb-6">
              <button
                onClick={() => setStep('role')}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center transition-colors"
                disabled={loading}
              >
                ← 이전 단계로
              </button>
            </div>

            <ProfileForm
              role={formData.role as any}
              onSubmit={handleProfileSubmit}
              onSkip={handleProfileSkip}
              loading={loading}
            />
          </div>
        )}

        {/* 로그인 링크 */}
        {step !== 'profile' && (
          <div className="text-center">
            <span className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <a href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                로그인
              </a>
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 