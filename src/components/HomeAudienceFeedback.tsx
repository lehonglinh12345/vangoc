import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  ExternalLink,
  Youtube
} from 'lucide-react';

interface RealYoutubeComment {
  id: string;
  userName: string;
  channelUrl: string;
  avatar: string;
  timeText: string;
  commentUrl: string;
  content: string;
  likes: number;
}

// 6 bình luận thật từ khán giả trên video YouTube chính thức của Studio
const REAL_YOUTUBE_COMMENTS: RealYoutubeComment[] = [
  {
    id: 'yt_lLOVEV-VN',
    userName: '@lLOVEV-VN',
    channelUrl: 'https://www.youtube.com/@lLOVEV-VN',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=lLOVEVVN&backgroundColor=ffd5dc',
    timeText: '2 tuần trước',
    commentUrl: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=Ugz4bT0phwujfH-o87Z4AaABAg',
    content: 'Chủ đề đơn giản vậy mà ra kịch bản hay quá!',
    likes: 16,
  },
  {
    id: 'yt_thedaftpoetz',
    userName: '@thedaftpoetz',
    channelUrl: 'https://www.youtube.com/@thedaftpoetz',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=thedaftpoetz&backgroundColor=d1fae5',
    timeText: '2 tuần trước',
    commentUrl: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgwtGCrApPZ8qCe49Wl4AaABAg',
    content: 'tr ơi đáng yêu quáaa, dự án rất xịn và chỉnh chu luôn ạ.',
    likes: 8,
  },
  {
    id: 'yt_conmeotenlaconcho',
    userName: '@conmeotenlaconcho',
    channelUrl: 'https://www.youtube.com/@conmeotenlaconcho',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=conmeotenlaconcho&backgroundColor=fef3c7',
    timeText: '6 ngày trước',
    commentUrl: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgyxtgySIYLJXE3eTbR4AaABAg',
    content: 'Cảm ơn sự cố gắng của team 🫶',
    likes: 7,
  },
  {
    id: 'yt_Kaijune-h5',
    userName: '@Kaijune-h5',
    channelUrl: 'https://www.youtube.com/@Kaijune-h5',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Kaijune&backgroundColor=e0f2fe',
    timeText: '2 tuần trước',
    commentUrl: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=Ugx1fwDsBxEhn1kjYT94AaABAg',
    content: 'Làm nhớ cả bầu trời tuổi thơ phim hoạt hình Việt',
    likes: 9,
  },
  {
    id: 'yt_BbiZyy-hy8eo',
    userName: '@BbiZyy-hy8eo',
    channelUrl: 'https://www.youtube.com/@BbiZyy-hy8eo',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=BbiZyy&backgroundColor=e0e7ff',
    timeText: '2 tuần trước',
    commentUrl: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgwinhX6F3y_MvowQRN4AaABAg',
    content: 'Camera quận 1 :)))',
    likes: 5,
  },
  {
    id: 'yt_kienngo8878',
    userName: '@kienngo8878',
    channelUrl: 'https://www.youtube.com/@kienngo8878',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=kienngo8878&backgroundColor=fce7f3',
    timeText: '6 ngày trước',
    commentUrl: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=Ugy9xK9L0huQUOs14n94AaABAg',
    content: 'Dễ thương quá nè, chúc studio mình phát triển nhiều hơn nữa nha',
    likes: 4,
  },
];

export default function HomeAudienceFeedback() {
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('3covangoc_home_yt_likes');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleLike = (id: string) => {
    const nextState = !likedMap[id];
    const updated = { ...likedMap, [id]: nextState };
    setLikedMap(updated);
    try {
      localStorage.setItem('3covangoc_home_yt_likes', JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi lưu like YouTube comment:', e);
    }
  };

  return (
    <div className="w-full">
      {/* Lưới hiển thị 6 bình luận thật từ YouTube */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {REAL_YOUTUBE_COMMENTS.map((item, index) => {
          const isLiked = !!likedMap[item.id];
          const displayLikes = item.likes + (isLiked ? 1 : 0);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/80 via-neutral-900/60 to-black/80 p-6 backdrop-blur-md hover:border-studio-gold/40 hover:bg-neutral-900/90 transition-all duration-300 shadow-xl hover:shadow-[0_10px_30px_rgba(217,119,6,0.1)]"
            >
              <div>
                {/* Phần đầu: Avatar, Kênh, Huy hiệu YouTube & Thời gian */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <a
                      href={item.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/15 bg-white/10 hover:border-studio-gold transition-colors block"
                      title={`Xem kênh YouTube của ${item.userName}`}
                    >
                      <img
                        src={item.avatar}
                        alt={item.userName}
                        className="h-full w-full object-cover"
                      />
                    </a>

                    <div>
                      <a
                        href={item.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-white hover:text-studio-gold transition-colors block leading-tight"
                      >
                        {item.userName}
                      </a>
                      <a
                        href={item.commentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-neutral-400 hover:text-white transition-colors mt-1 inline-flex items-center gap-1.5"
                        title="Bấm để xem bình luận gốc trên YouTube"
                      >
                        <span>{item.timeText}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-red-400 flex items-center gap-0.5 font-medium">
                          <Youtube size={12} className="inline fill-red-500 text-red-500" />
                          YouTube
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Nút thả tim tương tác */}
                  <button
                    type="button"
                    onClick={() => toggleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.4)] scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
                    }`}
                    title={isLiked ? 'Bỏ thích' : 'Thích bình luận'}
                  >
                    <Heart
                      size={13}
                      className={`transition-all duration-300 ${
                        isLiked
                          ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                          : 'text-neutral-400'
                      }`}
                    />
                    <span className={isLiked ? 'text-red-300' : ''}>
                      {displayLikes}
                    </span>
                  </button>
                </div>

                {/* Nội dung bình luận thật */}
                <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-light whitespace-pre-wrap">
                  "{item.content}"
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Nút liên kết toàn kênh YouTube */}
      <div className="mt-10 text-center">
        <a
          href="https://www.youtube.com/watch?v=ENcG_Q9zgH0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-2xl bg-white/5 hover:bg-red-600/15 border border-white/15 hover:border-red-500/40 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white transition-all shadow-xl cursor-pointer"
        >
          <Youtube size={18} className="text-red-500" />
          <span>Xem tất cả cảm nhận trên kênh YouTube chính thức của Studio</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
