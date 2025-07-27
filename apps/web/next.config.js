/** @type {import('next').NextConfig} */

// 환경변수 검증 함수
function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('\n❌ 필수 환경변수가 설정되지 않았습니다:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    
    console.error('\n🔧 해결 방법:');
    console.error('1. Vercel 대시보드에서 환경변수를 설정하세요.');
    console.error('2. 로컬 개발시에는 .env.local 파일을 생성하세요.');
    console.error('   cp .env.example .env.local');
    console.error('\n📚 자세한 설정 방법: docs/ENVIRONMENT_SETUP.md\n');
    
    throw new Error(`필수 환경변수가 누락되었습니다: ${missingVars.join(', ')}`);
  }
  
  // Supabase URL 형식 검증
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && !supabaseUrl.startsWith('https://') && !supabaseUrl.includes('supabase.co')) {
    console.warn('⚠️  NEXT_PUBLIC_SUPABASE_URL 형식을 확인하세요. (예: https://your-project.supabase.co)');
  }
  
  console.log('✅ 환경변수 검증 완료');
}

// 빌드 시 환경변수 검증 실행 (CI 환경 제외)
if ((process.env.NODE_ENV === 'production' || process.env.VERCEL) && !process.env.CI && !process.env.GITHUB_ACTIONS) {
  validateEnvironmentVariables();
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['undici']
  },
  transpilePackages: ["@le-feu/ui", "@le-feu/auth", "@le-feu/utils"],
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  webpack: (config, { isServer, dev }) => {
    // undici 완전 제거 및 대체
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
      'node:undici': false
    };

    if (!isServer) {
      // 클라이언트에서 Node.js 전용 모듈들 제외
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'undici',
        'node:undici': 'undici'
      });
      
      // fallback 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        events: false,
        path: false,
        querystring: false,
        url: false,
        http: false,
        https: false,
        os: false,
        zlib: false,
        undici: false
      };
    }
    
    // undici 관련 파일들을 무시
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: 'null-loader'
    });
    
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 