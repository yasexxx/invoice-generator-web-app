function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.16 4.44-1.26 1.12-3.14 2.02-5.68 2.02-4.54 0-8.22-3.6-8.22-8s3.68-8 8.22-8c2.56 0 4.46 1 5.86 2.36l2.32-2.32C18.52 2.62 15.9 1 12.48 1 6.3 1 1.28 6.04 1.28 12.24S6.3 23.48 12.48 23.48c3.34 0 5.86-1.1 7.84-3.16 2.06-2.06 2.7-4.94 2.7-7.3 0-.7-.06-1.36-.16-2.1h-10.4z"
        fill="#EA4335"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-5 h-5 fill-on-surface" viewBox="0 0 24 24" aria-hidden>
      <path d="M17.05 20.28c-.96.95-2.06 1.72-3.23 1.72-1.15 0-1.62-.71-2.98-.71-1.37 0-1.89.69-2.95.71-1.16.02-2.33-.87-3.41-2.43-2.18-3.14-2.18-7.05 0-10.19 1.08-1.56 2.45-2.52 3.8-2.52 1.34 0 2.22.84 3.06.84.85 0 1.9-.88 3.3-.88 1.41 0 2.65.65 3.51 1.91-2.95 1.72-2.47 5.46.43 6.64-.78 1.93-1.6 3.91-2.53 4.91zm-4.32-15.65c-.6-1.36-.2-2.85.45-4.01 1.21.1 2.5.85 3.19 1.95.66 1.05.41 2.66-.46 3.89-1.22.12-2.57-.46-3.18-1.83z" />
    </svg>
  )
}

export function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-md">
      <button className="flex items-center justify-center gap-sm bg-surface-container-high border border-outline-variant/20 py-md rounded-lg hover:bg-surface-variant transition-colors">
        <GoogleIcon />
        <span className="label-md text-on-surface">Google</span>
      </button>
      <button className="flex items-center justify-center gap-sm bg-surface-container-high border border-outline-variant/20 py-md rounded-lg hover:bg-surface-variant transition-colors">
        <AppleIcon />
        <span className="label-md text-on-surface">Apple</span>
      </button>
    </div>
  )
}
