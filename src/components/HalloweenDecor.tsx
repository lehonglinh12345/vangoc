import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Ghost, Volume2, VolumeX } from 'lucide-react';

// Web Audio API spooky sound effects generator (no external audio files needed)
const playSpookySound = (type: 'boo' | 'chime' | 'cackle') => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'chime') {
      // Magic fairy/halloween chime
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
      });
    } else if (type === 'boo') {
      // Spooky deep wobble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    }
  } catch {
    // Ignore audio context errors if browser blocks autoplay
  }
};

// Halloween quotes
const HALLOWEEN_GREETINGS = [
  "🎃 Happy Halloween từ 3COVANGOC STUDIO!",
  "🍬 Trick or Treat! Chúc bạn render không bị lỗi!",
  "👻 Đêm nay ai thức cùng 3COVANGOC render phim nào?",
  "🦇 Rực sáng đêm Halloween cùng các pháp sư 3D!",
  "🧙‍♀️ Phép thuật hoạt hình 3D: Biến ý tưởng thành siêu phẩm!"
];

interface TreatParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
  scale: number;
}

export default function HalloweenDecor() {
  const [spiderHovered, setSpiderHovered] = useState(false);
  const [spiderDropped, setSpiderDropped] = useState(false);
  const [particles, setParticles] = useState<TreatParticle[]>([]);
  const [currentGreeting, setCurrentGreeting] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Trigger Halloween burst effect when user clicks pumpkin
  const triggerTrickOrTreat = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    if (soundEnabled) {
      playSpookySound('chime');
    }

    // Pick random greeting
    const randomGreet = HALLOWEEN_GREETINGS[Math.floor(Math.random() * HALLOWEEN_GREETINGS.length)];
    setCurrentGreeting(randomGreet);

    // Emojis for treat burst
    const emojis = ['🎃', '🍬', '🦇', '👻', '🍭', '✨', '🕷️', '🕯️', '🍫'];
    const newParticles: TreatParticle[] = [];

    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5);
      const distance = 80 + Math.random() * 120;
      newParticles.push({
        id: Date.now() + i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.8
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
          1. TOP-LEFT SPIDER WEB WITH DANGLING SPIDER
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 z-40 pointer-events-none select-none">
        <svg
          className="w-32 h-32 sm:w-44 sm:h-44 text-orange-500/30 opacity-70 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          {/* Radial strands */}
          <path d="M0,0 L100,0" strokeDasharray="2 2" opacity="0.4" />
          <path d="M0,0 L0,100" strokeDasharray="2 2" opacity="0.4" />
          <path d="M0,0 L90,35" />
          <path d="M0,0 L75,65" />
          <path d="M0,0 L50,85" />
          <path d="M0,0 L25,95" />
          
          {/* Concentric webs */}
          <path d="M25,0 Q24,10 18,18 Q10,24 0,25" />
          <path d="M50,0 Q45,22 35,35 Q22,45 0,50" />
          <path d="M75,0 Q68,34 52,52 Q34,68 0,75" />
          <path d="M100,0 Q90,45 70,70 Q45,90 0,100" />
        </svg>

        {/* Interactive Dangling Spider */}
        <div
          className="absolute top-0 left-16 sm:left-24 pointer-events-auto cursor-pointer"
          onMouseEnter={() => {
            setSpiderHovered(true);
            if (soundEnabled) playSpookySound('boo');
          }}
          onMouseLeave={() => setSpiderHovered(false)}
          onClick={() => setSpiderDropped(!spiderDropped)}
          title="Nhấp vào nhện Halloween để vui đùa!"
        >
          {/* Silk thread */}
          <motion.div
            className="w-[1px] bg-gradient-to-b from-orange-400/60 via-white/50 to-orange-400/80 mx-auto"
            animate={{ height: spiderDropped ? 120 : spiderHovered ? 65 : 40 }}
            transition={{ type: 'spring', damping: 8, stiffness: 120 }}
          />

          {/* Spider body */}
          <motion.div
            className="relative -mt-1 flex flex-col items-center group"
            animate={{
              rotate: spiderHovered ? [0, -15, 15, -10, 10, 0] : [0, -5, 5, 0],
              y: spiderHovered ? [0, 4, 0] : 0
            }}
            transition={{
              rotate: { repeat: Infinity, duration: spiderHovered ? 0.6 : 3, ease: 'easeInOut' }
            }}
          >
            {/* Spider Icon / SVG */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#18181b] border border-orange-500/60 shadow-[0_0_12px_rgba(249,115,22,0.6)] flex items-center justify-center relative">
              <span className="text-sm select-none">🕷️</span>
              {/* Glowing eyes */}
              <div className="absolute top-1.5 left-2 w-1 h-1 bg-red-500 rounded-full animate-ping" />
              <div className="absolute top-1.5 right-2 w-1 h-1 bg-red-500 rounded-full animate-ping" />
            </div>

            {/* Speech bubble */}
            <AnimatePresence>
              {spiderHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-md border border-orange-500/50 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg pointer-events-none"
                >
                  Boo! 👻 Halloween vui vẻ!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. TOP-RIGHT HALLOWEEN COBWEB
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 right-0 z-40 pointer-events-none select-none">
        <svg
          className="w-28 h-28 sm:w-40 sm:h-40 text-purple-500/30 opacity-70 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)] transform -scale-x-100"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M0,0 L90,35" />
          <path d="M0,0 L75,65" />
          <path d="M0,0 L50,85" />
          <path d="M25,0 Q24,10 18,18 Q10,24 0,25" />
          <path d="M50,0 Q45,22 35,35 Q22,45 0,50" />
          <path d="M75,0 Q68,34 52,52 Q34,68 0,75" />
          <path d="M100,0 Q90,45 70,70 Q45,90 0,100" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. FLOATING HALLOWEEN BATS IN BACKGROUND
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[0, 1, 2, 3].map((idx) => {
          const delays = [0, 4, 9, 13];
          const durations = [16, 20, 18, 22];
          const startY = [15, 35, 60, 25][idx];
          return (
            <motion.div
              key={`bat-${idx}`}
              className="absolute text-orange-400/40 opacity-70 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              initial={{
                x: '-10vw',
                y: `${startY}vh`,
                scale: 0.7 + idx * 0.15
              }}
              animate={{
                x: ['-10vw', '110vw'],
                y: [
                  `${startY}vh`,
                  `${startY - 12}vh`,
                  `${startY + 15}vh`,
                  `${startY - 8}vh`,
                  `${startY + 10}vh`,
                  `${startY}vh`
                ]
              }}
              transition={{
                x: {
                  duration: durations[idx],
                  repeat: Infinity,
                  ease: 'linear',
                  delay: delays[idx]
                },
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }}
            >
              {/* Animated bat SVG */}
              <motion.svg
                viewBox="0 0 24 24"
                className="w-7 h-7 sm:w-9 sm:h-9 fill-current"
                animate={{
                  scaleY: [1, 0.4, 1, 0.5, 1],
                  rotate: [0, -8, 8, -5, 0]
                }}
                transition={{
                  scaleY: { duration: 0.35, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <path d="M12 4c.8 0 1.5.7 1.5 1.5 0 .3-.1.6-.3.8 1.8.4 3.3 1.6 3.8 3.2.7-.4 1.5-.5 2.5-.5 1.7 0 3.3.7 4.5 2-1 .7-2.3 1-3.5 1-1.2 0-2.3-.3-3.2-.8-.4 1.8-1.5 3.3-3 4.2.3.8.7 1.6 1.2 2.4-1.2-.4-2.3-1-3.5-1.8-1.2.8-2.3 1.4-3.5 1.8.5-.8.9-1.6 1.2-2.4-1.5-.9-2.6-2.4-3-4.2-.9.5-2 .8-3.2.8-1.2 0-2.5-.3-3.5-1 1.2-1.3 2.8-2 4.5-2 1 0 1.8.1 2.5.5.5-1.6 2-2.8 3.8-3.2-.2-.2-.3-.5-.3-.8C10.5 4.7 11.2 4 12 4z" />
              </motion.svg>
            </motion.div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. FLOATING HALLOWEEN WIDGET: INTERACTIVE PUMPKIN & TRICK OR TREAT
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
        {/* Halloween Bubble Speech Greeting */}
        <AnimatePresence>
          {currentGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="bg-neutral-900/95 backdrop-blur-md border border-orange-500/60 rounded-xl px-4 py-2.5 shadow-[0_0_25px_rgba(249,115,22,0.35)] text-white text-xs max-w-xs flex items-center gap-2 mb-1"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 animate-spin" />
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

        {/* The Magic Pumpkin Button */}
        <div className="relative group">
          {/* Glowing Aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-600 via-amber-500 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.12, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.9 }}
            onClick={triggerTrickOrTreat}
            className="relative px-3.5 py-2.5 bg-neutral-950 border border-orange-500/60 rounded-full flex items-center gap-2.5 shadow-xl text-orange-400 cursor-pointer overflow-hidden"
            title="Nhấn để nhận quà Halloween từ 3COVANGOC Studio!"
          >
            {/* Jack-o-lantern icon */}
            <span className="text-xl filter drop-shadow-[0_0_6px_rgba(249,115,22,0.8)] animate-bounce">
              🎃
            </span>
            <div className="text-left hidden sm:block pr-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-orange-400 leading-none">
                Halloween 2026
              </div>
              <div className="text-[11px] font-bold text-white flex items-center gap-1 leading-tight">
                Trick or Treat!
              </div>
            </div>

            {/* Sound toggle button */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="text-neutral-400 hover:text-orange-300 p-1 rounded-full transition-colors"
              title={soundEnabled ? 'Tắt âm thanh Halloween' : 'Bật âm thanh Halloween'}
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
              rotate: p.rotation
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
