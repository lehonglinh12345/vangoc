import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, setAuthModalOpen } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer to track active section on Home page
  useEffect(() => {
    if (!isHomePage) return;
    const sections = ['home', 'about', 'services', 'projects', 'team', 'contact'];
    
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomePage]);

  const navItems = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.services, id: 'services' },
    { name: t.nav.projects, id: 'projects' },
    { name: t.nav.team, id: 'team' },
    { name: t.nav.contact, id: 'contact' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'vi', label: 'VN' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: 'JP' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (!isHomePage) {
      navigate('/#' + id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        id="main-navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-6 lg:px-12 flex justify-between items-center will-change-transform ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#0A0A0A]/90 md:bg-[#0A0A0A]/85 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl'
            : 'bg-transparent shadow-none'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            onClick={() => {
              if (isHomePage) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 group cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-studio-red/20 blur-2xl group-hover:bg-studio-red/40 transition-all duration-700" />
            <div className="absolute inset-0 rounded-full border border-white/10 border-t-studio-red animate-spin [animation-duration:8s]" />
            <div className="absolute inset-0 rounded-full border border-studio-red/20 animate-ping opacity-30" />
            <div className="relative w-full h-full rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.15)] group-hover:scale-110 transition-all duration-500">
              <img
                src="/images/logo_new.jpg"
                alt="3covangoc Studio Logo"
                className="w-full h-full object-cover rounded-full drop-shadow-[0_0_15px_rgba(255,0,0,0.45)] group-hover:rotate-6 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="absolute inset-0 bg-studio-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>
          <Link to="/" className="hidden sm:block">
            <div className="w-56 md:w-64 overflow-hidden relative group">
              <motion.div
                className="flex whitespace-nowrap items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                <div className="pr-6 flex items-center">
                  <span className="text-lg md:text-xl font-black tracking-widest uppercase text-yellow-400 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center gap-2">
                    <span className="text-xl">🌕</span> 3COVANGOC STUDIO <span className="text-xl">🏮</span>
                  </span>
                </div>
                <div className="pr-6 flex items-center">
                  <span className="text-lg md:text-xl font-black tracking-widest uppercase text-yellow-400 group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] flex items-center gap-2">
                    <span className="text-xl">🌕</span> 3COVANGOC STUDIO <span className="text-xl">🏮</span>
                  </span>
                </div>
              </motion.div>
              {/* Optional fade edges so it looks smooth entering/exiting */}
              <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {isHomePage &&
            navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-[11px] font-semibold uppercase tracking-[0.3em] transition-all relative py-1 cursor-pointer ${
                    isActive ? 'text-studio-red' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-studio-red"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          {!isHomePage && (
            <Link
              to="/"
              className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors"
            >
              {t.nav.home}
            </Link>
          )}
        </div>

        {/* Right Action Area: Language Switcher + User Profile/Auth + Mobile Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                  language === l.code
                    ? 'bg-studio-red text-white shadow-lg shadow-studio-red/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* User Profile / Login */}
          {user ? (
            <div className="hidden md:flex items-center gap-2.5 bg-white/5 rounded-full p-1 pr-3.5 border border-white/10">
              <Link
                to="/profile"
                className="w-7 h-7 rounded-full overflow-hidden bg-white/10 shrink-0 cursor-pointer hover:ring-2 hover:ring-studio-red transition-all"
                title={user.name}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    <UserIcon size={14} />
                  </div>
                )}
              </Link>
              <Link
                to="/profile"
                className="text-[10px] font-bold text-white uppercase tracking-wider hidden lg:block hover:text-studio-red transition-colors"
              >
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={logout}
                className="text-white/40 hover:text-studio-red transition-colors ml-1 cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden md:block px-4 py-2 bg-studio-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Đăng nhập
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white cursor-pointer p-2 hover:bg-white/5 rounded-full transition-colors z-[60]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[49] bg-[#0A0A0A]/98 flex flex-col items-center justify-center pt-24 pb-12 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col items-center gap-6 relative z-10 w-full max-w-xs text-center">
              {navItems.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * idx }}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm font-bold uppercase tracking-[0.4em] transition-colors pb-2 border-b w-full ${
                      isActive ? 'text-studio-red border-studio-red' : 'text-white/60 border-white/5'
                    }`}
                  >
                    {item.name}
                  </motion.button>
                );
              })}

              {user ? (
                <div className="mt-6 flex flex-col items-center gap-3 w-full">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full w-full justify-center"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={16} className="text-white/50 m-auto mt-2" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-white/50 hover:text-studio-red uppercase tracking-wider"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="mt-6 w-full py-3 bg-studio-red text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
