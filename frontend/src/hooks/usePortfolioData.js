import { useState, useEffect } from 'react'
import { getSections } from '../api/sections'
import { getHero } from '../api/hero'
import { getSkills } from '../api/skills'
import { getProjects } from '../api/projects'
import { getExperiences } from '../api/experiences'
import { getEducations } from '../api/educations'
import { getCertificates } from '../api/certificates'
import { getServices } from '../api/services'
import { getContacts } from '../api/contacts'

export function usePortfolioData() {
  const [data, setData] = useState({
    sections: null,
    hero: null,
    skills: null,
    projects: null,
    experiences: null,
    educations: null,
    certificates: null,
    services: null,
    contacts: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      getSections(),
      getHero(),
      getSkills(),
      getProjects(),
      getExperiences(),
      getEducations(),
      getCertificates(),
      getServices(),
      getContacts(),
    ])
      .then(([sections, hero, skills, projects, experiences, educations, certificates, services, contacts]) => {
        setData({
          sections: sections.data.data,
          hero: hero.data.data,
          skills: skills.data.data,
          projects: projects.data.data,
          experiences: experiences.data.data,
          educations: educations.data.data,
          certificates: certificates.data.data,
          services: services.data.data,
          contacts: contacts.data.data,
        })
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { ...data, loading, error }
}
