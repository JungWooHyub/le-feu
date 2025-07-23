/**
 * 전화번호를 마스킹 처리 (예: "010-1234-5678" -> "010-****-5678")
 * @param phoneNumber - 마스킹할 전화번호
 * @returns 마스킹된 전화번호
 */
export function maskPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-****-${cleaned.slice(7)}`;
  }
  
  return phoneNumber.replace(/\d/g, '*');
}

/**
 * 이메일을 마스킹 처리 (예: "user@example.com" -> "u***@example.com")
 * @param email - 마스킹할 이메일
 * @returns 마스킹된 이메일
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  
  if (username.length <= 1) {
    return email;
  }
  
  const maskedUsername = username[0] + '*'.repeat(username.length - 1);
  return `${maskedUsername}@${domain}`;
}

/**
 * 이름을 마스킹 처리 (예: "홍길동" -> "홍*동")
 * @param name - 마스킹할 이름
 * @returns 마스킹된 이름
 */
export function maskName(name: string): string {
  if (name.length <= 1) {
    return name;
  }
  
  if (name.length === 2) {
    return name[0] + '*';
  }
  
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

/**
 * 숫자를 한국어 형식으로 포맷팅 (예: 1000 -> "1,000")
 * @param number - 포맷팅할 숫자
 * @returns 포맷팅된 숫자 문자열
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat('ko-KR').format(number);
}

/**
 * 금액을 한국어 형식으로 포맷팅 (예: 1000000 -> "100만원")
 * @param amount - 포맷팅할 금액
 * @returns 포맷팅된 금액 문자열
 */
export function formatCurrency(amount: number): string {
  if (amount >= 100000000) {
    return `${Math.floor(amount / 100000000)}억${amount % 100000000 >= 10000 ? Math.floor((amount % 100000000) / 10000) + '만' : ''}원`;
  }
  
  if (amount >= 10000) {
    return `${Math.floor(amount / 10000)}만${amount % 10000 > 0 ? formatNumber(amount % 10000) : ''}원`;
  }
  
  return `${formatNumber(amount)}원`;
}

/**
 * 텍스트를 지정된 길이로 잘라내고 말줄임표 추가
 * @param text - 자를 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
} 