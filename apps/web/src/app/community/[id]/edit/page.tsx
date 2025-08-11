'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Bold, Italic, List, Link, Image } from 'lucide-react';

interface PostForm {
  title: string;
  content: string;
  category: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    id: string;
    display_name: string;
  };
}

const categories = [
  { id: 'question', name: '질문', description: '업계 관련 궁금한 점을 물어보세요' },
  { id: 'review', name: '후기', description: '경험담이나 리뷰를 공유하세요' },
  { id: 'free', name: '자유', description: '자유로운 주제로 이야기해보세요' },
  { id: 'job_posting', name: '구인', description: '채용 정보를 공유하세요' }
];

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [form, setForm] = useState<PostForm>({
    title: '',
    content: '',
    category: 'free'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const params = useParams();
  
  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      loadPost();
      checkAuthUser();
    }
  }, [postId]);

  const checkAuthUser = async () => {
    try {
      const { getFirebaseAuth } = await import('../../../../lib/firebase');
      const { auth } = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      setCurrentUserId(currentUser.uid);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      
      const { getFirebaseAuth } = await import('../../../../lib/firebase');
      const { auth } = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(`/api/community/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('게시글을 찾을 수 없습니다.');
        } else {
          setError('게시글을 불러올 수 없습니다.');
        }
        return;
      }

      const data = await response.json();
      const postData = data.data;
      
      setPost(postData);
      setForm({
        title: postData.title,
        content: postData.content,
        category: postData.category
      });

    } catch (error: any) {
      console.error('Post load error:', error);
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (!form.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    
    // 게시글 소유자 확인
    if (!post || !currentUserId || post.author.id !== currentUserId) {
      setError('게시글을 수정할 권한이 없습니다.');
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const { getFirebaseAuth } = await import('../../../../lib/firebase');
      const { auth } = getFirebaseAuth();
      const currentUser = auth?.currentUser;
      
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }

      const token = await currentUser.getIdToken();

      const response = await fetch(`/api/community/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          category: form.category
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '게시글 수정에 실패했습니다.');
      }

      // 게시글 상세 페이지로 이동
      router.push(`/community/${postId}`);

    } catch (error: any) {
      console.error('Post update error:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);
    
    const newText = before + selectedText + after;
    const textBefore = form.content.substring(0, start);
    const textAfter = form.content.substring(end);
    
    setForm(prev => ({
      ...prev,
      content: textBefore + newText + textAfter
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const renderPreview = () => {
    let html = form.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
    
    html = html.replace(/(<li>.*?<\/li>)(<br>)*(<li>.*?<\/li>)/g, '<ul>$1$3</ul>');
    
    return { __html: html };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p className="mt-2 text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 게시글 소유자가 아닌 경우
  if (post && currentUserId && post.author.id !== currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">게시글을 수정할 권한이 없습니다.</p>
          <button 
            onClick={() => router.push(`/community/${postId}`)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            게시글로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">게시글 수정</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <Eye className="h-4 w-4" />
                <span>{preview ? '편집' : '미리보기'}</span>
              </button>
              
              <button
                type="submit"
                form="edit-post-form"
                disabled={saving}
                className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? '저장 중...' : '저장'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form id="edit-post-form" onSubmit={handleSubmit} className="space-y-6">
          {/* 카테고리 선택 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리 선택</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    form.category === category.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={form.category === category.id}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{category.description}</div>
                </label>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="게시글 제목을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              maxLength={100}
            />
            <div className="mt-2 text-sm text-gray-500 text-right">
              {form.title.length}/100
            </div>
          </div>

          {/* 내용 입력 */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* 에디터 툴바 */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="굵게"
                >
                  <Bold className="h-4 w-4" />
                </button>
                
                <button
                  type="button"
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="기울임"
                >
                  <Italic className="h-4 w-4" />
                </button>
                
                <button
                  type="button"
                  onClick={() => insertMarkdown('- ', '')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="목록"
                >
                  <List className="h-4 w-4" />
                </button>
                
                <button
                  type="button"
                  onClick={() => insertMarkdown('[링크텍스트](', ')')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  title="링크"
                >
                  <Link className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 에디터 영역 */}
            <div className="p-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              
              {preview ? (
                <div className="min-h-[300px] p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={renderPreview()}
                  />
                </div>
              ) : (
                <textarea
                  ref={contentRef}
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="내용을 입력하세요...

팁: 마크다운 문법을 사용할 수 있습니다.
- **굵게** 또는 *기울임*
- - 목록 아이템
- [링크텍스트](URL)"
                  className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}