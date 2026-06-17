import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/contact/ContactForm'

interface Channel {
  icon: string
  title: string
  description: string
  actionLabel: string
  href: string
}

const CHANNELS: Channel[] = [
  {
    icon: 'mail',
    title: 'Email Support',
    description: 'Send us a message and we\'ll respond within one business day.',
    actionLabel: 'support@invoicely.com',
    href: 'mailto:support@invoicely.com',
  },
  {
    icon: 'forum',
    title: 'Live Chat',
    description: 'Available Monday–Friday, 9 am–6 pm EST.',
    actionLabel: 'Start a conversation',
    href: '#',
  },
  {
    icon: 'menu_book',
    title: 'Documentation',
    description: 'Browse our knowledge base for step-by-step guides.',
    actionLabel: 'Browse docs',
    href: '#',
  },
]

export default function ContactPage() {
  return (
    <>
      <TopNav />
      <main className="pt-xxl">
        <ContactHero />
        <ContactBody />
      </main>
      <Footer />
    </>
  )
}

function ContactHero() {
  return (
    <section className="page-hero-glow pt-xxl pb-xl text-center">
      <div className="max-w-[1200px] mx-auto px-lg">
        <span className="label-md text-primary mb-sm block">SUPPORT</span>
        <h1 className="display-lg mb-md">How can we help?</h1>
        <p className="body-lg text-text-muted mx-auto">
          Our team is here to help you get the most out of Invoicely. Choose how to reach us below.
        </p>
      </div>
    </section>
  )
}

function ContactBody() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="grid md:grid-cols-5 gap-xl">
        <div className="md:col-span-2">
          <ContactChannels />
        </div>
        <div className="md:col-span-3">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function ContactChannels() {
  return (
    <div className="flex flex-col gap-md">
      <div className="mb-md">
        <h2 className="headline-lg-mobile text-on-surface font-semibold mb-sm">
          Other ways to reach us
        </h2>
        <p className="body-md text-text-muted">
          Need a quick answer? Try our{' '}
          <Link href="/faqs" className="text-primary hover:underline underline-offset-4">
            FAQ page
          </Link>{' '}
          first.
        </p>
      </div>
      {CHANNELS.map((channel) => (
        <ChannelCard key={channel.title} channel={channel} />
      ))}
    </div>
  )
}

function ChannelCard({ channel }: { channel: Channel }) {
  const { icon, title, description, actionLabel, href } = channel
  return (
    <div className="glass-card rounded-xl p-lg border border-outline-variant/20 flex gap-md">
      <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div>
        <p className="title-md text-on-surface mb-xs">{title}</p>
        <p className="body-md text-text-muted mb-sm">{description}</p>
        <Link
          href={href}
          className="label-sm text-primary hover:underline underline-offset-4 font-medium"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  )
}
