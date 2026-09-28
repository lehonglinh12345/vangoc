import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Play,
  Sparkles,
  Clock,
  Users,
  Film,
  Box,
  Palette,
  Video,
  MessageCircle,
  Phone,
  ExternalLink,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '2+', label: 'Dự Án Hoàn Thành', icon: <Film size={20} /> },
  { value: '100%', label: 'Sáng Tạo Tự Do', icon: <Sparkles size={20} /> },
  { value: '3', label: 'Chuyên Gia Nghệ Thuật', icon: <Users size={20} /> },
  { value: '24/7', label: 'Hỗ Trợ Khách Hàng', icon: <Clock size={20} /> },
];

const packages = [
  {
    id: 'starter',
    badge: 'Khởi Đầu',
    name: 'Basic',
    tagline: 'Hoàn hảo cho dự án nhỏ',
    price: '5.000.000',
    unit: 'VNĐ / dự án',
    color: 'from-neutral-700 to-neutral-900',
    accentColor: 'text-neutral-300',
    borderColor: 'border-white/10',
    icon: <Box size={28} className="text-white/60" />,
    features: [
      '1 sản phẩm 3D Animation (15-30s)',
      'Dựng hình tiêu chuẩn (720p)',
      '2 lần chỉnh sửa',
      'Xuất file MP4',
      'Thời gian: 7-14 ngày',
    ],
    cta: 'Bắt Đầu Ngay',
    popular: false,
  },
  {
    id: 'pro',
    badge: '🔥 PHỔ BIẾN NHẤT',
    name: 'Professional',
    tagline: 'Lý tưởng cho thương hiệu',
    price: '15.000.000',
    unit: 'VNĐ / dự án',
    color: 'from-red-700 to-rose-900',
    accentColor: 'text-studio-gold',
    borderColor: 'border-studio-red/60',
    icon: <Palette size={28} className="text-studio-gold" />,
    features: [
      '1 sản phẩm 3D Animation (60-90s)',
      'Dựng hình 4K Ultra HD',
      'Motion Graphics tích hợp',
      '5 lần chỉnh sửa không giới hạn',
      'Âm thanh & nhạc nền bản quyền',
      'Xuất đa định dạng (MP4, MOV, GIF)',
      'Thời gian: 14-21 ngày',
    ],
    cta: 'Chọn Gói Này',
    popular: true,
  },
  {
    id: 'enterprise',
    badge: 'Doanh Nghiệp',
    name: 'Enterprise',
    tagline: 'Giải pháp toàn diện',
    price: 'Liên Hệ',
    unit: 'Tùy theo dự án',
    color: 'from-amber-700 to-yellow-900',
    accentColor: 'text-amber-300',
    borderColor: 'border-amber-500/40',
    icon: <Award size={28} className="text-amber-300" />,
    features: [
      'Phim hoạt hình 3D dài (2-5 phút)',
      'Brand Identity Package đầy đủ',
      'Không giới hạn chỉnh sửa',
      'Project Manager riêng',
      'Chiến lược nội dung số',
      'Bản quyền toàn bộ sản phẩm',
      'Hỗ trợ sau bàn giao 3 tháng',
    ],
    cta: 'Tư Vấn Miễn Phí',
    popular: false,
  },
];

const youtubeComments = [
  {
    name: '@3CoVaNgocStudio',
    handle: '@3CoVaNgocStudio',
    avatar: '3C',
    text: 'Chúng mình hiện đã update phụ đề cho các bạn có những trải nghiệm xem phim trọn vẹn hơn nha',
    likes: 2,
    time: '2 ngày trước',
    pinned: true,
    accent: 'from-red-600 to-rose-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=Ugz5dPDx9e2eHHYe7lB4AaABAg',
  },
  {
    name: '@windymai107',
    handle: '@windymai107',
    avatar: 'WM',
    text: 'T ấn tượng vs đoạn cuối khi phim đề cập đến mấy concert của mấy show anh trai vs nghệ sĩ hiện tại ở ngoài đời á, tạo cảm giác phim bắt kịp xu hướng của giới trẻ, sáng tạo, lồng ghép trong phim cx phù hợp',
    likes: 11,
    time: '6 ngày trước',
    pinned: false,
    accent: 'from-blue-600 to-cyan-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgwbpUkLb17qBt9CyfJ4AaABAg',
  },
  {
    name: '@windymai107',
    handle: '@windymai107',
    avatar: 'WM',
    text: 'Ủa, PKL cameo trong phim luôn hỏ',
    likes: 25,
    time: '6 ngày trước',
    pinned: false,
    accent: 'from-purple-600 to-violet-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgxmOzlcpEai4jjU0pB4AaABAg',
  },
  {
    name: '@ZuHoàng',
    handle: '@ZuHoàng-g6t7n',
    avatar: 'ZH',
    text: 'Về phần hình ảnh thì mik thấy cx ổn còn về âm thanh thì cảm giác 1 số nv hơi khó nghe thí hoặc mik ko quen về giọng trong Nam. Và mik khá tiếc đoạn cuối các bạn có thể cho thêm qc hoặc thêm đoạn kết thúc có thể ns thêm về trung thu. Mik mong các bạn có thể hoàn thiện hơn trg các vd sắp tới',
    likes: 27,
    time: '6 ngày trước',
    pinned: false,
    accent: 'from-green-600 to-emerald-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgwrzabKxwwX3BJJ36J4AaABAg',
  },
  {
    name: '@iliketill',
    handle: '@iliketill',
    avatar: 'IL',
    text: '2:37 "cậu út xin hãy giúp đỡ con với cậu út chuyện là vầy nè đó là vậy đó" :))',
    likes: 13,
    time: '6 ngày trước',
    pinned: false,
    accent: 'from-amber-600 to-orange-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=Ugzh3upzru_8bigoTyx4AaABAg',
  },
  {
    name: '@thedaftpoetz',
    handle: '@thedaftpoetz',
    avatar: 'DP',
    text: 'tr ơi đáng yêu quáaa, dự án rất xịn và chỉnh chu luôn ạ.',
    likes: 8,
    time: '6 ngày trước',
    pinned: false,
    accent: 'from-pink-600 to-rose-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=UgwtGCrApPZ8qCe49Wl4AaABAg',
  },
  {
    name: '@lLOVEV-VN',
    handle: '@lLOVEV-VN',
    avatar: 'LV',
    text: 'Chủ đề đơn giản vậy mà ra kịch bản hay quá!',
    likes: 12,
    time: '6 ngày trước',
    pinned: false,
    accent: 'from-indigo-600 to-blue-800',
    link: 'https://www.youtube.com/watch?v=ENcG_Q9zgH0&lc=Ugz4bT0phwujfH-o87Z4AaABAg',
  },
];

const whyChooseUs = [
  {
    icon: <Award size={32} className="text-studio-gold" />,
    title: 'Chất Lượng Điện Ảnh',
    desc: 'Mỗi frame được chăm chút như một tác phẩm nghệ thuật, đạt chuẩn quốc tế.',
  },
  {
    icon: <Zap size={32} className="text-studio-red" />,
    title: 'Workflow Nhanh Chóng',
    desc: 'Quy trình sản xuất tối ưu, giao hàng đúng deadline mà không hy sinh chất lượng.',
  },
  {
    icon: <Shield size={32} className="text-green-400" />,
    title: 'Bảo Mật Dự Án',
    desc: 'Cam kết bảo mật tuyệt đối, toàn bộ bản quyền thuộc về khách hàng.',
  },
  {
    icon: <TrendingUp size={32} className="text-amber-400" />,
    title: 'ROI Đo Lường Được',
    desc: 'Nội dung sáng tạo của chúng tôi được tối ưu để tăng engagement và chuyển đổi.',
  },
];



// ─── Sub-components ──────────────────────────────────────────────────────────

function YouTubeCommentsWall() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
      {youtubeComments.map((cmt, i) => (
        <motion.a
          key={i}
          href={cmt.link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.76, 0, 0.24, 1] }}
          viewport={{ once: true }}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`glass-card rounded-2xl p-6 border border-white/8 hover:border-white/20 transition-all duration-500 relative overflow-hidden group cursor-pointer block ${cmt.pinned ? 'md:col-span-2 border-studio-gold/20 hover:border-studio-gold/40' : ''
            }`}
        >
          {/* Background accent */}
          <div className={`absolute inset-0 bg-gradient-to-br ${cmt.accent} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 rounded-2xl`} />

          {/* Pinned badge */}
          {cmt.pinned && (
            <div className="flex items-center gap-1.5 mb-3">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-studio-gold/70" fill="currentColor">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-studio-gold/70">
                Đã ghim bởi @3CoVaNgocStudio
              </span>
            </div>
          )}

          {/* Comment header */}
          <div className="flex items-start gap-3 relative z-10">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${cmt.accent} flex items-center justify-center text-white font-black text-[10px] shrink-0 shadow-lg`}>
              {cmt.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-bold ${cmt.pinned ? 'text-studio-gold' : 'text-white/90'
                  }`}>
                  {cmt.name}
                </span>
                {cmt.pinned && (
                  <span className="px-1.5 py-0.5 bg-studio-red/20 rounded text-[9px] font-bold text-studio-red uppercase tracking-wider">
                    Studio
                  </span>
                )}
                <span className="text-[10px] text-white/30">{cmt.time}</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {cmt.text}
              </p>
              {/* Like count */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-white/30 group-hover:text-white/50 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                  <span className="text-[11px] font-semibold">{cmt.likes}</span>
                </div>
                <ExternalLink size={12} className="text-white/0 group-hover:text-white/30 transition-all" />
              </div>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function BrandShowcase() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative z-10 bg-[#0A0A0A] overflow-hidden">

      {/* ── HERO BILLBOARD ───────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 px-6"
      >
        {/* Animated Background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-[#0A0A0A] to-amber-950/20" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-studio-gold/50"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center max-w-5xl"
        >
          {/* Badge */}
          <motion.div


          >

          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.88] tracking-tighter mb-6"
          >
            <span className="text-white">Sáng Tạo</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-red via-rose-400 to-studio-gold italic font-serif">
              Là
            </span>
            <br />
            <span className="text-white">Sức Mạnh</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="text-white/60 text-base md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Chúng tôi không chỉ tạo ra những thước phim đẹp — chúng tôi xây dựng
            <span className="text-studio-gold font-semibold"> câu chuyện thương hiệu</span> có sức
            mạnh thay đổi nhận thức khách hàng.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => scrollToSection('brand-packages')}
              className="group relative px-8 py-4 bg-studio-red text-white font-bold uppercase tracking-widest text-xs rounded-sm overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-shadow duration-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                Xem Gói Dịch Vụ <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </button>

            <button
              onClick={() => scrollToSection('brand-showreel')}
              className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white/5 transition-all cursor-pointer"
            >
              <Play size={14} className="fill-white" />
              Xem Showreel
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => scrollToSection('brand-stats')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 group-hover:text-studio-gold transition-colors">
            Khám Phá
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-studio-gold to-transparent" />
        </motion.div>
      </section>

      {/* ── STATS SECTION ────────────────────────────────────────────────── */}
      <section id="brand-stats" className="py-20 relative border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 md:p-8 text-center border border-white/8 hover:border-studio-red/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-studio-red/10 flex items-center justify-center mx-auto mb-4 text-studio-red group-hover:bg-studio-red/20 transition-colors">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWREEL / VIDEO HIGHLIGHT ───────────────────────────────────── */}
      <section id="brand-showreel" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="editorial-tag mb-6 justify-center">
              <span /> SHOWREEL 2024 <span />
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              CHỨNG MINH BẰNG{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-studio-gold italic">
                TÁC PHẨM
              </span>
            </h3>
            <p className="text-white/50 text-sm max-w-xl mx-auto">
              Xem những gì chúng tôi đã tạo ra và tưởng tượng chúng tôi có thể làm gì cho thương hiệu của bạn.
            </p>
          </motion.div>

          {/* Video Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(220,38,38,0.15)] cursor-pointer">
              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-studio-red z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-2 -right-2 w-10 h-10 border-t-2 border-r-2 border-studio-gold z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-2 border-l-2 border-studio-gold z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-studio-red z-10 opacity-80 group-hover:opacity-100 transition-opacity" />

              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/ENcG_Q9zgH0?autoplay=0&controls=1&modestbranding=1"
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media; fullscreen"
                  title="Rực Sáng Đêm Thu - 3COVANGOC Studio"
                />
              </div>

              {/* Gradient overlay bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Label */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  Rực Sáng Đêm Thu · 3COVANGOC Studio
                </span>
              </div>
            </div>
          </motion.div>

          {/* YouTube Comments - directly under video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto mt-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">CỘNG ĐỒNG YÊU THÍCH</h4>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold">Phản hồi thực tế từ YouTube</span>
            </div>
            <YouTubeCommentsWall />
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="py-20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="editorial-tag mb-6 justify-center">
              <span /> TẠI SAO CHỌN CHÚNG TÔI <span />
            </h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter">
              KHÁC BIỆT TẠO NÊN{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-gold to-amber-300 italic">
                GIÁ TRỊ
              </span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl p-8 border border-white/8 hover:border-studio-gold/30 transition-all duration-500 group relative overflow-hidden cursor-default"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {item.icon}
                </div>
                <div className="w-8 h-[2px] bg-studio-red mb-4 transition-all duration-300 group-hover:w-16" />
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-3 text-white">
                  {item.title}
                </h4>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PACKAGES ─────────────────────────────────────────────── */}
      <section id="brand-packages" className="py-24 md:py-36 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-900/10 to-transparent blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="editorial-tag mb-6 justify-center">
              <span /> GÓI DỊCH VỤ <span />
            </h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              ĐẦU TƯ VÀO{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-studio-gold italic">
                THÀNH CÔNG
              </span>
            </h3>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              Chọn gói phù hợp với nhu cầu và ngân sách của bạn. Tất cả gói đều bao gồm tư vấn chiến lược miễn phí.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: [0.76, 0, 0.24, 1] }}
                viewport={{ once: true }}
                className={`relative rounded-2xl border ${pkg.borderColor} overflow-hidden flex flex-col group cursor-default
                  ${pkg.popular ? 'ring-2 ring-studio-red shadow-[0_0_60px_rgba(220,38,38,0.2)] scale-[1.02]' : ''}
                `}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-neutral-950/90" />
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                {/* Popular badge */}
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-studio-red via-rose-400 to-studio-red" />
                )}

                <div className="relative z-10 p-7 md:p-8 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${pkg.accentColor} mb-2 block`}>
                        {pkg.badge}
                      </span>
                      <h4 className="text-xl md:text-2xl font-black text-white">{pkg.name}</h4>
                      <p className="text-white/40 text-xs mt-1">{pkg.tagline}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      {pkg.icon}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-white/8">
                    <div className="text-3xl md:text-4xl font-black text-white">
                      {pkg.price === 'Liên Hệ' ? (
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${pkg.color}`}>
                          Liên Hệ
                        </span>
                      ) : (
                        <>
                          <span className="text-lg text-white/40">₫</span>
                          {pkg.price}
                        </>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-1">{pkg.unit}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-sm text-white/70">
                        <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="text-green-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#brand-contact"
                    onClick={(e) => { e.preventDefault(); scrollToSection('brand-contact'); }}
                    className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-center transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group/btn
                      ${pkg.popular
                        ? 'bg-studio-red text-white hover:bg-rose-500 shadow-lg shadow-red-900/30'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {pkg.cta}
                    <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/30 text-xs mt-10"
          >
            * Giá có thể thay đổi theo độ phức tạp dự án · Tư vấn miễn phí trong 30 phút đầu tiên · Liên hệ để nhận báo giá chính xác
          </motion.p>
        </div>
      </section>


      {/* ── PROCESS STEPS ─────────────────────────────────────────────────── */}
      <section className="py-20 border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="editorial-tag mb-6 justify-center">
              <span /> QUY TRÌNH LÀM VIỆC <span />
            </h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter">
              ĐƠN GIẢN ·{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-rose-400 italic">
                MINH BẠCH
              </span>{' '}
              · HIỆU QUẢ
            </h3>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connector line */}
            <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Tư Vấn', desc: 'Lắng nghe nhu cầu, phân tích thương hiệu và đề xuất giải pháp tối ưu.', icon: <MessageCircle size={24} /> },
                { step: '02', title: 'Lên Kế Hoạch', desc: 'Xây dựng concept, storyboard và timeline chi tiết được phê duyệt.', icon: <Sparkles size={24} /> },
                { step: '03', title: 'Sản Xuất', desc: 'Thực hiện với tiêu chuẩn kỹ thuật cao nhất, cập nhật tiến độ thường xuyên.', icon: <Video size={24} /> },
                { step: '04', title: 'Bàn Giao', desc: 'Chỉnh sửa theo phản hồi, bàn giao file gốc chất lượng cao và hỗ trợ sau.', icon: <Award size={24} /> },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.12 }}
                  viewport={{ once: true }}
                  className="relative text-center group"
                >
                  {/* Step circle */}
                  <div className="w-16 h-16 rounded-full bg-neutral-900 border border-white/10 group-hover:border-studio-red/50 transition-colors flex items-center justify-center mx-auto mb-4 relative">
                    <div className="absolute inset-0 rounded-full bg-studio-red/5 group-hover:bg-studio-red/15 transition-colors" />
                    <span className="text-studio-red/70 group-hover:text-studio-red transition-colors">
                      {s.icon}
                    </span>
                  </div>

                  <div className="text-[10px] font-black text-studio-gold/50 uppercase tracking-[0.4em] mb-2">{s.step}</div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-2">{s.title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section id="brand-contact" className="py-28 md:py-40 relative overflow-hidden">
        {/* Dramatic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-[#0A0A0A] to-amber-950/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-studio-red/15 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/15 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                Đang Nhận Dự Án Mới
              </span>
            </div>

            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
              SẴN SÀNG
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-red via-rose-400 to-studio-gold italic font-serif">
                TỎA SÁNG?
              </span>
            </h2>

            <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-12">
              Hãy cùng chúng tôi biến ý tưởng của bạn thành những thước phim gây
              <span className="text-studio-gold"> ấn tượng mạnh</span> và
              <span className="text-studio-red"> kết quả thực sự</span>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <a
                href="tel:0842992493"
                className="group flex items-center gap-3 px-8 py-4 bg-studio-red text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-shadow duration-500 cursor-pointer"
              >
                <Phone size={14} />
                Gọi Ngay: 084 299 2493
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://www.facebook.com/3covangocstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ExternalLink size={14} />
                Nhắn Tin Facebook
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/30 text-xs">
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-green-400" />
                Tư vấn miễn phí
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-green-400" />
                Không cam kết ngay
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-green-400" />
                Bảo mật thông tin
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={12} className="text-green-400" />
                Báo giá trong 24h
              </span>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
