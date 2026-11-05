import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Reveal } from '@/components/scroll/Reveal';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { Services } from '@/components/sections/Services';
import { Skills } from '@/components/sections/Skills';

export default function Home() {
  return (
    <>
      <Header />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Services />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <FloatingWhatsApp />
      <Reveal />
    </>
  );
}
