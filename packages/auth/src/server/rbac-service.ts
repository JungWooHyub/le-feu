import { 
  UserRole, 
  Permission, 
  ROLE_PERMISSIONS, 
  ROLE_HIERARCHY,
  RBACContext,
  PermissionResult 
} from '../types/roles';

/**
 * 서버 측 RBAC 권한 체크 서비스
 * ISMS-P 보안 가이드라인 준수
 */
export class RBACService {
  /**
   * 기본 권한 체크
   * @param userRole 사용자 역할
   * @param permission 확인할 권한
   * @returns 권한 허용 여부
   */
  static hasPermission(userRole: UserRole, permission: Permission): boolean {
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];
    return userPermissions.includes(permission);
  }

  /**
   * 컨텍스트 기반 권한 체크 (소유자 확인 포함)
   * @param context RBAC 컨텍스트
   * @param permission 확인할 권한
   * @returns 상세한 권한 체크 결과
   */
  static checkPermission(context: RBACContext, permission: Permission): PermissionResult {
    const { userRole, userId, resourceOwnerId } = context;

    // 기본 권한 체크
    if (this.hasPermission(userRole, permission)) {
      return { allowed: true };
    }

    // 소유자 기반 권한 체크 (본인 리소스)
    if (resourceOwnerId && userId === resourceOwnerId) {
      const ownPermission = this.getOwnResourcePermission(permission);
      if (ownPermission && this.hasPermission(userRole, ownPermission)) {
        return { 
          allowed: true, 
          reason: 'Resource owner permission' 
        };
      }
    }

    // 역할 계층 기반 권한 체크
    if (this.checkRoleHierarchy(userRole, permission)) {
      return { 
        allowed: true, 
        reason: 'Role hierarchy permission' 
      };
    }

    return { 
      allowed: false, 
      reason: `Insufficient permissions. Required: ${permission}, User role: ${userRole}` 
    };
  }

  /**
   * 여러 권한 중 하나라도 있는지 체크 (OR 조건)
   * @param context RBAC 컨텍스트
   * @param permissions 확인할 권한 목록
   * @returns 권한 체크 결과
   */
  static checkAnyPermission(context: RBACContext, permissions: Permission[]): PermissionResult {
    for (const permission of permissions) {
      const result = this.checkPermission(context, permission);
      if (result.allowed) {
        return result;
      }
    }

    return { 
      allowed: false, 
      reason: `None of the required permissions found: ${permissions.join(', ')}` 
    };
  }

  /**
   * 모든 권한이 있는지 체크 (AND 조건)
   * @param context RBAC 컨텍스트
   * @param permissions 확인할 권한 목록
   * @returns 권한 체크 결과
   */
  static checkAllPermissions(context: RBACContext, permissions: Permission[]): PermissionResult {
    for (const permission of permissions) {
      const result = this.checkPermission(context, permission);
      if (!result.allowed) {
        return result;
      }
    }

    return { allowed: true };
  }

  /**
   * 관리자 권한 체크 (ADMIN 이상)
   * @param userRole 사용자 역할
   * @returns 관리자 권한 여부
   */
  static isAdmin(userRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[UserRole.ADMIN];
  }

  /**
   * 큐레이터 권한 체크 (CURATOR 이상)
   * @param userRole 사용자 역할
   * @returns 큐레이터 권한 여부
   */
  static isCurator(userRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[UserRole.CURATOR];
  }

  /**
   * 사업주 권한 체크
   * @param userRole 사용자 역할
   * @returns 사업주 권한 여부
   */
  static isEmployer(userRole: UserRole): boolean {
    return userRole === UserRole.EMPLOYER || this.isAdmin(userRole);
  }

  /**
   * 역할 할당 권한 체크
   * @param assignerRole 할당하는 사람의 역할
   * @param targetRole 할당할 역할
   * @returns 역할 할당 가능 여부
   */
  static canAssignRole(assignerRole: UserRole, targetRole: UserRole): boolean {
    // SUPER_ADMIN만 모든 역할 할당 가능
    if (assignerRole === UserRole.SUPER_ADMIN) {
      return true;
    }

    // ADMIN은 ADMIN 미만의 역할만 할당 가능
    if (assignerRole === UserRole.ADMIN) {
      return ROLE_HIERARCHY[targetRole] < ROLE_HIERARCHY[UserRole.ADMIN];
    }

    // 다른 역할은 역할 할당 불가
    return false;
  }

  /**
   * 리소스별 최소 필요 권한 정의
   */
  private static readonly RESOURCE_PERMISSIONS = {
    // 큐레이션 관련
    'curations:list': Permission.CURATIONS_READ,
    'curations:detail': Permission.CURATIONS_READ,
    'curations:create': Permission.CURATIONS_CREATE,
    'curations:update': Permission.CURATIONS_UPDATE,
    'curations:delete': Permission.CURATIONS_DELETE,
    'curations:feature': Permission.CURATIONS_FEATURE,

    // 커뮤니티 관련
    'community:list': Permission.COMMUNITY_READ,
    'community:detail': Permission.COMMUNITY_READ,
    'community:create': Permission.COMMUNITY_CREATE,
    'community:update': Permission.COMMUNITY_UPDATE_ANY,
    'community:delete': Permission.COMMUNITY_DELETE_ANY,
    'community:moderate': Permission.COMMUNITY_MODERATE,

    // 채용공고 관련
    'jobs:list': Permission.JOBS_READ,
    'jobs:detail': Permission.JOBS_READ,
    'jobs:create': Permission.JOBS_CREATE,
    'jobs:update': Permission.JOBS_UPDATE_ANY,
    'jobs:delete': Permission.JOBS_DELETE_ANY,
    'jobs:approve': Permission.JOBS_APPROVE,

    // 사용자 관련
    'users:profile': Permission.USERS_READ,
    'users:update': Permission.USERS_UPDATE_ANY,
    'users:ban': Permission.USERS_BAN,
    'users:assign-role': Permission.USERS_ASSIGN_ROLES,

    // 분석 관련
    'analytics:view': Permission.ANALYTICS_READ,
    'analytics:export': Permission.ANALYTICS_EXPORT
  } as const;

  /**
   * 리소스 접근 권한 체크
   * @param context RBAC 컨텍스트
   * @param resource 리소스 식별자
   * @returns 권한 체크 결과
   */
  static checkResourceAccess(context: RBACContext, resource: keyof typeof this.RESOURCE_PERMISSIONS): PermissionResult {
    const requiredPermission = this.RESOURCE_PERMISSIONS[resource];
    if (!requiredPermission) {
      return { 
        allowed: false, 
        reason: `Unknown resource: ${resource}` 
      };
    }

    return this.checkPermission(context, requiredPermission);
  }

  /**
   * 역할 계층 기반 권한 상속 체크
   */
  private static checkRoleHierarchy(userRole: UserRole, permission: Permission): boolean {
    const userLevel = ROLE_HIERARCHY[userRole];
    
    // 상위 역할의 권한을 확인
    for (const [role, level] of Object.entries(ROLE_HIERARCHY)) {
      if (level <= userLevel && level > ROLE_HIERARCHY[userRole]) {
        if (ROLE_PERMISSIONS[role as UserRole]?.includes(permission)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * 본인 소유 리소스에 대한 권한 매핑
   */
  private static getOwnResourcePermission(permission: Permission): Permission | null {
    const ownPermissionMap: Partial<Record<Permission, Permission>> = {
      [Permission.COMMUNITY_UPDATE_ANY]: Permission.COMMUNITY_UPDATE_OWN,
      [Permission.COMMUNITY_DELETE_ANY]: Permission.COMMUNITY_DELETE_OWN,
      [Permission.JOBS_UPDATE_ANY]: Permission.JOBS_UPDATE_OWN,
      [Permission.JOBS_DELETE_ANY]: Permission.JOBS_DELETE_OWN,
      [Permission.USERS_UPDATE_ANY]: Permission.USERS_UPDATE_OWN
    };

    return ownPermissionMap[permission] || null;
  }

  /**
   * 로깅을 위한 권한 체크 (감사 로그)
   * @param context RBAC 컨텍스트
   * @param permission 확인한 권한
   * @param result 권한 체크 결과
   * @param action 수행하려는 액션
   */
  static logPermissionCheck(
    context: RBACContext, 
    permission: Permission, 
    result: PermissionResult, 
    action: string
  ): void {
    const logData = {
      timestamp: new Date().toISOString(),
      userId: context.userId,
      userRole: context.userRole,
      permission,
      action,
      allowed: result.allowed,
      reason: result.reason,
      resourceOwnerId: context.resourceOwnerId
    };

    // 실제 환경에서는 Supabase 함수 또는 외부 로깅 서비스로 전송
    console.log('RBAC_AUDIT_LOG:', JSON.stringify(logData));
  }

  /**
   * 권한 에러 생성 헬퍼
   * @param result 권한 체크 결과
   * @returns HTTP 에러 정보
   */
  static createPermissionError(result: PermissionResult): { status: number; message: string } {
    return {
      status: 403,
      message: result.reason || '권한이 없습니다.'
    };
  }
} 