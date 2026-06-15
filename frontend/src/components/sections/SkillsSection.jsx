function groupByCategory(skills) {
  const groups = []
  const index = new Map()
  for (const s of skills) {
    const cat = s.category || 'Other'
    if (!index.has(cat)) {
      index.set(cat, groups.length)
      groups.push({ category: cat, items: [] })
    }
    groups[index.get(cat)].items.push(s)
  }
  return groups
}

export default function SkillsSection({ skills }) {
  const groups = skills ? groupByCategory(skills) : []

  return (
    <section id="skills" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">01</span> SKILLS</div>
        <h2 className="sec-title">Teknologi yang saya gunakan</h2>
        <p className="sec-sub">Tools dan teknologi untuk membangun aplikasi web yang performan dan mudah dirawat.</p>
      </div>

      {!skills ? (
        <div className="skills-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 140 }} />
          ))}
        </div>
      ) : (
        <div className="skills-grid">
          {groups.map((group, idx) => {
            const fullWidth = idx === groups.length - 1 && groups.length % 2 === 1
            return (
              <div
                key={group.category}
                className="skill-group panel reveal"
                style={fullWidth ? { gridColumn: '1 / -1' } : undefined}
              >
                <div className="skill-group-head"><span className="dot" /><h3>{group.category}</h3></div>
                <div className="skill-items">
                  {group.items.map((s) => (
                    <span key={s.id} className="skill-chip">
                      {s.icon && <img src={s.icon} alt="" loading="lazy" />}
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
