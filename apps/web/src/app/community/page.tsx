import { Flame, MessageCircle, Heart, Bookmark, User, Clock, Pin } from 'lucide-react';

// 임시 데이터
const posts = [
  {
    id: 1,
    title: "레스토랑 오픈 준비하는데 조언 부탁드려요",
    content: "내년 봄에 작은 이탈리안 레스토랑 오픈 예정입니다. 처음 창업이라 많이 막막한데, 선배님들 조언 부탁드릴게요...",
    author: "신입셰프123",
    category: "question",
    isAnonymous: false,
    isPinned: false,
    isSolved: false,
    viewCount: 234,
    likeCount: 12,
    commentCount: 8,
    bookmarkCount: 3,
    tags: ["창업", "이탈리안", "조언"],
    createdAt: "2시간 전"
  },
  {
    id: 2,
    title: "[solved] 파스타 면 삶는 물의 염도 질문",
    content: "파스타 면 삶을 때 물에 소금을 얼마나 넣어야 할까요? 이탈리아 현지에서는 어떻게 하는지 궁금합니다.",
    author: "주방보조5년차",
    category: "question", 
    isAnonymous: false,
    isPinned: false,
    isSolved: true,
    viewCount: 567,
    likeCount: 28,
    commentCount: 15,
    bookmarkCount: 12,
    tags: ["파스타", "기초", "이탈리아"],
    createdAt: "5시간 전"
  },
  {
    id: 3,
    title: "[공지] 커뮤니티 이용 규칙 안내",
    content: "le feu 커뮤니티를 이용해주셔서 감사합니다. 건전한 커뮤니티 운영을 위한 기본 규칙을 안내드립니다...",
    author: "운영자",
    category: "free",
    isAnonymous: false,
    isPinned: true,
    isSolved: false,
    viewCount: 1250,
    likeCount: 45,
    commentCount: 23,
    bookmarkCount: 8,
    tags: ["공지", "규칙"],
    createdAt: "1일 전"
  },
  {
    id: 4,
    title: "오늘 새로 배운 스테이크 굽기 후기",
    content: "시니어 셰프님께 스테이크 굽는 법을 배웠는데 정말 신세계였어요. 온도 관리의 중요성을 새삼 깨달았습니다...",
    author: "익명의요리사",
    category: "review",
    isAnonymous: true,
    isPinned: false,
    isSolved: false,
    viewCount: 189,
    likeCount: 31,
    commentCount: 6,
    bookmarkCount: 15,
    tags: ["스테이크", "후기", "팁"],
    createdAt: "3시간 전"
  }
];

const categories = [
  { id: 'all', name: '전체', icon: '📋', count: 1247 },
  { id: 'question', name: '질문', icon: '❓', count: 456 },
  { id: 'review', name: '후기', icon: '⭐', count: 324 },
  { id: 'free', name: '자유', icon: '💬', count: 287 },
  { id: 'job', name: '구인', icon: '💼', count: 89 },
  { id: 'recipe', name: '레시피', icon: '👨‍🍳', count: 91 }
];

export default function CommunityPage() {
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
              <a href="/curations" className="text-gray-700 hover:text-primary-500 transition-colors">
                큐레이션
              </a>
              <a href="/community" className="text-primary-500 font-medium">
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              커뮤니티
            </h1>
            <p className="text-lg text-gray-600">
              요식업 종사자들과 소통하고 정보를 공유하세요
            </p>
          </div>
          <button className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            글쓰기
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 */}
          <aside className="lg:w-64 space-y-6">
            {/* 카테고리 */}
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
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
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
                {['창업', '파스타', '스테이크', '조언', '후기', '기초', '팁', '레시피'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 커뮤니티 통계 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                커뮤니티 현황
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">전체 게시글</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">활성 회원</span>
                  <span className="font-semibold">892</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">오늘 새 글</span>
                  <span className="font-semibold text-primary-600">23</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1">
            {/* 필터 및 정렬 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  총 <span className="font-semibold text-gray-900">1,247</span>개의 게시글
                </span>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>최신순</option>
                <option>인기순</option>
                <option>댓글순</option>
              </select>
            </div>

            {/* 게시글 리스트 */}
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      {/* 게시글 헤더 */}
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-primary-500" />
                        )}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          post.category === 'question' ? 'bg-blue-100 text-blue-800' :
                          post.category === 'review' ? 'bg-green-100 text-green-800' :
                          post.category === 'free' ? 'bg-gray-100 text-gray-800' :
                          post.category === 'job' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {post.category === 'question' ? '질문' :
                           post.category === 'review' ? '후기' :
                           post.category === 'free' ? '자유' :
                           post.category === 'job' ? '구인' : '레시피'}
                        </span>
                        {post.isSolved && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            해결됨
                          </span>
                        )}
                      </div>

                      {/* 제목 및 내용 */}
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {post.content}
                      </p>

                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-primary-50 hover:text-primary-600 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* 게시글 정보 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.isAnonymous ? '익명' : post.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {post.createdAt}
                          </div>
                          <span>조회 {post.viewCount}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likeCount}
                          </div>
                          <div className="flex items-center hover:text-blue-500 cursor-pointer transition-colors">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.commentCount}
                          </div>
                          <div className="flex items-center hover:text-yellow-500 cursor-pointer transition-colors">
                            <Bookmark className="w-4 h-4 mr-1" />
                            {post.bookmarkCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded-l-lg hover:bg-gray-50">
                  이전
                </button>
                <button className="px-3 py-2 bg-primary-500 text-white border border-primary-500">
                  1
                </button>
                <button className="px-3 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded-r-lg hover:bg-gray-50">
                  다음
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 