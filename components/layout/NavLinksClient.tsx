'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Pricing', href: '/pricing' },
]

export function NavLinksClient() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-xl">
      {NAV_LINKS.map(({ label, href }) => {
        const active = pathname === href
        return (
          <Link
            key={label}
            href={href}
            className={
              active
                ? 'label-md text-primary font-bold border-b-2 border-primary pb-1'
                : 'label-md text-on-surface-variant font-medium hover:text-primary transition-colors duration-200'
            }
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
