'use client'

import { InvoiceTotals }    from './InvoiceTotals'
import type { BodyRefCallback } from './useInvoicePagination'
import type { InvoiceFormData, InvoiceTotals as Totals, LineItem } from '../invoice.types'
import styles from './InvoiceDocument.module.css'

export interface InvoiceDocumentProps {
  data:          InvoiceFormData
  totals:        Totals
  pages:         LineItem[][]
  registerBody?: (index: number) => BodyRefCallback
}

const ISSUER_NAME_FALLBACK    = 'Your Business'
const ISSUER_ADDRESS_FALLBACK = 'Your City, Country'
const CLIENT_NAME_FALLBACK    = 'Client Name'
const CLIENT_ADDRESS_FALLBACK = '123 Client Street'
const CLIENT_EMAIL_FALLBACK   = 'client@example.com'

const TABLE_HEADINGS = ['Description', 'Qty', 'Price', 'Total'] as const

function rowPaddingBlock(itemCount: number): number {
  if (itemCount <= 4)  return 10
  if (itemCount <= 7)  return 7
  if (itemCount <= 11) return 5
  return 3
}

export function InvoiceDocument({ data, totals, pages, registerBody }: InvoiceDocumentProps) {
  const themeClass = `invoice-theme-${data.templateId}`
  const lastIndex  = pages.length - 1

  return (
    <>
      {pages.map((pageItems, index) => (
        <DocumentPage
          key={index}
          data={data}
          totals={totals}
          pageItems={pageItems}
          isFirst={index === 0}
          isLast={index === lastIndex}
          themeClass={themeClass}
          bodyRef={registerBody?.(index)}
        />
      ))}
    </>
  )
}

interface DocumentPageProps {
  data:       InvoiceFormData
  totals:     Totals
  pageItems:  LineItem[]
  isFirst:    boolean
  isLast:     boolean
  themeClass: string
  bodyRef?:   BodyRefCallback
}

function DocumentPage({ data, totals, pageItems, isFirst, isLast, themeClass, bodyRef }: DocumentPageProps) {
  return (
    <div className={`${themeClass} ${styles.page}`} data-paper={data.paperSize}>
      {isFirst ? (
        <DocumentHeader
          invoiceNumber={data.invoiceNumber}
          issuerName={data.issuerName}
          issuerAddress={data.issuerAddress}
        />
      ) : (
        <ContinuationHeader
          invoiceNumber={data.invoiceNumber}
          issuerName={data.issuerName}
        />
      )}
      <div className={styles.body} ref={bodyRef}>
        {isFirst && (
          <BillingInfo
            clientName={data.clientName}
            clientEmail={data.clientEmail}
            clientAddress={data.clientAddress}
            issuedDate={data.issuedDate}
            dueDate={data.dueDate}
          />
        )}
        <LineItemsTable items={pageItems} />
        {isLast && (
          <>
            <InvoiceTotals totals={totals} taxPercent={data.taxPercent} />
            {data.notes     && <NotesFooter notes={data.notes} />}
            {data.signature && <SignatureBlock signature={data.signature} />}
          </>
        )}
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
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--doc-header-bar-text)', transition: 'color 300ms ease' }}>
          {issuerName || ISSUER_NAME_FALLBACK}
        </div>
        <div style={{ fontSize: 11, marginTop: 2, opacity: 0.65, color: 'var(--doc-header-bar-text)', transition: 'color 300ms ease' }}>
          {issuerAddress || ISSUER_ADDRESS_FALLBACK}
        </div>
      </div>
    </header>
  )
}

interface ContinuationHeaderProps {
  invoiceNumber: string
  issuerName:    string
}

function ContinuationHeader({ invoiceNumber, issuerName }: ContinuationHeaderProps) {
  return (
    <header className={styles.continuationBar}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--doc-header-bar-text)', opacity: 0.75, transition: 'color 300ms ease' }}>
        Continued — #{invoiceNumber}
      </div>
      <div style={{ fontSize: 10, color: 'var(--doc-header-bar-text)', opacity: 0.75, transition: 'color 300ms ease' }}>
        {issuerName || ISSUER_NAME_FALLBACK}
      </div>
    </header>
  )
}

interface BillingInfoProps {
  clientName:    string
  clientEmail:   string
  clientAddress: string
  issuedDate:    string
  dueDate:       string
}

function BillingInfo({ clientName, clientEmail, clientAddress, issuedDate, dueDate }: BillingInfoProps) {
  const hasDates = issuedDate.length > 0 || dueDate.length > 0
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
      {hasDates && (
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'inline-block', textAlign: 'left' }}>
            <SectionLabel>Dates</SectionLabel>
            {issuedDate && <DateRow label="Issued" value={issuedDate} />}
            {dueDate    && <DateRow label="Due"    value={dueDate} />}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--doc-muted-text)', marginBottom: 4, transition: 'color 300ms ease' }}>
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

function LineItemsTable({ items }: { items: LineItem[] }) {
  const paddingBlock = rowPaddingBlock(items.length)
  const headingSize  = Math.max(7, 9 - Math.floor(items.length / 5))

  return (
    <div style={{ flex: 1 }}>
      <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--doc-border)', transition: 'border-color 300ms ease' }}>
            {TABLE_HEADINGS.map((heading, i) => (
              <th
                key={heading}
                style={{
                  paddingBlock,
                  fontSize: headingSize,
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
          {items.map((item) => {
            const lineTotal = item.qty * item.rate
            return (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--doc-border)', transition: 'border-color 300ms ease' }}>
                <td style={{ paddingBlock, fontSize: 12, fontWeight: 600, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
                  {item.description || '—'}
                </td>
                <td style={{ paddingBlock, fontSize: 12, textAlign: 'right', color: 'var(--doc-body-text)', transition: 'color 300ms ease' }}>
                  {item.qty}
                </td>
                <td style={{ paddingBlock, fontSize: 12, textAlign: 'right', color: 'var(--doc-body-text)', transition: 'color 300ms ease' }}>
                  ${item.rate.toFixed(2)}
                </td>
                <td style={{ paddingBlock, fontSize: 12, textAlign: 'right', fontWeight: 700, color: 'var(--doc-title-text)', transition: 'color 300ms ease' }}>
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

function SignatureBlock({ signature }: { signature: string }) {
  return (
    <div style={{ borderTop: '1px solid var(--doc-border)', paddingTop: 12, transition: 'border-color 300ms ease' }}>
      <SectionLabel>Authorised Signature</SectionLabel>
      <img
        src={signature}
        alt="Signature"
        style={{ maxHeight: 48, maxWidth: 160, objectFit: 'contain', marginTop: 4 }}
      />
    </div>
  )
}
