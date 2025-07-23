/**
 * 이메일 주소 유효성 검사
 * @param email - 검증할 이메일 주소
 * @returns 유효성 검사 결과
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * 한국 전화번호 유효성 검사
 * @param phoneNumber - 검증할 전화번호
 * @returns 유효성 검사 결과
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // 01X-XXXX-XXXX 형식 (11자리)
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    return true;
  }
  
  // 02-XXXX-XXXX 형식 (10자리, 서울 지역번호)
  if (cleaned.length === 10 && cleaned.startsWith('02')) {
    return true;
  }
  
  // 0XX-XXX-XXXX 또는 0XX-XXXX-XXXX 형식 (10-11자리, 지역번호)
  if ((cleaned.length === 10 || cleaned.length === 11) && cleaned.startsWith('0')) {
    return true;
  }
  
  return false;
}

/**
 * 비밀번호 강도 검사
 * @param password - 검증할 비밀번호
 * @returns 비밀번호 강도 ('weak' | 'medium' | 'strong')
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) {
    return 'weak';
  }
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const criteriaMet = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (criteriaMet >= 3 && password.length >= 12) {
    return 'strong';
  }
  
  if (criteriaMet >= 2 && password.length >= 8) {
    return 'medium';
  }
  
  return 'weak';
}

/**
 * URL 유효성 검사
 * @param url - 검증할 URL
 * @returns 유효성 검사 결과
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 한국어 이름 유효성 검사 (한글 2-4글자)
 * @param name - 검증할 이름
 * @returns 유효성 검사 결과
 */
export function isValidKoreanName(name: string): boolean {
  const koreanNameRegex = /^[가-힣]{2,4}$/;
  return koreanNameRegex.test(name);
}

/**
 * 숫자만 포함되어 있는지 검사
 * @param value - 검증할 값
 * @returns 검사 결과
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
} 