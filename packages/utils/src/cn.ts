import { clsx, type ClassValue } from 'clsx';

/**
 * Tailwind CSS 클래스명을 결합하는 유틸리티 함수
 * @param inputs - 결합할 클래스명들
 * @returns 결합된 클래스명 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
} 