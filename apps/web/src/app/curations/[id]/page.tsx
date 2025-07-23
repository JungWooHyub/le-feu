'use client';

import { ArrowLeft, Clock, Star, User, Heart, Bookmark, Share2, ChefHat, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MobileHeader from '../../../components/MobileHeader';
import MobileBottomNav from '../../../components/MobileBottomNav';

// 임시 상세 데이터 (실제로는 API에서 가져올 예정)
const curationDetail = {
  id: 1,
  title: "미슐랭 3스타 셰프의 파스타 비법",
  subtitle: "이탈리아 현지에서 배운 정통 파스타 만들기",
  author: {
    name: "마르코 로시",
    role: "미슐랭 3스타 셰프",
    restaurant: "Osteria del Borgo",
    avatar: "https://images.unsplash.com/photo-1583394293214-28a5b0129b7c?w=64&h=64&fit=crop&crop=face"
  },
  category: "레시피",
  difficulty: 4,
  cookingTime: 45,
  servings: 4,
  image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop",
  tags: ["파스타", "이탈리아", "미슐랭", "정통", "알덴테"],
  summary: "30년 경력의 이탈리아 셰프가 공개하는 완벽한 파스타의 비밀. 면을 삶는 방법부터 소스 만들기까지, 미슐랭 스타 레스토랑의 노하우를 집에서도 재현할 수 있도록 상세히 알려드립니다.",
  
  content: {
    intro: "파스타는 단순해 보이지만, 완벽한 파스타를 만드는 것은 예술입니다. 오늘 여러분과 함께 나누고 싶은 것은 30년간 이탈리아에서 배우고 연구한 진정한 파스타의 비법입니다.",
    
    ingredients: [
      { name: "스파게티니", amount: "400g", note: "브론즈 다이 제품 권장" },
      { name: "구아냐얄레", amount: "150g", note: "혹은 판체타" },
      { name: "페코리노 로마노", amount: "100g", note: "갓 간 것" },
      { name: "달걀 노른자", amount: "4개", note: "실온" },
      { name: "검은 후추", amount: "1작은술", note: "갓 간 것" },
      { name: "소금", amount: "적당량", note: "바다소금 권장" }
    ],
    
    steps: [
      {
        title: "물 끓이기의 과학",
        content: "파스타 100g당 1L의 물을 사용합니다. 물이 완전히 끓기 시작하면 소금을 넣는데, 이때 물 1L당 10g의 소금이 황금비율입니다. 물이 바다맛이 날 정도로 짜야 합니다.",
        tip: "소금을 너무 일찍 넣으면 물의 끓는점이 높아져 시간이 오래 걸립니다."
      },
      {
        title: "구아냐얄레 준비",
        content: "구아냐얄레를 5mm 두께로 썰어 팬에서 천천히 볶습니다. 기름을 별도로 넣지 마세요. 구아냐얄레에서 나오는 기름이면 충분합니다.",
        tip: "너무 센 불에서 볶으면 딱딱해집니다. 약불에서 천천히가 포인트입니다."
      },
      {
        title: "파스타 삶기의 예술",
        content: "포장지에 적힌 시간보다 1분 적게 삶습니다. 알덴테의 정의는 '치아에 닿는다'는 뜻으로, 중심에 아주 얇은 흰 선이 보일 정도가 완벽합니다.",
        tip: "파스타를 넣을 때 젓가락으로 저어주어야 붙지 않습니다."
      },
      {
        title: "만테카투라 기법",
        content: "이것이 가장 중요한 단계입니다. 파스타와 소스를 합치는 과정으로, 팬을 불에서 내린 후 치즈와 파스타 물을 조금씩 넣으며 격렬하게 저어줍니다.",
        tip: "이 과정에서 크림같은 질감이 만들어집니다. 물을 너무 많이 넣지 마세요."
      }
    ],
    
    professionalTips: [
      "파스타 물은 버리지 마세요. 전분이 풍부해서 소스를 부드럽게 만들어줍니다.",
      "치즈는 파스타를 서빙하기 직전에 갈아주세요. 미리 갈아두면 풍미가 날아갑니다.",
      "완성된 파스타는 즉시 서빙하세요. 파스타는 기다려주지 않습니다.",
      "같은 레시피라도 계절과 습도에 따라 파스타 물의 양을 조절해야 합니다."
    ]
  },
  
  viewCount: 12500,
  likeCount: 320,
  bookmarkCount: 89,
  publishedAt: "2024-01-15",
  readingTime: 8
};

export default function CurationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 모바일 + 데스크톱 헤더 */}
      <MobileHeader 
        title={curationDetail.category}
        showBackButton={true}
        onBackClick={handleBack}
        rightAction={
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        }
      />

      {/* 히어로 섹션 */}
      <div className="relative">
        <div className="aspect-[4/3] md:aspect-[16/9] relative overflow-hidden">
          <img 
            src={curationDetail.image}
            alt={curationDetail.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          
          {/* 모바일에서는 하단에 정보 표시 */}
          <div className="md:hidden absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium">
                {curationDetail.category}
              </span>
              {curationDetail.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* 헤더 정보 */}
        <div className="mb-6 md:mb-8">
          {/* 데스크톱 태그 */}
          <div className="hidden md:flex flex-wrap gap-2 mb-4">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {curationDetail.category}
            </span>
            {curationDetail.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            {curationDetail.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6">
            {curationDetail.subtitle}
          </p>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <img 
                src={curationDetail.author.avatar}
                alt={curationDetail.author.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900">{curationDetail.author.name}</div>
                <div className="text-xs">{curationDetail.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {curationDetail.cookingTime}분
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              난이도 {curationDetail.difficulty}/5
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              {curationDetail.servings}인분
            </div>
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b">
            <span>조회 {curationDetail.viewCount.toLocaleString()}</span>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {curationDetail.likeCount}
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="w-4 h-4" />
              {curationDetail.bookmarkCount}
            </div>
            <span>읽는 시간 {curationDetail.readingTime}분</span>
          </div>
        </div>

        {/* 소개 */}
        <div className="mb-8 md:mb-12">
          <p className="text-lg leading-relaxed text-gray-700">
            {curationDetail.content.intro}
          </p>
        </div>

        {/* 재료 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            필요한 재료
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {curationDetail.content.ingredients.map((ingredient, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <span className="font-medium text-gray-900">{ingredient.name}</span>
                    {ingredient.note && (
                      <span className="text-sm text-gray-500 ml-2">({ingredient.note})</span>
                    )}
                  </div>
                  <span className="font-semibold text-primary-600">{ingredient.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 조리 과정 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            조리 과정
          </h2>
          <div className="space-y-6 md:space-y-8">
            {curationDetail.content.steps.map((step, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4 md:pl-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  {step.content}
                </p>
                {step.tip && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>💡 셰프 팁:</strong> {step.tip}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 프로페셔널 팁 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            프로페셔널 팁
          </h2>
          <div className="bg-primary-50 rounded-lg p-4 md:p-6">
            <div className="space-y-3">
              {curationDetail.content.professionalTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
            <Heart className="w-5 h-5" />
            좋아요 {curationDetail.likeCount}
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Bookmark className="w-5 h-5" />
            북마크
          </button>
          <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            공유
          </button>
        </div>
      </div>

      {/* 모바일 하단 탭바 */}
      <MobileBottomNav />
    </div>
  );
} 