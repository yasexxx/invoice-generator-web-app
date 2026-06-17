import { Brand } from '@/components/ui'

const FOOTER_COLS = [
  {
    heading: 'Product',
    links: [{ label: 'Terms of Service' }, { label: 'Privacy Policy' }],
  },
  {
    heading: 'Support',
    links: [{ label: 'Contact Support' }, { label: 'API Documentation' }],
  },
  {
    heading: 'Settings',
    links: [{ label: 'Cookie Settings' }],
  },
] as const

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-xxl mt-xxl">
      <div className="max-w-[1200px] mx-auto px-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-xl">
        <FooterBrand />
        <FooterLinks />
      </div>
      <FooterCopyright />
    </footer>
  )
}

function FooterBrand() {
  return (
    <Brand subtitle="Empowering the next generation of digital commerce through precision and automated financial utility." />
  )
}

function FooterLinks() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-xl">
      {FOOTER_COLS.map(({ heading, links }) => (
        <div key={heading} className="flex flex-col gap-sm">
          <span className="text-on-surface font-bold text-sm">{heading}</span>
          {links.map(({ label }) => (
            <a
              key={label}
              href="#"
              className="label-sm text-text-muted hover:text-secondary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      ))}
    </div>
  )
}

function FooterCopyright() {
  return (
    <div className="max-w-[1200px] mx-auto px-lg mt-xl pt-lg border-t border-outline-variant/10 text-center md:text-left">
      <p className="label-sm text-text-muted">
        © 2024 Invoicely SaaS. All rights reserved. Precision in every pixel.
      </p>
    </div>
  )
}
