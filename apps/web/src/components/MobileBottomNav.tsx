'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BookOpen, Users, Briefcase } from 'lucide-react';

interface TabItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabItem[] = [
  {
    href: '/',
    label: '홈',
    icon: Home
  },
  {
    href: '/curations',
    label: '큐레이션',
    icon: BookOpen
  },
  {
    href: '/community',
    label: '커뮤니티',
    icon: Users
  },
  {
    href: '/jobs',
    label: '채용',
    icon: Briefcase
  }
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* 컨텐츠 하단 패딩 (탭바 높이만큼) */}
      <div className="h-20 md:hidden" />
      
      {/* 하단 탭바 - 모바일에서만 표시 */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
        role="navigation"
        aria-label="주요 네비게이션"
      >
        <div className="flex items-center justify-around h-20 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={`${tab.label} 페이지로 이동${isActive ? ' (현재 페이지)' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isActive
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary-500' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary-500' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* iOS 스타일 홈 인디케이터 */}
        <div 
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full" 
          aria-hidden="true"
        />
      </nav>
    </>
  );
} 