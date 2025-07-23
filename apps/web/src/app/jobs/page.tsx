import { Briefcase, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import MobileHeader from '../../components/MobileHeader';
import MobileBottomNav from '../../components/MobileBottomNav';

// 임시 데이터
const jobs = [
  {
    id: 1,
    title: "미슐랭 스타 레스토랑 수셰프 모집",
    company: "라 메종 블루",
    location: "서울 강남",
    jobType: "정규직",
    position: "수셰프",
    experienceLevel: "경력 5년 이상",
    businessType: "restaurant",
    cuisineTypes: ["프렌치", "파인다이닝"],
    salaryType: "연봉",
    salaryMin: 4500,
    salaryMax: 6000,
    salaryCurrency: "만원",
    isUrgent: false,
    isFeatured: true,
    description: "미슐랭 가이드 스타 레스토랑에서 열정적인 수셰프를 찾습니다. 프렌치 요리 경험과 창의성을 갖춘 분을 환영합니다...",
    requirements: ["프렌치 요리 경력 5년 이상", "파인다이닝 경험 필수", "리더십 및 팀워크", "영어 의사소통 가능"],
    benefits: ["4대보험", "성과급", "해외연수", "식사제공"],
    applicationCount: 45,
    viewCount: 234,
    postedAt: "3일 전",
    deadline: "2024-02-15"
  },
  {
    id: 2,
    title: "이탈리안 파스타 전문 요리사",
    company: "파스타 마에스트로",
    location: "서울 이태원",
    jobType: "정규직",
    position: "요리사",
    experienceLevel: "경력 3년 이상",
    businessType: "restaurant",
    cuisineTypes: ["이탈리안", "파스타"],
    salaryType: "월급",
    salaryMin: 300,
    salaryMax: 400,
    salaryCurrency: "만원",
    isUrgent: true,
    isFeatured: false,
    description: "정통 이탈리안 파스타 전문점에서 함께할 요리사를 모집합니다. 파스타 제조부터 플레이팅까지 전 과정을 담당하게 됩니다...",
    requirements: ["이탈리안 요리 경력 3년 이상", "파스타 제조 기술", "주 6일 근무 가능"],
    benefits: ["4대보험", "식사제공", "교육지원"],
    applicationCount: 12,
    viewCount: 156,
    postedAt: "1일 전",
    deadline: "2024-01-25"
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
      {/* 모바일 + 데스크톱 헤더 */}
      <MobileHeader 
        title="채용 정보" 
        rightAction={
          <button className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors flex items-center min-h-[36px]">
            <Briefcase className="w-4 h-4 mr-1" />
            구인
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* 페이지 헤더 - 데스크톱에서만 표시 */}
        <div className="hidden md:flex justify-between items-center mb-8">
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

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* 필터 사이드바 */}
          <aside className="lg:w-80 space-y-4 md:space-y-6">
            {/* 빠른 필터 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                빠른 필터
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-red-100 transition-colors min-h-[40px]">
                  🚨 급구 (22)
                </button>
                <button className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-100 transition-colors min-h-[40px]">
                  ⭐ 추천 (5)
                </button>
                <button className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-green-100 transition-colors min-h-[40px]">
                  💰 고연봉 (12)
                </button>
                <button className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-purple-100 transition-colors min-h-[40px]">
                  🏆 미슐랭 (3)
                </button>
              </div>
            </div>

            {/* 고용 형태 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                고용 형태
              </h3>
              <div className="space-y-1 md:space-y-2">
                {filters.jobTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors min-h-[44px] ${
                      type.id === 'all'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm md:text-base">{type.name}</span>
                    <span className="text-xs md:text-sm text-gray-400">{type.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 포지션 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                포지션
              </h3>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[44px]">
                {filters.positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 업종 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                업종
              </h3>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[44px]">
                {filters.businessTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 지역 */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                지역
              </h3>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[44px]">
                {filters.locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          <main className="flex-1">
            {/* 결과 요약 및 정렬 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
              <div className="flex flex-wrap items-center gap-2">
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
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[44px] w-full sm:w-auto">
                <option>최신순</option>
                <option>급여순</option>
                <option>마감임박순</option>
                <option>지원자수순</option>
              </select>
            </div>

            {/* 채용공고 리스트 */}
            <div className="space-y-4 md:space-y-6">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 md:p-6"
                >
                  {/* 헤더 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        job.jobType === '정규직' ? 'bg-blue-100 text-blue-800' :
                        job.jobType === '파트타임' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {job.jobType}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {job.position}
                      </span>
                      {job.isUrgent && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          급구
                        </span>
                      )}
                      {job.isFeatured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                          추천
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{job.postedAt}</span>
                  </div>

                  {/* 제목 및 회사 */}
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 cursor-pointer">
                    {job.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-3">
                    <span className="font-medium text-sm md:text-base">{job.company}</span>
                    <span className="mx-2">•</span>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                  </div>

                  {/* 급여 및 경력 */}
                  <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salaryType} {job.salaryMin.toLocaleString()}
                      {job.salaryMax && `~${job.salaryMax.toLocaleString()}`} {job.salaryCurrency}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.experienceLevel}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.deadline}까지
                    </div>
                  </div>

                  {/* 설명 */}
                  <p className="text-gray-700 mb-4 line-clamp-2 text-sm md:text-base">
                    {job.description}
                  </p>

                  {/* 요구사항 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">주요 요구사항</h4>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 하단 액션 */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>지원자 {job.applicationCount}명</span>
                      <span>조회 {job.viewCount}회</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm min-h-[40px]">
                        저장
                      </button>
                      <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium min-h-[40px]">
                        지원하기
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="text-center mt-6 md:mt-8">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px] w-full sm:w-auto">
                더 많은 채용공고 보기
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