// 사용자 역할
export const USER_ROLES = {
  CHEF: 'chef',
  HELPER: 'helper',
  MANAGER: 'manager',
  OWNER: 'owner',
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// 커뮤니티 카테고리
export const COMMUNITY_CATEGORIES = {
  QUESTION: 'question',
  REVIEW: 'review',
  FREE: 'free',
  JOB: 'job',
  RECIPE: 'recipe',
  TREND: 'trend',
} as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[keyof typeof COMMUNITY_CATEGORIES];

// 채용 공고 타입
export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  EXTRA: 'extra',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

// 경력 수준
export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  JUNIOR: 'junior',
  SENIOR: 'senior',
  EXPERT: 'expert',
} as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];

// 업체 유형
export const BUSINESS_TYPES = {
  RESTAURANT: 'restaurant',
  CAFE: 'cafe',
  BAKERY: 'bakery',
  BAR: 'bar',
  HOTEL: 'hotel',
  CATERING: 'catering',
  FOOD_TRUCK: 'food_truck',
  OTHERS: 'others',
} as const;

export type BusinessType = (typeof BUSINESS_TYPES)[keyof typeof BUSINESS_TYPES];

// 한국어 레이블 매핑
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.CHEF]: '셰프',
  [USER_ROLES.HELPER]: '주방보조',
  [USER_ROLES.MANAGER]: '매니저',
  [USER_ROLES.OWNER]: '사업주',
  [USER_ROLES.STUDENT]: '학생/지망생',
  [USER_ROLES.ADMIN]: '관리자',
};

export const COMMUNITY_CATEGORY_LABELS: Record<CommunityCategory, string> = {
  [COMMUNITY_CATEGORIES.QUESTION]: '질문',
  [COMMUNITY_CATEGORIES.REVIEW]: '후기',
  [COMMUNITY_CATEGORIES.FREE]: '자유',
  [COMMUNITY_CATEGORIES.JOB]: '구인',
  [COMMUNITY_CATEGORIES.RECIPE]: '레시피',
  [COMMUNITY_CATEGORIES.TREND]: '트렌드',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JOB_TYPES.FULL_TIME]: '정규직',
  [JOB_TYPES.PART_TIME]: '파트타임',
  [JOB_TYPES.EXTRA]: '엑스트라',
  [JOB_TYPES.INTERNSHIP]: '인턴',
  [JOB_TYPES.CONTRACT]: '계약직',
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  [EXPERIENCE_LEVELS.ENTRY]: '신입',
  [EXPERIENCE_LEVELS.JUNIOR]: '초급 (1-3년)',
  [EXPERIENCE_LEVELS.SENIOR]: '중급 (3-7년)',
  [EXPERIENCE_LEVELS.EXPERT]: '고급 (7년+)',
};

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  [BUSINESS_TYPES.RESTAURANT]: '일반음식점',
  [BUSINESS_TYPES.CAFE]: '카페',
  [BUSINESS_TYPES.BAKERY]: '베이커리',
  [BUSINESS_TYPES.BAR]: '바',
  [BUSINESS_TYPES.HOTEL]: '호텔',
  [BUSINESS_TYPES.CATERING]: '케이터링',
  [BUSINESS_TYPES.FOOD_TRUCK]: '푸드트럭',
  [BUSINESS_TYPES.OTHERS]: '기타',
};

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    VERIFY_PHONE: '/api/auth/verify-phone',
  },
  COMMUNITY: {
    POSTS: '/api/community/posts',
    COMMENTS: '/api/community/comments',
    LIKES: '/api/community/likes',
    BOOKMARKS: '/api/community/bookmarks',
  },
  JOBS: {
    LISTINGS: '/api/jobs/listings',
    APPLICATIONS: '/api/jobs/applications',
    SAVED: '/api/jobs/saved',
  },
  CURATIONS: {
    FEED: '/api/curations/feed',
    DETAIL: '/api/curations/detail',
    BOOKMARKS: '/api/curations/bookmarks',
  },
  USER: {
    PROFILE: '/api/user/profile',
    SETTINGS: '/api/user/settings',
  },
} as const;

// 페이지네이션 기본값
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// 파일 업로드 제한
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const; 