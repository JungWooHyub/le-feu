// Firebase 클라이언트 설정 및 초기화
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase 설정 검증
const isFirebaseConfigured = !!(
  typeof window !== 'undefined' && // 클라이언트에서만 실행
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Firebase 설정 (안전한 기본값 포함)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo'
};

// Firebase 앱 및 Auth 인스턴스
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Firebase 초기화 함수
function initializeFirebase() {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 초기화하지 않음
    return { app: null, auth: null, isConfigured: false };
  }

  if (!isFirebaseConfigured) {
    console.warn('Firebase 환경변수가 설정되지 않았습니다. 일부 기능이 제한될 수 있습니다.');
    return { app: null, auth: null, isConfigured: false };
  }

  try {
    // Firebase 앱 초기화 (중복 방지)
    if (!app && getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log('Firebase 앱이 초기화되었습니다.');
    } else if (!app && getApps().length > 0) {
      app = getApps()[0];
    }

    // Auth 초기화
    if (app && !auth) {
      auth = getAuth(app);
      console.log('Firebase Auth가 초기화되었습니다.');
    }

    return { app, auth, isConfigured: true };
  } catch (error) {
    console.error('Firebase 초기화 중 오류가 발생했습니다:', error);
    return { app: null, auth: null, isConfigured: false };
  }
}

// Firebase 인스턴스 가져오기 (안전)
export function getFirebaseInstances() {
  return initializeFirebase();
}

// Firebase Auth 가져오기 (안전)
export function getFirebaseAuth() {
  const { auth, isConfigured } = initializeFirebase();
  return { auth, isConfigured };
}

// Firebase App 가져오기 (안전)
export function getFirebaseApp() {
  const { app, isConfigured } = initializeFirebase();
  return { app, isConfigured };
}

// 환경변수 상태 확인
export function checkFirebaseConfig() {
  return {
    isConfigured: isFirebaseConfigured,
    isClient: typeof window !== 'undefined',
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  };
}

// 기본 export
export default { getFirebaseInstances, getFirebaseAuth, getFirebaseApp, checkFirebaseConfig }; 