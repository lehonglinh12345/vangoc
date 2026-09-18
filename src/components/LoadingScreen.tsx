import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const titleWords = "HELLO CHÚNG MÌNH LÀ 3 CÔ VÀNG NGỌC".split(" ");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[10001] bg-[#0A0A0A] flex items-center justify-center flex-col overflow-hidden"
        >
          {/* Ambient Background with subtle zoom */}
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.18 }}
            transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 z-0 will-change-transform pointer-events-none"
          >
            <img
              src="/images/background.jpg"
              alt="Loading Background"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Logo with reveal effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="w-48 h-48 md:w-64 md:h-64 relative z-10 will-change-transform"
          >
            <img
              src="/images/logo_new.jpg"
              alt="3covangoc Studio Logo"
              className="w-full h-full object-cover rounded-full filter drop-shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              referrerPolicy="no-referrer"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"
              initial={{ height: "100%" }}
              animate={{ height: "0%" }}
              transition={{ delay: 0.8, duration: 1.2, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Staggered Heading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center overflow-hidden z-10 px-4"
          >
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 max-w-lg text-center text-studio-gold font-black uppercase text-sm md:text-lg tracking-widest drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]">
              {titleWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.08, type: "spring", stiffness: 200 }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="h-[2px] bg-gradient-to-r from-transparent via-studio-gold to-transparent mt-3 w-full max-w-xs mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.9, duration: 1 }}
            />
          </motion.div>

          {/* Skip button if user wants immediate access */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute bottom-8 text-neutral-500 hover:text-white text-xs uppercase tracking-widest transition-colors z-20 cursor-pointer"
          >
            Bỏ qua
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
