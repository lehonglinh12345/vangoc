import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({ isOpen, onClose }: TrailerModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[620px] bg-neutral-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-neutral-900/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-studio-red animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                  {t.hero.trailer} — NHÀ CÓ GIỖ
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-studio-red text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng"
              >
                <X size={14} />
              </button>
            </div>

            {/* Video player iframe (YouTube embed with autoplay) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src="https://www.youtube.com/embed/TM142-7LiiQ?autoplay=1&rel=0"
                title="NHÀ CÓ GIỖ - 3COVANGOC Studio"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal footer info */}
            <div className="px-5 py-3.5 bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-0.5">
                  NHÀ CÓ GIỖ (3D Short Film)
                </h4>
                <p className="text-neutral-400 text-[11px] line-clamp-1">
                  Một câu chuyện vừa hài hước, vừa cảm động về tình thân gia đình Việt.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-studio-red text-white text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
