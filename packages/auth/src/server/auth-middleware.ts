import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UserRole, Permission, RBACContext } from '../types/roles';
import { RBACService } from './rbac-service';

/**
 * API 미들웨어용 인증된 사용자 정보
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  metadata?: Record<string, any>;
}

/**
 * 미들웨어 옵션
 */
export interface MiddlewareOptions {
  requireAuth?: boolean;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  allowOwnerAccess?: boolean; // 리소스 소유자 접근 허용
}

/**
 * 인증 미들웨어 결과
 */
export interface AuthMiddlewareResult {
  user?: AuthenticatedUser;
  error?: {
    status: number;
    message: string;
  };
}

/**
 * Next.js API Routes용 인증 및 권한 체크 미들웨어
 */
export class AuthMiddleware {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // 서버에서는 Service Role Key 사용
  );

  /**
   * JWT 토큰에서 사용자 정보 추출
   * @param request NextRequest 객체
   * @returns 인증된 사용자 정보 또는 에러
   */
  static async authenticate(request: NextRequest): Promise<AuthMiddlewareResult> {
    try {
      // Authorization 헤더에서 토큰 추출
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          error: {
            status: 401,
            message: '인증 토큰이 필요합니다.'
          }
        };
      }

      const token = authHeader.substring(7);

      // Supabase로 토큰 검증
      const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
      
      if (authError || !user) {
        return {
          error: {
            status: 401,
            message: '유효하지 않은 인증 토큰입니다.'
          }
        };
      }

      // 사용자 프로필 정보 조회
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('role, is_verified, metadata')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return {
          error: {
            status: 404,
            message: '사용자 프로필을 찾을 수 없습니다.'
          }
        };
      }

      // 사용자 정보 반환
      return {
        user: {
          id: user.id,
          email: user.email || '',
          role: profile.role as UserRole,
          isVerified: profile.is_verified || false,
          metadata: profile.metadata
        }
      };

    } catch (error) {
      console.error('Authentication error:', error);
      return {
        error: {
          status: 500,
          message: '인증 처리 중 오류가 발생했습니다.'
        }
      };
    }
  }

  /**
   * 권한 체크
   * @param user 인증된 사용자
   * @param options 미들웨어 옵션
   * @param resourceOwnerId 리소스 소유자 ID (선택사항)
   * @returns 권한 체크 결과
   */
  static checkAuthorization(
    user: AuthenticatedUser, 
    options: MiddlewareOptions,
    resourceOwnerId?: string
  ): AuthMiddlewareResult {
    
    // 역할 기반 체크
    if (options.requiredRole) {
      const userLevel = RBACService.isAdmin(user.role) ? 4 : 
                      RBACService.isCurator(user.role) ? 3 :
                      RBACService.isEmployer(user.role) ? 2 : 1;
      
      const requiredLevel = options.requiredRole === UserRole.ADMIN ? 4 :
                           options.requiredRole === UserRole.CURATOR ? 3 :
                           options.requiredRole === UserRole.EMPLOYER ? 2 : 1;

      if (userLevel < requiredLevel) {
        return {
          error: {
            status: 403,
            message: `${options.requiredRole} 권한이 필요합니다.`
          }
        };
      }
    }

    // 권한 기반 체크
    if (options.requiredPermission) {
      const context: RBACContext = {
        userRole: user.role,
        userId: user.id,
        resourceOwnerId
      };

      const permissionResult = RBACService.checkPermission(context, options.requiredPermission);
      
      if (!permissionResult.allowed) {
        // 로깅
        RBACService.logPermissionCheck(
          context, 
          options.requiredPermission, 
          permissionResult, 
          'API_ACCESS'
        );

        const error = RBACService.createPermissionError(permissionResult);
        return { error };
      }
    }

    return { user };
  }

  /**
   * 통합 미들웨어 (인증 + 권한 체크)
   * @param request NextRequest 객체
   * @param options 미들웨어 옵션
   * @param resourceOwnerId 리소스 소유자 ID (선택사항)
   * @returns 인증 및 권한 체크 결과
   */
  static async verifyAccess(
    request: NextRequest,
    options: MiddlewareOptions = {},
    resourceOwnerId?: string
  ): Promise<AuthMiddlewareResult> {
    
    // 인증이 필요한 경우에만 체크
    if (options.requireAuth !== false) {
      const authResult = await this.authenticate(request);
      
      if (authResult.error) {
        return authResult;
      }

      const user = authResult.user!;

      // 권한 체크
      if (options.requiredRole || options.requiredPermission) {
        const authzResult = this.checkAuthorization(user, options, resourceOwnerId);
        
        if (authzResult.error) {
          return authzResult;
        }
      }

      return { user };
    }

    return {};
  }

  /**
   * API Route 래퍼 함수
   * @param handler 원본 API 핸들러
   * @param options 미들웨어 옵션
   * @returns 미들웨어가 적용된 핸들러
   */
  static withAuth<T = any>(
    handler: (request: NextRequest, context: { user?: AuthenticatedUser, params?: T }) => Promise<NextResponse>,
    options: MiddlewareOptions = {}
  ) {
    return async (request: NextRequest, context: { params?: T }) => {
      try {
        // 리소스 소유자 ID 추출 (URL 파라미터 또는 본문에서)
        let resourceOwnerId: string | undefined;
        
        if (options.allowOwnerAccess && context.params) {
          // URL 파라미터에서 사용자 ID 추출 시도
          const params = context.params as any;
          resourceOwnerId = params?.userId || params?.authorId || params?.employerId;
        }

        // 인증 및 권한 체크
        const authResult = await this.verifyAccess(request, options, resourceOwnerId);
        
        if (authResult.error) {
          return NextResponse.json(
            { error: authResult.error.message },
            { status: authResult.error.status }
          );
        }

        // 원본 핸들러 실행
        return handler(request, { 
          user: authResult.user, 
          params: context.params 
        });

      } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.json(
          { error: '서버 오류가 발생했습니다.' },
          { status: 500 }
        );
      }
    };
  }

  /**
   * Rate Limiting 체크 (보안 강화)
   * @param userId 사용자 ID
   * @param action 액션 타입
   * @param limit 제한 횟수
   * @param windowMs 시간 윈도우 (밀리초)
   * @returns Rate limit 위반 여부
   */
  static async checkRateLimit(
    userId: string,
    action: string,
    limit: number,
    windowMs: number
  ): Promise<{ limited: boolean; remaining: number }> {
    const key = `rate_limit:${userId}:${action}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    try {
      // Supabase에 rate limit 로그 저장 및 조회
      const { data: logs } = await this.supabase
        .from('rate_limits')
        .select('created_at')
        .eq('user_id', userId)
        .eq('action', action)
        .gte('created_at', new Date(windowStart).toISOString())
        .order('created_at', { ascending: false });

      const currentCount = logs?.length || 0;

      if (currentCount >= limit) {
        return { limited: true, remaining: 0 };
      }

      // 새 요청 로그 추가
      await this.supabase
        .from('rate_limits')
        .insert({
          user_id: userId,
          action,
          created_at: new Date().toISOString()
        });

      return { limited: false, remaining: limit - currentCount - 1 };

    } catch (error) {
      console.error('Rate limit check error:', error);
      // 에러 시 허용 (fail-open)
      return { limited: false, remaining: limit };
    }
  }
} 