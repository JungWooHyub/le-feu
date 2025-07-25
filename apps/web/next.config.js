/** @type {import('next').NextConfig} */
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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 