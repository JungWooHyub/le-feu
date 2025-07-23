import { Flame, Briefcase, MapPin, Clock, DollarSign, Star, Users, Building } from 'lucide-react';

// 임시 데이터
const jobs = [
  {
    id: 1,
    title: "이탈리안 레스토랑 수셰프 구인",
    company: "라 포르케타",
    location: "서울 강남구",
    jobType: "정규직",
    position: "수셰프",
    experienceLevel: "경력 3-5년",
    businessType: "restaurant",
    cuisineTypes: ["이탈리안"],
    salaryType: "월급",
    salaryMin: 350,
    salaryMax: 450,
    salaryCurrency: "만원",
    isUrgent: true,
    isFeatured: false,
    description: "미슐랭 가이드 추천 레스토랑에서 함께 일할 열정적인 수셰프를 찾습니다. 정통 이탈리안 요리 경험자 우대...",
    requirements: ["이탈리안 요리 경험 3년 이상", "칼 스킬 우수자", "원활한 의사소통 능력"],
    benefits: ["4대보험", "식사제공", "연차", "성과급"],
    applicationCount: 12,
    viewCount: 156,
    postedAt: "1일 전",
    deadline: "2024-02-15"
  },
  {
    id: 2,
    title: "호텔 일식 레스토랑 메인 셰프",
    company: "신라호텔",
    location: "서울 중구",
    jobType: "정규직",
    position: "헤드셰프",
    experienceLevel: "경력 7년+",
    businessType: "hotel",
    cuisineTypes: ["일식"],
    salaryType: "연봉",
    salaryMin: 6000,
    salaryMax: 8000,
    salaryCurrency: "만원",
    isUrgent: false,
    isFeatured: true,
    description: "5성급 호텔 일식당의 메인 셰프로 근무하실 분을 모집합니다. 숙련된 일식 요리 기술과 팀 관리 경험이 필요합니다...",
    requirements: ["일식 경력 7년 이상", "오마카세 경험", "팀 관리 경험", "일본어 가능자 우대"],
    benefits: ["4대보험", "연차", "교육지원", "해외연수 기회", "숙박시설 이용"],
    applicationCount: 8,
    viewCount: 245,
    postedAt: "3일 전",
    deadline: "2024-02-20"
  },
  {
    id: 3,
    title: "브런치 카페 주방보조 급구",
    company: "모닝글로리 카페",
    location: "서울 홍대",
    jobType: "파트타임",
    position: "주방보조",
    experienceLevel: "신입 가능",
    businessType: "cafe",
    cuisineTypes: ["브런치", "베이커리"],
    salaryType: "시급",
    salaryMin: 12000,
    salaryMax: 15000,
    salaryCurrency: "원",
    isUrgent: true,
    isFeatured: false,
    description: "홍대 인기 브런치 카페에서 주방보조 아르바이트를 모집합니다. 경험 없어도 열심히 하실 분이면 환영입니다...",
    requirements: ["성실하고 책임감 있는 분", "주 5일 근무 가능", "오전 근무 가능"],
    benefits: ["식사제공", "교통비지원", "주휴수당"],
    applicationCount: 23,
    viewCount: 89,
    postedAt: "12시간 전",
    deadline: "2024-01-30"
  }
];

const filters = {
  jobTypes: [
    { id: 'all', name: '전체', count: 156 },
    { id: 'full_time', name: '정규직', count: 89 },
    { id: 'part_time', name: '파트타임', count: 45 },
    { id: 'extra', name: '엑스트라', count: 22 }
  ],
  positions: [
    { id: 'all', name: '전체 포지션' },
    { id: 'head_chef', name: '헤드셰프' },
    { id: 'sous_chef', name: '수셰프' },
    { id: 'cook', name: '요리사' },
    { id: 'helper', name: '주방보조' },
    { id: 'manager', name: '매니저' }
  ],
  businessTypes: [
    { id: 'all', name: '전체 업종' },
    { id: 'restaurant', name: '레스토랑' },
    { id: 'cafe', name: '카페' },
    { id: 'hotel', name: '호텔' },
    { id: 'bakery', name: '베이커리' },
    { id: 'bar', name: '바' }
  ],
  locations: [
    { id: 'all', name: '전체 지역' },
    { id: 'gangnam', name: '강남구' },
    { id: 'hongdae', name: '홍대' },
    { id: 'jung', name: '중구' },
    { id: 'gangbuk', name: '강북구' }
  ]
};

export default function JobsPage() {
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
              <a href="/community" className="text-gray-700 hover:text-primary-500 transition-colors">
                커뮤니티
              </a>
              <a href="/jobs" className="text-primary-500 font-medium">
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
              채용 정보
            </h1>
            <p className="text-lg text-gray-600">
              요식업계 맞춤 채용 정보를 찾아보세요
            </p>
          </div>
          <button className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            구인공고 등록
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 필터 사이드바 */}
          <aside className="lg:w-80 space-y-6">
            {/* 빠른 필터 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                빠른 필터
              </h3>
              
              {/* 고용 형태 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">고용 형태</h4>
                <div className="space-y-2">
                  {filters.jobTypes.map((type) => (
                    <label key={type.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="jobType"
                          defaultChecked={type.id === 'all'}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{type.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 포지션 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">포지션</h4>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {filters.positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 업종 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">업종</h4>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {filters.businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 지역 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">지역</h4>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {filters.locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <button className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors">
                필터 적용
              </button>
            </div>

            {/* 급여 정보 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                평균 급여 정보
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">헤드셰프</span>
                  <span className="font-semibold">월 500-800만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">수셰프</span>
                  <span className="font-semibold">월 350-500만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">요리사</span>
                  <span className="font-semibold">월 250-350만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">주방보조</span>
                  <span className="font-semibold">시급 1.2-1.5만원</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1">
            {/* 결과 요약 및 정렬 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  총 <span className="font-semibold text-gray-900">156</span>개의 채용공고
                </span>
                <div className="flex space-x-2">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    급구 22개
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    추천 5개
                  </span>
                </div>
              </div>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>최신순</option>
                <option>급여순</option>
                <option>마감임박순</option>
                <option>지원자수순</option>
              </select>
            </div>

            {/* 채용공고 리스트 */}
            <div className="space-y-6">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {job.isUrgent && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            급구
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            추천
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {job.jobType === 'full_time' ? '정규직' : 
                           job.jobType === 'part_time' ? '파트타임' : '엑스트라'}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                        {job.title}
                      </h2>
                      
                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.experienceLevel}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {req}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.benefits.slice(0, 4).map((benefit, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="ml-6 text-right">
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {job.salaryType === '시급' 
                          ? `시급 ${job.salaryMin.toLocaleString()}${job.salaryCurrency}`
                          : `${job.salaryMin}-${job.salaryMax}${job.salaryCurrency}`
                        }
                      </div>
                      <div className="text-sm text-gray-500 mb-3">
                        {job.salaryType}
                      </div>
                      <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                        지원하기
                      </button>
                    </div>
                  </div>

                  {/* 하단 정보 */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.postedAt}
                      </div>
                      <span>조회 {job.viewCount}</span>
                      <span>지원 {job.applicationCount}명</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      마감일: {job.deadline}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center mt-8">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                더 많은 채용공고 보기
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 