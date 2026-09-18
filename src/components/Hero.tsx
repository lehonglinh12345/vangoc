import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onOpenTrailerModal: () => void;
}

export default function Hero({ onOpenTrailerModal }: HeroProps) {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background with Ambient Gradients */}
      <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0 will-change-transform">
          <img
            src="/images/background.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover md:object-[center_20%] scale-[1.08] md:scale-105 opacity-60 filter brightness-90"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/75 to-[#0A0A0A] z-10" />
        
        {/* Radial Lighting Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(220,38,38,0.18)_0%,rgba(0,0,0,0)_70%)] rounded-full z-1 transform-gpu pointer-events-none hidden md:block" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[radial-gradient(circle,rgba(220,38,38,0.1)_0%,rgba(0,0,0,0)_70%)] rounded-full z-1 transform-gpu pointer-events-none hidden md:block" />
      </div>

      {/* Floating Animated Geometric Elements */}
      <motion.div
        className="absolute top-1/3 left-10 w-24 h-24 border border-studio-gold/20 rotate-45 rounded-lg md:backdrop-blur-sm z-10 pointer-events-none hidden lg:block"
        animate={{ rotate: 405, y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-10 w-32 h-32 border border-studio-red/30 -rotate-12 rounded-full md:backdrop-blur-sm z-10 pointer-events-none hidden lg:block"
        animate={{ scale: [1, 1.06, 1], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Typography and CTAs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.2 },
              },
            }}
            className="col-span-12 xl:col-span-7 text-left will-change-opacity"
          >
            {/* Tag */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
              }}
              className="editorial-tag mb-6"
            >
              <span /> {t.hero.tag}
            </motion.h2>

            {/* Main Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] },
                },
              }}
              className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-8 leading-[0.92] tracking-tighter will-change-transform"
            >
              {t.hero.title1} <br />
              <span className="inline-block px-2 py-1 text-transparent bg-clip-text bg-gradient-to-r from-studio-red via-rose-400 to-studio-wine italic font-serif">
                {t.hero.title2}
              </span>
              <br />
              {t.hero.title3}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
              className="max-w-md text-white/60 text-sm md:text-base mb-10 font-light leading-relaxed border-l-2 border-studio-wine pl-4"
            >
              {t.hero.desc}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              }}
              className="flex flex-wrap items-center gap-5"
            >
              <div className="group relative">
                <div className="absolute -inset-2 bg-studio-red opacity-25 blur group-hover:opacity-60 transition duration-500 rounded-lg" />
                <motion.button
                  onClick={() => scrollToSection('projects')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative px-8 sm:px-10 py-4 bg-studio-red text-white font-bold uppercase tracking-widest text-xs transition-all cursor-pointer shadow-lg shadow-studio-red/30 rounded-sm"
                >
                  {t.hero.viewProjects}
                </motion.button>
              </div>

              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="px-8 sm:px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-center cursor-pointer rounded-sm"
              >
                {t.hero.sendEmail}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column: Video Trailer Display Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true }}
            className="col-span-12 xl:col-span-5 relative mt-6 xl:mt-0 max-w-xs sm:max-w-sm md:max-w-md xl:max-w-[360px] 2xl:max-w-[400px] mx-auto xl:ml-auto xl:mr-0 w-full will-change-transform"
          >
            <div className="relative group cursor-pointer" onClick={onOpenTrailerModal}>
              {/* Radial glow */}
              <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(220,38,38,0.25)_0%,rgba(0,0,0,0)_70%)] opacity-100 xl:opacity-40 xl:group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Video Container Frame */}
              <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                {/* Embed Facebook reel trailer with click-to-open fallback */}
                <iframe
                  src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1467677221505904&show_text=false&t=0&autoplay=1&muted=1"
                  className="w-full h-full border-none overflow-hidden transition-all duration-700 group-hover:scale-105 pointer-events-none"
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  title="3COVANGOC Trailer Reel"
                />

                {/* Vignette Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Scanline CRT overlay effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full bg-studio-red/90 group-hover:bg-studio-red text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Play size={18} className="ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 pointer-events-none z-20 flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-studio-red animate-ping" />
                      <span className="text-[9px] text-white/60 uppercase font-bold tracking-widest">
                        {t.hero.deepProject}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-tight drop-shadow-md">
                      TRAILER NHÀ CÓ GIỖ
                    </h3>
                  </div>

                  <span className="text-[9px] uppercase font-bold tracking-wider text-studio-gold bg-black/70 px-2 py-0.5 rounded border border-studio-gold/30">
                    {t.hero.trailer}
                  </span>
                </div>
              </div>

              {/* High-tech Corner Accents */}
              <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-studio-red opacity-80 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute -bottom-1.5 -left-1.5 md:-bottom-2 md:-left-2 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-studio-red opacity-80 group-hover:opacity-100 transition-all duration-500" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Downward Scroll Indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        onClick={() => scrollToSection('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 will-change-opacity cursor-pointer z-20 group"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-studio-gold transition-colors">
          {t.hero.scroll}
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-studio-gold to-transparent" />
      </motion.div>
    </section>
  );
}
