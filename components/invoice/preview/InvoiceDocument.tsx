import { InvoiceTotals } from './InvoiceTotals'
import type { InvoiceFormData, InvoiceTotals as Totals } from '../invoice.types'
import styles from './InvoiceDocument.module.css'

export interface InvoiceDocumentProps {
  data:   InvoiceFormData
  totals: Totals
}

const ISSUER_NAME_FALLBACK    = 'Your Business'
const ISSUER_ADDRESS_FALLBACK = 'Your City, Country'
const CLIENT_NAME_FALLBACK    = 'Client Name'
const CLIENT_ADDRESS_FALLBACK = '123 Client Street'
const CLIENT_EMAIL_FALLBACK   = 'client@example.com'

const ISSUED = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const DUE    = new Date(Date.now() + 15 * 86_400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function InvoiceDocument({ data, totals }: InvoiceDocumentProps) {
  return (
    <div className={`invoice-theme-${data.templateId} ${styles.document} font-sans`}>
      <DocumentHeader
        invoiceNumber={data.invoiceNumber}
        issuerName={data.issuerName}
        issuerAddress={data.issuerAddress}
      />
      <div className={styles.body}>
        <BillingInfo
          clientName={data.clientName}
          clientEmail={data.clientEmail}
          clientAddress={data.clientAddress}
        />
        <LineItemsTable data={data} />
        <InvoiceTotals totals={totals} taxPercent={data.taxPercent} />
        {data.notes && <NotesFooter notes={data.notes} />}
      </div>
    </div>
  )
}

interface DocumentHeaderProps {
  invoiceNumber: string
  issuerName:    string
  issuerAddress: string
}

function DocumentHeader({ invoiceNumber, issuerName, issuerAddress }: DocumentHeaderProps) {
  return (
    <header className={styles.headerBar}>
      <div>
        <div
          style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--doc-header-bar-text)', lineHeight: 1, transition: 'color 300ms ease' }}
        >
          INVOICE
        </div>
        <div
          style={{ fontSize: 11, fontWeight: 500, marginTop: 4, opacity: 0.65, color: 'var(--doc-header-bar-text)', letterSpacing: '0.04em', transition: 'color 300ms ease' }}
        >
          #{invoiceNumber}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div
          style={{ fontSize: 15, fontWeight: 700, color: 'var(--doc-header-bar-text)', transition: 'color 300ms ease' }}
        >
          {issuerName || ISSUER_NAME_FALLBACK}
        </div>
        <div
          style={{ fontSize: 11, marginTop: 2, opacity: 0.65, color: 'var(--doc-header-bar-text)', transition: 'color 300ms ease' }}
        >
          {issuerAddress || ISSUER_ADDRESS_FALLBACK}
        </div>
      </div>
    </header>
  )
}

interface BillingInfoProps {
  clientName:    string
  clientEmail:   string
  clientAddress: string
}

function BillingInfo({ clientName, clientEmail, clientAddress }: BillingInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <SectionLabel>Billed To</SectionLabel>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
          {clientName || CLIENT_NAME_FALLBACK}
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--doc-muted-text)', transition: 'color 300ms ease' }}>
          {clientAddress || CLIENT_ADDRESS_FALLBACK}
        </div>
        <div style={{ fontSize: 11, color: 'var(--doc-muted-text)', transition: 'color 300ms ease' }}>
          {clientEmail || CLIENT_EMAIL_FALLBACK}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-block', textAlign: 'left' }}>
          <SectionLabel>Dates</SectionLabel>
          <DateRow label="Issued" value={ISSUED} />
          <DateRow label="Due"    value={DUE} />
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--doc-muted-text)', marginBottom: 4, transition: 'color 300ms ease' }}
    >
      {children}
    </div>
  )
}

function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--doc-body-text)', lineHeight: 1.7, transition: 'color 300ms ease' }}>
      {label}:{' '}
      <span style={{ fontWeight: 600, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
        {value}
      </span>
    </div>
  )
}

function LineItemsTable({ data }: { data: InvoiceFormData }) {
  return (
    <div style={{ flex: 1 }}>
      <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--doc-border)', transition: 'border-color 300ms ease' }}>
            {(['Description', 'Qty', 'Price', 'Total'] as const).map((heading, i) => (
              <th
                key={heading}
                style={{
                  paddingBlock: 6,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--doc-muted-text)',
                  textAlign: i > 0 ? 'right' : 'left',
                  transition: 'color 300ms ease',
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.lineItems.map((item) => {
            const lineTotal = item.qty * item.rate
            return (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--doc-border)', transition: 'border-color 300ms ease' }}>
                <td style={{ paddingBlock: 10, fontSize: 12, fontWeight: 600, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
                  {item.description || '—'}
                </td>
                <td style={{ paddingBlock: 10, fontSize: 12, textAlign: 'right', color: 'var(--doc-body-text)', transition: 'color 300ms ease' }}>
                  {item.qty}
                </td>
                <td style={{ paddingBlock: 10, fontSize: 12, textAlign: 'right', color: 'var(--doc-body-text)', transition: 'color 300ms ease' }}>
                  ${item.rate.toFixed(2)}
                </td>
                <td style={{ paddingBlock: 10, fontSize: 12, textAlign: 'right', fontWeight: 700, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
                  ${lineTotal.toFixed(2)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function NotesFooter({ notes }: { notes: string }) {
  return (
    <div>
      <SectionLabel>Notes</SectionLabel>
      <p style={{ fontSize: 11, color: 'var(--doc-muted-text)', lineHeight: 1.6, fontStyle: 'italic', transition: 'color 300ms ease' }}>
        {notes}
      </p>
    </div>
  )
}
