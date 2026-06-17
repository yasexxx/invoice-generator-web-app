import Link from 'next/link'
import { Brand } from '@/components/ui'

interface FooterLink {
  label: string
  href: string
}

interface FooterCol {
  heading: string
  links: FooterLink[]
}

const FOOTER_COLS: FooterCol[] = [
  {
    heading: 'Company',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Support', href: '/contact' },
    ],
  },
]

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
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="label-sm text-text-muted hover:text-secondary transition-colors"
            >
              {label}
            </Link>
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
        © 2025 Invoicely. All rights reserved. Precision in every pixel.
      </p>
    </div>
  )
}
