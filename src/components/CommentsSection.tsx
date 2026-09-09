import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Send,
  Heart,
  Trash2,
  Edit3,
  Reply,
  X,
  Check,
  CornerDownRight,
  Shield,
  Loader2
} from 'lucide-react';
import { Comment, User } from '../types';
import {
  subscribeToComments,
  addCommentToFirestore,
  editCommentInFirestore,
  toggleCommentLike,
  deleteCommentFromFirestore
} from '../services/db';

interface CommentsSectionProps {
  projectId: string;
  user: User | null;
  setAuthModalOpen: (open: boolean) => void;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    project_id: 'project-1',
    user_id: 'u1',
    user_name: 'Trịnh Chí Bảo',
    user_avatar: '/images/trichibao.png',
    content: 'Cảm ơn tất cả mọi người đã ủng hộ phim ngắn NHÀ CÓ GIỖ của tụi mình! Hãy để lại cảm nhận nhé 💛',
    created_at: '1 ngày trước',
    likes: 24,
    user_reacted: false,
  },
  {
    id: 'c2',
    project_id: 'project-1',
    user_id: 'u2',
    user_name: 'Lê Kim Thơ',
    user_avatar: '/images/lekimtho.png',
    content: 'Phần visual mâm cỗ miền Tây làm cực kỳ tỉ mỉ luôn đó nha!',
    created_at: '2 ngày trước',
    likes: 18,
    user_reacted: true,
  },
  {
    id: 'c3',
    project_id: 'project-1',
    user_id: 'u3',
    user_name: 'Khán Giả Mộ Điệu',
    user_avatar: '/images/logo.png',
    content: 'Xem mà nhớ quê quá, đồ họa 3D chuyển động mượt mà và âm thanh sống động thật sự. Hóng tập 2!',
    created_at: '3 ngày trước',
    likes: 9,
    user_reacted: false,
  }
];

export default function CommentsSection({
  projectId,
  user,
  setAuthModalOpen
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Liked comments storage
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_liked_comments');
      return raw ? JSON.parse(raw) : ['c2'];
    } catch {
      return ['c2'];
    }
  });

  // Editing state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Replying state
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyToUser, setReplyToUser] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Subscribe to real-time comments from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToComments(projectId, (firestoreComments) => {
      // Find initial comments specifically for this project
      const projectInitial = INITIAL_COMMENTS.filter((c) => c.project_id === projectId);
      const firestoreIds = new Set(firestoreComments.map((c) => c.id));
      const remainingInitial = projectInitial.filter((c) => !firestoreIds.has(c.id));

      const merged = [...firestoreComments, ...remainingInitial];

      setComments(
        merged.map((c) => ({
          ...c,
          user_reacted: likedCommentIds.includes(c.id),
        }))
      );
    });

    return () => unsubscribe();
  }, [projectId, likedCommentIds]);

  // Check if current user can edit or delete a comment
  const canModify = (commentUserId: string) => {
    if (!user) return false;
    return (
      user.id === commentUserId ||
      (user.email && user.email === commentUserId) ||
      user.role === 'admin'
    );
  };

  // Add root comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const content = newCommentText.trim();
    setNewCommentText('');
    setIsSubmitting(true);

    try {
      await addCommentToFirestore(projectId, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
      });
    } catch (error) {
      console.error('Error adding comment to Firestore:', error);
      const fallbackComment: Comment = {
        id: 'c_' + Date.now(),
        project_id: projectId,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar,
        content,
        created_at: 'Vừa xong',
        likes: 0,
        user_reacted: false,
      };
      setComments((prev) => [fallbackComment, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like comment with radiant glow ("tim thì sáng tim lên")
  const handleLikeComment = async (commentId: string) => {
    const isLiked = likedCommentIds.includes(commentId);
    const nextLiked = !isLiked;

    const nextLikedIds = nextLiked
      ? [...likedCommentIds, commentId]
      : likedCommentIds.filter((id) => id !== commentId);

    setLikedCommentIds(nextLikedIds);
    localStorage.setItem('3covangoc_liked_comments', JSON.stringify(nextLikedIds));

    let updatedLikes = 0;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          updatedLikes = nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1);
          return {
            ...c,
            user_reacted: nextLiked,
            likes: updatedLikes,
          };
        }
        return c;
      })
    );

    try {
      await toggleCommentLike(projectId, commentId, updatedLikes);
    } catch (e) {
      console.warn('Error updating comment like:', e);
    }
  };

  // Start editing
  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  // Save edited comment
  const handleSaveEdit = async (commentId: string) => {
    if (!editingText.trim()) return;

    const content = editingText.trim();
    setIsSavingEdit(true);

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, content, is_edited: true }
          : c
      )
    );
    setEditingCommentId(null);
    setEditingText('');

    try {
      await editCommentInFirestore(projectId, commentId, content);
    } catch (err) {
      console.error('Error saving edited comment:', err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) {
      setComments((prev) => prev.filter((c) => c.id !== commentId && c.parent_id !== commentId));
      try {
        await deleteCommentFromFirestore(projectId, commentId);
      } catch (e) {
        console.warn('Error deleting comment:', e);
      }
    }
  };

  // Start replying
  const handleStartReply = (parentCommentId: string, targetUserName: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setReplyingCommentId(parentCommentId);
    setReplyToUser(targetUserName);
    setReplyText('');
  };

  // Cancel reply
  const handleCancelReply = () => {
    setReplyingCommentId(null);
    setReplyToUser('');
    setReplyText('');
  };

  // Submit reply
  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyText.trim()) return;
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    const content = replyText.trim();
    setIsSubmittingReply(true);

    try {
      await addCommentToFirestore(projectId, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content,
        parentId: parentCommentId,
        replyToName: replyToUser,
      });
      setReplyText('');
      setReplyingCommentId(null);
      setReplyToUser('');
    } catch (error) {
      console.error('Error submitting reply:', error);
      const fallbackReply: Comment = {
        id: 'c_' + Date.now(),
        project_id: projectId,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar,
        content,
        created_at: 'Vừa xong',
        parent_id: parentCommentId,
        reply_to_name: replyToUser,
        likes: 0,
        user_reacted: false,
      };
      setComments((prev) => [...prev, fallbackReply]);
      setReplyText('');
      setReplyingCommentId(null);
      setReplyToUser('');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Separate root comments and their replies
  const rootComments = comments.filter((c) => !c.parent_id);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare size={22} className="text-studio-gold" />
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
            Bình luận ({comments.length})
          </h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Realtime Database
          </span>
        </div>
      </div>

      {/* Main Comment Form Input */}
      <form onSubmit={handleAddComment} className="mb-10">
        <div className="glass-card p-4 sm:p-5 rounded-2xl border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0 border border-white/20">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-bold">
                ?
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onClick={() => {
                if (!user) setAuthModalOpen(true);
              }}
              placeholder={
                user
                  ? `Bình luận dưới tên ${user.name}...`
                  : 'Đăng nhập để tham gia bình luận...'
              }
              className="w-full bg-transparent border-0 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !newCommentText.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-studio-red hover:bg-studio-wine disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-studio-red/25 cursor-pointer shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Gửi</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {rootComments.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl border-white/5 text-center text-neutral-400 text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ về bộ phim!
          </div>
        ) : (
          rootComments.map((comment) => {
            const isLiked = likedCommentIds.includes(comment.id) || comment.user_reacted;
            const replies = comments.filter((r) => r.parent_id === comment.id);

            return (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 sm:p-6 rounded-2xl border-white/5 space-y-3 transition-all"
              >
                {/* Header: User info & Delete action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/15">
                      <img
                        src={comment.user_avatar || '/images/logo.png'}
                        alt={comment.user_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white leading-none">
                          {comment.user_name}
                        </h4>
                        {(comment.user_id === 'u1' || comment.user_id === 'u2') && (
                          <span className="px-2 py-0.5 rounded-full bg-studio-gold/15 border border-studio-gold/30 text-[9px] font-bold text-studio-gold flex items-center gap-1">
                            <Shield size={10} /> 3COVANGOC
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-neutral-500 font-medium">
                          {comment.created_at}
                        </span>
                        {comment.is_edited && (
                          <span className="text-[10px] text-neutral-400 italic">
                            (Đã chỉnh sửa)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for owner */}
                  {canModify(comment.user_id) && editingCommentId !== comment.id && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(comment)}
                        className="text-neutral-500 hover:text-studio-gold transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
                        title="Chỉnh sửa bình luận"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-neutral-500 hover:text-studio-red transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-studio-red/10"
                        title="Xóa bình luận"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content or Edit Form */}
                {editingCommentId === comment.id ? (
                  <div className="space-y-3 pl-0 sm:pl-12 pt-1">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full bg-black/60 border border-studio-red/60 focus:border-studio-red rounded-xl p-3 text-sm text-white focus:outline-none resize-y min-h-[85px]"
                      placeholder="Nhập nội dung mới..."
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={isSavingEdit || !editingText.trim()}
                        className="px-4 py-1.5 bg-studio-red hover:bg-studio-wine disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check size={13} />
                        <span>Lưu thay đổi</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-neutral-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-300 leading-relaxed font-light pl-0 sm:pl-12">
                    {comment.content}
                  </p>
                )}

                {/* Footer Action Bar: Heart / Tim (sáng rực lên), Reply, Edit, Delete */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pl-0 sm:pl-12 pt-1">
                  {/* Heart / Tim Button with glowing effect */}
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer border ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.45)] scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                    }`}
                    title={isLiked ? 'Bỏ thích' : 'Thích bình luận'}
                  >
                    <Heart
                      size={14}
                      className={`transition-all duration-300 ${
                        isLiked
                          ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.95)] animate-pulse'
                          : 'text-neutral-400'
                      }`}
                    />
                    <span className={isLiked ? 'text-red-300 font-bold' : ''}>
                      {comment.likes}
                    </span>
                  </button>

                  {/* Reply Button */}
                  <button
                    onClick={() => handleStartReply(comment.id, comment.user_name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-neutral-400 hover:text-studio-gold hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
                  >
                    <Reply size={13} />
                    <span>Trả lời</span>
                  </button>

                  {/* Quick Edit shortcut if owner */}
                  {canModify(comment.user_id) && editingCommentId !== comment.id && (
                    <button
                      onClick={() => handleStartEdit(comment)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-neutral-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Edit3 size={12} />
                      <span>Sửa</span>
                    </button>
                  )}
                </div>

                {/* Reply Form if replying to this thread */}
                <AnimatePresence>
                  {replyingCommentId === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-0 sm:pl-12 pt-3"
                    >
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span className="flex items-center gap-1.5 font-medium text-studio-gold">
                            <CornerDownRight size={13} />
                            Đang trả lời @{replyToUser}
                          </span>
                          <button
                            onClick={handleCancelReply}
                            className="text-neutral-500 hover:text-white cursor-pointer p-0.5"
                            title="Hủy trả lời"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="flex gap-2.5 items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/20">
                            <img
                              src={user?.avatar || '/images/logo.png'}
                              alt={user?.name || 'User'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Viết câu trả lời cho ${replyToUser}...`}
                              className="w-full bg-black/50 border border-white/15 focus:border-studio-red rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSubmitReply(comment.id);
                                }
                              }}
                              autoFocus
                            />
                          </div>
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={isSubmittingReply || !replyText.trim()}
                            className="px-4 py-2 bg-studio-red hover:bg-studio-wine disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                          >
                            {isSubmittingReply ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Send size={13} />
                            )}
                            <span className="hidden sm:inline">Gửi</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Nested Replies List */}
                {replies.length > 0 && (
                  <div className="ml-2 sm:ml-12 pl-3 sm:pl-5 border-l-2 border-white/10 space-y-3 pt-2">
                    {replies.map((reply) => {
                      const isReplyLiked = likedCommentIds.includes(reply.id) || reply.user_reacted;

                      return (
                        <div
                          key={reply.id}
                          className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/15">
                                <img
                                  src={reply.user_avatar || '/images/logo.png'}
                                  alt={reply.user_name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white leading-none">
                                    {reply.user_name}
                                  </h5>
                                  {(reply.user_id === 'u1' || reply.user_id === 'u2') && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-studio-gold/15 text-[8px] font-bold text-studio-gold">
                                      3COVANGOC
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[9px] text-neutral-500 font-medium">
                                    {reply.created_at}
                                  </span>
                                  {reply.is_edited && (
                                    <span className="text-[9px] text-neutral-400 italic">
                                      (Đã chỉnh sửa)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Owner actions for reply */}
                            {canModify(reply.user_id) && editingCommentId !== reply.id && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStartEdit(reply)}
                                  className="text-neutral-500 hover:text-studio-gold transition-colors cursor-pointer p-1 rounded hover:bg-white/5"
                                  title="Chỉnh sửa"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="text-neutral-500 hover:text-studio-red transition-colors cursor-pointer p-1 rounded hover:bg-studio-red/10"
                                  title="Xóa"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Reply content or Edit */}
                          {editingCommentId === reply.id ? (
                            <div className="space-y-2 pt-1">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full bg-black/60 border border-studio-red/60 focus:border-studio-red rounded-xl p-2.5 text-xs text-white focus:outline-none resize-y min-h-[70px]"
                                placeholder="Sửa câu trả lời..."
                                autoFocus
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleSaveEdit(reply.id)}
                                  disabled={isSavingEdit || !editingText.trim()}
                                  className="px-3 py-1 bg-studio-red hover:bg-studio-wine disabled:opacity-50 text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Check size={12} />
                                  <span>Lưu</span>
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-neutral-300 text-[11px] rounded-lg transition-colors cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-300 leading-relaxed font-light pl-9">
                              {reply.reply_to_name && (
                                <span className="text-studio-gold font-medium mr-1.5">
                                  @{reply.reply_to_name}
                                </span>
                              )}
                              {reply.content}
                            </p>
                          )}

                          {/* Reply action bar: Tim & Reply */}
                          <div className="flex items-center gap-3 pl-9 pt-0.5">
                            {/* Heart / Tim for reply */}
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-300 cursor-pointer border ${
                                isReplyLiked
                                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.45)] scale-105'
                                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                              }`}
                              title={isReplyLiked ? 'Bỏ thích' : 'Thích'}
                            >
                              <Heart
                                size={12}
                                className={`transition-all duration-300 ${
                                  isReplyLiked
                                    ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.9)] animate-pulse'
                                    : 'text-neutral-400'
                                }`}
                              />
                              <span className={isReplyLiked ? 'text-red-300 font-bold' : ''}>
                                {reply.likes}
                              </span>
                            </button>

                            {/* Reply to this sub-user */}
                            <button
                              onClick={() => handleStartReply(comment.id, reply.user_name)}
                              className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-studio-gold transition-colors cursor-pointer"
                            >
                              <Reply size={11} />
                              <span>Trả lời</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
