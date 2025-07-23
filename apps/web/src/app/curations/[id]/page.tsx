'use client';

import { ArrowLeft, Clock, Star, User, Heart, Bookmark, Share2, Award, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MobileHeader from '../../../components/MobileHeader';
import MobileBottomNav from '../../../components/MobileBottomNav';

// 모든 셰프 스토리 데이터
const chefStories = {
  1: {
    id: 1,
    title: "안성재, 미슐랭을 정복한 한국인",
    subtitle: "뉴욕에서 파리까지, 세계를 무대로 한 요리 여정",
    author: {
      name: "le feu 편집팀",
      role: "큐레이션 팀",
      restaurant: "le feu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    category: "셰프 스토리",
    difficulty: 5,
    readingTime: 12,
    chefAge: 45,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    tags: ["안성재", "미슐랭", "한국요리", "세계화", "뉴욕", "파리"],
    summary: "한국 요리의 세계화를 꿈꾸며 뉴욕과 파리를 넘나드는 안성재 셰프. 미슐랭 스타를 받기까지의 험난한 여정과 한국 요리에 대한 철학을 들어보세요.",
    
    content: {
      intro: "\"한국 요리가 세계 무대에서 당당히 인정받을 수 있다는 것을 증명하고 싶었습니다.\" 안성재 셰프의 눈빛에는 여전히 그 시절의 열정이 담겨 있다. 뉴욕과 파리에서 미슐랭 스타를 받으며 한국 요리의 세계화를 이끌어온 그의 이야기를 들어보자.",
      
      philosophy: [
        { 
          title: "정체성", 
          content: "한국인으로서의 뿌리를 잃지 않으면서도 세계인이 공감할 수 있는 요리",
          detail: "어디를 가도 한국 사람이라는 것을 숨기지 않았어요. 오히려 그것이 제 요리의 가장 큰 무기였습니다."
        },
        { 
          title: "혁신", 
          content: "전통을 존중하되, 현지 식재료와 조화를 이루는 창의적 해석",
          detail: "전통 한식의 맛을 해치지 않으면서도 현지인들이 쉽게 접할 수 있도록 하는 것이 핵심이었습니다."
        },
        { 
          title: "완벽주의", 
          content: "매일 같은 맛을 유지하며, 손님 한 분 한 분께 최선을 다하는 자세",
          detail: "미슐랭 스타는 하루아침에 얻어지는 것이 아니에요. 매일매일의 완벽함이 쌓여야 합니다."
        }
      ],
      
      journey: [
        {
          period: "1998-2005",
          title: "서울에서의 시작",
          location: "서울, 대한민국",
          content: "호텔 조리사로 시작한 요리 인생. 프랑스 요리를 배우며 기본기를 다졌지만, 항상 한국 요리에 대한 갈증이 있었다. '언젠가는 한국 요리로 세계를 놀래켜보겠다'는 꿈을 품고 있었다.",
          highlight: "한국 요리에 대한 꿈의 시작"
        },
        {
          period: "2005-2012",
          title: "뉴욕 진출",
          location: "뉴욕, 미국",
          content: "맨해튼 한복판에 작은 한식당을 열었다. 처음에는 손님이 거의 없었지만, 한국 요리의 진정성을 잃지 않으면서도 현지인들의 입맛에 맞는 요리를 개발하기 위해 끊임없이 연구했다.",
          highlight: "첫 번째 도전과 시행착오"
        },
        {
          period: "2012-2018", 
          title: "미슐랭 스타 획득",
          location: "뉴욕, 미국",
          content: "2015년, 드디어 미슐랭 1스타를 받았다. 한국 요리로는 뉴욕에서 최초였다. 이후 꾸준히 스타를 유지하며 한국 요리의 위상을 높였다. 전 세계에서 한국 요리를 배우러 오는 셰프들이 늘어났다.",
          highlight: "한국 요리 최초의 뉴욕 미슐랭 스타"
        },
        {
          period: "2018-현재",
          title: "파리 진출과 글로벌 확장",
          location: "파리, 프랑스",
          content: "요리의 본고장 파리에서도 도전했다. 프랑스인들에게 한국 요리를 소개하는 것은 더욱 어려웠지만, 2020년 파리에서도 미슐랭 스타를 받았다. 현재는 서울, 뉴욕, 파리에서 레스토랑을 운영하며 한국 요리의 세계화를 이끌고 있다.",
          highlight: "파리 미슐랭 스타 획득, 글로벌 체인 구축"
        }
      ],
      
      wisdom: [
        "요리는 언어입니다. 말이 통하지 않아도 맛으로 마음을 전할 수 있어요.",
        "실패를 두려워하지 마세요. 저도 수백 번 실패했지만, 그 경험이 지금의 저를 만들었습니다.",
        "자신의 뿌리를 잊지 마세요. 그것이 당신만의 요리를 만드는 원동력입니다.",
        "완벽한 요리는 없어요. 하지만 완벽해지려는 노력은 멈추면 안 됩니다.",
        "세계 무대에서 당당하려면 먼저 자신의 것에 자부심을 가져야 합니다."
      ],

      achievements: [
        { year: "2015", achievement: "뉴욕 미슐랭 1스타 획득 (한국 요리 최초)" },
        { year: "2016-2018", achievement: "뉴욕 미슐랭 스타 3년 연속 유지" },
        { year: "2019", achievement: "James Beard Award 후보 선정" },
        { year: "2020", achievement: "파리 미슐랭 1스타 획득" },
        { year: "2022", achievement: "서울 레스토랑 오픈" },
        { year: "2023", achievement: "한국 요리 세계화 공로 대통령상 수상" }
      ]
    },
    
    viewCount: 25400,
    likeCount: 1250,
    bookmarkCount: 450,
    publishedAt: "2024-01-15",
    readingTime: 12
  },

  2: {
    id: 2,
    title: "이연복, 중화요리 거장의 40년",
    subtitle: "평생을 중화요리에 바친 마이스터의 이야기",
    author: {
      name: "le feu 편집팀",
      role: "큐레이션 팀",
      restaurant: "le feu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    category: "셰프 스토리",
    difficulty: 4,
    readingTime: 15,
    chefAge: 58,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
    tags: ["이연복", "중화요리", "장인정신", "40년", "마이스터"],
    summary: "40년간 중화요리 한 길만 걸어온 이연복 셰프. TV 스타가 되기 전, 중국 현지에서 배운 진짜 중화요리의 정수와 요리에 대한 장인정신을 만나보세요.",
    
    content: {
      intro: "\"요리에는 지름길이 없습니다. 40년을 한 길만 걸어왔지만, 아직도 배울 것이 무궁무진합니다.\" 이연복 셰프의 손끝에서 태어나는 중화요리는 시간과 정성이 만들어낸 예술품이다. 방송으로 친숙해진 그의 또 다른 모습, 진정한 장인의 이야기를 들어보자.",
      
      philosophy: [
        { 
          title: "장인정신", 
          content: "40년을 한 길만 걸어오며 쌓아온 깊이와 전문성",
          detail: "매일 똑같은 일을 해도 늘 새로운 것을 발견할 수 있어요. 그것이 장인의 길입니다."
        },
        { 
          title: "정통성", 
          content: "중국 현지에서 배운 정말 진짜 중화요리의 맛과 기법",
          detail: "중화요리는 단순히 맛있는 것을 넘어서 문화이고 역사입니다. 그 깊이를 전달하고 싶어요."
        },
        { 
          title: "겸손함", 
          content: "아무리 오래 했어도 늘 배우는 자세로 요리에 임하는 마음",
          detail: "요리 앞에서는 누구나 초심자입니다. 자만하는 순간 맛이 변해버려요."
        }
      ],
      
      journey: [
        {
          period: "1983-1995",
          title: "중화요리의 입문",
          location: "서울, 대한민국",
          content: "어린 나이에 중식당에서 조리보조로 시작한 요리 인생. 선배들의 험한 꾸지람도 많이 들었지만, 중화요리의 매력에 빠져 포기할 생각은 전혀 없었다. 기본기부터 차근차근 배워나갔다.",
          highlight: "중화요리 입문과 기본기 습득"
        },
        {
          period: "1995-2008",
          title: "중국 현지 수업",
          location: "베이징, 중국",
          content: "진짜 중화요리를 배우기 위해 중국으로 건너갔다. 언어도 통하지 않고 문화도 달랐지만, 현지 셰프들에게 정통 중화요리 기법을 배웠다. 특히 북경 요리의 정수를 익혔다.",
          highlight: "중국 현지에서 정통 중화요리 습득"
        },
        {
          period: "2008-2018", 
          title: "마이스터로의 성장",
          location: "서울, 대한민국",
          content: "한국으로 돌아와 자신만의 중화요리 세계를 구축했다. 정통성을 잃지 않으면서도 한국인의 입맛에 맞는 요리를 개발했다. 많은 제자들을 키우며 중화요리의 전통을 이어갔다.",
          highlight: "중화요리 마이스터로 인정받음"
        },
        {
          period: "2018-현재",
          title: "TV 셰프로서의 새로운 도전",
          location: "전국, 대한민국",
          content: "방송을 통해 일반인들에게 중화요리를 알리기 시작했다. TV 스타가 되었지만 변함없이 요리에 대한 열정과 겸손함을 잃지 않고 있다. 지금도 매일 새로운 요리를 연구하고 있다.",
          highlight: "TV를 통한 중화요리 대중화"
        }
      ],
      
      wisdom: [
        "요리에는 지름길이 없습니다. 시간과 정성만이 진짜 맛을 만들어냅니다.",
        "실력은 하루아침에 늘지 않아요. 매일 조금씩 발전하는 것이 중요합니다.",
        "좋은 재료가 좋은 요리의 시작이지만, 그것을 다루는 마음이 더 중요해요.",
        "전통은 지키되, 시대에 맞게 변화할 줄도 알아야 합니다.",
        "요리하는 사람의 마음이 음식에 그대로 담겨요. 늘 좋은 마음으로 요리하세요."
      ],

      achievements: [
        { year: "2010", achievement: "대한민국 중식조리기능장 취득" },
        { year: "2015", achievement: "중화요리 명장 선정" },
        { year: "2018", achievement: "TV 요리 프로그램 첫 출연" },
        { year: "2020", achievement: "중화요리 전문서적 출간" },
        { year: "2022", achievement: "중국 정부 중화요리 홍보대사 위촉" },
        { year: "2023", achievement: "한-중 요리문화 교류 공로상 수상" }
      ]
    },
    
    viewCount: 18600,
    likeCount: 890,
    bookmarkCount: 320,
    publishedAt: "2024-01-12",
    readingTime: 15
  },

  3: {
    id: 3,
    title: "최현석, 혁신과 전통 사이에서",
    subtitle: "기존 한식의 틀을 깨며 새로운 길을 만드는 셰프",
    author: {
      name: "le feu 편집팀",
      role: "큐레이션 팀", 
      restaurant: "le feu",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
    },
    category: "셰프 스토리",
    difficulty: 4,
    readingTime: 10,
    chefAge: 42,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
    tags: ["최현석", "혁신", "한식", "전통", "창의성"],
    summary: "전통 한식에 현대적 해석을 더하며 독자적인 요리 세계를 구축한 최현석 셰프. 끊임없는 도전과 실험 정신으로 한국 요리의 새로운 가능성을 제시합니다.",
    
    content: {
      intro: "\"전통을 파괴하는 것이 아니라, 전통에 새로운 생명을 불어넣는 것입니다.\" 최현석 셰프의 요리는 기존의 틀을 과감히 벗어나지만, 그 속에는 한국 요리에 대한 깊은 애정이 담겨있다. 혁신과 전통 사이에서 균형을 찾아가는 그의 요리 철학을 들어보자.",
      
      philosophy: [
        { 
          title: "창의성", 
          content: "기존의 고정관념을 깨고 새로운 시도를 두려워하지 않는 용기",
          detail: "요리는 예술이에요. 예술가가 새로운 작품을 만들듯, 셰프도 새로운 맛을 창조해야 합니다."
        },
        { 
          title: "균형감", 
          content: "전통의 가치를 인정하면서도 현대적 감각을 조화시키는 능력",
          detail: "뿌리를 잊지 않으면서도 시대의 흐름에 맞춰 진화하는 것이 진짜 혁신입니다."
        },
        { 
          title: "도전정신", 
          content: "실패를 두려워하지 않고 끊임없이 새로운 것에 도전하는 자세",
          detail: "실패는 성공의 어머니라고 하잖아요. 도전하지 않으면 발전도 없어요."
        }
      ],
      
      journey: [
        {
          period: "2001-2010",
          title: "요리의 기초 다지기",
          location: "서울, 대한민국",
          content: "호텔 조리과를 졸업하고 여러 레스토랑에서 경험을 쌓았다. 프렌치, 이탈리안, 일식 등 다양한 요리를 접하며 폭넓은 시야를 기를 수 있었다. 이때의 경험이 나중에 창의적인 요리의 바탕이 되었다.",
          highlight: "다양한 요리 장르 경험으로 기초 다지기"
        },
        {
          period: "2010-2016",
          title: "독창적 스타일 개발",
          location: "서울, 대한민국",
          content: "자신만의 레스토랑을 오픈하며 본격적인 창작 활동을 시작했다. 한식의 기본을 지키면서도 서양 요리 기법을 접목한 독특한 스타일을 개발했다. 처음에는 이해받기 어려웠지만 점차 인정받기 시작했다.",
          highlight: "독창적인 퓨전 한식 스타일 확립"
        },
        {
          period: "2016-2020", 
          title: "방송과 대중화",
          location: "전국, 대한민국",
          content: "TV 요리 프로그램에 출연하며 일반 대중에게 알려지기 시작했다. 어려워 보이는 요리를 쉽고 재미있게 설명하는 능력으로 많은 사랑을 받았다. 요리의 대중화에 큰 기여를 했다.",
          highlight: "TV를 통한 창의적 요리 대중화"
        },
        {
          period: "2020-현재",
          title: "글로벌 진출과 지속적 혁신",
          location: "해외 진출",
          content: "해외 진출을 통해 한국 요리의 새로운 가능성을 세계에 알리고 있다. 지속적인 연구와 실험을 통해 더욱 발전된 요리를 선보이고 있다. 젊은 셰프들의 롤모델이 되고 있다.",
          highlight: "글로벌 무대에서 한식 혁신 이끌기"
        }
      ],
      
      wisdom: [
        "전통을 알아야 제대로 혁신할 수 있어요. 기본기가 탄탄해야 창의성이 빛납니다.",
        "요리는 소통이에요. 손님과 소통하고, 재료와 소통하고, 자신과도 소통해야 해요.",
        "실패를 두려워하지 마세요. 실패에서 배우는 것이 성공보다 더 값진 경험입니다.",
        "트렌드를 따라가는 것도 중요하지만, 자신만의 색깔을 잃지 않는 것이 더 중요해요.",
        "요리는 끝이 없는 여행이에요. 매 순간이 새로운 발견의 연속입니다."
      ],

      achievements: [
        { year: "2012", achievement: "서울 미식 레스토랑 오픈" },
        { year: "2016", achievement: "한국 창의 요리 대상 수상" },
        { year: "2018", achievement: "TV 요리 프로그램 메인 셰프 데뷔" },
        { year: "2020", achievement: "요리책 베스트셀러 작가" },
        { year: "2022", achievement: "해외 팝업 레스토랑 성공" },
        { year: "2023", achievement: "젊은 셰프 멘토링 프로그램 운영" }
      ]
    },
    
    viewCount: 14200,
    likeCount: 720,
    bookmarkCount: 280,
    publishedAt: "2024-01-10",
    readingTime: 10
  }
};

export default function CurationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const chefId = parseInt(params.id);
  
  // 해당 ID의 셰프 데이터 가져오기 (없으면 안성재 기본값)
  const curationDetail = chefStories[chefId as keyof typeof chefStories] || chefStories[1];

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
              {curationDetail.readingTime}분 읽기
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              깊이 {curationDetail.difficulty}/5
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              글로벌 셰프
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

        {/* 인트로 */}
        <div className="mb-8 md:mb-12">
          <p className="text-lg leading-relaxed text-gray-700 italic">
            {curationDetail.content.intro}
          </p>
        </div>

        {/* 요리 철학 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            {curationDetail.title.split(',')[0]} 셰프의 요리 철학
          </h2>
          <div className="space-y-6">
            {curationDetail.content.philosophy.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 md:p-6">
                <h3 className="text-lg font-semibold text-primary-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 mb-3 font-medium">
                  {item.content}
                </p>
                <blockquote className="text-gray-600 italic border-l-4 border-primary-200 pl-4">
                  "{item.detail}"
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* 인생 여정 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            셰프의 인생 여정
          </h2>
          <div className="space-y-6 md:space-y-8">
            {curationDetail.content.journey.map((period, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4 md:pl-6">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {period.period}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {period.title}
                  </h3>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {period.location}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-3">
                  {period.content}
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>💫 하이라이트:</strong> {period.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주요 성취 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            주요 성취
          </h2>
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 md:p-6">
            <div className="space-y-3">
              {curationDetail.content.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-primary-600">{achievement.year}</span>
                    <span className="text-gray-700 ml-3">{achievement.achievement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 셰프의 조언 */}
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            후배들에게 전하는 조언
          </h2>
          <div className="bg-primary-50 rounded-lg p-4 md:p-6">
            <div className="space-y-4">
              {curationDetail.content.wisdom.map((wisdom, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 italic">"{wisdom}"</p>
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