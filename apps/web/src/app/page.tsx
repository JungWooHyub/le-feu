import { Users, Briefcase, BookOpen } from 'lucide-react';
import MobileHeader from '../components/MobileHeader';
import MobileBottomNav from '../components/MobileBottomNav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* 모바일 + 데스크톱 헤더 */}
      <MobileHeader title="le feu" />

      {/* 메인 콘텐츠 */}
      <main className="pb-4 md:pb-8">
        {/* 히어로 섹션 */}
        <section className="py-8 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              셰프와 외식업 종사자를 위한
              <br />
              <span className="text-primary-500">전용 플랫폼</span>
            </h1>
            <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              셰프 스토리 중심의 고품질 콘텐츠, 실질적인 업계 커뮤니티, 
              현장 용어 기반 채용 정보를 한번에 만나보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a 
                href="/auth/login" 
                className="bg-primary-500 text-white px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-primary-600 transition-colors min-h-[44px] flex items-center justify-center"
              >
                무료로 시작하기
              </a>
              <a 
                href="#features" 
                className="border border-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-gray-50 transition-colors min-h-[44px] flex items-center justify-center"
              >
                더 알아보기
              </a>
            </div>
          </div>
        </section>

        {/* 주요 기능 섹션 */}
        <section id="features" className="py-8 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                le feu의 핵심 기능
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                요식업 종사자들을 위해 특별히 설계된 기능들
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-6 md:p-8 rounded-xl bg-gradient-to-b from-primary-50 to-white">
                <BookOpen className="h-10 w-10 md:h-12 md:w-12 text-primary-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  셰프 큐레이션
                </h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                  세계 각지의 셰프들의 스토리와 레시피, 업계 트렌드를 
                  엄선해서 제공하는 고품질 콘텐츠
                </p>
                <a 
                  href="/curations" 
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base min-h-[44px] flex items-center justify-center"
                >
                  자세히 보기 →
                </a>
              </div>
              
              <div className="text-center p-6 md:p-8 rounded-xl bg-gradient-to-b from-secondary-50 to-white">
                <Users className="h-10 w-10 md:h-12 md:w-12 text-secondary-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  업계 전용 커뮤니티
                </h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                  요식업 종사자들만의 폐쇄형 커뮤니티에서 
                  자유롭게 소통하고 정보를 공유
                </p>
                <a 
                  href="/community" 
                  className="text-secondary-600 hover:text-secondary-700 font-medium text-sm md:text-base min-h-[44px] flex items-center justify-center"
                >
                  자세히 보기 →
                </a>
              </div>
              
              <div className="text-center p-6 md:p-8 rounded-xl bg-gradient-to-b from-primary-50 to-white">
                <Briefcase className="h-10 w-10 md:h-12 md:w-12 text-primary-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  직무 맞춤 채용
                </h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                  업계 용어와 포지션에 특화된 필터로 
                  정확한 매칭의 구인·구직 서비스
                </p>
                <a 
                  href="/jobs" 
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm md:text-base min-h-[44px] flex items-center justify-center"
                >
                  자세히 보기 →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="bg-gray-900 text-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo_lefue_0.png" 
                  alt="le feu" 
                  className="h-5 w-5 md:h-6 md:w-6 object-contain" 
                />
                <span className="text-lg md:text-xl font-bold">le feu</span>
              </div>
              <div className="text-xs md:text-sm text-gray-400">
                © 2024 le feu. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* 모바일 하단 탭바 */}
      <MobileBottomNav />
    </div>
  );
} 