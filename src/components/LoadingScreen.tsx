import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, SkipForward, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    __introFinished?: boolean;
  }
}

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finishIntro = useCallback(() => {
    window.__introFinished = true;
    window.dispatchEvent(new Event('intro-finished'));
    setIsVisible(false);
  }, []);

  const unlockAudio = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      v.volume = 1.0;
      setIsMuted(false);
      if (v.paused) {
        v.play().catch(() => { });
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const v = videoRef.current;
    if (!v) return;

    let cancelled = false;

    // 1. Thử phát ngay lập tức CÓ TIẾNG (100% volume)
    v.muted = false;
    v.volume = 1.0;
    const playPromise = v.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (!cancelled) {
            setIsMuted(false);
          }
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          const errorName = err instanceof Error ? err.name : '';

          // Tránh trường hợp StrictMode React dev ném AbortError
          if (errorName === 'AbortError') {
            setTimeout(() => {
              if (!cancelled && videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.volume = 1.0;
                videoRef.current.play().then(() => setIsMuted(false)).catch(() => {
                  if (videoRef.current) {
                    videoRef.current.muted = true;
                    videoRef.current.play().catch(() => { });
                    setIsMuted(true);
                  }
                });
              }
            }, 50);
            return;
          }

          // Trên điện thoại (iOS Safari/Android): Trình duyệt cấm phát tiếng nếu chưa chạm màn hình.
          // Cho video chạy hình ngay lập tức để không bao giờ bị đứng/đen màn hình, và bật cờ isMuted
          v.muted = true;
          v.play().catch(() => { });
          setIsMuted(true);
        });
    }

    // 2. Tự động mở tiếng 100% ngay khi người dùng chạm vào bất kỳ đâu trên màn hình
    const gestureEvents = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'click'];
    const handleFirstGesture = () => {
      unlockAudio();
    };

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleFirstGesture, { passive: true });
    });

    return () => {
      cancelled = true;
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleFirstGesture);
      });
    };
  }, [isVisible, unlockAudio]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: 'easeOut' } }}
          onClick={unlockAudio}
          className="fixed inset-0 z-[10001] bg-black flex items-center justify-center overflow-hidden select-none"
        >
          {/*
            Native HTML5 H.264 Faststart Full HD Video Player (/videos/intro.mp4):
            - Chuẩn H.264 AVC + AAC + faststart tương thích 100% với iPhone (iOS Safari), iPad và Android trên Vercel.
            - playsInline + webkit-playsinline để phát trực tiếp trong trang web trên điện thoại.
            - Chạy hết video tự động chuyển vào trang chủ.
          */}
          {/*
            Video Container:
            - Trên điện thoại (<md): w-full h-[100dvh] object-fill giúp video bóp lại vừa khít 100% theo chiều dọc khung màn hình điện thoại (đầy tràn màn hình, không còn viền đen).
            - Trên PC (md+): w-full h-full object-cover giữ nguyên tỉ lệ chuẩn đẹp mắt.
          */}
          <div className="relative w-full h-[100dvh] md:h-full overflow-hidden flex items-center justify-center bg-black transform-gpu">
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              playsInline
              preload="auto"
              onEnded={finishIntro}
              className="w-full h-full object-fill md:object-cover pointer-events-none transform-gpu"
            />
          </div>

          {/* Nút nhắc nhở bật tiếng nổi bật trên điện thoại nếu trình duyệt chưa cấp quyền Autoplay Audio */}
          <AnimatePresence>
            {isMuted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  unlockAudio();
                }}
                className="absolute bottom-20 sm:bottom-24 z-30 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-emerald-600 to-amber-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(220,38,38,0.7)] border border-white/30 cursor-pointer animate-bounce"
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Chạm để bật tiếng Giáng Sinh</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle Top-Left Studio Christmas Badge */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20 flex items-center gap-2.5 pointer-events-none bg-black/70 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-white/10">
            <img
              src="/images/logo_new.jpg"
              alt="3COVANGOC Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-red-500/60 shrink-0"
            />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-amber-300 flex items-center gap-1.5">
              <span>🎄</span> 3COVANGOC STUDIO • GIÁNG SINH 2026 <span>🎅❄️</span>
            </span>
          </div>

          {/* Bottom-Right Skip Button Only */}
          <div className="absolute bottom-5 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                finishIntro();
              }}
              className="px-4 py-2 rounded-full bg-black/75 hover:bg-red-600 border border-white/15 hover:border-red-500 text-white/90 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Bỏ qua</span>
              <SkipForward size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
