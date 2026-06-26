import { formatDate, formatYear } from '../../utils/formatDate'

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
)
const CapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
)

function TimelineItem({ icon, fallback, date, title, org, description, tags }) {
  return (
    <div className="tl-item">
      <span className={`tl-ic${icon ? ' has-img' : ''}`}>
        {icon ? <img src={icon} alt="" loading="lazy" /> : fallback}
      </span>
      <div className="tl-date">{date}</div>
      <div className="tl-title">{title}</div>
      {org && <div className="tl-org">{org}</div>}
      {description && <p className="tl-desc">{description}</p>}
      {tags?.length > 0 && (
        <div className="tl-tags">
          {tags.map((t) => <span key={t} className="tl-tag">{t}</span>)}
        </div>
      )}
    </div>
  )
}

export default function JourneySection({ experiences, educations, num = '03' }) {
  return (
    <section id="journey" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">{num}</span> JOURNEY</div>
        <h2 className="sec-title">My journey</h2>
        <p className="sec-sub">Work experience and education — where I've grown and learned.</p>
      </div>

      <div className="journey-grid">
        <div className="reveal">
          <div className="col-head">
            <span className="ic"><BriefcaseIcon /></span>
            <h3>Experience</h3>
          </div>
          {(experiences || []).map((exp) => (
            <TimelineItem
              key={exp.id}
              icon={exp.icon}
              fallback={<BriefcaseIcon />}
              date={`${formatDate(exp.start_date)} — ${formatDate(exp.end_date)}`}
              title={exp.title}
              org={exp.organization}
              description={exp.description}
              tags={exp.skills}
            />
          ))}
        </div>

        <div className="reveal">
          <div className="col-head">
            <span className="ic"><CapIcon /></span>
            <h3>Education</h3>
          </div>
          {(educations || []).map((edu) => (
            <TimelineItem
              key={edu.id}
              icon={edu.icon}
              fallback={<CapIcon />}
              date={`${formatYear(edu.start_year)} — ${formatYear(edu.end_year)}`}
              title={edu.institution}
              org={edu.major}
              description={edu.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
