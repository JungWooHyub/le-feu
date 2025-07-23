import { initializeApp, getApps, cert, ServiceAccount, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

// Firebase Admin 설정
interface AdminConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

function getAdminConfig(): AdminConfig {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Firebase Admin 환경변수가 설정되지 않았습니다.\n' +
      '필요한 변수: NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL'
    );
  }

  return {
    projectId,
    privateKey: privateKey.replace(/\\n/g, '\n'), // 줄바꿈 문자 복원
    clientEmail
  };
}

// Firebase Admin 앱 초기화
let adminApp: App;

function initializeAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const config = getAdminConfig();
  
  const serviceAccount: ServiceAccount = {
    projectId: config.projectId,
    privateKey: config.privateKey,
    clientEmail: config.clientEmail
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: config.projectId
  });

  return adminApp;
}

// Auth 인스턴스 생성
export const adminAuth = getAuth(initializeAdminApp());

// 환경변수 검증
export function validateAdminConfig() {
  try {
    getAdminConfig();
    return true;
  } catch (error) {
    console.error('Firebase Admin 설정 오류:', error);
    return false;
  }
}

export { adminApp }; 