import Link from 'next/link'
import { Brand } from '@/components/ui'
import { NavLinksClient } from './NavLinksClient'

export function TopNav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-lg py-md">
        <Brand />
        <NavLinksClient />
        <NavActions />
      </div>
    </header>
  )
}

function NavActions() {
  return (
    <div className="flex items-center gap-md">
      <Link
        href="/login"
        className="hidden sm:block label-md text-on-surface-variant font-medium hover:text-primary transition-colors"
      >
        Log In
      </Link>
      <Link
        href="/register"
        className="bg-primary-container text-text-primary px-lg py-sm rounded-lg font-bold active:scale-95 transition-transform shadow-sm hover:brightness-110"
      >
        Get Started
      </Link>
    </div>
  )
}
