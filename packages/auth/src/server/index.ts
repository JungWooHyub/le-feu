// Server-side auth exports
export { adminAuth, validateAdminConfig } from './config';
export {
  verifyIdToken,
  createSessionCookie,
  verifySessionCookie,
  getFirebaseUser,
  setCustomClaims,
  updateUserStatus,
  deleteFirebaseUser,
  extractTokenFromRequest,
  extractTokenFromNextRequest,
  extractUidFromToken,
  requireAuth,
  requireRole,
  requireAdmin
} from './auth-service';

// Re-export types for convenience
export type {
  AuthUser,
  AuthTokenPayload,
  AuthError,
  SupabaseUserProfile
} from '../types'; 