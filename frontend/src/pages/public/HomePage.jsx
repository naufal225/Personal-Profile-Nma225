import { usePortfolioData } from '../../hooks/usePortfolioData'
import SectionRail from '../../components/SectionRail'
import Footer from '../../components/Footer'
import HeroSection from '../../components/sections/HeroSection'
import SkillsSection from '../../components/sections/SkillsSection'
import ProjectsSection from '../../components/sections/ProjectsSection'
import JourneySection from '../../components/sections/JourneySection'
import CertificatesSection from '../../components/sections/CertificatesSection'
import ServicesSection from '../../components/sections/ServicesSection'
import ContactSection from '../../components/sections/ContactSection'
import ScrollReveal from '../../components/ui/ScrollReveal'

export default function HomePage() {
  const {
    hero,
    skills,
    projects,
    experiences,
    educations,
    certificates,
    services,
    contacts,
    error,
  } = usePortfolioData()

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-ink-950">
        <div className="text-center">
          <p className="text-rose-600 dark:text-rose-400 font-medium mb-2">Failed to load portfolio data</p>
          <p className="text-sm text-slate-500 dark:text-zinc-500">Please make sure the API server is running.</p>
        </div>
      </div>
    )
  }

  return (
    <div id="top" className="relative min-h-screen bg-slate-50 dark:bg-ink-950 text-slate-700 dark:text-zinc-300 overflow-x-hidden">
      {/* Ambient gradient blobs (decorative) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] max-w-[80vw] rounded-full bg-violet-400/20 dark:bg-violet-500/10 blur-3xl" />
        <div className="absolute top-[40%] -left-32 w-[420px] h-[420px] max-w-[80vw] rounded-full bg-indigo-400/15 dark:bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-[20%] w-[380px] h-[380px] max-w-[80vw] rounded-full bg-fuchsia-400/10 dark:bg-fuchsia-500/[0.06] blur-3xl" />
      </div>

      <SectionRail />

      <main className="space-y-4">
        <HeroSection hero={hero} />
        
        <ScrollReveal direction="up" delay={100}>
          <SkillsSection skills={skills} />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <ProjectsSection projects={projects} />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <JourneySection experiences={experiences} educations={educations} />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <CertificatesSection certificates={certificates} />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <ServicesSection services={services} />
        </ScrollReveal>
        
        <ScrollReveal direction="up" delay={100}>
          <ContactSection contacts={contacts} />
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  )
}
