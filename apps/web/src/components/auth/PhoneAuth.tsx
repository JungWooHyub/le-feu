'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, ArrowRight, RotateCcw } from 'lucide-react';

// Firebase 초기화 함수
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

interface PhoneAuthProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  mode: 'login' | 'register';
}

export const PhoneAuth = ({ onSuccess, onError, mode }: PhoneAuthProps) => {
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const confirmationResultRef = useRef<any>(null);

  // 재전송 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // reCAPTCHA 초기화
  useEffect(() => {
    const initializeRecaptcha = async () => {
      try {
        const auth = await initializeFirebaseAuth();
        if (!auth) return;

        const { RecaptchaVerifier } = await import('firebase/auth');
        
        if (recaptchaRef.current) {
          // 기존 reCAPTCHA 제거
          recaptchaRef.current.innerHTML = '';
          
          new RecaptchaVerifier(auth, recaptchaRef.current, {
            'size': 'normal',
            'callback': () => {
              console.log('reCAPTCHA 완료');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA 만료됨');
            }
          });
        }
      } catch (error) {
        console.error('reCAPTCHA 초기화 실패:', error);
      }
    };

    if (step === 'phone') {
      initializeRecaptcha();
    }
  }, [step]);

  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const digits = value.replace(/\D/g, '');
    
    // 한국 번호 형식으로 변환 (010-1234-5678)
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // 한국 휴대폰 번호 형식 확인 (010으로 시작하는 11자리)
    const digits = phone.replace(/\D/g, '');
    return /^010\d{8}$/.test(digits);
  };

  const sendVerificationCode = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      onError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const auth = await initializeFirebaseAuth();
      if (!auth) {
        onError('Firebase가 초기화되지 않았습니다.');
        return;
      }

      const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth');
      
      // 국제 형식으로 변환 (+82 10-xxxx-xxxx)
      const formattedNumber = `+82${phoneNumber.replace(/\D/g, '').slice(1)}`;
      
      // reCAPTCHA 검증자 가져오기
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
        'size': 'normal'
      });

      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
      confirmationResultRef.current = confirmationResult;
      
      setStep('verification');
      setResendDisabled(true);
      setResendTimer(60); // 60초 재전송 제한
      
    } catch (error: any) {
      console.error('인증번호 전송 실패:', error);
      
      let errorMessage = '인증번호 전송에 실패했습니다.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = '올바르지 않은 전화번호입니다.';
      }
      
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      onError('6자리 인증번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      if (!confirmationResultRef.current) {
        onError('인증 정보가 없습니다. 다시 시도해주세요.');
        return;
      }

      const result = await confirmationResultRef.current.confirm(verificationCode);
      const user = result.user;

      if (mode === 'register') {
        // 회원가입 모드일 때는 프로필 확인 후 역할 선택으로 이동
        const profileResponse = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });

        if (!profileResponse.ok) {
          // 새 사용자이므로 역할 선택이 필요
          onSuccess({ user, needsRoleSelection: true });
          return;
        }
      }

      // 로그인 모드이거나 기존 사용자인 경우
      onSuccess({ user, needsRoleSelection: false });
      
    } catch (error: any) {
      console.error('인증번호 확인 실패:', error);
      
      let errorMessage = '인증번호가 올바르지 않습니다.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = '인증번호가 올바르지 않습니다.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = '인증번호가 만료되었습니다. 다시 요청해주세요.';
      }
      
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setStep('phone');
    setVerificationCode('');
    confirmationResultRef.current = null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 13) { // 010-1234-5678 최대 길이
      setPhoneNumber(formatted);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  if (step === 'phone') {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="sr-only">
            전화번호
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            인증번호를 받을 휴대폰 번호를 입력해주세요.
          </p>
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <div ref={recaptchaRef}></div>
        </div>

        <button
          type="button"
          onClick={sendVerificationCode}
          disabled={loading || !validatePhoneNumber(phoneNumber)}
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '전송 중...' : '인증번호 전송'}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="verification-code" className="sr-only">
          인증번호
        </label>
        <input
          id="verification-code"
          name="verification-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center text-lg tracking-widest"
          placeholder="123456"
          value={verificationCode}
          onChange={handleCodeChange}
          maxLength={6}
        />
        <p className="mt-1 text-xs text-gray-500 text-center">
          {phoneNumber}로 전송된 6자리 인증번호를 입력해주세요.
        </p>
      </div>

      <button
        type="button"
        onClick={verifyCode}
        disabled={loading || verificationCode.length !== 6}
        className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '확인 중...' : '인증번호 확인'}
      </button>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          {resendDisabled ? `다시 전송 (${resendTimer}초)` : '다시 전송'}
        </button>
        
        <button
          type="button"
          onClick={() => setStep('phone')}
          className="text-sm text-gray-600 hover:text-gray-500"
        >
          번호 변경
        </button>
      </div>
    </div>
  );
}; 