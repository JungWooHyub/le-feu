import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param date - 포맷팅할 날짜
 * @param formatString - 포맷 문자열 (기본값: 'yyyy년 MM월 dd일')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | string, formatString = 'yyyy년 MM월 dd일'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString, { locale: ko });
}

/**
 * 상대적인 시간을 한국어로 표시 (예: "3분 전", "2시간 전")
 * @param date - 기준 날짜
 * @returns 상대적인 시간 문자열
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ko });
}

/**
 * 날짜에 따른 스마트한 표시 형식
 * - 오늘: "오후 3:20"
 * - 어제: "어제"
 * - 일주일 이내: "3일 전"
 * - 그 외: "2024년 1월 15일"
 */
export function formatSmartDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return format(dateObj, 'a h:mm', { locale: ko });
  }
  
  if (isYesterday(dateObj)) {
    return '어제';
  }
  
  const daysDiff = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) {
    return formatRelativeTime(dateObj);
  }
  
  return formatDate(dateObj);
}

/**
 * ISO 문자열을 Date 객체로 변환
 * @param isoString - ISO 날짜 문자열
 * @returns Date 객체
 */
export function parseDate(isoString: string): Date {
  return parseISO(isoString);
} 