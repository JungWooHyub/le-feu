#!/usr/bin/env node

/**
 * le feu 환경변수 검증 스크립트
 * 프로젝트에 필요한 모든 환경변수가 올바르게 설정되었는지 확인합니다.
 */

const fs = require('fs');
const path = require('path');

// 색상 코드
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// 필수 환경변수 정의
const REQUIRED_ENV_VARS = {
  // Supabase (필수)
  'NEXT_PUBLIC_SUPABASE_URL': {
    required: true,
    description: 'Supabase 프로젝트 URL',
    example: 'https://your-project.supabase.co'
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    required: true,
    description: 'Supabase Anonymous Key',
    example: 'eyJhbG...'
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    required: true,
    description: 'Supabase Service Role Key',
    example: 'eyJhbG...',
    secret: true
  },

  // Firebase (필수)
  'NEXT_PUBLIC_FIREBASE_API_KEY': {
    required: true,
    description: 'Firebase API Key',
    example: 'AIzaSy...'
  },
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': {
    required: true,
    description: 'Firebase Auth Domain',
    example: 'your-project.firebaseapp.com'
  },
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': {
    required: true,
    description: 'Firebase Project ID',
    example: 'your-project-id'
  },

  // 보안 (필수)
  'JWT_SECRET': {
    required: true,
    description: 'JWT 서명용 비밀키 (최소 32자)',
    example: '최소 32자 이상의 랜덤 문자열',
    secret: true,
    minLength: 32
  },
  'NEXTAUTH_SECRET': {
    required: true,
    description: 'NextAuth 비밀키',
    example: '랜덤 문자열',
    secret: true,
    minLength: 32
  },

  // 애플리케이션 URL
  'NEXT_PUBLIC_APP_URL': {
    required: true,
    description: '애플리케이션 URL',
    example: 'http://localhost:3000'
  },

  // 선택사항
  'CLOUDINARY_CLOUD_NAME': {
    required: false,
    description: 'Cloudinary Cloud Name',
    example: 'your-cloud-name'
  },
  'SENDGRID_API_KEY': {
    required: false,
    description: 'SendGrid API Key',
    example: 'SG.your-api-key',
    secret: true
  },
  'AIRTABLE_API_KEY': {
    required: false,
    description: 'Airtable API Key',
    example: 'your-airtable-key',
    secret: true
  }
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    log('\n⚠️  .env.local 파일이 없습니다.', 'yellow');
    
    if (fs.existsSync(envExamplePath)) {
      log('📝 .env.example 파일을 복사하여 .env.local을 생성하세요:', 'cyan');
      log('   cp .env.example .env.local', 'cyan');
    } else {
      log('📝 다음 내용으로 .env.local 파일을 생성하세요:', 'cyan');
      showExampleEnv();
    }
    
    return {};
  }

  // .env.local 파일 파싱
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        env[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
      }
    }
  });

  return env;
}

function showExampleEnv() {
  log('\n# .env.local 예시', 'cyan');
  log('# ==========================================', 'cyan');
  
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, config]) => {
    if (config.required) {
      log(`${key}=${config.example}`, 'cyan');
    }
  });
  
  log('# ==========================================\n', 'cyan');
}

function validateEnvironment() {
  log(`${colors.bold}🔍 le feu 환경변수 검증 시작...${colors.reset}\n`);

  const env = loadEnvFile();
  const issues = [];
  const warnings = [];
  
  // 각 환경변수 검증
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, config]) => {
    const value = env[key] || process.env[key];
    
    if (config.required && !value) {
      issues.push({
        type: 'missing',
        key,
        description: config.description,
        example: config.example
      });
    } else if (value) {
      // 길이 검증
      if (config.minLength && value.length < config.minLength) {
        issues.push({
          type: 'too_short',
          key,
          description: config.description,
          minLength: config.minLength,
          currentLength: value.length
        });
      }
      
      // URL 형식 검증
      if (key.includes('URL') && !isValidUrl(value)) {
        issues.push({
          type: 'invalid_url',
          key,
          description: config.description,
          value: value
        });
      }
      
      // 예시 값 사용 경고
      if (value === config.example || value.includes('your-') || value.includes('example')) {
        warnings.push({
          type: 'example_value',
          key,
          description: config.description
        });
      }
    } else if (!config.required && !value) {
      log(`ℹ️  선택사항: ${key} (${config.description})`, 'yellow');
    }
  });

  // 결과 출력
  if (issues.length === 0) {
    log('✅ 모든 필수 환경변수가 올바르게 설정되었습니다!', 'green');
    
    if (warnings.length > 0) {
      log('\n⚠️  경고:', 'yellow');
      warnings.forEach(warning => {
        log(`   ${warning.key}: 예시 값으로 보입니다. 실제 값으로 변경하세요.`, 'yellow');
      });
    }
    
    log('\n🚀 개발 서버를 시작할 수 있습니다:', 'green');
    log('   npm run dev', 'cyan');
    
  } else {
    log('❌ 환경변수 설정에 문제가 있습니다:\n', 'red');
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'missing':
          log(`🔴 누락: ${issue.key}`, 'red');
          log(`   설명: ${issue.description}`, 'red');
          log(`   예시: ${issue.example}`, 'cyan');
          break;
          
        case 'too_short':
          log(`🔴 길이 부족: ${issue.key}`, 'red');
          log(`   현재: ${issue.currentLength}자, 최소: ${issue.minLength}자 필요`, 'red');
          break;
          
        case 'invalid_url':
          log(`🔴 잘못된 URL: ${issue.key}`, 'red');
          log(`   값: ${issue.value}`, 'red');
          break;
      }
      log(''); // 빈 줄
    });
    
    log('📖 자세한 설정 방법은 docs/ENVIRONMENT_SETUP.md를 참고하세요.\n', 'cyan');
    process.exit(1);
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// 스크립트 실행
validateEnvironment(); 