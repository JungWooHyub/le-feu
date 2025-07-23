import { Flame, BookOpen, Star, Clock, User } from 'lucide-react';

// 임시 데이터
const curations = [
  {
    id: 1,
    title: "미슐랭 3스타 셰프의 파스타 비법",
    subtitle: "이탈리아 현지에서 배운 정통 파스타 만들기",
    author: "마르코 로시",
    category: "recipe",
    difficulty: 4,
    cookingTime: 45,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
    summary: "30년 경력의 이탈리아 셰프가 공개하는 완벽한 파스타의 비밀. 면을 삶는 방법부터 소스 만들기까지...",
    tags: ["파스타", "이탈리아", "미슐랭"],
    viewCount: 12500,
    likeCount: 320,
    isFeature: true
  },
  {
    id: 2,
    title: "일식 장인의 스시 쌀 이야기",
    subtitle: "200년 전통의 스시 쌀 준비법",
    author: "다나카 히로시",
    category: "technique",
    difficulty: 5,
    cookingTime: 120,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    summary: "도쿄 츠키지에서 3대째 이어온 스시 장인이 알려주는 완벽한 샤리(스시밥) 만들기...",
    tags: ["스시", "일식", "장인"],
    viewCount: 8200,
    likeCount: 185,
    isFeature: false
  },
  {
    id: 3,
    title: "프렌치 셰프의 소스 마스터클래스",
    subtitle: "5가지 기본 소스로 완성하는 프렌치 요리",
    author: "피에르 뒤봉",
    category: "technique",
    difficulty: 3,
    cookingTime: 60,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    summary: "프랑스 요리의 기초인 5가지 마더 소스를 마스터하면 어떤 요리든 가능합니다...",
    tags: ["프렌치", "소스", "기초"],
    viewCount: 6800,
    likeCount: 142,
    isFeature: false
  }
];

const categories = [
  { id: 'all', name: '전체', count: 156 },
  { id: 'recipe', name: '레시피', count: 89 },
  { id: 'technique', name: '기법', count: 34 },
  { id: 'story', name: '스토리', count: 23 },
  { id: 'trend', name: '트렌드', count: 10 }
];

export default function CurationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-gray-900">le feu</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary-500 transition-colors">
                홈
              </a>
              <a href="/curations" className="text-primary-500 font-medium">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            셰프 큐레이션
          </h1>
          <p className="text-lg text-gray-600">
            세계 최고 셰프들의 비법과 스토리를 만나보세요
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 - 카테고리 */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                카테고리
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      category.id === 'all'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-400">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 인기 태그 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['이탈리아', '프렌치', '일식', '미슐랭', '파스타', '스시', '소스', '기초'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1">
            {/* 필터 및 정렬 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  총 <span className="font-semibold text-gray-900">156</span>개의 큐레이션
                </span>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>최신순</option>
                <option>인기순</option>
                <option>조회순</option>
              </select>
            </div>

            {/* 큐레이션 리스트 */}
            <div className="space-y-6">
              {curations.map((curation) => (
                <article
                  key={curation.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 이미지 */}
                    <div className="md:w-80 h-48 md:h-auto relative">
                      <img
                        src={curation.image}
                        alt={curation.title}
                        className="w-full h-full object-cover"
                      />
                      {curation.isFeature && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            추천
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {curation.cookingTime}분
                      </div>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {curation.category === 'recipe' ? '레시피' : 
                           curation.category === 'technique' ? '기법' : '스토리'}
                        </span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < curation.difficulty
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">
                            난이도 {curation.difficulty}/5
                          </span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {curation.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3">
                        {curation.subtitle}
                      </p>
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {curation.summary}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            {curation.author}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>조회 {curation.viewCount.toLocaleString()}</span>
                            <span>좋아요 {curation.likeCount}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {curation.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center mt-8">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                더 많은 큐레이션 보기
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 