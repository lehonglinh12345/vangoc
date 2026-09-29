import { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import ProjectShowcase from '../components/ProjectShowcase';
import CommentsSection from '../components/CommentsSection';
import Team from '../components/Team';
import Contact from '../components/Contact';
import TrailerModal from '../components/TrailerModal';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, setAuthModalOpen } = useAuth();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailerIndex, setTrailerIndex] = useState(0);

  return (
    <main className="relative z-10">
      <Hero onOpenTrailerModal={(idx) => { setTrailerIndex(idx); setTrailerModalOpen(true); }} />
      <About />
      <Services />
      <ProjectShowcase />

      {/* Audience Feedback & Comments Section - Ngay dưới DANH MỤC SÁNG TẠO */}
      <section id="comments" className="py-20 md:py-28 bg-transparent relative border-t border-white/5 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-studio-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-10 text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-[1px] w-12 bg-studio-gold" />
                <span className="text-studio-gold text-[11px] font-bold tracking-[0.4em] uppercase">
                  Ý Kiến & Cảm Nhận
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                CẢM NHẬN <span className="text-studio-gold">KHÁN GIẢ</span>
              </h2>
              <p className="text-neutral-400 text-sm md:text-base mt-3 max-w-xl font-normal leading-relaxed">
                Những phản hồi, cảm nhận chân thật từ khán giả và cộng đồng mộ điệu dành cho các dự án của 3COVANGOC Studio.
              </p>
            </div>

            <CommentsSection
              projectId="project-1"
              user={user}
              setAuthModalOpen={setAuthModalOpen}
              showLoginPrompt={false}
              showHeader={false}
            />
          </div>
        </div>
      </section>

      <Team />
      <Contact />

      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        trailerIndex={trailerIndex}
      />
    </main>
  );
}
