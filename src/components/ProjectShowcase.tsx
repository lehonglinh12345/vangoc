import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PROJECTS } from '../data/projects';

export default function ProjectShowcase() {
  const { t } = useLanguage();

  return (
    <section id="projects" className="min-h-screen py-20 md:py-28 bg-[#0A0A0A] overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="h-[1px] w-12 bg-studio-red" />
            <span className="text-studio-red text-[11px] font-bold tracking-[0.4em] uppercase">
              {t.projects?.title || 'Tác phẩm'}
            </span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
            {t.projects?.title || 'DANH MỤC'}
            <br />
            <span className="text-studio-gold">{t.projects?.span || 'SÁNG TẠO'}</span>
          </h2>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {PROJECTS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: idx * 0.1, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true }}
              className="group relative cursor-pointer active:scale-[0.98] transition-transform duration-200"
            >
              <Link
                to={`/project/${item.id}`}
                className="block relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl"
              >
                <img
                  src={item.mainImage}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 will-change-transform"
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

                {/* Content Details */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <span className="text-studio-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-studio-red transition-colors">
                    {item.title}
                  </h3>

                  {/* "Xem chi tiết" hover reveal */}
                  <div className="mt-6 flex items-center gap-2 overflow-hidden">
                    <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      Xem chi tiết
                    </span>
                    <div className="h-[1px] flex-1 bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Teaser Archive Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            viewport={{ once: true }}
            className="group relative cursor-pointer active:scale-[0.98] transition-transform duration-200"
          >
            <div className="relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center p-8 text-center group-hover:border-studio-red/50 transition-all duration-500 h-full">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-studio-red group-hover:text-white transition-all duration-500 text-neutral-400">
                <Layers size={24} />
              </div>
              <h4 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                Kho ý tưởng đồ sộ
              </h4>
              <p className="text-neutral-500 text-xs uppercase tracking-widest leading-relaxed max-w-xs">
                Khám phá hàng chục dự án CGI & Animation đỉnh cao khác của chúng tôi
              </p>
              <div className="mt-8 text-studio-gold text-[10px] font-bold tracking-[0.3em] uppercase border border-studio-gold/20 px-6 py-3 rounded-full group-hover:bg-studio-gold group-hover:text-black transition-all">
                Xem Portfolio
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
