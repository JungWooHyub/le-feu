/**
 * le feu RBAC (Role-Based Access Control) 타입 정의
 * 요식업 업계 특화 역할 및 권한 시스템
 */

// 기본 사용자 역할 정의
export enum UserRole {
  // 일반 사용자 (셰프, 주방보조, 매니저 등)
  USER = 'user',
  
  // 사업주 (음식점 운영자, 인사 담당자)
  EMPLOYER = 'employer',
  
  // 큐레이터 (콘텐츠 작성자, 업계 전문가)
  CURATOR = 'curator',
  
  // 관리자 (플랫폼 운영진)
  ADMIN = 'admin',
  
  // 슈퍼 관리자 (시스템 전체 권한)
  SUPER_ADMIN = 'super_admin'
}

// 세부 권한 정의
export enum Permission {
  // 큐레이션 관련 권한
  CURATIONS_READ = 'curations:read',
  CURATIONS_CREATE = 'curations:create', 
  CURATIONS_UPDATE = 'curations:update',
  CURATIONS_DELETE = 'curations:delete',
  CURATIONS_FEATURE = 'curations:feature', // 추천 콘텐츠 지정
  
  // 커뮤니티 관련 권한
  COMMUNITY_READ = 'community:read',
  COMMUNITY_CREATE = 'community:create',
  COMMUNITY_UPDATE_OWN = 'community:update_own', // 본인 게시물만
  COMMUNITY_UPDATE_ANY = 'community:update_any', // 모든 게시물
  COMMUNITY_DELETE_OWN = 'community:delete_own',
  COMMUNITY_DELETE_ANY = 'community:delete_any',
  COMMUNITY_MODERATE = 'community:moderate', // 신고 처리, 숨김
  COMMUNITY_PIN = 'community:pin', // 고정 게시물 설정
  
  // 채용공고 관련 권한
  JOBS_READ = 'jobs:read',
  JOBS_CREATE = 'jobs:create',
  JOBS_UPDATE_OWN = 'jobs:update_own', // 본인 공고만
  JOBS_UPDATE_ANY = 'jobs:update_any', // 모든 공고
  JOBS_DELETE_OWN = 'jobs:delete_own',
  JOBS_DELETE_ANY = 'jobs:delete_any',
  JOBS_APPROVE = 'jobs:approve', // 공고 승인
  JOBS_FEATURE = 'jobs:feature', // 긴급/추천 공고 설정
  
  // 사용자 관리 권한
  USERS_READ = 'users:read',
  USERS_UPDATE_OWN = 'users:update_own', // 본인 프로필만
  USERS_UPDATE_ANY = 'users:update_any', // 모든 사용자
  USERS_DELETE = 'users:delete',
  USERS_BAN = 'users:ban', // 사용자 차단
  USERS_ASSIGN_ROLES = 'users:assign_roles', // 역할 할당
  
  // 분석 및 리포트 권한
  ANALYTICS_READ = 'analytics:read',
  ANALYTICS_EXPORT = 'analytics:export',
  
  // 시스템 관리 권한
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_LOGS = 'system:logs'
}

// 기본 권한 정의 (상속 없이)
const USER_PERMISSIONS: Permission[] = [
  // 기본 읽기 권한
  Permission.CURATIONS_READ,
  Permission.COMMUNITY_READ,
  Permission.JOBS_READ,
  
  // 커뮤니티 참여 권한
  Permission.COMMUNITY_CREATE,
  Permission.COMMUNITY_UPDATE_OWN,
  Permission.COMMUNITY_DELETE_OWN,
  
  // 본인 정보 관리
  Permission.USERS_UPDATE_OWN
];

const EMPLOYER_ADDITIONAL_PERMISSIONS: Permission[] = [
  // 채용공고 관리 권한
  Permission.JOBS_CREATE,
  Permission.JOBS_UPDATE_OWN,
  Permission.JOBS_DELETE_OWN,
  
  // 지원자 정보 조회
  Permission.USERS_READ
];

const CURATOR_ADDITIONAL_PERMISSIONS: Permission[] = [
  // 큐레이션 콘텐츠 권한
  Permission.CURATIONS_CREATE,
  Permission.CURATIONS_UPDATE,
  Permission.CURATIONS_DELETE,
  
  // 커뮤니티 모더레이션
  Permission.COMMUNITY_MODERATE,
  Permission.COMMUNITY_PIN,
  
  // 기본 분석 권한
  Permission.ANALYTICS_READ
];

const ADMIN_ADDITIONAL_PERMISSIONS: Permission[] = [
  // 큐레이션 추천 설정
  Permission.CURATIONS_FEATURE,
  
  // 모든 커뮤니티 관리
  Permission.COMMUNITY_UPDATE_ANY,
  Permission.COMMUNITY_DELETE_ANY,
  
  // 모든 채용공고 관리
  Permission.JOBS_UPDATE_ANY,
  Permission.JOBS_DELETE_ANY,
  Permission.JOBS_APPROVE,
  Permission.JOBS_FEATURE,
  
  // 사용자 관리
  Permission.USERS_UPDATE_ANY,
  Permission.USERS_BAN,
  
  // 분석 전체 권한
  Permission.ANALYTICS_EXPORT,
  
  // 기본 시스템 관리
  Permission.SYSTEM_LOGS
];

// 역할별 권한 매핑 (상속 관계 적용)
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: USER_PERMISSIONS,
  
  [UserRole.EMPLOYER]: [
    ...USER_PERMISSIONS,
    ...EMPLOYER_ADDITIONAL_PERMISSIONS
  ],
  
  [UserRole.CURATOR]: [
    ...USER_PERMISSIONS,
    ...CURATOR_ADDITIONAL_PERMISSIONS
  ],
  
  [UserRole.ADMIN]: [
    ...USER_PERMISSIONS,
    ...CURATOR_ADDITIONAL_PERMISSIONS,
    ...ADMIN_ADDITIONAL_PERMISSIONS
  ],
  
  [UserRole.SUPER_ADMIN]: [
    // 모든 권한
    ...Object.values(Permission)
  ]
};

// 권한 체크 헬퍼 타입
export interface RBACContext {
  userRole: UserRole;
  userId: string;
  resourceOwnerId?: string; // 리소스 소유자 ID (본인 확인용)
}

// 권한 체크 결과
export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

// 특별 조건부 권한 (본인 소유 리소스 등)
export interface ConditionalPermission {
  permission: Permission;
  condition: (context: RBACContext) => boolean;
}

// 역할 계층 구조 (상위 역할이 하위 역할 권한 포함)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.USER]: 1,
  [UserRole.EMPLOYER]: 2,
  [UserRole.CURATOR]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5
};

// 업계 특화 추가 메타데이터
export interface UserMetadata {
  // 경력 수준
  experienceLevel?: 'beginner' | 'intermediate' | 'experienced' | 'expert';
  
  // 전문 분야
  specialties?: string[]; // ['korean', 'italian', 'bakery', 'dessert']
  
  // 근무 지역
  workLocation?: string;
  
  // 회사 정보 (사업주용)
  companyInfo?: {
    name: string;
    businessNumber?: string;
    address: string;
    employeeCount?: number;
  };
  
  // 큐레이터 검증 상태
  isVerified?: boolean;
  verificationDate?: string;
} 