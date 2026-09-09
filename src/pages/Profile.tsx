import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Check,
  Heart,
  Shield,
  Loader2,
  Camera,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROJECTS } from '../data/projects';

export default function Profile() {
  const { user, updateUser, logout, signInWithGoogle, setAuthModalOpen } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadMsg, setAvatarUploadMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form inputs when user changes or finishes loading
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-studio-gold">
          <UserIcon size={28} />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-2">
          Bạn chưa đăng nhập
        </h2>
        <p className="text-neutral-400 text-sm max-w-sm mb-6">
          Vui lòng đăng nhập hoặc đăng ký tài khoản để xem hồ sơ và quản lý hoạt động cá nhân của bạn.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 bg-studio-red hover:bg-studio-wine text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <UserIcon size={14} />
            <span>Đăng nhập / Đăng ký</span>
          </button>
          <button
            onClick={() => signInWithGoogle()}
            className="px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
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
            <span>Google</span>
          </button>
          <Link
            to="/"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors border border-white/10"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  // Compress and resize avatar file for quick loading and Firestore storage
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WEBP).'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploadingAvatar(true);
    setAvatarUploadMsg(null);
    try {
      const dataUrl = await processImageFile(file);
      await updateUser({ avatar: dataUrl });
      setAvatarUploadMsg('Cập nhật ảnh đại diện thành công!');
      setTimeout(() => setAvatarUploadMsg(null), 3500);
    } catch (err: any) {
      console.error('Lỗi đổi ảnh đại diện:', err);
      setAvatarUploadMsg(err.message || 'Không thể tải ảnh lên.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle saving ONLY the currently logged-in account
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Lỗi lưu hồ sơ:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-20">
      {/* Hidden file input for direct avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Top Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-studio-gold transition-colors py-2 px-4 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft size={14} /> Quay lại trang chủ
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="glass-card p-6 md:p-10 rounded-3xl border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-studio-red/10 rounded-full blur-3xl pointer-events-none" />

          {avatarUploadMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs animate-in fade-in">
              <Check size={15} className="text-emerald-400 shrink-0" />
              <span>{avatarUploadMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            {/* User Avatar with Click-to-Upload trigger */}
            <div className="relative shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-studio-red/50 bg-neutral-900 shadow-2xl group cursor-pointer"
                title="Bấm để tải ảnh mới từ máy tính của bạn"
              >
                <img
                  src={user.avatar || '/images/logo.png'}
                  alt={user.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/logo.png';
                  }}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1 text-center p-1.5">
                  <Camera size={22} className="text-studio-gold" />
                  <span>Bấm đổi ảnh</span>
                </div>

                {/* Loading state overlay */}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1.5 z-20">
                    <Loader2 size={20} className="animate-spin text-studio-gold" />
                    <span>Đang tải...</span>
                  </div>
                )}
              </div>

              {/* Camera badge trigger on corner */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-studio-red hover:bg-studio-wine text-white border-2 border-[#0A0A0A] shadow-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer z-10"
                title="Bấm để tải ảnh mới từ máy tính"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-studio-gold/10 border border-studio-gold/30 text-[10px] font-bold text-studio-gold uppercase tracking-wider flex items-center gap-1">
                  <Shield size={11} /> {user.id.startsWith('u_') ? 'Tài khoản Thành viên' : 'Tài khoản Google'}
                </span>
              </div>

              <p className="text-sm text-neutral-400 mb-2">
                <span className="text-neutral-500">Email:</span> {user.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-studio-gold hover:text-white transition-colors cursor-pointer font-medium"
                >
                  <Camera size={13} />
                  <span>Bấm vào ảnh để tải ảnh mới lên</span>
                </button>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Đã xác thực</span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/5 hover:bg-studio-red/20 text-neutral-300 hover:text-studio-red border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                Chỉnh sửa thông tin hồ sơ
              </h2>
            </div>
            <span className="text-xs font-mono text-studio-gold bg-studio-gold/10 px-2.5 py-1 rounded-lg border border-studio-gold/20">
              {user.email}
            </span>
          </div>

          {isSaved && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs animate-in fade-in">
              <Check size={16} className="text-emerald-400 shrink-0" />
              <span>
                Cập nhật thành công! Thông tin tài khoản <strong>{name}</strong> đã được lưu lên Database.
              </span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Profile fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2">
                  Tên hiển thị của bạn
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ tên của bạn..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-studio-red"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2">
                  Email tài khoản
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-neutral-400 cursor-not-allowed opacity-80"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 bg-studio-red hover:bg-studio-wine disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-studio-red/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang lưu vào Firestore...</span>
                  </>
                ) : (
                  'Lưu thông tin tài khoản'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Featured Projects Highlight */}
        <div>
          <h2 className="text-base font-bold uppercase tracking-wider text-white mb-4">
            Dự án đề xuất
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROJECTS.map((proj) => (
              <Link
                key={proj.id}
                to={`/project/${proj.id}`}
                className="glass-card p-4 rounded-2xl border-white/10 hover:border-studio-red/40 transition-all flex items-center gap-4 group"
              >
                <img
                  src={proj.mainImage}
                  alt={proj.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-studio-gold transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-neutral-400">{proj.category}</p>
                  <div className="flex items-center gap-1 text-[10px] text-studio-red mt-1">
                    <Heart size={10} className="fill-studio-red" />
                    <span>{proj.likes || 388} lượt thích</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
