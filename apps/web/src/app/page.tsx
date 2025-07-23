import { Users, Briefcase, BookOpen } from 'lucide-react';

// le feu 커스텀 로고 컴포넌트
function LeFeuLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 외곽 불꽃 */}
      <path 
        d="M20 4C16 8 14 12 14 16C14 18 15 20 17 21C15 19 14 17 14 15C14 13 15 11 17 9C18 7 19 5 20 4Z" 
        className="fill-orange-500"
      />
      {/* 중간 불꽃 */}
      <path 
        d="M20 6C18 9 17 12 17 15C17 17 18 19 20 20C19 18 18 16 18 14C18 12 19 10 20 8C20.5 7 20.7 6.5 20 6Z" 
        className="fill-red-500"
      />
      {/* 내부 불꽃 */}
      <path 
        d="M20 8C19 10 18.5 12 18.5 14C18.5 15.5 19 17 20 18C19.5 16.5 19.2 15 19.2 13.5C19.2 12 19.5 10.5 20 9C20.3 8.5 20.2 8.2 20 8Z" 
        className="fill-yellow-400"
      />
      {/* 중앙 하이라이트 */}
      <circle cx="20" cy="15" r="2" className="fill-yellow-200" opacity="0.8" />
      
      {/* 베이스 (잿불) */}
      <ellipse cx="20" cy="22" rx="6" ry="2" className="fill-orange-300" opacity="0.6" />
      
      {/* 추가 불꽃 효과 */}
      <path 
        d="M26 12C25 14 24 16 24 18C24 19 24.5 20 25 20.5C24.5 19.5 24.2 18.5 24.2 17.5C24.2 16 24.8 14.5 25.5 13C26 12.2 26.2 11.8 26 12Z" 
        className="fill-orange-400" 
        opacity="0.7"
      />
      <path 
        d="M14 12C15 14 16 16 16 18C16 19 15.5 20 15 20.5C15.5 19.5 15.8 18.5 15.8 17.5C15.8 16 15.2 14.5 14.5 13C14 12.2 13.8 11.8 14 12Z" 
        className="fill-orange-400" 
        opacity="0.7"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <LeFeuLogo className="h-10 w-10" />
              <span className="text-2xl font-bold text-gray-900">le feu</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-500 transition-colors">
                기능
              </a>
              <a href="#community" className="text-gray-700 hover:text-primary-500 transition-colors">
                커뮤니티
              </a>
              <a href="#jobs" className="text-gray-700 hover:text-primary-500 transition-colors">
                채용
              </a>
            </nav>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              시작하기
            </button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            셰프와 외식업 종사자를 위한
            <br />
            <span className="text-primary-500">전용 플랫폼</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            셰프 스토리 중심의 고품질 콘텐츠, 실질적인 업계 커뮤니티, 
            현장 용어 기반 채용 정보를 한번에 만나보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/login" className="bg-primary-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors">
              무료로 시작하기
            </a>
            <a href="#features" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              더 알아보기
            </a>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              le feu의 핵심 기능
            </h2>
            <p className="text-lg text-gray-600">
              요식업 종사자들을 위해 특별히 설계된 기능들
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-primary-50 to-white">
              <BookOpen className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                셰프 큐레이션
              </h3>
              <p className="text-gray-600 mb-4">
                세계 각지의 셰프들의 스토리와 레시피, 업계 트렌드를 
                엄선해서 제공하는 고품질 콘텐츠
              </p>
              <a href="/curations" className="text-primary-600 hover:text-primary-700 font-medium">
                자세히 보기 →
              </a>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-secondary-50 to-white">
              <Users className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                업계 전용 커뮤니티
              </h3>
              <p className="text-gray-600 mb-4">
                요식업 종사자들만의 폐쇄형 커뮤니티에서 
                자유롭게 소통하고 정보를 공유
              </p>
              <a href="/community" className="text-secondary-600 hover:text-secondary-700 font-medium">
                자세히 보기 →
              </a>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-primary-50 to-white">
              <Briefcase className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                직무 맞춤 채용
              </h3>
              <p className="text-gray-600 mb-4">
                업계 용어와 포지션에 특화된 필터로 
                정확한 매칭의 구인·구직 서비스
              </p>
              <a href="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
                자세히 보기 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LeFeuLogo className="h-6 w-6" />
              <span className="text-xl font-bold">le feu</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 le feu. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 