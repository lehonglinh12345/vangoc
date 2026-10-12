import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Loader2,
  MessageSquare,
  Send,
  CornerDownRight,
  Trash2,
  Pencil,
  Pin,
  LogIn,
  Check,
  Flame,
  ArrowUpDown,
  ShieldCheck,
  AlertTriangle,
  X,
  Clock
} from 'lucide-react';
import { Comment, User } from '../types';
import {
  addCommentToFirestore,
  subscribeToComments,
  editCommentInFirestore,
  deleteCommentFromFirestore
} from '../services/db';

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

// Danh sách bình luận thật từ khán giả và cộng đồng 3COVANGOC
const INITIAL_COMMENTS: Comment[] = [
  // --- PROJECT 1: NHÀ CÓ GIỖ ---
  {
    id: 'c_studio_pinned_1',
    project_id: 'project-1',
    user_id: 'u_studio_official',
    user_name: '3COVANGOC Studio',
    user_avatar: '/images/input_file_2.png',
    content: 'Cảm ơn cả nhà đã luôn yêu thương và đồng hành cùng bộ phim "Nhà Có Giỗ"! 💛 Mâm cơm gia đình ngày giỗ không chỉ là nghi thức, mà là sợi dây thiêng liêng gắn kết mọi thế hệ. Mọi người thích chi tiết nào nhất trong phim, hãy chia sẻ cùng chúng mình nhé!',
    created_at: 'Ghim bởi Studio',
    timestamp: 1740000000000,
    likes: 245,
    is_pinned: true,
    user_reacted: false,
  },
  {
    id: 'c_tuananhday2999',
    project_id: 'project-1',
    user_id: 'u_tuananhday2999',
    user_name: '@tuananhday2999',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=tuananh&backgroundColor=e0e7ff',
    content: 'Phim rất hay và ý nghĩa. Nó đã truyền cảm hứng cho em rất nhiều. Mong video sẽ sớm viral và chúc kênh mình ngày càng lớn mạnh ạ…',
    created_at: '6 ngày trước',
    timestamp: 1739500000000,
    likes: 14,
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
    timestamp: 1739450000000,
    is_edited: true,
    likes: 28,
    user_reacted: false,
  },
  // Phản hồi mẫu dưới comment của windymai
  {
    id: 'c_reply_windymai_studio',
    project_id: 'project-1',
    parent_id: 'c_windymai_1',
    reply_to_name: '@windymai107',
    user_id: 'u_studio_official',
    user_name: '3COVANGOC Studio',
    user_avatar: '/images/input_file_2.png',
    content: 'Cảm ơn bạn rất nhiều! Ekip luôn mong muốn mang những hơi thở đời thường và hiện đại nhất vào trong phim để mọi người cảm nhận được sự gần gũi ❤️🏮',
    created_at: '5 ngày trước',
    timestamp: 1739440000000,
    likes: 18,
    user_reacted: false,
  },
  {
    id: 'c_ngochuyen_art',
    project_id: 'project-1',
    user_id: 'u_ngochuyen',
    user_name: '@ngochuyen.3d',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=ngochuyen&backgroundColor=fce7f3',
    content: 'Tạo hình nhân vật Vàng Ngọc cưng xỉu luôn! Biểu cảm gương mặt nhân vật 3D làm rất tự nhiên, lighting mâm cỗ truyền thống nhìn ấm cúng và chân thật quá chừng.',
    created_at: '5 ngày trước',
    timestamp: 1739400000000,
    likes: 19,
    user_reacted: false,
  },
  {
    id: 'c_minhtri_cine',
    project_id: 'project-1',
    user_id: 'u_minhtri',
    user_name: '@minhtri_filmmaker',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=minhtri&backgroundColor=dbeafe',
    content: 'Xem mà rơm rớm nước mắt đoạn nhớ ông bà. Phim hoạt hình Việt Nam đang ngày càng vươn tầm cả về kỹ thuật lẫn chiều sâu câu chuyện!',
    created_at: '4 ngày trước',
    timestamp: 1739350000000,
    likes: 31,
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
    timestamp: 1739300000000,
    likes: 8,
    user_reacted: false,
  },
  {
    id: 'c_diem10cungbe',
    project_id: 'project-1',
    user_id: 'u_diem10cungbe',
    user_name: '@diem10cungbe',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=diem10&backgroundColor=fef3c7',
    content: 'Tâm huyết quá team ơi, từng góc máy và ánh sáng đều rất mượt mà',
    created_at: '3 ngày trước',
    timestamp: 1739250000000,
    likes: 15,
    user_reacted: false,
  },
  {
    id: 'c_Kaijune',
    project_id: 'project-1',
    user_id: 'u_kaijune',
    user_name: '@Kaijune-h5',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=kaijune&backgroundColor=e0f2fe',
    content: 'Làm nhớ cả bầu trời tuổi thơ phim hoạt hình Việt. Nhạc phim lúc xúc động nghe nổi da gà luôn á!',
    created_at: '4 ngày trước',
    timestamp: 1739200000000,
    likes: 12,
    user_reacted: false,
  },
  {
    id: 'c_lehoangnam',
    project_id: 'project-1',
    user_id: 'u_namle',
    user_name: '@namle.studio',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=namle&backgroundColor=f3e8ff',
    content: 'Coi xong tự nhiên muốn về quê ăn bữa cơm với gia đình liền luôn á trùi... Ủng hộ 3COVANGOC hết mình!',
    created_at: '2 ngày trước',
    timestamp: 1739150000000,
    likes: 22,
    user_reacted: false,
  },

  // --- PROJECT 2: RỰC SÁNG ĐÊM THU ---
  {
    id: 'c_studio_pinned_2',
    project_id: 'project-2',
    user_id: 'u_studio_official',
    user_name: '3COVANGOC Studio',
    user_avatar: '/images/input_file_2.png',
    content: '3COVANGOC Studio trân trọng gửi tặng khán giả món quà Trung Thu "Rực Sáng Đêm Thu"! 🏮✨ Chúc mọi gia đình một mùa trăng rằm đoàn viên, ấm áp. Cùng Vàng Ngọc rước đèn phá cỗ nào!',
    created_at: 'Ghim bởi Studio',
    timestamp: 1740000000000,
    likes: 188,
    is_pinned: true,
    user_reacted: false,
  },
  {
    id: 'c_trangmoon99',
    project_id: 'project-2',
    user_id: 'u_trangmoon99',
    user_name: '@trangmoon_99',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=trangmoon&backgroundColor=ffd5dc',
    content: 'Hình ảnh Trung thu lung linh và ấm áp quá ạ! Màu sắc 3D đậm chất truyền thống Việt Nam mà vẫn rất hiện đại ✨🏮',
    created_at: '5 ngày trước',
    timestamp: 1739400000000,
    likes: 24,
    user_reacted: false,
  },
  {
    id: 'c_vietanh_render',
    project_id: 'project-2',
    user_id: 'u_vietanh',
    user_name: '@vietanh.graphics',
    user_avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=vietanh&backgroundColor=dbeafe',
    content: 'Render ánh sáng lồng đèn đêm trăng đỉnh chóp luôn team ơi! Tone màu vàng ấm áp, tạo cảm giác Trung Thu xưa ùa về.',
    created_at: '4 ngày trước',
    timestamp: 1739350000000,
    likes: 35,
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
    timestamp: 1739300000000,
    likes: 19,
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
    timestamp: 1739250000000,
    likes: 16,
    user_reacted: false,
  }
];

// Gợi ý nhanh dạng chữ (không có icon)
const QUICK_REACTIONS = [
  'Quá xuất sắc',
  'Phim 3D đỉnh cao',
  'Chúc mừng Studio',
  'Rất ý nghĩa & cảm động',
  'Hình ảnh tuyệt đẹp',
  'Cốt truyện lôi cuốn'
];

const REPLY_QUICK_REACTIONS = [
  'Đồng quan điểm',
  'Rất chính xác',
  'Mình cũng thấy vậy',
  'Cảm ơn bạn'
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'likes'>('newest');
  const [showAllComments, setShowAllComments] = useState(false);

  // Trạng thái trả lời NGAY DƯỚI BÌNH LUẬN (không đưa lên trên)
  const [replyingToComment, setReplyingToComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Trạng thái Chỉnh sửa bình luận
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Trạng thái Xác nhận Xóa bình luận (Modal form trực quan)
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Guest ID cố định cho mỗi trình duyệt để nhận diện "bình luận của mình"
  const [currentGuestId] = useState(() => {
    let gid = localStorage.getItem('3covangoc_guest_id');
    if (!gid) {
      gid = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('3covangoc_guest_id', gid);
    }
    return gid;
  });

  // Lấy bình luận lưu cục bộ trong localStorage
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

  // Lưu danh sách id đã thả tim
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_liked_comments');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Delta số tim cục bộ
  const [likeDeltas, setLikeDeltas] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_like_deltas');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Thiết lập BroadcastChannel để đồng bộ tức thì giữa các Tab trên cùng máy
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(`3covangoc_comments_${projectId}`);
      channel.onmessage = (event) => {
        if (event.data?.type === 'NEW_COMMENT' && event.data.comment) {
          const incoming: Comment = event.data.comment;
          setComments((prev) => {
            if (prev.some((c) => c.id === incoming.id)) return prev;
            return [incoming, ...prev];
          });
        } else if (event.data?.type === 'EDIT_COMMENT' && event.data.commentId) {
          const { commentId, newContent } = event.data;
          setComments((prev) =>
            prev.map((c) =>
              c.id === commentId ? { ...c, content: newContent, is_edited: true } : c
            )
          );
        } else if (event.data?.type === 'DELETE_COMMENT' && event.data.commentId) {
          const targetId = event.data.commentId;
          setComments((prev) =>
            prev.filter((c) => c.id !== targetId && c.parent_id !== targetId)
          );
        }
      };
    } catch (e) {
      // Bỏ qua nếu môi trường không hỗ trợ BroadcastChannel
    }

    return () => {
      channel?.close();
    };
  }, [projectId]);

  // Đồng bộ thời gian thực từ Firestore và kết hợp với dữ liệu cục bộ
  useEffect(() => {
    const defaultForProject = INITIAL_COMMENTS.filter((c) => c.project_id === projectId);
    const localSaved = getStoredLocalComments();

    const combine = (dbComments: Comment[]) => {
      const map = new Map<string, Comment>();
      // 1. Bình luận mẫu
      defaultForProject.forEach((c) => map.set(c.id, c));
      // 2. Bình luận người dùng gửi cục bộ
      localSaved.forEach((c) => map.set(c.id, c));
      // 3. Bình luận trực tuyến từ Firestore
      dbComments.forEach((c) => map.set(c.id, c));
      setComments(Array.from(map.values()));
    };

    combine([]);

    const unsubscribe = subscribeToComments(projectId, (savedComments) => {
      if (Array.isArray(savedComments) && savedComments.length > 0) {
        combine(savedComments);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [projectId]);

  // Thả tim bình luận
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

  // Thêm nhanh gợi ý dạng chữ vào ô bình luận chính
  const handleAddQuickReaction = (text: string) => {
    setCommentText((prev) => (prev ? `${prev} - ${text}` : text));
    textareaRef.current?.focus();
  };

  // Thêm nhanh gợi ý dạng chữ vào ô trả lời dưới bình luận
  const handleAddReplyReaction = (text: string) => {
    setReplyContent((prev) => (prev ? `${prev} - ${text}` : text));
    replyTextareaRef.current?.focus();
  };

  // Mở khung trả lời NGAY DƯỚI BÌNH LUẬN NÀY
  const handleReplyClick = (targetComment: Comment) => {
    if (replyingToComment?.id === targetComment.id) {
      setReplyingToComment(null);
      setReplyContent('');
    } else {
      setReplyingToComment(targetComment);
      setReplyContent('');
      setTimeout(() => {
        replyTextareaRef.current?.focus();
      }, 50);
    }
  };

  // Gửi trả lời trực tiếp dưới bình luận
  const handleSubmitReply = async (parentComment: Comment) => {
    const trimmed = replyContent.trim();
    if (!trimmed || isSubmittingReply) return;

    setIsSubmittingReply(true);

    const authorName = user?.name || guestName.trim() || 'Khán giả 3COVANGOC';
    if (!user && guestName.trim()) {
      localStorage.setItem('3covangoc_guest_name', guestName.trim());
    }

    const authorAvatar =
      user?.avatar ||
      `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
        authorName
      )}&backgroundColor=e0e7ff`;

    // parentId luôn là id của bình luận gốc cao nhất để hiển thị theo luồng
    const rootParentId = parentComment.parent_id || parentComment.id;

    const newReply: Comment = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      project_id: projectId,
      parent_id: rootParentId,
      reply_to_name: parentComment.user_name,
      user_id: user?.id || currentGuestId,
      user_name: authorName,
      user_avatar: authorAvatar,
      content: trimmed,
      created_at: 'Vừa xong',
      timestamp: Date.now(),
      likes: 0,
      user_reacted: false,
    };

    // 1. Cập nhật state
    setComments((prev) => [...prev, newReply]);

    // 2. Lưu localStorage
    try {
      const currentStored = getStoredLocalComments();
      localStorage.setItem(
        `3covangoc_local_comments_${projectId}`,
        JSON.stringify([newReply, ...currentStored])
      );

      // 3. Broadcast tới các tab khác
      const bc = new BroadcastChannel(`3covangoc_comments_${projectId}`);
      bc.postMessage({ type: 'NEW_COMMENT', comment: newReply });
      bc.close();
    } catch (e) {
      console.warn('Lỗi lưu phản hồi vào localStorage:', e);
    }

    // 4. Reset form & thông báo
    setReplyingToComment(null);
    setReplyContent('');
    showToast(`Đã trả lời ${parentComment.user_name}!`);

    // 5. Đồng bộ Firestore
    try {
      await addCommentToFirestore(projectId, {
        userId: user?.id || currentGuestId,
        userName: authorName,
        userAvatar: authorAvatar,
        content: trimmed,
        parentId: rootParentId,
        replyToName: parentComment.user_name,
      });
    } catch (err) {
      console.warn('Sync reply to Firestore notice:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Bắt đầu sửa bình luận của mình
  const handleStartEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Lưu chỉnh sửa bình luận
  const handleSaveEdit = async (commentId: string) => {
    const trimmed = editContent.trim();
    if (!trimmed) return;

    setIsSavingEdit(true);

    // 1. Cập nhật state
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, content: trimmed, is_edited: true } : c
      )
    );

    // 2. Cập nhật localStorage
    try {
      const stored = getStoredLocalComments().map((c) =>
        c.id === commentId ? { ...c, content: trimmed, is_edited: true } : c
      );
      localStorage.setItem(`3covangoc_local_comments_${projectId}`, JSON.stringify(stored));

      // Broadcast sang các tab khác
      const bc = new BroadcastChannel(`3covangoc_comments_${projectId}`);
      bc.postMessage({ type: 'EDIT_COMMENT', commentId, newContent: trimmed });
      bc.close();
    } catch (e) {
      console.warn('Lỗi lưu chỉnh sửa vào localStorage:', e);
    }

    // 3. Cập nhật Firestore
    try {
      await editCommentInFirestore(projectId, commentId, trimmed);
    } catch (e) {
      console.warn('Lỗi lưu chỉnh sửa lên Firestore:', e);
    } finally {
      setIsSavingEdit(false);
      setEditingCommentId(null);
      showToast('Đã lưu chỉnh sửa bình luận!');
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  // Mở modal xác nhận xóa
  const handleOpenDeleteModal = (comment: Comment) => {
    setCommentToDelete(comment);
  };

  // Xác nhận xóa vĩnh viễn bình luận
  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    const commentId = commentToDelete.id;

    // 1. Cập nhật state (xóa comment và cả các câu trả lời phụ thuộc nó nếu có)
    setComments((prev) =>
      prev.filter((c) => c.id !== commentId && c.parent_id !== commentId)
    );

    // 2. Cập nhật localStorage
    try {
      const stored = getStoredLocalComments().filter(
        (c) => c.id !== commentId && c.parent_id !== commentId
      );
      localStorage.setItem(`3covangoc_local_comments_${projectId}`, JSON.stringify(stored));

      // Broadcast xóa sang các tab khác
      const bc = new BroadcastChannel(`3covangoc_comments_${projectId}`);
      bc.postMessage({ type: 'DELETE_COMMENT', commentId });
      bc.close();
    } catch (e) {
      console.warn('Lỗi xóa bình luận trong localStorage:', e);
    }

    // 3. Xóa trên Firestore
    try {
      await deleteCommentFromFirestore(projectId, commentId);
    } catch (e) {
      console.warn('Lỗi xóa bình luận trên Firestore:', e);
    }

    setCommentToDelete(null);
    showToast('Đã xóa bình luận thành công!');
  };

  // Gửi bình luận mới cấp cao (ở khung trên cùng)
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
      timestamp: Date.now(),
      likes: 0,
      user_reacted: false,
      parent_id: null,
      reply_to_name: '',
    };

    // 1. Cập nhật optimistic
    setComments((prev) => [newComment, ...prev]);

    // 2. Lưu cục bộ
    try {
      const currentStored = getStoredLocalComments();
      localStorage.setItem(
        `3covangoc_local_comments_${projectId}`,
        JSON.stringify([newComment, ...currentStored])
      );

      // 3. Gửi broadcast tới các tab khác
      const bc = new BroadcastChannel(`3covangoc_comments_${projectId}`);
      bc.postMessage({ type: 'NEW_COMMENT', comment: newComment });
      bc.close();
    } catch (e) {
      console.warn('Could not store comment in localStorage:', e);
    }

    // 4. Dọn form & báo thành công
    setCommentText('');
    showToast('Đã gửi bình luận thành công!');

    // 5. Đồng bộ Firestore
    try {
      await addCommentToFirestore(projectId, {
        userId: user?.id || currentGuestId,
        userName: authorName,
        userAvatar: authorAvatar,
        content,
        parentId: null,
        replyToName: '',
      });
    } catch (err) {
      console.warn('Syncing comment to Firestore notice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Phím tắt Ctrl + Enter cho ô bình luận chính
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  // Phím tắt Ctrl + Enter cho ô trả lời
  const handleReplyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, parentComment: Comment) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmitReply(parentComment);
    }
  };

  // Chuẩn bị danh sách bình luận kèm số tim
  const preparedComments = comments.map((c) => {
    const isLiked = likedCommentIds.includes(c.id) || c.user_reacted;
    const delta = likeDeltas[c.id] || 0;
    return {
      ...c,
      likes: Math.max(0, c.likes + delta),
      user_reacted: isLiked,
    };
  });

  // TÁCH THÀNH: Bình luận gốc (root) và Các câu trả lời (replies)
  const rootComments = preparedComments.filter((c) => !c.parent_id);
  const replies = preparedComments.filter((c) => !!c.parent_id);

  // Sắp xếp các bình luận gốc
  const sortedRootComments = [...rootComments].sort((a, b) => {
    // Ghim luôn lên đầu
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;

    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    // Mới nhất: so sánh timestamp
    const timeA = a.timestamp || (a.created_at === 'Vừa xong' ? Date.now() : 0);
    const timeB = b.timestamp || (b.created_at === 'Vừa xong' ? Date.now() : 0);
    if (timeA !== timeB) return timeB - timeA;

    return b.id.localeCompare(a.id);
  });

  const limit = maxComments || (showAllComments ? sortedRootComments.length : 6);
  const displayedRootComments = sortedRootComments.slice(0, limit);

  return (
    <div className={`w-full max-w-4xl relative ${className}`}>
      {/* Toast thông báo trực quan */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-500/90 text-white px-5 py-3 shadow-2xl backdrop-blur-md border border-emerald-400/40 text-xs sm:text-sm font-semibold"
          >
            <Check size={18} className="text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER: Tiêu đề, Số lượng, Bộ lọc sắp xếp */}
      {showHeader && (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-studio-gold/25 to-studio-gold/5 text-studio-gold border border-studio-gold/30 shadow-lg shadow-studio-gold/10">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                  Bình luận cộng đồng
                </h2>
                <span className="rounded-full bg-studio-red/20 border border-studio-red/40 px-3 py-0.5 text-xs font-black text-studio-gold">
                  {comments.length}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Chia sẻ cảm xúc & thảo luận cùng khán giả 3COVANGOC Studio
              </p>
            </div>
          </div>

          {/* Nút lọc sắp xếp */}
          {rootComments.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 p-1.5 border border-white/10 text-xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-bold transition-all cursor-pointer ${
                  sortBy === 'newest'
                    ? 'bg-studio-red text-white shadow-lg shadow-studio-red/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ArrowUpDown size={12} />
                Mới nhất
              </button>
              <button
                type="button"
                onClick={() => setSortBy('likes')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-bold transition-all cursor-pointer ${
                  sortBy === 'likes'
                    ? 'bg-studio-red text-white shadow-lg shadow-studio-red/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Flame size={12} />
                Nhiều tim nhất
              </button>
            </div>
          )}
        </div>
      )}

      {/* FORM VIẾT BÌNH LUẬN CHÍNH (Ở TRÊN - CHỈ ĐỂ ĐĂNG BÌNH LUẬN MỚI) */}
      {showCommentForm && (
        <div className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-black/80 p-5 md:p-7 backdrop-blur-xl shadow-2xl transition-all focus-within:border-studio-gold/50 focus-within:shadow-[0_0_30px_rgba(217,119,6,0.15)]">
          {/* Thông tin tài khoản hoặc nhập tên khách */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-studio-gold/40 bg-neutral-800 shadow-md">
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
                    <span className="rounded-full bg-studio-gold/20 px-2 py-0.5 text-[10px] font-bold text-studio-gold border border-studio-gold/40">
                      Thành viên
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">{user.email}</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Tên của bạn (hoặc để trống)"
                      maxLength={30}
                      className="rounded-xl border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-studio-gold focus:outline-none w-48 sm:w-60 transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Bình luận tự do không bắt buộc đăng nhập
                  </span>
                </div>
              )}
            </div>

            {/* Nút đăng nhập tài khoản */}
            {!user && showLoginPrompt && setAuthModalOpen && (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-studio-gold hover:text-yellow-400 transition-colors py-1.5 px-3 rounded-xl bg-studio-gold/10 border border-studio-gold/30 cursor-pointer shadow-sm"
              >
                <LogIn size={13} />
                Đăng nhập tài khoản
              </button>
            )}
          </div>

          {/* Form nhập bình luận mới */}
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
              placeholder="Chia sẻ cảm nhận chân thật của bạn về bộ phim này..."
              className="w-full resize-y rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-white placeholder:text-neutral-500 focus:border-studio-gold/60 focus:bg-black/70 focus:outline-none transition-all leading-relaxed"
            />

            {/* GỢI Ý NHANH: CHỈ CHỮ */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-neutral-400 mr-1">
                Gợi ý nhanh:
              </span>
              {QUICK_REACTIONS.map((tagText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddQuickReaction(tagText)}
                  className="rounded-full bg-white/5 hover:bg-studio-gold/15 border border-white/10 hover:border-studio-gold/40 px-3 py-1 text-[11px] font-medium text-neutral-300 hover:text-studio-gold transition-all duration-200 cursor-pointer shadow-sm"
                >
                  {tagText}
                </button>
              ))}
            </div>

            {/* Chân form: Đếm ký tự + Nút gửi */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3.5">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{commentText.length}/1000</span>
                <span>•</span>
                <span className="hidden sm:inline">Nhấn Ctrl + Enter để gửi nhanh</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-studio-red px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-studio-wine hover:shadow-lg hover:shadow-studio-red/40 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Gửi bình luận</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* DANH SÁCH BÌNH LUẬN & PHẢN HỒI NẰM NGAY DƯỚI NHAU */}
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {displayedRootComments.map((rootComment, index) => {
            const isLiked = rootComment.user_reacted;
            const isMyComment =
              rootComment.user_id === user?.id || rootComment.user_id === currentGuestId;
            const isEditing = editingCommentId === rootComment.id;

            // Tìm các câu trả lời trực tiếp của bình luận này
            const childReplies = replies.filter(
              (r) => r.parent_id === rootComment.id
            );

            // Kiểm tra xem bình luận này (hoặc một câu trả lời trong thread) có đang được trả lời không
            const isReplyingToThisRoot = replyingToComment?.id === rootComment.id;

            return (
              <motion.div
                key={rootComment.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                className="space-y-3"
              >
                {/* THẺ BÌNH LUẬN GỐC */}
                <div
                  className={`group relative rounded-3xl border p-5 sm:p-6 backdrop-blur-md transition-all duration-300 ${
                    rootComment.is_pinned
                      ? 'border-studio-gold/50 bg-gradient-to-br from-studio-gold/15 via-neutral-900/90 to-neutral-900 shadow-xl shadow-studio-gold/10'
                      : 'border-white/10 bg-neutral-900/70 hover:border-studio-gold/30 hover:bg-neutral-900/90 shadow-lg'
                  }`}
                >
                  {/* Huy hiệu ghim nếu có */}
                  {rootComment.is_pinned && (
                    <div className="mb-3.5 flex items-center gap-1.5 text-studio-gold text-xs font-bold uppercase tracking-wider">
                      <Pin size={12} className="fill-studio-gold" />
                      <span>Bình luận được ghim bởi Studio</span>
                    </div>
                  )}

                  {/* Phần đầu: Thông tin người dùng + Thao tác (Sửa, Xóa, Thả tim) */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 bg-white/10 shadow-md ${
                          rootComment.is_pinned ? 'border-studio-gold' : 'border-white/15'
                        }`}
                      >
                        <img
                          src={rootComment.user_avatar || '/images/logo.png'}
                          alt={rootComment.user_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://api.dicebear.com/7.x/notionists/svg?seed=avatar';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold leading-none ${
                              rootComment.is_pinned ? 'text-studio-gold' : 'text-white'
                            }`}
                          >
                            {rootComment.user_name}
                          </h4>
                          {rootComment.is_pinned && (
                            <span className="flex items-center gap-0.5 rounded-full bg-studio-gold/20 border border-studio-gold/50 px-2 py-0.5 text-[9px] font-black text-studio-gold">
                              <ShieldCheck size={10} /> STUDIO
                            </span>
                          )}
                          {isMyComment && !rootComment.is_pinned && (
                            <span className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[9px] font-bold text-neutral-300">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                            <Clock size={10} />
                            {rootComment.created_at}
                          </span>
                          {rootComment.is_edited && (
                            <span className="text-[10px] text-neutral-400 italic font-medium">
                              (Đã chỉnh sửa)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nút hành động bên phải */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {/* Nút Sửa & Xóa dành riêng cho bình luận của mình */}
                      {isMyComment && !rootComment.is_pinned && !isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(rootComment)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-studio-gold hover:bg-studio-gold/10 transition-colors cursor-pointer"
                            title="Chỉnh sửa bình luận này"
                          >
                            <Pencil size={12} />
                            <span className="hidden sm:inline">Sửa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(rootComment)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Xóa bình luận này"
                          >
                            <Trash2 size={12} />
                            <span className="hidden sm:inline">Xóa</span>
                          </button>
                        </div>
                      )}

                      {/* Nút thả tim */}
                      <button
                        type="button"
                        onClick={() => handleLikeComment(rootComment.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border ${
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
                        <span className={isLiked ? 'text-red-300' : ''}>
                          {rootComment.likes}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* KHUNG NỘI DUNG / CHỈNH SỬA TRỰC TIẾP */}
                  {isEditing ? (
                    <div className="mt-3.5 space-y-3 rounded-2xl bg-black/40 border border-studio-gold/30 p-3.5">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        className="w-full resize-y rounded-xl border border-white/10 bg-neutral-900/90 p-3 text-sm text-white focus:border-studio-gold focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(rootComment.id)}
                          disabled={!editContent.trim() || isSavingEdit}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-studio-gold text-neutral-950 text-xs font-bold hover:bg-yellow-400 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSavingEdit ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3.5 text-sm sm:text-base text-neutral-200 leading-relaxed font-light whitespace-pre-wrap">
                      {rootComment.content}
                    </p>
                  )}

                  {/* NÚT TRẢ LỜI: Bấm vào sẽ mở khung phản hồi NGAY DƯỚI BÌNH LUẬN NÀY */}
                  {showCommentForm && !isEditing && (
                    <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleReplyClick(rootComment)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          isReplyingToThisRoot
                            ? 'text-studio-gold'
                            : 'text-neutral-400 hover:text-studio-gold'
                        }`}
                      >
                        <CornerDownRight size={13} />
                        <span>{isReplyingToThisRoot ? 'Đóng trả lời' : 'Trả lời'}</span>
                      </button>

                      {childReplies.length > 0 && (
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {childReplies.length} câu trả lời
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* KHU VỰC CÁC PHẢN HỒI CON (NẰM NGAY DƯỚI BÌNH LUẬN GỐC) */}
                {(childReplies.length > 0 || isReplyingToThisRoot) && (
                  <div className="ml-5 sm:ml-10 border-l-2 border-studio-wine/40 pl-3 sm:pl-5 space-y-3 pt-1">
                    {/* Danh sách các câu trả lời đã có */}
                    {childReplies.map((reply) => {
                      const isReplyLiked = reply.user_reacted;
                      const isMyReply =
                        reply.user_id === user?.id || reply.user_id === currentGuestId;
                      const isEditingReply = editingCommentId === reply.id;
                      const isReplyingToChild = replyingToComment?.id === reply.id;

                      return (
                        <div key={reply.id} className="space-y-2">
                          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 hover:bg-neutral-900/80 p-4 sm:p-5 backdrop-blur-sm transition-all shadow-md">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                                  <img
                                    src={reply.user_avatar || '/images/logo.png'}
                                    alt={reply.user_name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs sm:text-sm font-bold text-white">
                                      {reply.user_name}
                                    </h5>
                                    {isMyReply && (
                                      <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-neutral-300">
                                        Bạn
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-neutral-400">
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

                              {/* Thao tác thả tim, sửa, xóa trên câu trả lời */}
                              <div className="flex items-center gap-1.5">
                                {isMyReply && !isEditingReply && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(reply)}
                                      className="p-1 text-neutral-400 hover:text-studio-gold cursor-pointer"
                                      title="Sửa phản hồi"
                                    >
                                      <Pencil size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenDeleteModal(reply)}
                                      className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                                      title="Xóa phản hồi"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleLikeComment(reply.id)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                                    isReplyLiked
                                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                                      : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                                  }`}
                                >
                                  <Heart
                                    size={12}
                                    className={isReplyLiked ? 'fill-red-500 text-red-500' : ''}
                                  />
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>

                            {/* Tag phản hồi @ai */}
                            {reply.reply_to_name && (
                              <div className="mt-2 inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[10px] text-studio-gold">
                                <CornerDownRight size={10} />
                                <span>Phản hồi @{reply.reply_to_name}</span>
                              </div>
                            )}

                            {/* Nội dung câu trả lời */}
                            {isEditingReply ? (
                              <div className="mt-2 space-y-2 rounded-xl bg-black/40 p-2.5 border border-studio-gold/30">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={2}
                                  className="w-full rounded-lg border border-white/10 bg-neutral-900 p-2.5 text-xs text-white focus:outline-none"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(reply.id)}
                                    className="px-3 py-1 bg-studio-gold text-black rounded text-xs font-bold"
                                  >
                                    Lưu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-2 text-xs sm:text-sm text-neutral-200 leading-relaxed font-light">
                                {reply.content}
                              </p>
                            )}

                            {/* Nút trả lời lại câu trả lời này */}
                            {showCommentForm && !isEditingReply && (
                              <div className="mt-2 pt-1 border-t border-white/5 flex items-center">
                                <button
                                  type="button"
                                  onClick={() => handleReplyClick(reply)}
                                  className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-studio-gold cursor-pointer"
                                >
                                  <CornerDownRight size={11} />
                                  <span>Trả lời</span>
                                </button>
                              </div>
                            )}
                          </div>

                          {/* KHUNG TRẢ LỜI NGAY DƯỚI CÂU TRẢ LỜI CON NÀY NẾU ĐƯỢC CHỌN */}
                          <AnimatePresence>
                            {isReplyingToChild && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="rounded-2xl border border-studio-gold/40 bg-neutral-950/90 p-3.5 shadow-xl"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-studio-gold flex items-center gap-1">
                                    <CornerDownRight size={12} />
                                    Trả lời @{reply.user_name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setReplyingToComment(null)}
                                    className="text-neutral-400 hover:text-white p-0.5"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                                <textarea
                                  ref={replyTextareaRef}
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  onKeyDown={(e) => handleReplyKeyDown(e, reply)}
                                  rows={2}
                                  placeholder={`Nhập câu trả lời cho @${reply.user_name}...`}
                                  className="w-full resize-none rounded-xl border border-white/10 bg-neutral-900/90 p-3 text-xs text-white placeholder:text-neutral-500 focus:border-studio-gold focus:outline-none"
                                />
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-[10px] text-neutral-500">
                                    Ctrl + Enter để gửi
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setReplyingToComment(null)}
                                      className="px-3 py-1 rounded-lg text-xs text-neutral-400 hover:text-white border border-white/10"
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSubmitReply(reply)}
                                      disabled={!replyContent.trim() || isSubmittingReply}
                                      className="px-3.5 py-1 rounded-lg bg-studio-red text-white text-xs font-bold hover:bg-studio-wine disabled:opacity-40"
                                    >
                                      Gửi phản hồi
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* KHUNG TRẢ LỜI NGAY DƯỚI BÌNH LUẬN GỐC (KHI BẤM TRẢ LỜI TRÊN GỐC) */}
                    <AnimatePresence>
                      {isReplyingToThisRoot && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-2xl border border-studio-gold/40 bg-neutral-950/90 p-4 shadow-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-studio-gold flex items-center gap-1.5">
                              <CornerDownRight size={13} />
                              Trả lời @{rootComment.user_name}
                            </span>
                            <button
                              type="button"
                              onClick={() => setReplyingToComment(null)}
                              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                              title="Hủy"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          <textarea
                            ref={replyTextareaRef}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => handleReplyKeyDown(e, rootComment)}
                            rows={3}
                            placeholder={`Viết câu trả lời cho @${rootComment.user_name}...`}
                            className="w-full resize-y rounded-xl border border-white/10 bg-neutral-900/90 p-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-studio-gold focus:outline-none"
                          />

                          {/* Gợi ý nhanh cho câu trả lời (Chỉ chữ) */}
                          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-neutral-400 mr-1">
                              Gợi ý nhanh:
                            </span>
                            {REPLY_QUICK_REACTIONS.map((tag, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAddReplyReaction(tag)}
                                className="rounded-full bg-white/5 hover:bg-studio-gold/15 border border-white/10 px-2.5 py-0.5 text-[10px] text-neutral-300 hover:text-studio-gold cursor-pointer transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>

                          {/* Chân khung trả lời: Nút gửi & Hủy */}
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-[10px] text-neutral-500">
                              Nhấn Ctrl + Enter để gửi nhanh
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setReplyingToComment(null)}
                                className="px-3.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSubmitReply(rootComment)}
                                disabled={!replyContent.trim() || isSubmittingReply}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-studio-red text-white text-xs font-bold uppercase tracking-wider hover:bg-studio-wine disabled:opacity-40 transition-all cursor-pointer shadow-md"
                              >
                                {isSubmittingReply ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Send size={12} />
                                )}
                                <span>Gửi phản hồi</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Trạng thái danh sách trống */}
        {displayedRootComments.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-10 text-center">
            <MessageSquare size={36} className="mx-auto text-neutral-600 mb-3" />
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-1">
              Chưa có bình luận nào
            </h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Hãy là người đầu tiên chia sẻ cảm nhận của bạn về tác phẩm này nhé!
            </p>
          </div>
        )}

        {/* Nút Xem thêm / Thu gọn danh sách */}
        {!maxComments && sortedRootComments.length > 6 && (
          <div className="pt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAllComments((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 px-7 py-3 text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white transition-all cursor-pointer shadow-lg"
            >
              {showAllComments
                ? 'Thu gọn danh sách'
                : `Xem thêm ${sortedRootComments.length - 6} bình luận`}
            </button>
          </div>
        )}
      </div>

      {/* MODAL FORM XÁC NHẬN XÓA BÌNH LUẬN TRỰC QUAN */}
      <AnimatePresence>
        {commentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl border border-red-500/30 bg-neutral-900/95 p-6 sm:p-7 shadow-2xl shadow-red-500/10 text-white"
            >
              {/* Biểu tượng cảnh báo */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30 shadow-inner">
                <AlertTriangle size={28} />
              </div>

              {/* Tiêu đề & Nội dung mô tả */}
              <div className="text-center mb-5">
                <h3 className="text-lg font-black uppercase tracking-wide text-white mb-1.5">
                  Xác nhận xóa bình luận?
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Bạn có chắc chắn muốn xóa bình luận này không? Hành động này sẽ xóa vĩnh viễn và không thể hoàn tác.
                </p>
              </div>

              {/* Hộp trích dẫn xem trước bình luận sẽ xóa */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full overflow-hidden bg-white/10">
                    <img
                      src={commentToDelete.user_avatar || '/images/logo.png'}
                      alt={commentToDelete.user_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {commentToDelete.user_name}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {commentToDelete.created_at}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 italic line-clamp-3">
                  "{commentToDelete.content}"
                </p>
              </div>

              {/* Hai nút hành động: Hủy & Xác nhận Xóa */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCommentToDelete(null)}
                  className="w-full py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Xóa vĩnh viễn</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
