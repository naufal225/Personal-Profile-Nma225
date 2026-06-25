import { useEffect } from 'react'
import { usePortfolioData } from '../../hooks/usePortfolioData'
import { setFavicon } from '../../utils/favicon'
import { applySeo } from '../../utils/seo'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HeroSection from '../../components/sections/HeroSection'
import SkillsSection from '../../components/sections/SkillsSection'
import ProjectsSection from '../../components/sections/ProjectsSection'
import JourneySection from '../../components/sections/JourneySection'
import CertificatesSection from '../../components/sections/CertificatesSection'
import ServicesSection from '../../components/sections/ServicesSection'
import ContactSection from '../../components/sections/ContactSection'

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

  // Use the hero photo as the browser-tab favicon
  useEffect(() => {
    if (hero?.photo_path) setFavicon(hero.photo_path)
  }, [hero])

  // SEO / Open Graph tags, built from hero data (with static fallbacks)
  useEffect(() => {
    const name = "Naufal Ma'ruf Ashrori"
    applySeo({
      title: hero?.headline ? `${name} — ${hero.headline}` : `${name} — Full-Stack Developer`,
      description:
        hero?.subheadline ||
        'Backend-focused full-stack developer building scalable, fast, and maintainable web systems with Laravel, React, and Go.',
      image: hero?.photo_path,
    })
  }, [hero])

  // Reveal-on-scroll: (re)observe whenever content appears
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [hero, skills, projects, experiences, educations, certificates, services, contacts])

  if (error) {
    return (
      <div className="api-error">
        <div>
          <h2>Failed to load portfolio data</h2>
          <p>Make sure the API server is running, then reload the page.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-glows" aria-hidden="true">
        <span className="glow glow-1" />
        <span className="glow glow-2" />
        <span className="glow glow-3" />
      </div>
      <div className="bg-ambient" aria-hidden="true" />

      <Navbar />

      <main id="top">
        <HeroSection hero={hero} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <JourneySection experiences={experiences} educations={educations} />
        <CertificatesSection certificates={certificates} />
        <ServicesSection services={services} />
        <ContactSection contacts={contacts} />
      </main>

      <Footer />
    </>
  )
}
