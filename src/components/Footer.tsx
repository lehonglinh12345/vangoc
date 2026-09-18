import { ArrowUp, Facebook, Youtube, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 bg-transparent border-t border-white/5 pt-24 pb-12 overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] text-[20vw] font-black tracking-tighter leading-none whitespace-nowrap z-0 text-white">
        3COVANGOC
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Studio Brand and Description */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col items-start gap-6">
            <div className="flex items-center gap-4">
              <div
                onClick={scrollToTop}
                className="relative w-14 h-14 shrink-0 group cursor-pointer"
              >
                <div className="absolute inset-0 rounded-full bg-studio-red/20 blur-2xl group-hover:bg-studio-red/40 transition-all duration-700" />
                <div className="absolute inset-0 rounded-full border border-white/10 border-t-studio-red animate-spin [animation-duration:8s]" />
                <div className="absolute inset-0 rounded-full border border-studio-red/20 animate-ping opacity-30" />
                <div className="relative w-full h-full rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.15)] group-hover:scale-110 transition-all duration-500">
                  <img
                    src="/images/logo_new.jpg"
                    alt="3covangoc Studio Logo"
                    className="w-full h-full object-cover rounded-full drop-shadow-[0_0_15px_rgba(255,0,0,0.45)] group-hover:rotate-6 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-studio-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-widest uppercase text-white">
                3covangoc Studio
              </span>
            </div>

            <p className="text-neutral-500 text-sm max-w-sm leading-relaxed border-l border-studio-wine pl-4">
              {t.footer.desc}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-studio-gold mb-8">
              {t.footer.nav}
            </h4>
            <ul className="space-y-4">
              {[
                { name: t.nav.projects, id: 'projects' },
                { name: t.nav.services, id: 'services' },
                { name: t.nav.about, id: 'about' },
                { name: t.nav.contact, id: 'contact' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-neutral-400 hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect and Socials */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-studio-gold mb-8">
              {t.footer.connect}
            </h4>
            <div className="space-y-3 mb-8">
              <p className="text-xs text-neutral-400">
                Email: <span className="text-white">3covangocstudio@gmail.com</span>
              </p>
              <p className="text-xs text-neutral-400">
                Hotline: <span className="text-white">084 299 2493</span>
              </p>
              <p className="text-xs text-neutral-400">
                Studio: <span className="text-white">Việt Nam</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/3covangocstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-blue-600 transition-colors"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.youtube.com/@3covangocstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-600 transition-colors"
                title="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@3covangocstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-neutral-800 transition-colors"
                title="TikTok"
              >
                <span className="font-bold text-[11px]">TT</span>
              </a>
              <a
                href="https://www.instagram.com/3covangoc.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-pink-600 transition-colors"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.threads.com/@3covangocstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Threads"
              >
                <span className="font-bold text-[11px]">TH</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <p>{t.footer.copyright}</p>

          {/* Dev Attribution */}
          <div className="flex items-center gap-2 text-[11px]">
            <span>{t.footer.dev.subtitle}</span>
            <span className="font-bold text-white tracking-wider">
              {t.footer.dev.name}
            </span>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest">
              {t.footer.scrollToTop}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-studio-red transition-colors flex items-center justify-center text-white">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}
