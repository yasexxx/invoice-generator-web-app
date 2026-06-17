import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'

interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
}

const SECTIONS: LegalSection[] = [
  {
    id: 'information-collected',
    title: '1. Information We Collect',
    paragraphs: [
      'We collect information you provide directly: name, email address, billing details, and the content of invoices and client records you create within the Service.',
      'We also collect usage data automatically, including IP address, browser type, pages visited, and actions taken within the Service to improve performance and security.',
    ],
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    paragraphs: [
      'We use your information to provide and improve the Service, process payments, send transactional emails (receipts, reminders), and respond to support requests.',
      'We do not sell your personal data to third parties. We may use anonymised, aggregated data for product analytics and research.',
    ],
  },
  {
    id: 'sharing',
    title: '3. Sharing of Information',
    paragraphs: [
      'We share data with trusted third-party service providers — such as payment processors and cloud hosting providers — solely to deliver the Service. All such providers are bound by confidentiality obligations.',
      'We may disclose information if required by law, regulation, or valid legal process, or to protect the rights, property, or safety of Invoicely, our users, or the public.',
    ],
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    paragraphs: [
      'We implement industry-standard safeguards including TLS 1.3 encryption in transit, AES-256 encryption at rest, and strict access controls. We are SOC 2 Type II certified.',
      'Despite our best efforts, no security measure is perfect. We encourage you to use a strong, unique password and to notify us immediately of any suspected unauthorised access.',
    ],
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    paragraphs: [
      'We use essential cookies to keep you logged in and to remember your preferences. We use analytics cookies to understand how the Service is used.',
      'You can control cookies via your browser settings. Disabling non-essential cookies will not affect your ability to use core features of the Service.',
    ],
  },
  {
    id: 'your-rights',
    title: '6. Your Rights',
    paragraphs: [
      'Depending on your location, you may have the right to access, correct, or delete your personal data; to restrict or object to processing; and to data portability.',
      'To exercise these rights, contact us at privacy@invoicely.com. We will respond within 30 days. EU/EEA users may also lodge a complaint with your local supervisory authority.',
    ],
  },
  {
    id: 'changes',
    title: '7. Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. We will notify you of material changes by email or by a prominent notice within the Service.',
      'Your continued use of the Service after any change constitutes acceptance of the updated policy.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <TopNav />
      <main className="pt-xxl">
        <PrivacyHero />
        <PrivacyBody />
      </main>
      <Footer />
    </>
  )
}

function PrivacyHero() {
  return (
    <section className="page-hero-glow pt-xxl pb-xl">
      <div className="max-w-[1200px] mx-auto px-lg">
        <span className="label-md text-primary mb-sm block">LEGAL</span>
        <h1 className="display-lg mb-md">Privacy Policy</h1>
        <p className="label-sm text-text-muted">Last updated: January 1, 2025</p>
      </div>
    </section>
  )
}

function PrivacyBody() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="grid md:grid-cols-4 gap-xl">
        <PrivacyTOC />
        <PrivacyContent />
      </div>
    </section>
  )
}

function PrivacyTOC() {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-[80px] glass-card rounded-xl p-lg border border-outline-variant/20">
        <p className="label-md text-text-muted mb-md uppercase tracking-widest">Contents</p>
        <nav className="space-y-sm">
          {SECTIONS.map(({ id, title }) => (
            <Link
              key={id}
              href={`#${id}`}
              className="block label-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {title}
            </Link>
          ))}
        </nav>
        <div className="mt-lg pt-lg border-t border-outline-variant/10">
          <p className="label-sm text-text-muted mb-sm">Questions?</p>
          <Link href="/contact" className="label-sm text-primary hover:underline underline-offset-4">
            Contact our team
          </Link>
        </div>
      </div>
    </aside>
  )
}

function PrivacyContent() {
  return (
    <div className="md:col-span-3 space-y-xl">
      {SECTIONS.map(({ id, title, paragraphs }) => (
        <PrivacySection key={id} id={id} title={title} paragraphs={paragraphs} />
      ))}
    </div>
  )
}

function PrivacySection({ id, title, paragraphs }: LegalSection) {
  return (
    <section id={id} className="scroll-mt-xxl">
      <h2 className="headline-lg-mobile text-on-surface mb-md font-semibold">{title}</h2>
      <div className="space-y-md">
        {paragraphs.map((p, i) => (
          <p key={i} className="body-md text-text-muted leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}
