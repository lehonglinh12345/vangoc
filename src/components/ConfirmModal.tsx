import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = 'Bạn có muốn thoát không?',
  message = 'Thông tin bạn vừa nhập vào biểu mẫu chưa được gửi đi. Nếu thoát, các dữ liệu này sẽ bị mất.',
  confirmText = 'Xác nhận thoát',
  cancelText = 'Ở lại tiếp tục',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-white/15 bg-neutral-900/95 shadow-2xl text-center z-10 overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-studio-red via-studio-gold to-studio-red" />

            {/* Close icon button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Warning icon */}
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-400">
              <AlertCircle size={32} />
            </div>

            {/* Title & Message */}
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3">
              {title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              {message}
            </p>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-studio-red hover:bg-studio-wine text-white shadow-lg shadow-studio-red/30 transition-all cursor-pointer"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
