import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward } from 'lucide-react';

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: {
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
          };
        }
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
    __introFinished?: boolean;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
}

const INTRO_VIDEO_ID = '1giQVuoTAFM';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [needYtAudioBridge, setNeedYtAudioBridge] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const ytAudioContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);

  const finishIntro = useCallback(() => {
    window.__introFinished = true;
    window.dispatchEvent(new Event('intro-finished'));
    setIsVisible(false);
  }, []);

  // Khi người dùng có tương tác (click/chạm/phím), chuyển hẳn sang âm thanh gốc của thẻ <video>
  const switchToNativeAudio = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      v.volume = 1.0;
      if (v.paused) {
        v.play().catch(() => {});
      }
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.mute();
          ytPlayerRef.current.destroy();
        } catch {
          // Ignore
        }
        ytPlayerRef.current = null;
      }
      setNeedYtAudioBridge(false);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const v = videoRef.current;
    if (!v) return;

    let cancelled = false;

    const startPlayback = async () => {
      if (cancelled || !videoRef.current) return;
      const vid = videoRef.current;
      try {
        vid.muted = false;
        vid.volume = 1.0;
        await vid.play();
      } catch (err: unknown) {
        if (cancelled || !videoRef.current) return;
        const errorName = err instanceof Error ? err.name : '';
        if (errorName === 'AbortError') {
          setTimeout(() => {
            if (!cancelled && videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 1.0;
              videoRef.current.play().catch(() => {
                if (!cancelled && videoRef.current) {
                  videoRef.current.muted = true;
                  videoRef.current.play().catch(() => {});
                  setNeedYtAudioBridge(true);
                }
              });
            }
          }, 40);
          return;
        }

        // Nếu localhost chưa có quyền phát tiếng trực tiếp khi F5 trên Edge,
        // cho video 1080p chạy ngay lập tức và kích hoạt luồng âm thanh tự động từ YouTube (vốn đã có quyền Autoplay trên trình duyệt của bạn)
        vid.muted = true;
        vid.play().catch(() => {});
        setNeedYtAudioBridge(true);
      }
    };

    startPlayback();

    // Chỉ lắng nghe các sự kiện User Activation hợp lệ của trình duyệt (KHÔNG gắn mousemove vì mousemove làm trình duyệt tự pause video)
    const activationEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];
    activationEvents.forEach((evt) => {
      window.addEventListener(evt, switchToNativeAudio, { once: true, passive: true });
    });

    return () => {
      cancelled = true;
      activationEvents.forEach((evt) => {
        window.removeEventListener(evt, switchToNativeAudio);
      });
    };
  }, [isVisible, switchToNativeAudio]);

  // Luồng âm thanh tự động (chỉ bật khi trình duyệt chặn tiếng thẻ <video> trên localhost lúc vừa F5)
  useEffect(() => {
    if (!isVisible || !needYtAudioBridge) return;

    let syncInterval: ReturnType<typeof setInterval>;

    const initYtAudio = () => {
      if (!ytAudioContainerRef.current || !window.YT || !window.YT.Player) return;

      ytPlayerRef.current = new window.YT.Player(ytAudioContainerRef.current, {
        videoId: INTRO_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 0,
          controls: 0,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            try {
              event.target.unMute();
              event.target.setVolume(100);
              event.target.playVideo();
            } catch {
              // Ignore
            }
          },
          onStateChange: (event) => {
            if (event.data === 1 && videoRef.current) {
              try {
                const ytTime = event.target.getCurrentTime();
                if (Math.abs(videoRef.current.currentTime - ytTime) > 0.25) {
                  videoRef.current.currentTime = ytTime;
                }
              } catch {
                // Ignore
              }

              syncInterval = setInterval(() => {
                try {
                  if (!videoRef.current || !ytPlayerRef.current) return;
                  const ytTime = ytPlayerRef.current.getCurrentTime();
                  if (ytTime > 0 && Math.abs(videoRef.current.currentTime - ytTime) > 0.3) {
                    videoRef.current.currentTime = ytTime;
                  }
                } catch {
                  // Ignore
                }
              }, 500);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initYtAudio();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initYtAudio();
      };
    }

    return () => {
      clearInterval(syncInterval);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // Ignore
        }
        ytPlayerRef.current = null;
      }
    };
  }, [isVisible, needYtAudioBridge]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: 'easeOut' } }}
          onClick={switchToNativeAudio}
          className="fixed inset-0 z-[10001] bg-black flex items-center justify-center overflow-hidden select-none"
        >
          {/* Hình ảnh: Thẻ <video> 1080p Full HD nội bộ sắc nét 100%, mượt 60fps, không bao giờ có giao diện YouTube */}
          <div className="relative w-[160vw] sm:w-[128vw] md:w-full aspect-video md:aspect-auto md:h-full max-w-none overflow-hidden flex items-center justify-center bg-black transform-gpu">
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              playsInline
              preload="auto"
              onEnded={finishIntro}
              className="w-full h-full object-cover pointer-events-none transform-gpu"
            />
          </div>

          {/* Kênh âm thanh ẩn dự phòng (tự phát tiếng nhờ quyền Media Engagement của YouTube trên trình duyệt khi F5) */}
          {needYtAudioBridge && (
            <div className="fixed -bottom-10 -right-10 w-1 h-1 opacity-0 pointer-events-none overflow-hidden">
              <div ref={ytAudioContainerRef} />
            </div>
          )}

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
