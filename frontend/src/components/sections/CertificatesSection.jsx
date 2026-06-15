import { useState } from 'react'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'competition', label: 'Kompetisi' },
  { key: 'training', label: 'Pelatihan' },
]

const TYPE_LABEL = {
  competition: 'Kompetisi',
  training: 'Pelatihan',
  achievement: 'Prestasi',
}

const MedalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" /></svg>
)

export default function CertificatesSection({ certificates }) {
  const [filter, setFilter] = useState('all')

  return (
    <section id="certificates" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">04</span> CERTIFICATES</div>
        <h2 className="sec-title">Prestasi &amp; sertifikasi</h2>
        <p className="sec-sub">Kompetisi, pelatihan, dan sertifikasi yang telah saya selesaikan.</p>
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
        <div className="cert-grid">
          {certificates.map((cert) => {
            const hidden = filter !== 'all' && cert.type !== filter
            const showMedal = cert.type === 'competition' || cert.type === 'achievement'
            return (
              <article key={cert.id} className={`cert-card panel reveal${hidden ? ' hidden' : ''}`} data-type={cert.type}>
                <div className="cert-top">
                  {showMedal && <span className="cert-medal"><MedalIcon /></span>}
                  <span className={`cert-type ${cert.type}`}>{TYPE_LABEL[cert.type] ?? cert.type}</span>
                </div>
                <h4 className="cert-title">{cert.title}</h4>
                <p className="cert-meta">{cert.issuer} · <span className="yr">{cert.year}</span></p>
                {cert.credential_url && (
                  <a className="cert-cred" href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                    Lihat kredensial
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </a>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
