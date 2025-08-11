/**
 * Input validation and sanitization utilities
 */

// HTML 태그 제거 및 특수문자 이스케이프
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// 게시글 제목 검증
export function validateTitle(title: string): { isValid: boolean; error?: string } {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: '제목은 필수입니다.' };
  }
  
  const sanitized = sanitizeHtml(title).trim();
  
  if (sanitized.length < 2) {
    return { isValid: false, error: '제목은 최소 2자 이상이어야 합니다.' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, error: '제목은 100자를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
}

// 게시글 내용 검증
export function validateContent(content: string): { isValid: boolean; error?: string } {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: '내용은 필수입니다.' };
  }
  
  const sanitized = sanitizeHtml(content).trim();
  
  if (sanitized.length < 10) {
    return { isValid: false, error: '내용은 최소 10자 이상이어야 합니다.' };
  }
  
  if (sanitized.length > 10000) {
    return { isValid: false, error: '내용은 10,000자를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
}

// 카테고리 검증
export function validateCategory(category: string): { isValid: boolean; error?: string } {
  const validCategories = ['question', 'review', 'free', 'job_posting'];
  
  if (!category || !validCategories.includes(category)) {
    return { isValid: false, error: '유효하지 않은 카테고리입니다.' };
  }
  
  return { isValid: true };
}

// 태그 검증
export function validateTags(tags: string[]): { isValid: boolean; error?: string; sanitized: string[] } {
  if (!Array.isArray(tags)) {
    return { isValid: false, error: '태그는 배열 형태여야 합니다.', sanitized: [] };
  }
  
  if (tags.length > 10) {
    return { isValid: false, error: '태그는 최대 10개까지만 추가할 수 있습니다.', sanitized: [] };
  }
  
  const sanitized = tags
    .map(tag => sanitizeHtml(tag.toString()).trim())
    .filter(tag => tag.length > 0 && tag.length <= 20)
    .slice(0, 10); // 안전장치
  
  // 중복 제거
  const uniqueTags = Array.from(new Set(sanitized));
  
  return { isValid: true, sanitized: uniqueTags };
}

// 댓글 내용 검증
export function validateComment(content: string): { isValid: boolean; error?: string } {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: '댓글 내용을 입력해주세요.' };
  }
  
  const sanitized = sanitizeHtml(content).trim();
  
  if (sanitized.length < 1) {
    return { isValid: false, error: '댓글 내용을 입력해주세요.' };
  }
  
  if (sanitized.length > 1000) {
    return { isValid: false, error: '댓글은 1,000자를 초과할 수 없습니다.' };
  }
  
  return { isValid: true };
}

// SQL Injection 방지를 위한 기본적인 검사
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\*\/|\/\*)/,
    /(\b(OR|AND)\b.*=.*)/i,
    /(;|\||&)/
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

// 전체 요청 데이터 검증
export function validatePostData(data: any): { 
  isValid: boolean; 
  error?: string; 
  sanitized?: { title: string; content: string; category: string; tags: string[] } 
} {
  const { title, content, category, tags = [] } = data;
  
  // 각 필드별 검증
  const titleValidation = validateTitle(title);
  if (!titleValidation.isValid) {
    return { isValid: false, error: titleValidation.error };
  }
  
  const contentValidation = validateContent(content);
  if (!contentValidation.isValid) {
    return { isValid: false, error: contentValidation.error };
  }
  
  const categoryValidation = validateCategory(category);
  if (!categoryValidation.isValid) {
    return { isValid: false, error: categoryValidation.error };
  }
  
  const tagsValidation = validateTags(tags);
  if (!tagsValidation.isValid) {
    return { isValid: false, error: tagsValidation.error };
  }
  
  // SQL Injection 검사
  const allText = `${title} ${content} ${tags.join(' ')}`;
  if (containsSqlInjection(allText)) {
    return { isValid: false, error: '유효하지 않은 입력입니다.' };
  }
  
  return {
    isValid: true,
    sanitized: {
      title: sanitizeHtml(title).trim(),
      content: sanitizeHtml(content).trim(),
      category,
      tags: tagsValidation.sanitized
    }
  };
}