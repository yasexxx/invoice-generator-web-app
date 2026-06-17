import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { BRAND_NAME } from '@/components/ui'

interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
}

const SECTIONS: LegalSection[] = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    paragraphs: [
      `By accessing or using ${BRAND_NAME} ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.`,
      'We reserve the right to modify these Terms at any time. Changes become effective immediately upon posting. Your continued use of the Service after any modification constitutes acceptance of the revised Terms.',
    ],
  },
  {
    id: 'description',
    title: '2. Description of Service',
    paragraphs: [
      `${BRAND_NAME} is an online invoicing and payment management platform. We provide tools to create, send, and track invoices, manage clients, and process payments.`,
      'The Service is provided on an "as is" and "as available" basis. We may update, modify, or discontinue features at any time without prior notice.',
    ],
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    paragraphs: [
      'You must create an account to access most features of the Service. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.',
      'You must provide accurate and complete information when creating your account. You may not impersonate another person or use a name you are not authorised to use.',
    ],
  },
  {
    id: 'payment',
    title: '4. Payment Terms',
    paragraphs: [
      'Paid plans are billed monthly or annually in advance. Fees are non-refundable except as expressly set forth in these Terms or required by applicable law.',
      'We may change our pricing at any time. Price changes will take effect at the start of your next billing cycle following notice to you.',
    ],
  },
  {
    id: 'ip',
    title: '5. Intellectual Property',
    paragraphs: [
      `The Service and its original content, features, and functionality are and will remain the exclusive property of ${BRAND_NAME} and its licensors.`,
      'You retain ownership of all data, content, and materials you upload or create using the Service. You grant us a limited licence to host, display, and process such content solely to provide the Service to you.',
    ],
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    paragraphs: [
      `To the fullest extent permitted by law, ${BRAND_NAME} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.`,
      'Our total liability to you for any claim arising from or related to the Service shall not exceed the amount you paid us in the twelve months prior to the event giving rise to the claim.',
    ],
  },
  {
    id: 'governing-law',
    title: '7. Governing Law',
    paragraphs: [
      'These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.',
      'Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <TopNav />
      <main className="pt-xxl">
        <LegalHero title="Terms of Service" lastUpdated="January 1, 2025" />
        <LegalBody sections={SECTIONS} />
      </main>
      <Footer />
    </>
  )
}

interface LegalHeroProps {
  title: string
  lastUpdated: string
}

function LegalHero({ title, lastUpdated }: LegalHeroProps) {
  return (
    <section className="page-hero-glow pt-xxl pb-xl">
      <div className="max-w-[1200px] mx-auto px-lg">
        <span className="label-md text-primary mb-sm block">LEGAL</span>
        <h1 className="display-lg mb-md">{title}</h1>
        <p className="label-sm text-text-muted">Last updated: {lastUpdated}</p>
      </div>
    </section>
  )
}

function LegalBody({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="grid md:grid-cols-4 gap-xl">
        <LegalTOC sections={sections} />
        <LegalContent sections={sections} />
      </div>
    </section>
  )
}

function LegalTOC({ sections }: { sections: LegalSection[] }) {
  return (
    <aside className="hidden md:block">
      <div className="sticky top-[80px] glass-card rounded-xl p-lg border border-outline-variant/20">
        <p className="label-md text-text-muted mb-md uppercase tracking-widest">Contents</p>
        <nav className="space-y-sm">
          {sections.map(({ id, title }) => (
            <Link
              key={id}
              href={`#${id}`}
              className="block label-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              {title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="md:col-span-3 space-y-xl">
      {sections.map(({ id, title, paragraphs }) => (
        <LegalSection key={id} id={id} title={title} paragraphs={paragraphs} />
      ))}
    </div>
  )
}

function LegalSection({ id, title, paragraphs }: LegalSection) {
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
