'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageSquare, Heart, Eye, Clock, Users, Briefcase, HelpCircle, Star, Plus } from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url?: string;
    role: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const categories = [
  { id: 'all', name: '전체', icon: Users, color: 'text-gray-600' },
  { id: 'question', name: '질문', icon: HelpCircle, color: 'text-blue-600' },
  { id: 'review', name: '후기', icon: Star, color: 'text-yellow-600' },
  { id: 'free', name: '자유', icon: MessageSquare, color: 'text-green-600' },
  { id: 'job_posting', name: '구인', icon: Briefcase, color: 'text-purple-600' }
];

const sortOptions = [
  { id: 'latest', name: '최신순' },
  { id: 'popular', name: '인기순' },
  { id: 'oldest', name: '오래된순' }
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'latest';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadPosts();
  }, [currentCategory, currentSort, currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15',
        sort: currentSort
      });
      
      if (currentCategory !== 'all') {
        params.set('category', currentCategory);
      }

      const response = await fetch(`/api/community?${params}`);
      
      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }

      const data = await response.json();
      setPosts(data.data || []);
      setPagination(data.pagination);

    } catch (error) {
      console.error('Posts load error:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const newParams = new URLSearchParams();
    if (categoryId !== 'all') {
      newParams.set('category', categoryId);
    }
    if (currentSort !== 'latest') {
      newParams.set('sort', currentSort);
    }
    
    router.push(`/community?${newParams.toString()}`);
  };

  const handleSortChange = (sortId: string) => {
    const newParams = new URLSearchParams();
    if (currentCategory !== 'all') {
      newParams.set('category', currentCategory);
    }
    if (sortId !== 'latest') {
      newParams.set('sort', sortId);
    }
    
    router.push(`/community?${newParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams();
    if (currentCategory !== 'all') {
      newParams.set('category', currentCategory);
    }
    if (currentSort !== 'latest') {
      newParams.set('sort', currentSort);
    }
    if (page !== 1) {
      newParams.set('page', page.toString());
    }
    
    router.push(`/community?${newParams.toString()}`);
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = categories.find(c => c.id === category);
    return categoryInfo?.color || 'text-gray-600';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return date.toLocaleDateString();
  };

  const handleCreatePost = () => {
    // 로그인 확인
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }
    
    router.push('/community/create');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
              <p className="mt-1 text-gray-600">셰프들과 업계 이야기를 나누어 보세요</p>
            </div>
            <button
              onClick={handleCreatePost}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>글쓰기</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 카테고리 탭 */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap border-b">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = currentCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-primary-600' : category.color}`} />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* 정렬 옵션 */}
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-600">
              총 <span className="font-semibold text-gray-900">{pagination.total}</span>개의 게시글
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">정렬:</span>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 text-gray-600">게시글을 불러오는 중...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">아직 게시글이 없습니다.</p>
              <button
                onClick={handleCreatePost}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                첫 번째 게시글 작성하기
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                    post.is_pinned ? 'bg-yellow-50 border-l-4 border-l-yellow-400' : ''
                  }`}
                  onClick={() => router.push(`/community/${post.id}`)}
                >
                  <div className="flex items-start space-x-4">
                    {/* 작성자 아바타 */}
                    <div className="flex-shrink-0">
                      {post.author.avatar_url ? (
                        <img
                          src={post.author.avatar_url}
                          alt={post.author.display_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {post.author.display_name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 게시글 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.is_pinned && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            📌 고정
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)} bg-gray-100`}>
                          {categories.find(c => c.id === post.category)?.name || post.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="font-medium text-gray-700">{post.author.display_name}</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTimeAgo(post.created_at)}</span>
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.view_count}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.like_count}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comment_count}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {!loading && posts.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            {/* 페이지 번호 */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNum === currentPage
                        ? 'text-primary-600 bg-primary-50 border border-primary-300'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 