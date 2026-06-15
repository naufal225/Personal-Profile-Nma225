export default function HeroSection({ hero }) {
  return (
    <section id="about" className="container hero">
      <div className="hero-grid">
        <div className="hero-stagger">
          {hero?.available_for_work !== false && (
            <span className="badge-status">
              <span className="pulse"><span /><span /></span>
              Tersedia untuk proyek baru
            </span>
          )}

          <h1 className="hero-name">
            Naufal Ma&apos;ruf<br />Ashrori<span className="accent">.</span>
          </h1>

          <p className="hero-role">
            <span className="blink">&gt;</span> {hero?.headline || 'Backend-Focused Full-Stack Developer'}
          </p>

          <p className="hero-desc">
            {hero?.subheadline ||
              'Saya merancang dan membangun sistem web yang skalabel dengan fokus kuat pada arsitektur backend, performa, dan kemudahan perawatan.'}
          </p>

          <div className="hero-cta">
            <a
              className="btn btn-primary btn-lg"
              href={hero?.resume_url || '#'}
              {...(hero?.resume_url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Download Resume
            </a>
            <a className="btn btn-ghost btn-lg" href="#contact">
              Mari bicara
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat"><div className="k">5<span className="accent">+</span></div><div className="l">Proyek dikerjakan</div></div>
            <div className="stat-div" />
            <div className="stat"><div className="k">Top <span className="accent">6</span></div><div className="l">LKS IT Nasional &apos;25</div></div>
            <div className="stat-div" />
            <div className="stat"><div className="k">12<span className="accent">+</span></div><div className="l">Sertifikat &amp; lomba</div></div>
          </div>
        </div>

        <div className="portrait-wrap hero-anim">
          <div className="portrait">
            {hero?.photo_path ? (
              <img src={hero.photo_path} alt="Naufal Ma'ruf Ashrori" />
            ) : (
              <div className="placeholder">
                <span className="glyph">N</span>
                <span className="hint">naufal.jpg</span>
              </div>
            )}
            <div className="portrait-ring" />
          </div>
          <div className="portrait-tag"><b>&lt;/&gt;</b> full-stack · Laravel + React</div>
        </div>
      </div>
    </section>
  )
}
