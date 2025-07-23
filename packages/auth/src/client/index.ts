// Client-side auth exports
export { auth, validateFirebaseConfig } from './config';
export {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  sendPhoneVerification,
  verifyPhoneCode,
  signOut,
  sendPasswordReset,
  getCurrentUserToken,
  getCurrentUser,
  updateUserProfile,
  mapFirebaseUser
} from './auth-service';

// Re-export types for convenience
export type {
  AuthUser,
  AuthResult,
  SignInOptions,
  SignUpOptions,
  AuthConfig,
  AuthContext,
  AuthError,
  AuthState
} from '../types'; 