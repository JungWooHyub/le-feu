'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Heart, Bookmark, MessageSquare, Send, MoreVertical, Reply, Edit, Trash2, Flag } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  bookmark_count: number;
  is_pinned: boolean;
  is_liked: boolean;
  is_bookmarked: boolean;
  created_at: string;
  author: {
    id: string;
    display_name: string;
    avatar_url?: string;
    role: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  is_edited: boolean;
  parent_id?: string;
  author: {
    id: string;
    display_name: string;
    avatar_url?: string;
    role: string;
  };
  replies?: Comment[];
  like_count: number;
  is_liked: boolean;
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      loadPost();
      loadComments();
      checkAuthUser();
    }
  }, [postId]);

  // Supabase Realtime 구독 (실시간 댓글)
  useEffect(() => {
    if (!postId) return;

    let subscription: any;
    
    const setupRealtimeSubscription = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        subscription = supabase
          .channel(`comments_${postId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`
          }, (payload) => {
            console.log('Real-time comment update:', payload);
            // 댓글 목록 새로고침
            loadComments();
          })
          .subscribe();
      } catch (error) {
        console.error('Realtime subscription error:', error);
      }
    };

    setupRealtimeSubscription();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [postId]);

  const checkAuthUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.data.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/community/${postId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('게시글을 불러올 수 없습니다.');
      }

      const data = await response.json();
      setPost(data.data);

    } catch (error: any) {
      console.error('Post load error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/community/${postId}/comments`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }

    } catch (error) {
      console.error('Comments load error:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || !currentUserId) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/community/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPost(prev => prev ? {
          ...prev,
          is_liked: !prev.is_liked,
          like_count: prev.is_liked ? prev.like_count - 1 : prev.like_count + 1
        } : null);
      }

    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleBookmark = async () => {
    if (!post || !currentUserId) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/community/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPost(prev => prev ? {
          ...prev,
          is_bookmarked: !prev.is_bookmarked,
          bookmark_count: prev.is_bookmarked ? prev.bookmark_count - 1 : prev.bookmark_count + 1
        } : null);
      }

    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/community/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment.trim()
        })
      });

      if (response.ok) {
        setNewComment('');
        // Realtime으로 자동 업데이트되므로 수동 reload 불필요
      } else {
        throw new Error('댓글 작성에 실패했습니다.');
      }

    } catch (error: any) {
      console.error('Comment submit error:', error);
      alert(error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/community/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          parent_id: parentId
        })
      });

      if (response.ok) {
        setReplyContent('');
        setReplyingTo(null);
      } else {
        throw new Error('답글 작성에 실패했습니다.');
      }

    } catch (error: any) {
      console.error('Reply submit error:', error);
      alert(error.message);
    } finally {
      setSubmittingComment(false);
    }
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

  const renderMarkdown = (content: string) => {
    const html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');
    
    return { __html: html };
  };

  const handleCommentAction = (action: string, commentId: string) => {
    switch (action) {
      case 'edit':
        const comment = comments.find(c => c.id === commentId);
        if (comment && comment.author.id === currentUserId) {
          setEditingComment(commentId);
          setEditContent(comment.content);
        }
        break;
      case 'delete':
        if (confirm('댓글을 삭제하시겠습니까?')) {
          deleteComment(commentId);
        }
        break;
      case 'report':
        alert('신고 기능은 곧 추가될 예정입니다.');
        break;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`/api/community/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('댓글 삭제에 실패했습니다.');
      }

    } catch (error: any) {
      console.error('Comment delete error:', error);
      alert(error.message);
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* 아바타 */}
        <div className="flex-shrink-0">
          {comment.author.avatar_url ? (
            <img
              src={comment.author.avatar_url}
              alt={comment.author.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-xs">
                {comment.author.display_name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* 댓글 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{comment.author.display_name}</span>
              <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
              {comment.is_edited && (
                <span className="text-xs text-gray-400">(편집됨)</span>
              )}
            </div>

            {/* 댓글 메뉴 */}
            <div className="relative">
              <button
                className="p-1 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  // 간단한 액션 메뉴 (실제로는 dropdown 구현)
                  const actions = [];
                  if (comment.author.id === currentUserId) {
                    actions.push('edit', 'delete');
                  } else {
                    actions.push('report');
                  }
                  
                  const action = prompt(`액션을 선택하세요: ${actions.join(', ')}`);
                  if (action && actions.includes(action)) {
                    handleCommentAction(action, comment.id);
                  }
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 댓글 내용 */}
          <div className="mt-1">
            {editingComment === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      // 댓글 수정 API 호출
                      try {
                        const token = localStorage.getItem('auth_token');
                        const response = await fetch(`/api/community/${postId}/comments/${comment.id}`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ content: editContent })
                        });

                        if (response.ok) {
                          setEditingComment(null);
                          setEditContent('');
                        }
                      } catch (error) {
                        console.error('Comment edit error:', error);
                      }
                    }}
                    className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={renderMarkdown(comment.content)}
              />
            )}
          </div>

          {/* 댓글 액션 */}
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={() => {
                // 댓글 좋아요 기능 (구현 생략)
              }}
              className={`flex items-center space-x-1 text-sm ${
                comment.is_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${comment.is_liked ? 'fill-current' : ''}`} />
              <span>{comment.like_count}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(comment.id);
                  setTimeout(() => replyInputRef.current?.focus(), 100);
                }}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Reply className="h-4 w-4" />
                <span>답글</span>
              </button>
            )}
          </div>

          {/* 답글 입력 */}
          {replyingTo === comment.id && (
            <div className="mt-4 space-y-3">
              <textarea
                ref={replyInputRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 입력하세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  취소
                </button>
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim() || submittingComment}
                  className="flex items-center space-x-1 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  <span>답글 작성</span>
                </button>
              </div>
            </div>
          )}

          {/* 답글 목록 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{error || '게시글을 찾을 수 없습니다.'}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">게시글</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 게시글 내용 */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            {/* 게시글 헤더 */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                {post.author.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.display_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-primary-600 font-semibold">
                    {post.author.display_name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{post.author.display_name}</div>
                <div className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</div>
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

            {/* 내용 */}
            <div
              className="prose max-w-none text-gray-700 mb-6"
              dangerouslySetInnerHTML={renderMarkdown(post.content)}
            />

            {/* 게시글 액션 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 ${
                    post.is_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${post.is_liked ? 'fill-current' : ''}`} />
                  <span>{post.like_count}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 ${
                    post.is_bookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <Bookmark className={`h-5 w-5 ${post.is_bookmarked ? 'fill-current' : ''}`} />
                  <span>{post.bookmark_count}</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageSquare className="h-5 w-5" />
                  <span>{post.comment_count}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                조회 {post.view_count}
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              댓글 {comments.length}개
            </h3>

            {/* 댓글 작성 */}
            {currentUserId && (
              <div className="mb-6 space-y-3">
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    마크다운 문법을 사용할 수 있습니다.
                  </div>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submittingComment ? '작성 중...' : '댓글 작성'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 댓글 목록 */}
            <div className="space-y-6">
              {commentsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                  <p className="mt-2 text-gray-600">댓글을 불러오는 중...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">첫 번째 댓글을 작성해보세요!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 