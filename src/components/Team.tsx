import { motion } from 'motion/react';
import { Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TeamMember } from '../types';

export default function Team() {
  const { t } = useLanguage();

  const membersMeta: { image: string; position: 'top' | 'center' | 'bottom'; facebook?: string }[] = [
    { image: "/images/lekimtho.png", position: "center", facebook: "https://www.facebook.com/kimtho.le.946" },
    { image: "/images/letienphat.png", position: "top", facebook: "https://www.facebook.com/tien.phat.le.181361" },
    { image: "/images/trichibao.png", position: "top", facebook: "https://www.facebook.com/TrinhChiBao2611" }
  ];

  const teamList: TeamMember[] = t.team.members.map((m, idx) => ({
    name: m.name,
    role: m.role,
    image: membersMeta[idx]?.image || '/images/logo.png',
    position: membersMeta[idx]?.position || 'center',
    facebook: membersMeta[idx]?.facebook,
  }));

  const renderTitle = () => {
    const title = t.team.title;
    if (title.includes('NHÀ BA CÔ')) {
      const parts = title.split('NHÀ BA CÔ');
      return (
        <>
          {parts[0]}
          <span className="inline-block px-2 py-1 text-transparent bg-clip-text bg-gradient-to-r from-studio-red to-studio-wine italic">
            NHÀ BA CÔ
          </span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <section id="team" className="min-h-screen py-24 md:py-32 bg-transparent flex items-center">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-center flex flex-col items-center">
          <h2 className="editorial-tag mb-6 md:mb-8">
            <span /> {t.team.tag}
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
            {renderTitle()}
          </h3>
          <p className="text-neutral-500 text-xs md:text-sm uppercase tracking-[0.4em]">
            {t.team.desc}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamList.map((person, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: idx * 0.12, ease: [0.76, 0, 0.24, 1] }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="bg-neutral-900/40 backdrop-blur-md p-3 rounded-2xl border border-white/5 hover:border-studio-red/40 transition-all group duration-500 shadow-xl"
            >
              {/* Image with zoom effect */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-6 bg-neutral-950">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectPosition: person.position }}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
              </div>

              {/* Info */}
              <div className="text-center pb-4 px-2">
                <h4 className="text-xl font-bold mb-1 group-hover:text-studio-gold transition-colors text-white">
                  {person.name}
                </h4>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
                  {person.role}
                </p>

                {person.facebook && (
                  <a
                    href={person.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-[#1877F2] transition-colors py-1 px-3 rounded-full hover:bg-white/5"
                  >
                    <Facebook size={14} /> Facebook
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
