import { Flame } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 로고 */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Flame className="h-12 w-12 text-primary-500 animate-pulse" />
          <span className="text-4xl font-bold text-gray-900">le feu</span>
        </div>

        {/* 로딩 스피너 */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
        
        <p className="text-gray-600 text-lg">
          불러오는 중...
        </p>
        
        {/* 로딩 바 */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mt-6 mx-auto overflow-hidden">
          <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
} 