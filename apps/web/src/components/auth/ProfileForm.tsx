'use client';

import { useState } from 'react';
import { 
  User, MapPin, Briefcase, Clock, Coffee, ChefHat, 
  Building, Camera, Edit3, CheckCircle 
} from 'lucide-react';

type UserRole = 'chef' | 'helper' | 'manager' | 'owner' | 'student';

type BusinessType = 'restaurant' | 'cafe' | 'bakery' | 'bar' | 'hotel' | 'catering' | 'food_truck' | 'others';

interface ProfileData {
  nickname: string;
  bio: string;
  businessType?: BusinessType;
  specialties: string[];
  location: {
    city: string;
    district: string;
  };
  experienceYears: number;
}

interface ProfileFormProps {
  role: UserRole;
  initialData?: Partial<ProfileData>;
  onSubmit: (data: ProfileData) => void;
  onSkip?: () => void;
  loading?: boolean;
}

const businessTypeOptions: { value: BusinessType; label: string }[] = [
  { value: 'restaurant', label: '레스토랑' },
  { value: 'cafe', label: '카페' },
  { value: 'bakery', label: '베이커리' },
  { value: 'bar', label: '바/펍' },
  { value: 'hotel', label: '호텔' },
  { value: 'catering', label: '케이터링' },
  { value: 'food_truck', label: '푸드트럭' },
  { value: 'others', label: '기타' }
];

const specialtyOptions: { [key in UserRole]: string[] } = {
  chef: ['한식', '양식', '중식', '일식', '이탈리안', '프렌치', '베이킹', '디저트', '바리스타'],
  helper: ['주방보조', '홀서빙', '정리정돈', '재료준비', '설거지', '청소'],
  manager: ['매장관리', '직원관리', '재고관리', '고객응대', '마케팅', '회계'],
  owner: ['운영관리', '메뉴개발', '마케팅', '인사관리', '재무관리', '고객관리'],
  student: ['요리학교', '호텔경영', '제과제빵', '바리스타', '소믈리에', '영양사']
};

const cityOptions = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', 
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', 
  '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', 
  '제주특별자치도'
];

export const ProfileForm = ({ 
  role, 
  initialData = {}, 
  onSubmit, 
  onSkip, 
  loading = false 
}: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileData>({
    nickname: initialData.nickname || '',
    bio: initialData.bio || '',
    businessType: initialData.businessType,
    specialties: initialData.specialties || [],
    location: {
      city: initialData.location?.city || '',
      district: initialData.location?.district || ''
    },
    experienceYears: initialData.experienceYears || 0
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다.';
    }

    if (formData.specialties.length === 0) {
      newErrors.specialties = '최소 1개의 전문 분야를 선택해주세요.';
    }

    if (!formData.location.city) {
      newErrors.city = '지역을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const getRoleTitle = (role: UserRole): string => {
    const titles: { [key in UserRole]: string } = {
      chef: '셰프',
      helper: '헬퍼',
      manager: '매니저',
      owner: '사업주',
      student: '학생/지망생'
    };
    return titles[role];
  };

  const getRoleDescription = (role: UserRole): string => {
    const descriptions: { [key in UserRole]: string } = {
      chef: '요리 전문가로서 활동하시는군요! 전문 분야와 경력을 알려주세요.',
      helper: '주방 보조 업무를 담당하시는군요! 관심 분야를 알려주세요.',
      manager: '매장 관리를 담당하시는군요! 관리 영역을 알려주세요.',
      owner: '사업을 운영하시는군요! 업종과 전문 분야를 알려주세요.',
      student: '업계 진입을 준비하시는군요! 관심 분야를 알려주세요.'
    };
    return descriptions[role];
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <User className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          프로필 설정
        </h2>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold text-primary-600">{getRoleTitle(role)}</span>로 선택하셨네요!
        </p>
        <p className="text-sm text-gray-500">
          {getRoleDescription(role)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 닉네임 */}
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            닉네임 *
          </label>
          <div className="relative">
            <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="nickname"
              type="text"
              required
              className={`appearance-none relative block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                errors.nickname ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="다른 사용자들에게 보여질 닉네임"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            />
          </div>
          {errors.nickname && (
            <p className="mt-1 text-xs text-red-600">{errors.nickname}</p>
          )}
        </div>

        {/* 자기소개 */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            자기소개
          </label>
          <textarea
            id="bio"
            rows={3}
            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="자신을 소개하는 간단한 문구를 작성해주세요"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          />
        </div>

        {/* 사업주인 경우 업종 선택 */}
        {role === 'owner' && (
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
              업종
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="businessType"
                className="appearance-none relative block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.businessType || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  businessType: e.target.value as BusinessType || undefined 
                }))}
              >
                <option value="">업종을 선택해주세요</option>
                {businessTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 전문 분야 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전문 분야 *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {specialtyOptions[role].map(specialty => (
              <button
                key={specialty}
                type="button"
                onClick={() => handleSpecialtyToggle(specialty)}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.specialties.includes(specialty)
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                    : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {formData.specialties.includes(specialty) && (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {specialty}
              </button>
            ))}
          </div>
          {errors.specialties && (
            <p className="mt-1 text-xs text-red-600">{errors.specialties}</p>
          )}
        </div>

        {/* 지역 정보 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              지역 *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="city"
                className={`appearance-none relative block w-full pl-10 pr-8 py-3 border rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.location.city}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, city: e.target.value } 
                }))}
              >
                <option value="">지역 선택</option>
                {cityOptions.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            {errors.city && (
              <p className="mt-1 text-xs text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
              구/군
            </label>
            <input
              id="district"
              type="text"
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="구/군 입력"
              value={formData.location.district}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                location: { ...prev.location, district: e.target.value } 
              }))}
            />
          </div>
        </div>

        {/* 경력 */}
        <div>
          <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-2">
            경력
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              id="experienceYears"
              className="appearance-none relative block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={formData.experienceYears}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                experienceYears: parseInt(e.target.value) 
              }))}
            >
              <option value={0}>신입 (경력 없음)</option>
              <option value={1}>1년</option>
              <option value={2}>2년</option>
              <option value={3}>3년</option>
              <option value={5}>5년</option>
              <option value={10}>10년 이상</option>
            </select>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex space-x-4 pt-6">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              나중에 하기
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '저장 중...' : '프로필 완성'}
          </button>
        </div>
      </form>
    </div>
  );
}; 