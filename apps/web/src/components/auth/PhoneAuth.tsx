'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Phone, ArrowLeft } from 'lucide-react';
import { getFirebaseAuth } from '../../../lib/firebase';

interface PhoneAuthProps {
  mode: 'login' | 'register';
  onSuccess: (result: { user: User; needsRoleSelection: boolean }) => void;
  onError: (error: string) => void;
}

// 전화번호 포맷팅 함수
const formatPhoneNumber = (value: string) => {
  const phoneNumber = value.replace(/[^\d]/g, '');
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  } else {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
  }
};

export const PhoneAuth = ({ mode, onSuccess, onError }: PhoneAuthProps) => {
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
        setResendTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const sendVerificationCode = async () => {
    if (phoneNumber.replace(/\D/g, '').length !== 11) {
      onError('올바른 전화번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const { auth, isConfigured } = getFirebaseAuth();
      if (!auth || !isConfigured) {
        onError('Firebase가 초기화되지 않았습니다.');
        return;
      }

      const { signInWithPhoneNumber, RecaptchaVerifier } = await import('firebase/auth');
      
      // 국제 형식으로 변환 (+82 10-xxxx-xxxx)
      const formattedNumber = `+82${phoneNumber.replace(/\D/g, '').slice(1)}`;
      
      // reCAPTCHA 검증자 생성
      const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current!, {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA 성공
        },
        'expired-callback': () => {
          onError('reCAPTCHA가 만료되었습니다. 다시 시도해주세요.');
        }
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
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = '일일 SMS 할당량을 초과했습니다. 내일 다시 시도해주세요.';
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
      } else if (error.code === 'auth/session-expired') {
        errorMessage = '세션이 만료되었습니다. 처음부터 다시 시도해주세요.';
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

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 6) {
      setVerificationCode(value);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'phone' ? (
        <>
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                SMS 인증번호가 발송됩니다.
              </p>
            </div>

            {/* reCAPTCHA 컨테이너 */}
            <div ref={recaptchaRef} className="flex justify-center"></div>
          </div>

          <button
            type="button"
            onClick={sendVerificationCode}
            disabled={loading || phoneNumber.replace(/\D/g, '').length !== 11}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                인증번호 발송 중...
              </div>
            ) : (
              '인증번호 발송'
            )}
          </button>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                인증번호 확인
              </h3>
              <p className="text-sm text-gray-600">
                {phoneNumber}로 발송된 6자리 인증번호를 입력해주세요.
              </p>
            </div>

            <div>
              <label htmlFor="verification" className="block text-sm font-medium text-gray-700 mb-2">
                인증번호
              </label>
              <input
                id="verification"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-center text-lg tracking-widest"
                placeholder="123456"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                disabled={loading}
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={verifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  인증 중...
                </div>
              ) : (
                '인증하기'
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendDisabled}
                className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendDisabled ? `다시 요청 (${resendTimer}초)` : '다시 요청'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-sm text-gray-600 hover:text-gray-500 flex items-center"
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                번호 변경
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 