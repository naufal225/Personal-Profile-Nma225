import { useState, useEffect } from 'react'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'competition', label: 'Competition' },
  { key: 'training', label: 'Training' },
]

const TYPE_LABEL = {
  competition: 'Competition',
  training: 'Training',
  achievement: 'Achievement',
}

const MedalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /></svg>
)

export default function CertificatesSection({ certificates, num = '04' }) {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <section id="certificates" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">{num}</span> CERTIFICATES</div>
        <h2 className="sec-title">Achievements &amp; certifications</h2>
        <p className="sec-sub">Competitions, training, and certifications I've completed.</p>
      </div>

      <div className="cert-filter reveal">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`cert-pill${filter === f.key ? ' active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!certificates ? (
        <div className="cert-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
      ) : (
        <div className="cert-grid reveal">
          {certificates.map((cert) => {
            const hidden = filter !== 'all' && cert.type !== filter
            const showMedal = cert.type === 'competition' || cert.type === 'achievement'
            const hasImage = !!cert.image_path
            return (
              <article
                key={cert.id}
                className={`cert-card panel${hidden ? ' hidden' : ''}${hasImage ? ' clickable' : ''}`}
                data-type={cert.type}
                onClick={hasImage ? () => setLightbox(cert.image_path) : undefined}
              >
                <div className="cert-top">
                  {showMedal && <span className="cert-medal"><MedalIcon /></span>}
                  <span className={`cert-type ${cert.type}`}>{TYPE_LABEL[cert.type] ?? cert.type}</span>
                </div>
                <h4 className="cert-title">{cert.title}</h4>
                <p className="cert-meta">{cert.issuer} · <span className="yr">{cert.year}</span></p>
                {cert.credential_url && (
                  <a className="cert-cred" href={cert.credential_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    View credential
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </a>
                )}
                {hasImage && (
                  <span className="cert-view">
                    View certificate
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                  </span>
                )}
              </article>
            )
          })}
        </div>
      )}

      {lightbox && (
        <div className="cert-lightbox" onClick={() => setLightbox(null)}>
          <button className="cert-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <img src={lightbox} alt="Certificate" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}
