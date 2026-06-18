import Link            from 'next/link'
import { BRAND_NAME } from '@/components/ui'

const AUTH_FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Help Center'] as const
const COPYRIGHT_YEAR = 2024

export function AuthFooter() {
  return (
    <footer className="mt-auto py-lg w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-md opacity-60">
      <p className="label-sm text-text-muted">© {COPYRIGHT_YEAR} {BRAND_NAME} SaaS. All rights reserved.</p>
      <nav className="flex gap-lg">
        {AUTH_FOOTER_LINKS.map((label) => (
          <Link
            key={label}
            href="#"
            className="label-sm text-text-muted hover:text-primary transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
