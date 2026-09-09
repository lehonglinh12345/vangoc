import { motion } from 'motion/react';
import { Box, Sparkles, Palette, Video, BookOpen, Film } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      title: t.services.items.animation.title,
      desc: t.services.items.animation.desc,
      icon: <Box className="w-8 h-8 text-studio-red" />,
    },
    {
      title: t.services.items.motion.title,
      desc: t.services.items.motion.desc,
      icon: <Sparkles className="w-8 h-8 text-studio-gold" />,
    },
    {
      title: t.services.items.branding.title,
      desc: t.services.items.branding.desc,
      icon: <Palette className="w-8 h-8 text-studio-red" />,
    },
    {
      title: t.services.items.editing.title,
      desc: t.services.items.editing.desc,
      icon: <Video className="w-8 h-8 text-studio-gold" />,
    },
    {
      title: t.services.items.storytelling.title,
      desc: t.services.items.storytelling.desc,
      icon: <BookOpen className="w-8 h-8 text-studio-red" />,
    },
    {
      title: t.services.items.production.title,
      desc: t.services.items.production.desc,
      icon: <Film className="w-8 h-8 text-studio-gold" />,
    },
  ];

  const renderTitle = () => {
    const title = t.services.title;
    if (title.includes('SÁNG TẠO')) {
      const parts = title.split('SÁNG TẠO');
      return (
        <>
          {parts[0]}
          <span className="inline-block px-2 py-1 text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-studio-wine italic">
            SÁNG TẠO
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section id="services" className="min-h-screen py-20 md:py-28 bg-transparent relative overflow-hidden flex items-center">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-14 md:mb-20 text-center flex flex-col items-center">
          <h2 className="editorial-tag mb-6 md:mb-8">
            <span /> {t.services.tag}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase max-w-3xl">
            {renderTitle()}
          </h3>
          <p className="text-neutral-500 text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em]">
            {t.services.desc}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: idx * 0.08, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -8 }}
              className="bg-neutral-950/80 p-8 md:p-10 rounded-2xl border border-white/5 group hover:border-studio-red/40 transition-all duration-500 relative overflow-hidden will-change-transform cursor-default shadow-xl"
            >
              {/* Dynamic decorative line */}
              <div className="w-8 h-[2px] bg-studio-red mb-6 transition-all duration-300 group-hover:w-16" />

              <div className="mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                {item.icon}
              </div>

              <h4 className="text-sm md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] mb-3 text-neutral-300 group-hover:text-white transition-colors">
                {item.title}
              </h4>

              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-light tracking-wide">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
