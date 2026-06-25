export default function HeroSection({ hero }) {
  return (
    <section id="about" className="container hero">
      <div className="hero-grid">
        <div className="hero-stagger">
          {hero?.available_for_work !== false && (
            <span className="badge-status">
              <span className="pulse"><span /><span /></span>
              Available for new projects
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
              'I design and build scalable web systems with a strong focus on backend architecture, performance, and maintainability.'}
          </p>

          <div className="hero-cta">
            <a className="btn btn-primary btn-lg" href="#contact">
              Let&apos;s talk
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
            <a className="btn btn-ghost btn-lg" href="#projects">
              View Projects
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat"><div className="k">5<span className="accent">+</span></div><div className="l">Projects delivered</div></div>
            <div className="stat-div" />
            <div className="stat"><div className="k">Top <span className="accent">6</span></div><div className="l">National LKS IT &apos;25</div></div>
            <div className="stat-div" />
            <div className="stat"><div className="k">12<span className="accent">+</span></div><div className="l">Certificates &amp; competitions</div></div>
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
