import Link from 'next/link'

export const BRAND_NAME = 'InvoiceData'

export type BrandSize = 'sm' | 'md' | 'lg'

export interface BrandProps {
  size?: BrandSize
  showIcon?: boolean
  subtitle?: string
  className?: string
}

const SIZE_CLASS: Record<BrandSize, string> = {
  sm: 'headline-lg-mobile',
  md: 'headline-lg',
  lg: 'display-lg',
}

export function Brand({ size = 'md', showIcon = false, subtitle, className }: BrandProps) {
  const nameClasses = `${SIZE_CLASS[size]} font-bold text-primary tracking-tight${showIcon ? ' flex items-center gap-sm' : ''}`

  return (
    <div className={className}>
      <Link href="/" className={nameClasses}>
        {showIcon && (
          <span className="material-symbols-outlined text-primary">receipt_long</span>
        )}
        {BRAND_NAME}
      </Link>
      {subtitle && <p className="label-sm text-text-muted mt-xs">{subtitle}</p>}
    </div>
  )
}
