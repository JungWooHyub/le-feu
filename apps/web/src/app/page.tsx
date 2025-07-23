import { Flame, Users, Briefcase, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary-500" />
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
            <button className="bg-primary-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors">
              무료로 시작하기
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              더 알아보기
            </button>
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
              <p className="text-gray-600">
                세계 각지의 셰프들의 스토리와 레시피, 업계 트렌드를 
                엄선해서 제공하는 고품질 콘텐츠
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-secondary-50 to-white">
              <Users className="h-12 w-12 text-secondary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                업계 전용 커뮤니티
              </h3>
              <p className="text-gray-600">
                요식업 종사자들만의 폐쇄형 커뮤니티에서 
                자유롭게 소통하고 정보를 공유
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-primary-50 to-white">
              <Briefcase className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                직무 맞춤 채용
              </h3>
              <p className="text-gray-600">
                업계 용어와 포지션에 특화된 필터로 
                정확한 매칭의 구인·구직 서비스
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-6 w-6 text-primary-500" />
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