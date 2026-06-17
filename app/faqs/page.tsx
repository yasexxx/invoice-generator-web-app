import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/layout/Footer'
import { BRAND_NAME } from '@/components/ui'

interface FAQ {
  question: string
  answer: string
}

interface FAQCategory {
  name: string
  icon: string
  items: FAQ[]
}

const FAQ_CATEGORIES: FAQCategory[] = [
  {
    name: 'General',
    icon: 'help',
    items: [
      {
        question: `What is ${BRAND_NAME}?`,
        answer:
          `${BRAND_NAME} is a professional invoicing platform built for freelancers and growing businesses. Create, send, and track invoices in minutes — and get paid faster with automated payment reminders.`,
      },
      {
        question: 'Do I need a credit card to sign up?',
        answer:
          'No. The Free plan requires no payment details. You only need to add a payment method if you upgrade to Pro or Business.',
      },
    ],
  },
  {
    name: 'Billing',
    icon: 'credit_card',
    items: [
      {
        question: 'Can I cancel my subscription at any time?',
        answer:
          "Yes. Cancel anytime from account settings. You'll keep full access until the end of your current billing period — no questions asked.",
      },
      {
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, Mastercard, Amex), as well as ACH bank transfers for Business plan customers.',
      },
    ],
  },
  {
    name: 'Features',
    icon: 'star',
    items: [
      {
        question: 'Can I customize my invoice templates?',
        answer:
          'Absolutely. Pro and Business plans include 10+ premium templates with full logo, color, and font customization. Business plan customers can request fully bespoke template designs.',
      },
      {
        question: `Does ${BRAND_NAME} integrate with accounting software?`,
        answer:
          `${BRAND_NAME} integrates with QuickBooks, Xero, and FreshBooks. Business plan customers also get access to our full REST API for custom integrations.`,
      },
    ],
  },
  {
    name: 'Security',
    icon: 'security',
    items: [
      {
        question: 'Is my financial data secure?',
        answer:
          'Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II certified and conduct annual third-party security audits.',
      },
      {
        question: 'Where is my data stored?',
        answer:
          'Your data is stored on servers in the United States. EU-based data residency is available for Business plan customers who require GDPR compliance.',
      },
    ],
  },
]

export default function FAQsPage() {
  return (
    <>
      <TopNav />
      <main className="pt-xxl">
        <FAQsHero />
        <FAQsContent />
        <FAQsBottomCTA />
      </main>
      <Footer />
    </>
  )
}

function FAQsHero() {
  return (
    <section className="page-hero-glow pt-xxl pb-xl text-center">
      <div className="max-w-[1200px] mx-auto px-lg">
        <span className="label-md text-primary mb-sm block">SUPPORT</span>
        <h1 className="display-lg mb-md">Frequently asked questions</h1>
        <p className="body-lg text-text-muted mx-auto">
          Can&apos;t find an answer?{' '}
          <Link href="/contact" className="text-primary hover:underline underline-offset-4">
            Ask our team.
          </Link>
        </p>
      </div>
    </section>
  )
}

function FAQsContent() {
  return (
    <section className="py-xxl max-w-[1200px] mx-auto px-lg">
      <div className="space-y-xxl">
        {FAQ_CATEGORIES.map((category) => (
          <FAQCategorySection key={category.name} category={category} />
        ))}
      </div>
    </section>
  )
}

function FAQCategorySection({ category }: { category: FAQCategory }) {
  const { name, icon, items } = category
  return (
    <div>
      <div className="flex items-center gap-sm mb-lg">
        <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[18px] leading-none">{icon}</span>
        </div>
        <h2 className="title-md text-on-surface">{name}</h2>
      </div>
      <div className="space-y-sm">
        {items.map(({ question, answer }) => (
          <FAQItem key={question} question={question} answer={answer} />
        ))}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: FAQ) {
  return (
    <details className="glass-card rounded-xl border border-outline-variant/20 group">
      <summary className="flex justify-between items-center p-lg cursor-pointer list-none select-none">
        <span className="title-md text-on-surface pr-md">{question}</span>
        <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform duration-200 shrink-0">
          expand_more
        </span>
      </summary>
      <div className="px-lg pb-lg border-t border-outline-variant/10">
        <p className="body-md text-text-muted mt-md">{answer}</p>
      </div>
    </details>
  )
}

function FAQsBottomCTA() {
  return (
    <section className="py-xxl bg-surface-container-lowest">
      <div className="max-w-[1200px] mx-auto px-lg text-center">
        <h2 className="headline-lg mb-md">Still have questions?</h2>
        <p className="body-lg text-text-muted mb-xl">
          Our support team is available Monday–Friday, 9 am–6 pm EST.
        </p>
        <Link
          href="/contact"
          className="inline-flex bg-primary-container text-text-primary px-xl py-md rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all"
        >
          Contact Support
        </Link>
      </div>
    </section>
  )
}
