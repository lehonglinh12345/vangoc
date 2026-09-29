import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Loader2, MessageSquare, Send } from 'lucide-react';
import { Comment, User } from '../types';
import { addCommentToFirestore, subscribeToComments } from '../services/db';

interface CommentsSectionProps {
  projectId?: string;
  user?: User | null;
  setAuthModalOpen?: (open: boolean) => void;
  showLoginPrompt?: boolean;
  showCommentForm?: boolean;
  showHeader?: boolean;
  className?: string;
  variant?: 'showcase' | 'full';
  maxComments?: number;
}

// 5 bình luận khán giả chính xác theo yêu cầu
const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c_tuananhday2999',
    project_id: 'project-1',
    user_id: 'u_tuananhday2999',
    user_name: '@tuananhday2999',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=tuananh&backgroundColor=e0e7ff',
    content: 'Phim rất hay và ý nghĩa. Nó đã truyền cảm hứng cho em rất nhiều. Mong video sẽ sớm viral và chúc kênh mình ngày càng lớn mạnh ạ…',
    created_at: '6 ngày trước',
    likes: 3,
    user_reacted: false,
  },
  {
    id: 'c_windymai_1',
    project_id: 'project-1',
    user_id: 'u_windymai107',
    user_name: '@windymai107',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=windymai&backgroundColor=ffd5dc',
    content: 'T ấn tượng vs đoạn cuối khi phim đề cập đến mấy concert của mấy show anh trai vs nghệ sĩ hiện tại ở ngoài đời á, tạo cảm giác phim bắt kịp xu hướng của giới trẻ, sáng tạo, lồng ghép trong phim cx phù hợp',
    created_at: '6 ngày trước',
    is_edited: true,
    likes: 11,
    user_reacted: false,
  },
  {
    id: 'c_thedaftpoetz',
    project_id: 'project-1',
    user_id: 'u_thedaftpoetz',
    user_name: '@thedaftpoetz',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=thedaftpoetz&backgroundColor=d1fae5',
    content: 'tr ơi đáng yêu quáaa, dự án rất xịn và chỉnh chu luôn ạ.',
    created_at: '6 ngày trước',
    likes: 8,
    user_reacted: false,
  },
  {
    id: 'c_diem10cungbe',
    project_id: 'project-1',
    user_id: 'u_diem10cungbe',
    user_name: '@diem10cungbe',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=diem10&backgroundColor=fef3c7',
    content: 'Tâm huyết quá team ơi',
    created_at: '3 ngày trước',
    likes: 2,
    user_reacted: false,
  },
  {
    id: 'c_kaijune',
    project_id: 'project-1',
    user_id: 'u_kaijune',
    user_name: '@Kaijune-h5',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=kaijune&backgroundColor=e0f2fe',
    content: 'Làm nhớ cả bầu trời tuổi thơ phim hoạt hình Việt',
    created_at: '4 ngày trước',
    likes: 1,
    user_reacted: false,
  }
];

export default function CommentsSection({
  projectId = 'project-1',
  user,
  setAuthModalOpen,
  showLoginPrompt = true,
  showCommentForm = true,
  showHeader = true,
  className = '',
  maxComments = 5,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(() =>
    INITIAL_COMMENTS.filter((comment) => comment.project_id === projectId)
  );
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const sampleComments = INITIAL_COMMENTS.filter(
      (comment) => comment.project_id === projectId
    );
    setComments(sampleComments);

    return subscribeToComments(projectId, (savedComments) => {
      setComments([...savedComments, ...sampleComments]);
    });
  }, [projectId]);

  // Liked comments storage
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_liked_comments');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Like comment
  const handleLikeComment = (commentId: string) => {
    const isLiked = likedCommentIds.includes(commentId);
    const newLiked = isLiked
      ? likedCommentIds.filter((id) => id !== commentId)
      : [...likedCommentIds, commentId];

    setLikedCommentIds(newLiked);
    localStorage.setItem('3covangoc_liked_comments', JSON.stringify(newLiked));

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
            user_reacted: !isLiked,
          };
        }
        return c;
      })
    );
  };

  const handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentText.trim();
    if (!user || !content || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await addCommentToFirestore(projectId, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
      });
      setCommentText('');
    } catch {
      setSubmitError('Chưa gửi được bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedComments = comments.slice(0, maxComments);

  return (
    <div className={`w-full max-w-4xl ${className}`}>
      {showHeader && (
        <div className="mb-6 flex items-center gap-2">
          <MessageSquare size={18} className="text-studio-gold" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            Bình luận
          </h2>
          <span className="text-xs text-neutral-500">({comments.length})</span>
        </div>
      )}

      {showCommentForm && (user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <label htmlFor={`comment-${projectId}`} className="sr-only">
            Viết bình luận
          </label>
          <textarea
            id={`comment-${projectId}`}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Chia sẻ cảm nhận của bạn về dự án..."
            className="w-full resize-y rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-sm text-white placeholder:text-neutral-500 focus:border-studio-gold/60 focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-neutral-500">
              {commentText.length}/1000
            </span>
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-studio-red px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-studio-wine disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
          </div>
          {submitError && (
            <p role="alert" className="mt-2 text-sm text-red-400">
              {submitError}
            </p>
          )}
        </form>
      ) : showLoginPrompt ? (
        <button
          type="button"
          onClick={() => setAuthModalOpen?.(true)}
          className="mb-6 w-full rounded-xl border border-white/10 bg-neutral-900/70 p-4 text-left text-sm text-neutral-300 transition-colors hover:border-studio-gold/40 hover:text-white"
        >
          Đăng nhập để viết bình luận.
        </button>
      ) : null)}

      <div className="space-y-4">
        {displayedComments.map((comment, index) => {
          const isLiked = likedCommentIds.includes(comment.id) || comment.user_reacted;

          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-studio-gold/30 bg-neutral-900/60 hover:bg-neutral-900/80 transition-all duration-300"
            >
              {/* Header: User Info & Heart button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/15 bg-white/10">
                    <img
                      src={comment.user_avatar}
                      alt={comment.user_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">
                      {comment.user_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {comment.created_at}
                      </span>
                      {comment.is_edited && (
                        <span className="text-[11px] text-neutral-500 italic">
                          (Đã chỉnh sửa)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nút thả tim / thích */}
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer border ${isLiked
                    ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                    }`}
                  title={isLiked ? 'Bỏ thích' : 'Thích bình luận'}
                >
                  <Heart
                    size={14}
                    className={`transition-all duration-300 ${isLiked
                      ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                      : 'text-neutral-400'
                      }`}
                  />
                  <span className={isLiked ? 'text-red-300 font-bold' : ''}>
                    {comment.likes}
                  </span>
                </button>
              </div>

              {/* Nội dung bình luận */}
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light pl-0 sm:pl-13 pt-3">
                {comment.content}
              </p>
            </motion.div>
          );
        })}
        {displayedComments.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-neutral-900/50 p-5 text-sm text-neutral-400">
            Chưa có bình luận nào. Hãy chia sẻ cảm nhận đầu tiên.
          </p>
        )}
      </div>
    </div>
  );
}
