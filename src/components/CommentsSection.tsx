import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Loader2,
  MessageSquare,
  Send,
  CornerDownRight,
  Trash2,
  Sparkles,
  User as UserIcon,
  LogIn,
  Check,
  Flame,
  ArrowUpDown
} from 'lucide-react';
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

// Bình luận mẫu chân thật cho các dự án
const INITIAL_COMMENTS: Comment[] = [
  // project-1: Nhà Có Giỗ
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
  },

  // project-2: Rực Sáng Đêm Thu
  {
    id: 'c_trangmoon99',
    project_id: 'project-2',
    user_id: 'u_trangmoon99',
    user_name: '@trangmoon_99',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=trangmoon&backgroundColor=ffd5dc',
    content: 'Hình ảnh Trung thu lung linh và ấm áp quá ạ! Màu sắc 3D đậm chất truyền thống Việt Nam mà vẫn rất hiện đại ✨🏮',
    created_at: '5 ngày trước',
    likes: 14,
    user_reacted: false,
  },
  {
    id: 'c_namphong_anim',
    project_id: 'project-2',
    user_id: 'u_namphong',
    user_name: '@namphong.anim',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=namphong&backgroundColor=e0f2fe',
    content: 'Âm nhạc và tạo hình bé Vàng Ngọc quá dễ thương, animation chuyển động mượt mà thật sự. Chúc 3COVANGOC luôn giữ vững phong độ!',
    created_at: '4 ngày trước',
    likes: 9,
    user_reacted: false,
  },
  {
    id: 'c_minhduc_cine',
    project_id: 'project-2',
    user_id: 'u_minhduc',
    user_name: '@minhduc_cine',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=minhduc&backgroundColor=fef3c7',
    content: 'Gợi nhớ những đêm rước đèn phá cỗ tuổi thơ. Cảm ơn Studio đã mang lại một tác phẩm nghệ thuật giàu cảm xúc như vậy!',
    created_at: '3 ngày trước',
    likes: 6,
    user_reacted: false,
  }
];

const QUICK_REACTIONS = [
  '❤️ Quá xuất sắc!',
  '🔥 Phim 3D đỉnh cao',
  '👏 Chúc mừng Studio',
  '✨ Rất ý nghĩa',
  '🥺 Xúc động quá'
];

export default function CommentsSection({
  projectId = 'project-1',
  user,
  setAuthModalOpen,
  showLoginPrompt = true,
  showCommentForm = true,
  showHeader = true,
  className = '',
  maxComments,
}: CommentsSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState(() => {
    return localStorage.getItem('3covangoc_guest_name') || '';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [showAllComments, setShowAllComments] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Guest ID generated once per browser
  const [currentGuestId] = useState(() => {
    let gid = localStorage.getItem('3covangoc_guest_id');
    if (!gid) {
      gid = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('3covangoc_guest_id', gid);
    }
    return gid;
  });

  // Track comments in local storage for instant offline / fallback persistence
  const getStoredLocalComments = (): Comment[] => {
    try {
      const raw = localStorage.getItem(`3covangoc_local_comments_${projectId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const [comments, setComments] = useState<Comment[]>(() => {
    const defaultForProject = INITIAL_COMMENTS.filter((c) => c.project_id === projectId);
    const localSaved = getStoredLocalComments();
    const map = new Map<string, Comment>();
    [...localSaved, ...defaultForProject].forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  });

  // Liked comments storage
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_liked_comments');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Track like count adjustments made locally
  const [likeDeltas, setLikeDeltas] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_like_deltas');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Real-time synchronization from Firestore + local fallback
  useEffect(() => {
    const defaultForProject = INITIAL_COMMENTS.filter((c) => c.project_id === projectId);
    const localSaved = getStoredLocalComments();

    const combine = (dbComments: Comment[]) => {
      const map = new Map<string, Comment>();
      // 1. Initial sample comments
      defaultForProject.forEach((c) => map.set(c.id, c));
      // 2. Locally authored comments
      localSaved.forEach((c) => map.set(c.id, c));
      // 3. Firestore comments
      dbComments.forEach((c) => map.set(c.id, c));
      setComments(Array.from(map.values()));
    };

    combine([]);

    const unsubscribe = subscribeToComments(projectId, (savedComments) => {
      combine(savedComments);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [projectId]);

  // Handle Like Comment
  const handleLikeComment = (commentId: string) => {
    const isLiked = likedCommentIds.includes(commentId);
    const nextLiked = isLiked
      ? likedCommentIds.filter((id) => id !== commentId)
      : [...likedCommentIds, commentId];

    const currentDelta = likeDeltas[commentId] || 0;
    const nextDelta = isLiked ? currentDelta - 1 : currentDelta + 1;
    const nextDeltas = { ...likeDeltas, [commentId]: nextDelta };

    setLikedCommentIds(nextLiked);
    setLikeDeltas(nextDeltas);
    localStorage.setItem('3covangoc_liked_comments', JSON.stringify(nextLiked));
    localStorage.setItem('3covangoc_like_deltas', JSON.stringify(nextDeltas));

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: Math.max(0, c.likes + (isLiked ? -1 : 1)),
            user_reacted: !isLiked,
          };
        }
        return c;
      })
    );
  };

  // Quick reaction tag click
  const handleAddQuickReaction = (tagText: string) => {
    setCommentText((prev) => (prev ? `${prev} ${tagText}` : tagText));
    textareaRef.current?.focus();
  };

  // Reply button click
  const handleReplyClick = (comment: Comment) => {
    setReplyingTo(comment);
    textareaRef.current?.focus();
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Delete comment authored by user/guest
  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    try {
      const stored = getStoredLocalComments().filter((c) => c.id !== commentId);
      localStorage.setItem(`3covangoc_local_comments_${projectId}`, JSON.stringify(stored));
    } catch (e) {
      console.warn('Lỗi xóa bình luận:', e);
    }
  };

  // Submit comment
  const handleSubmitComment = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const content = commentText.trim();
    if (!content || isSubmitting) return;

    setIsSubmitting(true);

    const authorName = user?.name || guestName.trim() || 'Khán giả 3COVANGOC';
    if (!user && guestName.trim()) {
      localStorage.setItem('3covangoc_guest_name', guestName.trim());
    }

    const authorAvatar =
      user?.avatar ||
      `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
        authorName
      )}&backgroundColor=e0e7ff`;

    const newComment: Comment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      project_id: projectId,
      user_id: user?.id || currentGuestId,
      user_name: authorName,
      user_avatar: authorAvatar,
      content,
      created_at: 'Vừa xong',
      likes: 0,
      user_reacted: false,
      parent_id: replyingTo?.id || null,
      reply_to_name: replyingTo?.user_name || '',
    };

    // 1. Instant optimistic update
    setComments((prev) => [newComment, ...prev]);

    // 2. Save locally so it's permanent across reloads even if offline/no db
    try {
      const currentStored = getStoredLocalComments();
      localStorage.setItem(
        `3covangoc_local_comments_${projectId}`,
        JSON.stringify([newComment, ...currentStored])
      );
    } catch (e) {
      console.warn('Could not store comment in localStorage:', e);
    }

    // 3. Clear inputs & show success
    setCommentText('');
    setReplyingTo(null);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);

    // 4. Background sync to Firestore
    try {
      await addCommentToFirestore(projectId, {
        userId: user?.id || currentGuestId,
        userName: authorName,
        userAvatar: authorAvatar,
        content,
        parentId: replyingTo?.id || null,
        replyToName: replyingTo?.user_name || '',
      });
    } catch (err) {
      console.warn('Syncing comment to Firestore (offline/guest fallback active):', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  // Apply like deltas and sorting
  const preparedComments = comments.map((c) => {
    const isLiked = likedCommentIds.includes(c.id) || c.user_reacted;
    const delta = likeDeltas[c.id] || 0;
    return {
      ...c,
      likes: Math.max(0, c.likes + delta),
      user_reacted: isLiked,
    };
  });

  const sortedComments = [...preparedComments].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    // Newest: local 'Vừa xong' or newer ids first
    if (a.created_at === 'Vừa xong') return -1;
    if (b.created_at === 'Vừa xong') return 1;
    return b.id.localeCompare(a.id);
  });

  const limit = maxComments || (showAllComments ? sortedComments.length : 6);
  const displayedComments = sortedComments.slice(0, limit);

  return (
    <div className={`w-full max-w-4xl ${className}`}>
      {/* Header bar: Title, Count, Sort Filter */}
      {showHeader && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-studio-gold/15 text-studio-gold border border-studio-gold/30">
              <MessageSquare size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white">
                  Bình luận cộng đồng
                </h2>
                <span className="rounded-full bg-studio-red/20 border border-studio-red/40 px-2.5 py-0.5 text-xs font-bold text-studio-gold">
                  {comments.length}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Thảo luận & cảm nhận của khán giả dành cho tác phẩm
              </p>
            </div>
          </div>

          {/* Sort Switcher */}
          {comments.length > 1 && (
            <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  sortBy === 'newest'
                    ? 'bg-studio-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowUpDown size={12} />
                Mới nhất
              </button>
              <button
                type="button"
                onClick={() => setSortBy('likes')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                  sortBy === 'likes'
                    ? 'bg-studio-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame size={12} />
                Nổi bật nhất
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Comment Creation Box */}
      {showCommentForm && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-neutral-900/80 p-5 md:p-6 backdrop-blur-md shadow-2xl transition-all focus-within:border-studio-gold/50">
          {/* User info bar or guest name input */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-studio-gold/40 bg-neutral-800">
                <img
                  src={
                    user?.avatar ||
                    `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
                      guestName || 'khach'
                    )}&backgroundColor=e0e7ff`
                  }
                  alt={user?.name || guestName || 'Khách'}
                  className="h-full w-full object-cover"
                />
              </div>

              {user ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{user.name}</span>
                    <span className="rounded bg-studio-gold/20 px-1.5 py-0.5 text-[10px] font-semibold text-studio-gold border border-studio-gold/40">
                      Đã đăng nhập
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">{user.email}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Tên của bạn (hoặc Khách)"
                      maxLength={30}
                      className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-studio-gold focus:outline-none w-44 sm:w-56"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500 hidden sm:inline">
                    (để lại tên để giao lưu)
                  </span>
                </div>
              )}
            </div>

            {/* Quick Login button for guest */}
            {!user && showLoginPrompt && setAuthModalOpen && (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-studio-gold hover:text-yellow-400 transition-colors py-1 px-2.5 rounded-lg bg-studio-gold/10 border border-studio-gold/20 cursor-pointer"
              >
                <LogIn size={13} />
                Đăng nhập tài khoản
              </button>
            )}
          </div>

          {/* Active Reply Banner */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 flex items-center justify-between rounded-xl bg-studio-red/15 border border-studio-red/30 px-3.5 py-2 text-xs text-white"
              >
                <div className="flex items-center gap-2 truncate">
                  <CornerDownRight size={14} className="text-studio-gold shrink-0" />
                  <span className="text-neutral-400">Đang trả lời:</span>
                  <span className="font-bold text-studio-gold truncate">
                    {replyingTo.user_name}
                  </span>
                  <span className="text-neutral-400 truncate max-w-xs italic">
                    "{replyingTo.content.slice(0, 40)}..."
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer shrink-0"
                  title="Hủy trả lời"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea Form */}
          <form onSubmit={handleSubmitComment}>
            <label htmlFor={`comment-input-${projectId}`} className="sr-only">
              Viết bình luận
            </label>
            <textarea
              id={`comment-input-${projectId}`}
              ref={textareaRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={1000}
              rows={3}
              placeholder={
                replyingTo
                  ? `Viết câu trả lời cho ${replyingTo.user_name}...`
                  : 'Chia sẻ cảm nhận chân thật của bạn về bộ phim này...'
              }
              className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder:text-neutral-500 focus:border-studio-gold/60 focus:bg-black/60 focus:outline-none transition-all"
            />

            {/* Quick Emoji Reaction Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-neutral-500 flex items-center gap-1 mr-1">
                <Sparkles size={12} className="text-studio-gold" /> Gợi ý nhanh:
              </span>
              {QUICK_REACTIONS.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddQuickReaction(tag)}
                  className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 text-[11px] text-neutral-300 hover:text-studio-gold transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Footer Form Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>{commentText.length}/1000</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Nhấn Ctrl + Enter để gửi nhanh</span>
              </div>

              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {submitSuccess && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium"
                    >
                      <Check size={14} /> Đã đăng bình luận!
                    </motion.span>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-studio-red px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-studio-wine hover:shadow-lg hover:shadow-studio-red/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{replyingTo ? 'Gửi phản hồi' : 'Gửi bình luận'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* List of Comments */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {displayedComments.map((comment, index) => {
            const isLiked = comment.user_reacted;
            const isMyComment =
              comment.user_id === user?.id || comment.user_id === currentGuestId;

            return (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`group relative rounded-2xl border p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 ${
                  comment.parent_id
                    ? 'ml-4 sm:ml-8 border-studio-wine/40 bg-neutral-900/50'
                    : 'border-white/10 bg-neutral-900/60 hover:border-studio-gold/30 hover:bg-neutral-900/80'
                }`}
              >
                {/* Header: User Info & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                      <img
                        src={comment.user_avatar || '/images/logo.png'}
                        alt={comment.user_name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://api.dicebear.com/7.x/notionists/svg?seed=avatar';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white leading-none">
                          {comment.user_name}
                        </h4>
                        {isMyComment && (
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-300">
                            Bạn
                          </span>
                        )}
                      </div>
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

                  {/* Right side: Like + Delete buttons */}
                  <div className="flex items-center gap-2">
                    {/* Delete button for own comment */}
                    {isMyComment && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa bình luận này"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* Heart button */}
                    <button
                      type="button"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer border ${
                        isLiked
                          ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                      }`}
                      title={isLiked ? 'Bỏ thích' : 'Thích bình luận'}
                    >
                      <Heart
                        size={14}
                        className={`transition-all duration-300 ${
                          isLiked
                            ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                            : 'text-neutral-400'
                        }`}
                      />
                      <span className={isLiked ? 'text-red-300 font-bold' : ''}>
                        {comment.likes}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Reply Indicator if this comment replies to another */}
                {comment.reply_to_name && (
                  <div className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-studio-gold">
                    <CornerDownRight size={11} />
                    <span>Phản hồi @{comment.reply_to_name}</span>
                  </div>
                )}

                {/* Content */}
                <p className="mt-3 text-sm sm:text-base text-neutral-200 leading-relaxed font-light whitespace-pre-wrap">
                  {comment.content}
                </p>

                {/* Card Footer: Quick Reply trigger */}
                {showCommentForm && (
                  <div className="mt-3 flex items-center gap-4 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleReplyClick(comment)}
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-studio-gold transition-colors cursor-pointer"
                    >
                      <CornerDownRight size={12} />
                      <span>Trả lời</span>
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {displayedComments.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-8 text-center">
            <MessageSquare size={32} className="mx-auto text-neutral-600 mb-3" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-1">
              Chưa có bình luận nào
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Hãy là người đầu tiên chia sẻ cảm nhận của bạn về bộ phim này nhé!
            </p>
          </div>
        )}

        {/* Show More / Show Less Button */}
        {!maxComments && sortedComments.length > 6 && (
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setShowAllComments((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white transition-all cursor-pointer shadow-lg"
            >
              {showAllComments
                ? 'Thu gọn danh sách'
                : `Xem thêm ${sortedComments.length - 6} bình luận`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
