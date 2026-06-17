const AUTH_FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Help Center'] as const

export function AuthFooter() {
  return (
    <footer className="mt-auto py-lg w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-md opacity-60">
      <p className="label-sm text-text-muted">© 2024 Invoicely SaaS. All rights reserved.</p>
      <nav className="flex gap-lg">
        {AUTH_FOOTER_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            className="label-sm text-text-muted hover:text-primary transition-colors"
          >
            {label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
