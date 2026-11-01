import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';

// Web Audio API Christmas Jingle Bells & Chime synthesizer (no external audio files needed)
const playChristmasSound = (type: 'jingle' | 'bell') => {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'jingle') {
      // Classic "Jingle Bells" opening motif: E5, E5, E5 - E5, E5, E5 - E5, G5, C5, D5, E5
      const melody = [
        { freq: 659.25, time: 0.0, dur: 0.18 },
        { freq: 659.25, time: 0.2, dur: 0.18 },
        { freq: 659.25, time: 0.4, dur: 0.35 },
        { freq: 659.25, time: 0.8, dur: 0.18 },
        { freq: 659.25, time: 1.0, dur: 0.18 },
        { freq: 659.25, time: 1.2, dur: 0.35 },
        { freq: 659.25, time: 1.6, dur: 0.18 },
        { freq: 783.99, time: 1.8, dur: 0.18 },
        { freq: 523.25, time: 2.0, dur: 0.25 },
        { freq: 587.33, time: 2.28, dur: 0.15 },
        { freq: 659.25, time: 2.45, dur: 0.5 },
      ];

      melody.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0.14, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + dur + 0.05);
      });
    } else if (type === 'bell') {
      // Warm Christmas sleigh bell chime
      const harmonics = [1046.5, 1318.5, 1567.98, 2093.0];
      harmonics.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.55);
      });
    }
  } catch {
    // Ignore audio context errors if browser blocks audio
  }
};

// Christmas greetings from 3COVANGOC Studio
const CHRISTMAS_GREETINGS = [
  '🎄 Merry Christmas từ 3COVANGOC STUDIO! Chúc bạn mùa lễ ấm áp!',
  '🎅 Ho Ho Ho! Ông già Noel tặng bạn ngàn ý tưởng 3D sáng tạo!',
  '❄️ Giáng Sinh an lành! Chúc các pháp sư 3D render mượt như tuyết rơi!',
  '🎁 Món quà tuyệt vời nhất mùa Noel: Những thước phim hoạt hình đầy cảm xúc!',
  '🦌 Chuông ngân vang! Cùng 3COVANGOC thắp sáng mùa Giáng Sinh 2026!',
];

interface ChristmasParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
  scale: number;
}

const SNOWFLAKES = [
  { left: '6%', size: 'text-sm sm:text-base', duration: 14, delay: 0, sway: 25, char: '❄️' },
  { left: '16%', size: 'text-xs sm:text-sm', duration: 18, delay: 3, sway: -20, char: '❅' },
  { left: '28%', size: 'text-base sm:text-lg', duration: 16, delay: 7, sway: 30, char: '❆' },
  { left: '42%', size: 'text-xs sm:text-sm', duration: 20, delay: 1.5, sway: -25, char: '❄️' },
  { left: '55%', size: 'text-sm sm:text-base', duration: 15, delay: 5, sway: 20, char: '❅' },
  { left: '68%', size: 'text-xs sm:text-sm', duration: 19, delay: 9, sway: -18, char: '❆' },
  { left: '80%', size: 'text-base sm:text-lg', duration: 17, delay: 2, sway: 28, char: '❄️' },
  { left: '91%', size: 'text-xs sm:text-sm', duration: 21, delay: 6, sway: -22, char: '❅' },
];

export default function HalloweenDecor() {
  const [bellHovered, setBellHovered] = useState(false);
  const [bellPulled, setBellPulled] = useState(false);
  const [particles, setParticles] = useState<ChristmasParticle[]>([]);
  const [currentGreeting, setCurrentGreeting] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Trigger Christmas gift burst effect when user clicks Santa / Gift button
  const triggerChristmasGift = () => {
    if (soundEnabled) {
      playChristmasSound('jingle');
    }

    const randomGreet =
      CHRISTMAS_GREETINGS[Math.floor(Math.random() * CHRISTMAS_GREETINGS.length)];
    setCurrentGreeting(randomGreet);

    const emojis = ['🎄', '🎅', '🎁', '❄️', '⛄', '🦌', '🔔', '✨', '🍪', '🌟'];
    const newParticles: ChristmasParticle[] = [];

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5);
      const distance = 80 + Math.random() * 125;
      newParticles.push({
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 35,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.8,
      });
    }

    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 1800);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          1. TOP-LEFT CHRISTMAS PINE GARLAND & DANGLING GOLDEN BELL ORNAMENT
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 z-40 pointer-events-none select-none">
        {/* Pine Garland & Fairy Lights SVG */}
        <svg
          className="w-32 h-32 sm:w-44 sm:h-44 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Evergreen pine boughs */}
          <path
            d="M0,0 Q35,12 75,0 M0,0 Q28,28 58,18 M0,0 Q15,45 35,45 M0,0 Q8,60 12,80"
            stroke="rgba(16, 185, 129, 0.45)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M0,0 Q45,8 90,5 M0,0 Q20,35 45,32"
            stroke="rgba(5, 150, 105, 0.35)"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          {/* Glowing Fairy Light Bulbs */}
          <circle cx="22" cy="14" r="2.5" fill="#ef4444" className="animate-pulse" />
          <circle cx="42" cy="18" r="2.2" fill="#fbbf24" className="animate-ping" />
          <circle cx="62" cy="10" r="2.5" fill="#10b981" className="animate-pulse" />
          <circle cx="15" cy="36" r="2.2" fill="#fbbf24" className="animate-pulse" />
          <circle cx="30" cy="40" r="2.5" fill="#ef4444" />
        </svg>

        {/* Interactive Dangling Christmas Bell Ornament */}
        <div
          className="absolute top-0 left-16 sm:left-24 pointer-events-auto cursor-pointer"
          onMouseEnter={() => {
            setBellHovered(true);
            if (soundEnabled) playChristmasSound('bell');
          }}
          onMouseLeave={() => setBellHovered(false)}
          onClick={() => {
            setBellPulled(!bellPulled);
            if (soundEnabled) playChristmasSound('jingle');
          }}
          title="Nhấp vào chuông Giáng Sinh để nghe nhạc Jingle Bells!"
        >
          {/* Golden ribbon */}
          <motion.div
            className="w-[2px] bg-gradient-to-b from-red-500 via-amber-400 to-red-500 mx-auto shadow-[0_0_6px_rgba(251,191,36,0.6)]"
            animate={{ height: bellPulled ? 115 : bellHovered ? 65 : 42 }}
            transition={{ type: 'spring', damping: 8, stiffness: 120 }}
          />

          {/* Ornament body */}
          <motion.div
            className="relative -mt-1 flex flex-col items-center group"
            animate={{
              rotate: bellHovered ? [0, -18, 18, -12, 12, 0] : [0, -6, 6, 0],
              y: bellHovered ? [0, 3, 0] : 0,
            }}
            transition={{
              rotate: { repeat: Infinity, duration: bellHovered ? 0.6 : 3.2, ease: 'easeInOut' },
            }}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-amber-600 border border-amber-300/70 shadow-[0_0_15px_rgba(220,38,38,0.7)] flex items-center justify-center relative">
              <span className="text-base select-none">🔔</span>
              {/* Twinkling star highlight */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
            </div>

            {/* Speech bubble */}
            <AnimatePresence>
              {bellHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-950/95 backdrop-blur-md border border-amber-400/60 text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none"
                >
                  🎄 Jingle Bells! Giáng Sinh an lành! 🎅
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. TOP-RIGHT CHRISTMAS GARLAND & FAIRY LIGHTS
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 right-0 z-40 pointer-events-none select-none">
        <svg
          className="w-28 h-28 sm:w-40 sm:h-40 drop-shadow-[0_0_10px_rgba(220,38,38,0.3)] transform -scale-x-100"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M0,0 Q35,12 75,0 M0,0 Q28,28 58,18 M0,0 Q15,45 35,45"
            stroke="rgba(16, 185, 129, 0.45)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="25" cy="15" r="2.5" fill="#fbbf24" className="animate-pulse" />
          <circle cx="50" cy="16" r="2.5" fill="#ef4444" className="animate-ping" />
          <circle cx="22" cy="35" r="2.2" fill="#10b981" className="animate-pulse" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. GENTLE FALLING SNOWFLAKES IN BACKGROUND (z-10, behind video z-30)
             Pure GPU CSS keyframes (translate3d) for zero main-thread lag on mobile
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none">
        <style>{`
          @keyframes snow-fall-gpu {
            0% {
              transform: translate3d(0, -10vh, 0) rotate(0deg);
            }
            50% {
              transform: translate3d(18px, 50vh, 0) rotate(180deg);
            }
            100% {
              transform: translate3d(-12px, 108vh, 0) rotate(360deg);
            }
          }
          .snowflake-gpu {
            will-change: transform;
            animation-name: snow-fall-gpu;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}</style>
        {SNOWFLAKES.map((flake, idx) => (
          <div
            key={`snow-${idx}`}
            className={`snowflake-gpu absolute ${flake.size} text-white/40`}
            style={{
              left: flake.left,
              top: '-8vh',
              animationDuration: `${flake.duration}s`,
              animationDelay: `-${flake.delay}s`,
            }}
          >
            {flake.char}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. FLOATING CHRISTMAS WIDGET: SANTA GIFT BOX & JINGLE BELLS
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
        {/* Christmas Greeting Speech Bubble */}
        <AnimatePresence>
          {currentGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-neutral-900/95 backdrop-blur-md border border-red-500/60 rounded-xl px-4 py-2.5 shadow-[0_0_25px_rgba(220,38,38,0.35)] text-white text-xs max-w-xs flex items-center gap-2 mb-1"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
              <span className="font-medium">{currentGreeting}</span>
              <button
                onClick={() => setCurrentGreeting(null)}
                className="text-neutral-400 hover:text-white ml-1 text-sm font-bold leading-none cursor-pointer"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Magic Christmas Gift Button */}
        <div className="relative group">
          {/* Glowing Festive Aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-emerald-500 to-amber-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: [0, -4, 4, 0] }}
            whileTap={{ scale: 0.92 }}
            onClick={triggerChristmasGift}
            className="relative px-3.5 py-2.5 bg-neutral-950 border border-red-500/60 rounded-full flex items-center gap-2.5 shadow-xl text-amber-300 cursor-pointer overflow-hidden"
            title="Nhấn để nhận quà Giáng Sinh từ 3COVANGOC Studio!"
          >
            {/* Santa / Christmas Tree icon */}
            <span className="text-xl filter drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-bounce">
              🎅
            </span>
            <div className="text-left hidden sm:block pr-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400 leading-none">
                Giáng Sinh 2026
              </div>
              <div className="text-[11px] font-bold text-white flex items-center gap-1 leading-tight">
                Nhận Quà Noel! 🎁
              </div>
            </div>

            {/* Sound toggle button */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="text-neutral-400 hover:text-amber-300 p-1 rounded-full transition-colors"
              title={soundEnabled ? 'Tắt âm thanh Giáng Sinh' : 'Bật âm thanh Giáng Sinh'}
            >
              {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </div>
          </motion.button>
        </div>

        {/* Burst particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0.2, x: 0, y: 0 }}
            animate={{
              opacity: 0,
              scale: p.scale,
              x: p.x,
              y: p.y,
              rotate: p.rotation,
            }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="fixed bottom-12 left-12 pointer-events-none text-2xl z-50 select-none"
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>
    </>
  );
}
