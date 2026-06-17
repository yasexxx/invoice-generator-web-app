import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

interface Tier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  featured: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for freelancers just getting started.',
    features: [
      '5 invoices per month',
      '3 client profiles',
      '1 invoice template',
      'PDF export',
      'Basic analytics',
    ],
    ctaLabel: 'Start for Free',
    ctaHref: '/register',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For growing businesses that need more power.',
    features: [
      'Unlimited invoices',
      'Unlimited clients',
      '10+ premium templates',
      'Automated payment reminders',
      'Real-time open tracking',
      'Priority email support',
    ],
    ctaLabel: 'Start 14-day Trial',
    ctaHref: '/register',
    featured: true,
  },
  {
    name: 'Business',
    price: '$99',
    period: 'per month',
    description: 'Enterprise-grade features for scaling teams.',
    features: [
      'Everything in Pro',
      '10 team seats',
      'Custom brand templates',
      'Advanced revenue analytics',
      'Dedicated account manager',
      '99.9% uptime SLA',
    ],
    ctaLabel: 'Contact Sales',
    ctaHref: '/contact',
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <TopNav />
      <main className="pt-xxl">
        <PricingHero />
        <PricingTiers />
        <PricingFooterCTA />
      </main>
      <Footer />
    </>
  )
}

function PricingHero() {
  return (
    <section className="page-hero-glow pt-xxl pb-xl text-center">
      <div className="max-w-[1200px] mx-auto px-lg">
        <span className="label-md text-primary mb-sm block">PRICING</span>
        <h1 className="display-lg mb-md">Simple, transparent pricing</h1>
        <p className="body-lg text-text-muted mx-auto">
          Start free. Scale when you&apos;re ready. No hidden fees, no surprise charges.
        </p>
      </div>
    </section>
  )
}

function PricingTiers() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="grid md:grid-cols-3 gap-lg items-start">
        {TIERS.map((tier) => (
          <TierCard key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  )
}

function TierCard({ tier }: { tier: Tier }) {
  const { name, price, period, description, features, ctaLabel, ctaHref, featured } = tier
  const cardClass = featured
    ? 'glass-card rounded-2xl p-xl border-2 border-primary/60 relative shadow-2xl'
    : 'glass-card rounded-2xl p-xl border border-outline-variant/20 relative'

  return (
    <div className={cardClass}>
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-container text-text-primary label-sm px-md py-xs rounded-full font-bold whitespace-nowrap">
          MOST POPULAR
        </span>
      )}
      <TierHeader name={name} price={price} period={period} description={description} />
      <TierFeatures features={features} />
      <Link
        href={ctaHref}
        className={
          featured
            ? 'block w-full text-center mt-lg bg-primary-container text-text-primary px-lg py-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all'
            : 'block w-full text-center mt-lg border border-outline-variant text-on-surface-variant px-lg py-md rounded-lg font-medium hover:border-primary/40 hover:text-primary transition-all'
        }
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

interface TierHeaderProps {
  name: string
  price: string
  period: string
  description: string
}

function TierHeader({ name, price, period, description }: TierHeaderProps) {
  return (
    <div className="mb-lg">
      <h2 className="title-md text-on-surface mb-sm">{name}</h2>
      <div className="flex items-end gap-xs mb-sm">
        <span className="display-lg text-primary leading-none">{price}</span>
        <span className="label-sm text-text-muted mb-1">/ {period}</span>
      </div>
      <p className="body-md text-text-muted">{description}</p>
    </div>
  )
}

function TierFeatures({ features }: { features: string[] }) {
  return (
    <ul className="space-y-sm border-t border-outline-variant/20 pt-lg">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-sm body-md text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[18px] leading-none shrink-0">
            check_circle
          </span>
          {feature}
        </li>
      ))}
    </ul>
  )
}

function PricingFooterCTA() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="glass-card p-xl rounded-2xl text-center border border-outline-variant/20">
        <p className="body-lg text-text-muted mb-md">
          Not sure which plan is right for you?
        </p>
        <Link
          href="/contact"
          className="label-md text-primary font-semibold hover:underline underline-offset-4"
        >
          Talk to our team →
        </Link>
      </div>
    </section>
  )
}
