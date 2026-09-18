import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  AtSign,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    signInWithGoogle,
    registerManual,
    loginManual,
    isLoadingUser,
    authError,
    clearAuthError,
  } = useAuth();

  // Mode: 'login' (Đăng nhập) | 'register' (Đăng ký)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
  };

  const handleClose = () => {
    clearAuthError();
    resetForm();
    setAuthModalOpen(false);
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    await signInWithGoogle();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (authMode === 'register') {
      const success = await registerManual({
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        password,
      });
      if (success) {
        resetForm();
      }
    } else {
      const success = await loginManual({
        identifier: email.trim(), // Can be email or username
        password,
      });
      if (success) {
        resetForm();
      }
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }}
            className="relative w-full max-w-md bg-[#0F0F0F] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Brand Header */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-studio-red/15 border border-studio-red/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-studio-red/10">
                <img
                  src="/images/logo_new.jpg"
                  alt="3 Cổ Và Ngốc Studio"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {authMode === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản'}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                {authMode === 'login'
                  ? ' Đăng nhập để thảo luận và lưu hoạt động cá nhân'
                  : 'Tạo tài khoản thành viên để thảo luận và lưu hoạt động cá nhân'}
              </p>
            </div>

            {/* Quick 1-Click Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoadingUser}
              className="w-full py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 mb-5"
            >
              {isLoadingUser ? (
                <>
                  <Loader2 size={16} className="animate-spin text-neutral-700" />
                  <span>Đang kết nối Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Tiếp tục nhanh với Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center mb-5">
              <div className="flex-1 border-t border-white/10" />
              <span className="px-3 text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">
                Hoặc tài khoản thủ công
              </span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Tabs: Đăng nhập vs Đăng ký */}
            <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setAuthMode('login');
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-studio-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LogIn size={13} />
                <span>Đăng nhập</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setAuthMode('register');
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-studio-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <UserPlus size={13} />
                <span>Đăng ký</span>
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle size={15} className="shrink-0 text-red-400 mt-0.5" />
                <p className="flex-1 leading-relaxed text-[11px]">{authError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* If Register Mode: Họ và tên */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <UserIcon size={15} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Lê Tiến Phát"
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red focus:ring-1 focus:ring-studio-red transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email tài khoản / Tên tk */}
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                  {authMode === 'register' ? 'Email tài khoản' : 'Email hoặc Tên tài khoản'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail size={15} />
                  </div>
                  <input
                    type={authMode === 'register' ? 'email' : 'text'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      authMode === 'register'
                        ? 'name@gmail.com'
                        : 'name@gmail.com hoặc tên tài khoản'
                    }
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red focus:ring-1 focus:ring-studio-red transition-all"
                  />
                </div>
              </div>

              {/* If Register Mode: Tên tài khoản (tùy chọn) */}
              {authMode === 'register' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] uppercase font-bold tracking-wider text-neutral-300">
                      Tên tài khoản (Username)
                    </label>
                    <span className="text-[10px] text-neutral-500">Tùy chọn</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <AtSign size={15} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ví dụ: letienphat"
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red focus:ring-1 focus:ring-studio-red transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Mật khẩu (mk) */}
              <div>
                <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-300 mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      authMode === 'register'
                        ? 'Tạo mật khẩu (tối thiểu 6 ký tự)...'
                        : 'Nhập mật khẩu của bạn...'
                    }
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-studio-red focus:ring-1 focus:ring-studio-red transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingUser}
                className="w-full py-3 bg-studio-red hover:bg-studio-wine text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-studio-red/20 disabled:opacity-60 mt-4"
              >
                {isLoadingUser ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : authMode === 'register' ? (
                  <>
                    <UserPlus size={15} />
                    <span>Đăng ký tài khoản</span>
                  </>
                ) : (
                  <>
                    <LogIn size={15} />
                    <span>Đăng nhập ngay</span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode Hint */}
            <div className="mt-5 text-center">
              {authMode === 'register' ? (
                <p className="text-xs text-neutral-400">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthError();
                      setAuthMode('login');
                    }}
                    className="text-studio-gold hover:underline font-semibold cursor-pointer"
                  >
                    Đăng nhập tại đây
                  </button>
                </p>
              ) : (
                <p className="text-xs text-neutral-400">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthError();
                      setAuthMode('register');
                    }}
                    className="text-studio-gold hover:underline font-semibold cursor-pointer"
                  >
                    Đăng ký tài khoản mới
                  </button>
                </p>
              )}
            </div>

            <p className="text-[10px] text-neutral-600 text-center mt-5">
              Bằng việc đăng nhập, bạn đồng ý với điều khoản & tiêu chuẩn cộng đồng của 3COVANGOC Studio.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
