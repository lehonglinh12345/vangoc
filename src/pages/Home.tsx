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

  return (
    <main className="relative z-10">
      <Hero onOpenTrailerModal={() => setTrailerModalOpen(true)} />
      <About />
      <Services />
      <ProjectShowcase />
      <Team />
      <Contact />

      <TrailerModal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
      />
    </main>
  );
}
