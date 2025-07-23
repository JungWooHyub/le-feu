'use client';

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  onBackClick?: () => void;
}

export default function MobileHeader({ 
  title, 
  showBackButton = false, 
  rightAction,
  onBackClick 
}: MobileHeaderProps) {
  return (
    <>
      {/* 모바일 헤더 */}
      <header className="md:hidden bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          {/* 왼쪽: 뒤로가기 또는 로고 */}
          <div className="flex items-center min-w-[44px]">
            {showBackButton ? (
              <button
                onClick={onBackClick}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <img 
                  src="/logo_lefeu_0.png" 
                  alt="le feu" 
                  className="h-7 w-7 object-contain" 
                />
                <span className="text-lg font-bold text-gray-900">le feu</span>
              </div>
            )}
          </div>

          {/* 중앙: 타이틀 */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900 truncate px-2">
              {title}
            </h1>
          </div>

          {/* 오른쪽: 액션 버튼 */}
          <div className="flex items-center min-w-[44px] justify-end">
            {rightAction || (
              <button className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 데스크톱 헤더 */}
      <header className="hidden md:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo_lefeu_0.png" 
                alt="le feu" 
                className="h-8 w-8 object-contain" 
              />
              <span className="text-2xl font-bold text-gray-900">le feu</span>
            </div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary-500 transition-colors">
                홈
              </a>
              <a href="/curations" className="text-gray-700 hover:text-primary-500 transition-colors">
                큐레이션
              </a>
              <a href="/community" className="text-gray-700 hover:text-primary-500 transition-colors">
                커뮤니티
              </a>
              <a href="/jobs" className="text-gray-700 hover:text-primary-500 transition-colors">
                채용
              </a>
            </nav>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              로그인
            </button>
          </div>
        </div>
      </header>
    </>
  );
} 