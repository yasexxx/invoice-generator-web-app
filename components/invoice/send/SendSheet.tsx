'use client'

import { useState }    from 'react'
import { Input }       from '@/components/ui'
import { BRAND_NAME }  from '@/components/ui'
import styles          from './SendSheet.module.css'

export type SendStatus = 'confirm' | 'sending' | 'success' | 'error'

export interface SendSheetProps {
  isOpen:       boolean
  clientEmail:  string
  status:       SendStatus
  errorMessage: string | null
  onClose:      () => void
  onConfirm:    (email: string) => void
  onDownload:   () => void
}

const TWITTER_SHARE_TEXT = encodeURIComponent(
  `Just sent an invoice with ${BRAND_NAME}! Fast, clean, professional.`
)
const TWITTER_URL   = `https://twitter.com/intent/tweet?text=${TWITTER_SHARE_TEXT}`
const FACEBOOK_BASE = 'https://www.facebook.com/sharer/sharer.php?u='

export function SendSheet({
  isOpen,
  clientEmail,
  status,
  errorMessage,
  onClose,
  onConfirm,
  onDownload,
}: SendSheetProps) {
  if (!isOpen) return null

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Send Invoice">
      <div className={styles.panel}>
        <SheetHeader onClose={onClose} />
        {status === 'success' ? (
          <SuccessStep onClose={onClose} onDownload={onDownload} />
        ) : (
          <ConfirmStep
            clientEmail={clientEmail}
            status={status}
            errorMessage={errorMessage}
            onConfirm={onConfirm}
            onDownload={onDownload}
          />
        )}
      </div>
    </div>
  )
}

function SheetHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <span className="material-symbols-outlined" aria-hidden="true">send</span>
        Send Invoice
      </div>
      <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close">
        <span className="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
    </div>
  )
}

interface ConfirmStepProps {
  clientEmail:  string
  status:       SendStatus
  errorMessage: string | null
  onConfirm:    (email: string) => void
  onDownload:   () => void
}

function ConfirmStep({ clientEmail, status, errorMessage, onConfirm, onDownload }: ConfirmStepProps) {
  const [email, setEmail] = useState(clientEmail)
  const isSending         = status === 'sending'

  return (
    <div className={styles.body}>
      <p className={styles.description}>
        Confirm the recipient email and send the invoice directly to your client's inbox.
      </p>

      <Input
        label="Send to"
        type="email"
        icon="mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSending}
        placeholder="client@example.com"
        error={status === 'error' && errorMessage ? errorMessage : undefined}
      />

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => onConfirm(email)}
          disabled={isSending || !email.trim()}
          className={styles.sendBtn}
          aria-busy={isSending}
        >
          {isSending ? (
            <>
              <span className={`material-symbols-outlined ${styles.spinIcon}`} aria-hidden="true">
                autorenew
              </span>
              Sending…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" aria-hidden="true">send</span>
              Send Invoice
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onDownload}
          className={styles.downloadBtn}
          disabled={isSending}
        >
          <span className="material-symbols-outlined" aria-hidden="true">file_download</span>
          Download PDF
        </button>
      </div>
    </div>
  )
}

interface SuccessStepProps {
  onClose:    () => void
  onDownload: () => void
}

function SuccessStep({ onClose, onDownload }: SuccessStepProps) {
  return (
    <div className={styles.body}>
      <div className={styles.successBadge}>
        <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
        Invoice sent successfully!
      </div>

      <p className={styles.description}>
        Your client has been notified. Download the PDF or share via your preferred platform.
      </p>

      <div className={styles.actions}>
        <button type="button" onClick={onDownload} className={styles.sendBtn}>
          <span className="material-symbols-outlined" aria-hidden="true">file_download</span>
          Download PDF
        </button>
      </div>

      <div className={styles.shareSection}>
        <span className={styles.shareLabel}>Share</span>
        <div className={styles.shareButtons}>
          <ShareButton
            icon="alternate_email"
            label="Twitter / X"
            href={TWITTER_URL}
          />
          <ShareButton
            icon="groups"
            label="Facebook"
            href={`${FACEBOOK_BASE}${encodeURIComponent(window.location.origin)}`}
          />
          <InstagramShareButton onDownload={onDownload} />
        </div>
      </div>

      <button type="button" onClick={onClose} className={styles.doneBtn}>
        Done
      </button>
    </div>
  )
}

interface ShareButtonProps {
  icon:  string
  label: string
  href:  string
}

function ShareButton({ icon, label, href }: ShareButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.shareBtn}
      aria-label={`Share on ${label}`}
    >
      <span className={`material-symbols-outlined ${styles.shareBtnIcon}`} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.shareBtnLabel}>{label}</span>
    </a>
  )
}

function InstagramShareButton({ onDownload }: { onDownload: () => void }) {
  function handleClick() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: `Invoice — ${BRAND_NAME}`, text: `Check out my invoice from ${BRAND_NAME}!` })
        .catch(() => undefined)
    } else {
      onDownload()
    }
  }

  return (
    <button type="button" onClick={handleClick} className={styles.shareBtn} aria-label="Share on Instagram">
      <span className={`material-symbols-outlined ${styles.shareBtnIcon}`} aria-hidden="true">
        photo_camera
      </span>
      <span className={styles.shareBtnLabel}>Instagram</span>
    </button>
  )
}
