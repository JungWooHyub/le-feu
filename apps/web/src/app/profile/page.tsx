'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Edit3, Save, Camera, MapPin, Briefcase, Clock, Mail, 
  Phone, ChefHat, Users, Building, Crown, GraduationCap, X,
  Plus, CheckCircle, Calendar, Award, Star
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthContext';

type UserRole = 'chef' | 'helper' | 'manager' | 'owner' | 'student';
type BusinessType = 'restaurant' | 'cafe' | 'bakery' | 'bar' | 'hotel' | 'catering' | 'food_truck' | 'others';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  bio: string;
  role: UserRole;
  business_type?: BusinessType;
  specialties: string[];
  location: {
    city: string;
    district: string;
  };
  experience_years: number;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// 역할별 설정
const roleConfig = {
  chef: {
    name: '셰프',
    icon: ChefHat,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  helper: {
    name: '헬퍼/어시스턴트',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  manager: {
    name: '매니저',
    icon: Building,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  owner: {
    name: '사업주/점주',
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  student: {
    name: '학생/지망생',
    icon: GraduationCap,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  }
};

const businessTypeLabels = {
  restaurant: '레스토랑',
  cafe: '카페',
  bakery: '베이커리',
  bar: '바/펍',
  hotel: '호텔',
  catering: '케이터링',
  food_truck: '푸드트럭',
  others: '기타'
};

const experienceLabels = {
  0: '신입',
  1: '1년',
  2: '2년',
  3: '3년',
  5: '5년',
  10: '10년 이상'
};

const cityOptions = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', 
  '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', 
  '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', 
  '제주특별자치도'
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [editForm, setEditForm] = useState({
    nickname: '',
    bio: '',
    business_type: '' as BusinessType | '',
    specialties: [] as string[],
    location: {
      city: '',
      district: ''
    },
    experience_years: 0
  });

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        loadProfile();
      }
    }
  }, [user, authLoading]);

  const loadProfile = async () => {
    try {
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('프로필을 불러올 수 없습니다.');
      }

      const data = await response.json();
      setProfile(data.data);
      
      // 편집 폼 초기화
      setEditForm({
        nickname: data.data.nickname || '',
        bio: data.data.bio || '',
        business_type: data.data.business_type || '',
        specialties: data.data.specialties || [],
        location: data.data.location || { city: '', district: '' },
        experience_years: data.data.experience_years || 0
      });

    } catch (err: any) {
      console.error('Profile load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setMessage('');
  };

  const handleCancel = () => {
    setEditing(false);
    // 폼을 원래 데이터로 리셋
    if (profile) {
      setEditForm({
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        business_type: profile.business_type || '',
        specialties: profile.specialties || [],
        location: profile.location || { city: '', district: '' },
        experience_years: profile.experience_years || 0
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      if (!user) return;

      const token = await user.getIdToken();
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '프로필 업데이트에 실패했습니다.');
      }

      const data = await response.json();
      setProfile(data.data);
      setEditing(false);
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
      
      setTimeout(() => setMessage(''), 3000);

    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSpecialtyAdd = (specialty: string) => {
    if (specialty && !editForm.specialties.includes(specialty)) {
      setEditForm(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const handleSpecialtyRemove = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로필을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const roleInfo = roleConfig[profile.role];
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RoleIcon className={`h-8 w-8 ${roleInfo.color}`} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
                <p className="text-sm text-gray-600">{roleInfo.name}으로 활동 중</p>
              </div>
            </div>
            {!editing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>프로필 편집</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? '저장 중...' : '저장'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 알림 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 프로필 카드 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              {/* 프로필 헤더 */}
              <div className="flex items-start space-x-6 mb-8">
                {/* 아바타 */}
                <div className="relative">
                  <div className={`w-24 h-24 ${roleInfo.bgColor} ${roleInfo.borderColor} border-2 rounded-full flex items-center justify-center`}>
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.nickname}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <RoleIcon className={`h-12 w-12 ${roleInfo.color}`} />
                    )}
                  </div>
                  {editing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* 기본 정보 */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editing ? (
                        <input
                          type="text"
                          value={editForm.nickname}
                          onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                          className="text-2xl font-bold border-b-2 border-primary-200 focus:border-primary-500 outline-none bg-transparent"
                          placeholder="닉네임"
                        />
                      ) : (
                        profile.nickname
                      )}
                    </h2>
                    {profile.is_verified && (
                      <span className="flex items-center text-blue-600">
                        <CheckCircle className="h-5 w-5" />
                      </span>
                    )}
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleInfo.bgColor} ${roleInfo.color} ${roleInfo.borderColor} border`}>
                    <RoleIcon className="h-4 w-4 mr-2" />
                    {roleInfo.name}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatJoinDate(profile.created_at)}에 가입</span>
                    </div>

                    {profile.location.city && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {editing ? (
                            <div className="flex space-x-2">
                              <select
                                value={editForm.location.city}
                                onChange={(e) => setEditForm(prev => ({ 
                                  ...prev, 
                                  location: { ...prev.location, city: e.target.value } 
                                }))}
                                className="text-sm border rounded px-2 py-1"
                              >
                                <option value="">지역 선택</option>
                                {cityOptions.map(city => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={editForm.location.district}
                                onChange={(e) => setEditForm(prev => ({ 
                                  ...prev, 
                                  location: { ...prev.location, district: e.target.value } 
                                }))}
                                className="text-sm border rounded px-2 py-1"
                                placeholder="구/군"
                              />
                            </div>
                          ) : (
                            `${profile.location.city} ${profile.location.district}`.trim()
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        경력 {editing ? (
                          <select
                            value={editForm.experience_years}
                            onChange={(e) => setEditForm(prev => ({ 
                              ...prev, 
                              experience_years: parseInt(e.target.value) 
                            }))}
                            className="border rounded px-2 py-1 ml-1"
                          >
                            {Object.entries(experienceLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        ) : (
                          experienceLabels[profile.experience_years as keyof typeof experienceLabels]
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 자기소개 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">자기소개</h3>
                {editing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    placeholder="자신을 소개하는 글을 작성해주세요..."
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">
                    {profile.bio || '아직 자기소개가 작성되지 않았습니다.'}
                  </p>
                )}
              </div>

              {/* 전문 분야 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">전문 분야</h3>
                <div className="flex flex-wrap gap-2">
                  {editing ? (
                    <>
                      {editForm.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
                        >
                          {specialty}
                          <button
                            onClick={() => handleSpecialtyRemove(index)}
                            className="ml-2 h-4 w-4 text-primary-500 hover:text-primary-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => {
                          const specialty = prompt('전문 분야를 입력하세요:');
                          if (specialty) handleSpecialtyAdd(specialty);
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        추가
                      </button>
                    </>
                  ) : (
                    profile.specialties.length > 0 ? (
                      profile.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
                        >
                          {specialty}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">전문 분야가 설정되지 않았습니다.</p>
                    )
                  )}
                </div>
              </div>

              {/* 업종 (사업주인 경우) */}
              {profile.role === 'owner' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">업종</h3>
                  {editing ? (
                    <select
                      value={editForm.business_type}
                      onChange={(e) => setEditForm(prev => ({ 
                        ...prev, 
                        business_type: e.target.value as BusinessType 
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">업종 선택</option>
                      {Object.entries(businessTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-700">
                      {profile.business_type ? businessTypeLabels[profile.business_type] : '업종이 설정되지 않았습니다.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 활동 통계 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">게시글</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">댓글</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">북마크</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </div>

            {/* 뱃지 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">뱃지</h3>
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">아직 획득한 뱃지가 없습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 