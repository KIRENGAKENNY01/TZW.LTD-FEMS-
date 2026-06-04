import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { StatsStrip } from './StatsStrip';
import { ServicesSection } from './ServicesSection';
import { AboutSection } from './AboutSection';
import { StatsCounter } from './StatsCounter';
import { WhyUsSection } from './WhyUsSection';
import { DarkCTASection } from './DarkCTASection';
import { TeamSection } from './TeamSection';
import { ContactSection } from './ContactSection';
import { BlogSection } from './BlogSection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <ServicesSection />
        <AboutSection />
        <StatsCounter />
        <WhyUsSection />
        <DarkCTASection />
        <TeamSection />
        <ContactSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}
