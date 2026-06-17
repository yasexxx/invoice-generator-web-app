import { Brand } from '@/components/ui'

interface NavLink {
  label:   string
  active?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', active: true },
  { label: 'Solutions' },
  { label: 'Pricing' },
  { label: 'Resources' },
]

export function TopNav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-lg py-md">
        <Brand />
        <NavLinks />
        <NavActions />
      </div>
    </header>
  )
}

function NavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-xl">
      {NAV_LINKS.map(({ label, active }) => (
        <a
          key={label}
          href="#"
          className={
            active
              ? 'label-md text-primary font-bold border-b-2 border-primary pb-1'
              : 'label-md text-on-surface-variant font-medium hover:text-primary transition-colors duration-200'
          }
        >
          {label}
        </a>
      ))}
    </nav>
  )
}

function NavActions() {
  return (
    <div className="flex items-center gap-md">
      <button className="hidden sm:block label-md text-on-surface-variant font-medium hover:text-primary transition-colors">
        Log In
      </button>
      <button className="bg-primary-container text-text-primary px-lg py-sm rounded-lg font-bold active:scale-95 transition-transform shadow-sm hover:brightness-110">
        Get Started
      </button>
    </div>
  )
}
