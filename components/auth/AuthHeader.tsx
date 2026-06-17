import { Brand } from '@/components/ui'

export interface AuthHeaderProps {
  tagline?: string
}

export function AuthHeader({ tagline = 'Precision in every pixel.' }: AuthHeaderProps) {
  return (
    <header className="mb-xl text-center z-10">
      <Brand subtitle={tagline} />
    </header>
  )
}
