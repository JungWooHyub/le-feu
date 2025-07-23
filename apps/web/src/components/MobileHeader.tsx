'use client';

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
                <LeFeuLogo className="h-7 w-7" />
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
              <LeFeuLogo className="h-8 w-8" />
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