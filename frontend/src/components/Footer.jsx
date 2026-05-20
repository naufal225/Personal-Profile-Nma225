import Container from './ui/Container'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-white/[0.06] bg-white/40 dark:bg-ink-950/20 backdrop-blur-sm pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 md:gap-16 pb-12 border-b border-slate-200 dark:border-white/[0.06]">
          {/* Brand/Bio Column */}
          <div className="space-y-4">
            <a href="#top" className="flex items-center gap-2 group w-fit">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-500/20">
                N
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                Naufal<span className="text-violet-600 dark:text-violet-400">.</span>
              </span>
            </a>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-sm">
              Full-stack Web Developer specializing in building high-performance, elegant, and maintainable applications using Laravel &amp; React.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="#about" className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">About</a>
              <a href="#skills" className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Skills</a>
              <a href="#projects" className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Projects</a>
              <a href="#journey" className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Journey</a>
              <a href="#services" className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Services</a>
              <a href="#contact" className="text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200">Contact</a>
            </div>
          </div>

          {/* Connect Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest">
              Connect
            </h4>
            <div className="flex gap-3">
              <SocialLink href="https://github.com/naufalmarufashrori" label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com/in/naufalmarufashrori" label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </SocialLink>
              <SocialLink href="mailto:naufalmarufashrori225@gmail.com" label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Footer Bottom info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs text-slate-500 dark:text-zinc-500">
          <p>
            © {year} <span className="text-slate-700 dark:text-zinc-300">Naufal Marufa Ashrori</span>. Built with
            <span className="text-violet-600 dark:text-violet-400"> Laravel</span> &amp;
            <span className="text-violet-600 dark:text-violet-400"> React</span>.
          </p>
          <p className="font-mono text-slate-400 dark:text-zinc-600">
            Designed &amp; coded with care.
          </p>
        </div>
      </Container>
    </footer>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-zinc-400 hover:text-violet-700 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-500/[0.06] hover:-translate-y-0.5 transition-all duration-300"
    >
      {children}
    </a>
  )
}
