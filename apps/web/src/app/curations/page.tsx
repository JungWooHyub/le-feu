import { BookOpen, Star, Clock, User } from 'lucide-react';
import Link from 'next/link';
import MobileHeader from '../../components/MobileHeader';
import MobileBottomNav from '../../components/MobileBottomNav';

// 한국 셰프 스토리 데이터
const curations = [
  {
    id: 1,
    title: "안성재, 미슐랭을 정복한 한국인",
    subtitle: "뉴욕에서 파리까지, 세계를 무대로 한 요리 여정",
    author: "le feu 편집팀",
    category: "story",
    difficulty: 5,
    readingTime: 12,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    summary: "한국 요리의 세계화를 꿈꾸며 뉴욕과 파리를 넘나드는 안성재 셰프. 미슐랭 스타를 받기까지의 험난한 여정과 한국 요리에 대한 철학을 들어보세요.",
    tags: ["안성재", "미슐랭", "한국요리", "세계화", "뉴욕"],
    viewCount: 25400,
    likeCount: 1250,
    isFeature: true
  },
  {
    id: 2,
    title: "이연복, 중화요리 거장의 40년",
    subtitle: "평생을 중화요리에 바친 마이스터의 이야기",
    author: "le feu 편집팀",
    category: "story",
    difficulty: 4,
    readingTime: 15,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    summary: "40년간 중화요리 한 길만 걸어온 이연복 셰프. TV 스타가 되기 전, 중국 현지에서 배운 진짜 중화요리의 정수와 요리에 대한 장인정신을 만나보세요.",
    tags: ["이연복", "중화요리", "장인정신", "40년", "마이스터"],
    viewCount: 18600,
    likeCount: 890,
    isFeature: false
  },
  {
    id: 3,
    title: "최현석, 혁신과 전통 사이에서",
    subtitle: "기존 한식의 틀을 깨며 새로운 길을 만드는 셰프",
    author: "le feu 편집팀",
    category: "story",
    difficulty: 4,
    readingTime: 10,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    summary: "전통 한식에 현대적 해석을 더하며 독자적인 요리 세계를 구축한 최현석 셰프. 끊임없는 도전과 실험 정신으로 한국 요리의 새로운 가능성을 제시합니다.",
    tags: ["최현석", "혁신", "한식", "전통", "창의성"],
    viewCount: 14200,
    likeCount: 720,
    isFeature: false
  }
];

const categories = [
  { id: 'all', name: '전체', count: 156 },
  { id: 'story', name: '셰프 스토리', count: 89 },
  { id: 'philosophy', name: '요리 철학', count: 34 },
  { id: 'journey', name: '요리 여정', count: 23 },
  { id: 'interview', name: '인터뷰', count: 10 }
];

export default function CurationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 + 데스크톱 헤더 */}
      <MobileHeader title="셰프 큐레이션" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* 페이지 헤더 - 모바일에서는 숨김 (MobileHeader에서 표시) */}
        <div className="hidden md:block mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            셰프 큐레이션
          </h1>
          <p className="text-lg text-gray-600">
            한국 최고 셰프들의 인생 이야기와 요리 철학을 만나보세요
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* 사이드바 - 카테고리 */}
          <aside className="lg:w-64 space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                카테고리
              </h3>
              <div className="space-y-1 md:space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors min-h-[44px] ${
                      category.id === 'all'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm md:text-base">{category.name}</span>
                    <span className="text-xs md:text-sm text-gray-400">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 인기 태그 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                인기 태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {['안성재', '이연복', '최현석', '미슐랭', '중화요리', '한식', '혁신', '장인정신'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 text-xs md:text-sm rounded-full hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors min-h-[36px] flex items-center"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  총 <span className="font-semibold text-gray-900">156</span>개의 셰프 스토리
                </span>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[44px] w-full sm:w-auto">
                <option>최신순</option>
                <option>인기순</option>
                <option>조회순</option>
              </select>
            </div>

            {/* 큐레이션 리스트 */}
            <div className="space-y-4 md:space-y-6">
              {curations.map((curation) => (
                <Link 
                  key={curation.id}
                  href={`/curations/${curation.id}`}
                  className="block"
                >
                  <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                    <div className="flex flex-col md:flex-row">
                      {/* 이미지 */}
                      <div className="w-full md:w-64 h-48 md:h-40 relative overflow-hidden bg-gray-200">
                        <img 
                          src={curation.image} 
                          alt={curation.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {curation.isFeature && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium">
                              추천
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 콘텐츠 */}
                      <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col h-full">
                          {/* 카테고리 */}
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              curation.category === 'story' ? 'bg-purple-100 text-purple-800' :
                              curation.category === 'philosophy' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {curation.category === 'story' ? '셰프 스토리' :
                               curation.category === 'philosophy' ? '요리 철학' : '기타'}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <Star className="w-3 h-3 mr-1" />
                              깊이 {curation.difficulty}/5
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {curation.readingTime}분 읽기
                            </div>
                          </div>

                          {/* 제목 및 부제목 */}
                          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                            {curation.title}
                          </h2>
                          <h3 className="text-sm md:text-base text-gray-600 mb-3">
                            {curation.subtitle}
                          </h3>

                          {/* 요약 */}
                          <p className="text-sm md:text-base text-gray-700 mb-4 line-clamp-2 flex-1">
                            {curation.summary}
                          </p>

                          {/* 하단 정보 */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {curation.author}
                              </div>
                              <span>조회 {curation.viewCount.toLocaleString()}</span>
                              <span>좋아요 {curation.likeCount}</span>
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
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center mt-6 md:mt-8">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] w-full sm:w-auto">
                더 많은 셰프 스토리 보기
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* 모바일 하단 탭바 */}
      <MobileBottomNav />
    </div>
  );
} 