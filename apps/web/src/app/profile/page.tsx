'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Edit3, Crown, Building } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: 'user' | 'employer' | 'curator';
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
  experience_level?: 'beginner' | 'intermediate' | 'experienced' | 'expert';
  specialties?: string[];
  company_name?: string;
  is_verified: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

const roleLabels = {
  user: '일반 사용자',
  employer: '사업주',
  curator: '큐레이터'
};

const roleIcons = {
  user: User,
  employer: Building,
  curator: Crown
};

const experienceLabels = {
  beginner: '초급 (1년 미만)',
  intermediate: '중급 (1-3년)',
  experienced: '고급 (3-5년)',
  expert: '전문가 (5년 이상)'
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [editForm, setEditForm] = useState({
    display_name: '',
    phone: '',
    location: '',
    bio: '',
    experience_level: 'beginner' as const,
    specialties: [] as string[],
    company_name: ''
  });

  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

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
        display_name: data.data.display_name || '',
        phone: data.data.phone || '',
        location: data.data.location || '',
        bio: data.data.bio || '',
        experience_level: data.data.experience_level || 'beginner',
        specialties: data.data.specialties || [],
        company_name: data.data.company_name || ''
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
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        experience_level: profile.experience_level || 'beginner',
        specialties: profile.specialties || [],
        company_name: profile.company_name || ''
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          display_name: editForm.display_name,
          phone: editForm.phone,
          location: editForm.location,
          bio: editForm.bio,
          experience_level: editForm.experience_level,
          specialties: editForm.specialties,
          company_name: editForm.company_name
        })
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">프로필을 찾을 수 없습니다.</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const RoleIcon = roleIcons[profile.role];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
            {!editing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Edit3 className="h-4 w-4" />
                <span>편집</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
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
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* 프로필 카드 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* 프로필 헤더 */}
          <div className="flex items-start space-x-6 mb-8">
            {/* 아바타 */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary-500" />
                )}
              </div>
              {editing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    <input
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile.display_name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <RoleIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{roleLabels[profile.role]}</span>
                    {profile.is_verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ 인증됨
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{profile.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 연락처 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="010-1234-5678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{profile.phone || '등록되지 않음'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="서울특별시 강남구"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{profile.location || '등록되지 않음'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 전문 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">전문 정보</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">경력 수준</label>
                  {editing ? (
                    <select
                      value={editForm.experience_level}
                      onChange={(e) => setEditForm(prev => ({ ...prev, experience_level: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      {Object.entries(experienceLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {experienceLabels[profile.experience_level || 'beginner']}
                      </span>
                    </div>
                  )}
                </div>

                {profile.role === 'employer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.company_name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="회사명을 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{profile.company_name || '등록되지 않음'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 자기소개 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">자기소개</h3>
            {editing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="자신을 소개해보세요..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">
                {profile.bio || '아직 자기소개가 등록되지 않았습니다.'}
              </p>
            )}
          </div>

          {/* 전문 분야 (일반 사용자/큐레이터용) */}
          {(profile.role === 'user' || profile.role === 'curator') && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">전문 분야</h3>
              {editing ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {editForm.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {specialty}
                        <button
                          onClick={() => handleSpecialtyRemove(index)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="전문 분야 추가 (예: 한식, 양식, 디저트)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          handleSpecialtyAdd(input.value.trim());
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                        handleSpecialtyAdd(input.value.trim());
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      추가
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.specialties && profile.specialties.length > 0 ? (
                    profile.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">등록된 전문 분야가 없습니다.</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 계정 정보 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">가입일:</span> {new Date(profile.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">최근 업데이트:</span> {new Date(profile.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 