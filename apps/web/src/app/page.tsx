import { Flame, Users, Briefcase, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🔥 le feu
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          셰프와 외식업 종사자를 위한 전용 플랫폼
        </p>
        <div className="space-y-4">
          <a 
            href="/curations" 
            className="block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            셰프 큐레이션 보기
          </a>
          <a 
            href="/community" 
            className="block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            커뮤니티 보기
          </a>
          <a 
            href="/jobs" 
            className="block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            채용 정보 보기
          </a>
          <a 
            href="/auth/login" 
            className="block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            로그인 페이지 보기
          </a>
        </div>
      </div>
    </main>
  );
} 