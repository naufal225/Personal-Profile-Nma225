import { useState } from 'react'
import SectionHeader from '../ui/SectionHeader'
import Container from '../ui/Container'

const WHATSAPP_URL = 'https://wa.me/62XXXXXXXXXX'

const SERVICES_DATA = [
  {
    id: 'kontraktor',
    label: 'Kontraktor',
    tiers: [
      {
        name: 'Basic',
        price: 'Rp3.250.000',
        recommended: false,
        note: 'Cocok untuk kontraktor yang ingin tampil profesional secara online.',
        features: [
          'Website company profile statis',
          'Halaman: Home, Tentang, Layanan, Portfolio, Kontak',
          'Tombol kontak WhatsApp',
          'Mobile responsive',
          'Domain .com 1 tahun',
          'Shared hosting 1 tahun',
          'SSL',
        ],
      },
      {
        name: 'Professional',
        price: 'Rp5.250.000',
        recommended: true,
        note: 'Untuk kontraktor yang ingin kelola konten mandiri tanpa developer.',
        features: [
          'Semua yang ada di Basic, plus:',
          'CMS portfolio proyek',
          'Update proyek mandiri',
          'Galeri proyek dinamis',
          'SEO basic',
          'Halaman layanan dinamis',
        ],
      },
      {
        name: 'Business',
        price: 'Rp8.250.000',
        recommended: false,
        note: 'Solusi lengkap untuk kontraktor skala menengah ke atas.',
        features: [
          'Semua yang ada di Professional, plus:',
          'Inquiry form penawaran',
          'Permintaan penawaran masuk ke email admin',
          'Upload company profile PDF',
          'Multi layanan',
          'Form otomatis ke WhatsApp / email admin',
        ],
      },
    ],
  },
  {
    id: 'klinik',
    label: 'Klinik',
    tiers: [
      {
        name: 'Basic',
        price: 'Rp3.750.000',
        recommended: false,
        note: 'Untuk klinik yang ingin punya kehadiran online yang kredibel.',
        features: [
          'Profil klinik',
          'Halaman: Layanan, Dokter, Maps, Kontak',
          'Domain 1 tahun',
          'Hosting 1 tahun',
          'SSL',
        ],
      },
      {
        name: 'Professional',
        price: 'Rp5.750.000',
        recommended: true,
        note: 'Untuk klinik yang ingin aktif publish konten dan info dokter.',
        features: [
          'Semua yang ada di Basic, plus:',
          'CMS artikel kesehatan',
          'Jadwal dokter editable',
          'Promo layanan',
          'Galeri fasilitas',
        ],
      },
      {
        name: 'Business',
        price: 'Rp8.750.000',
        recommended: false,
        note: 'Untuk klinik yang ingin terima reservasi langsung dari website.',
        features: [
          'Semua yang ada di Professional, plus:',
          'Booking form reservasi layanan',
          'Notifikasi email ke admin',
          'Booking diteruskan ke WhatsApp admin',
        ],
      },
    ],
  },
]

export default function ServicesSection() {
  const [activeId, setActiveId] = useState('kontraktor')
  const active = SERVICES_DATA.find((c) => c.id === activeId) ?? SERVICES_DATA[0]

  return (
    <section id="services" className="py-20 sm:py-24">
      <Container>
        <SectionHeader
          number="06"
          title="Services"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          }
          subtitle="Paket harga website siap pakai untuk bisnis Anda. Pilih kategori dan tier yang sesuai."
        />

        <div className="flex justify-center mb-10 sm:mb-12">
          <div role="tablist" aria-label="Service categories" className="inline-flex gap-2 p-1 rounded-full border border-[#3B82F6]/25 bg-white/60 dark:bg-[#0A1628]/60 dark:border-[#3B82F6]/15">
            {SERVICES_DATA.map((cat) => {
              const isActive = cat.id === activeId
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(cat.id)}
                  className={
                    'px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ' +
                    (isActive
                      ? 'bg-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                      : 'bg-transparent text-[#475569] dark:text-[#64748B] border border-[#3B82F6]/30 dark:border-[#3B82F6]/20 hover:border-[#3B82F6]/60 dark:hover:border-[#3B82F6]/40 hover:text-[#1E3A8A] dark:hover:text-[#94A3B8]')
                  }
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <div
          key={activeId}
          className="animate-fade-in-up grid gap-5 lg:grid-cols-3 items-stretch"
        >
          {active.tiers.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function TierCard({ tier }) {
  const containerCls = tier.recommended
    ? 'relative flex flex-col h-full rounded-[12px] p-6 sm:p-7 bg-[#EFF6FF] dark:bg-[#0F1F3D] border border-[rgba(59,130,246,0.6)] dark:border-[rgba(59,130,246,0.5)] shadow-[0_0_24px_rgba(59,130,246,0.18)] dark:shadow-[0_0_24px_rgba(59,130,246,0.12)] lg:-translate-y-2'
    : 'relative flex flex-col h-full rounded-[12px] p-6 sm:p-7 bg-[#F8FAFC] dark:bg-[#0A1628] border-[0.5px] border-[rgba(59,130,246,0.25)] dark:border-[rgba(59,130,246,0.15)]'

  const ctaCls = tier.recommended
    ? 'block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 bg-[#3B82F6] text-white hover:bg-[#2563EB]'
    : 'block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 border border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/15'

  return (
    <div className={containerCls}>
      {tier.recommended && (
        <span className="absolute -top-3 right-5 bg-[#3B82F6] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)]">
          ★ Recommended
        </span>
      )}

      <div className="text-[14px] tracking-[0.08em] uppercase text-[#475569] dark:text-[#94A3B8]">
        {tier.name}
      </div>
      <div className="text-[28px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-2">
        {tier.price}
      </div>

      <div className="my-5 border-t-[0.5px] border-[rgba(59,130,246,0.2)] dark:border-[rgba(59,130,246,0.1)]" />

      <ul className="space-y-3">
        {tier.features.map((feature, idx) => {
          const isPlusLine = tier.name !== 'Basic' && idx === 0
          return (
            <li
              key={idx}
              className={
                'flex gap-2.5 items-start text-[13px] leading-[1.8] ' +
                (isPlusLine ? 'text-[#3B82F6] font-medium' : 'text-[#334155] dark:text-[#CBD5E1]')
              }
            >
              <svg
                className="w-4 h-4 mt-0.5 text-[#3B82F6] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{feature}</span>
            </li>
          )
        })}
      </ul>

      <div className="flex-grow" />

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={'mt-6 ' + ctaCls}
      >
        Hubungi via WhatsApp
      </a>

      <p className="mt-3 text-[11px] italic text-[#64748B] dark:text-[#475569] text-center">
        {tier.note}
      </p>
    </div>
  )
}
