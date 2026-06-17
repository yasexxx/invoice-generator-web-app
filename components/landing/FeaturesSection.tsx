import { BRAND_NAME } from '@/components/ui'

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

const FEATURES: FeatureCardProps[] = [
  {
    icon: 'palette',
    title: 'Customizable Templates',
    description:
      'Create professional invoices that match your brand identity with our intuitive, drag-and-drop editor.',
  },
  {
    icon: 'notifications_active',
    title: 'Automated Reminders',
    description:
      "Stop chasing clients. We'll send polite, automated nudges when payments are overdue so you don't have to.",
  },
  {
    icon: 'analytics',
    title: 'Real-time Tracking',
    description:
      'Know exactly when an invoice is opened, viewed, and paid with our comprehensive activity feed.',
  },
]

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-card p-lg rounded-xl border border-outline-variant/20 hover:border-primary/40 transition-all group">
      <div className="bg-primary-container/20 w-12 h-12 rounded-lg flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <h3 className="title-md mb-sm text-on-surface">{title}</h3>
      <p className="body-md text-text-muted">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="text-center mb-xxl">
        <h2 className="headline-lg mb-md">
          Everything you need to{' '}
          <span className="text-primary">master your cashflow</span>
        </h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Focus on your craft, while {BRAND_NAME} handles the logistics of getting you paid on
          time, every time.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-lg">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  )
}
