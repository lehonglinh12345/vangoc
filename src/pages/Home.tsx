import { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import ProjectShowcase from '../components/ProjectShowcase';
import Team from '../components/Team';
import Contact from '../components/Contact';
import TrailerModal from '../components/TrailerModal';

export default function Home() {
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [trailerIndex, setTrailerIndex] = useState(0);

  return (
    <main className="relative z-10">
      <Hero onOpenTrailerModal={(idx) => { setTrailerIndex(idx); setTrailerModalOpen(true); }} />
      <About />
      <Services />
      <ProjectShowcase />
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
