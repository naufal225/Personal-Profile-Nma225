import { useState } from 'react'

const WHATSAPP_URL = 'https://wa.me/6288971155133'

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
)

function TierCard({ tier }) {
  return (
    <div className={`tier panel${tier.recommended ? ' recommended' : ''}`}>
      {tier.recommended && <span className="tier-badge">★ Rekomendasi</span>}
      <div className="tier-name">{tier.name}</div>
      <div className="tier-price">{tier.price}</div>
      <div className="tier-rule" />
      <ul className="tier-feats">
        {(tier.features || []).map((feature, idx) => {
          const isPlus = tier.name !== 'Basic' && idx === 0
          return (
            <li key={idx} className={isPlus ? 'plus' : undefined}>
              <CheckIcon />
              {feature}
            </li>
          )
        })}
      </ul>
      <a className={`btn ${tier.recommended ? 'btn-primary' : 'btn-ghost'} tier-cta`} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
        Hubungi via WhatsApp
      </a>
      {tier.note && <p className="tier-note">{tier.note}</p>}
    </div>
  )
}

export default function ServicesSection({ services }) {
  const list = services || []
  const [activeIdx, setActiveIdx] = useState(0)
  const active = list[activeIdx] || list[0]
  const tiers = active?.metadata?.tiers || []

  return (
    <section id="services" className="container section">
      <div className="sec-head reveal">
        <div className="sec-eyebrow"><span className="bar" /><span className="num">05</span> SERVICES</div>
        <h2 className="sec-title">Paket pembuatan website</h2>
        <p className="sec-sub">Harga jelas dan transparan untuk bisnis Anda. Pilih kategori dan paket yang sesuai kebutuhan.</p>
      </div>

      {!services ? (
        <div className="tiers">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 420 }} />
          ))}
        </div>
      ) : (
        <>
          <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="svc-tabs" role="tablist">
              {list.map((svc, idx) => (
                <button
                  key={svc.id}
                  className={`svc-tab${idx === activeIdx ? ' active' : ''}`}
                  role="tab"
                  aria-selected={idx === activeIdx}
                  onClick={() => setActiveIdx(idx)}
                >
                  {svc.title}
                </button>
              ))}
            </div>
          </div>

          <div className="tiers reveal" style={{ marginTop: 40 }}>
            {tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
