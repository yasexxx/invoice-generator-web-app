import type { TemplateId } from '../invoice.types'
import styles from './TemplateSelector.module.css'

// Thumbnail decorative line widths — represent mock document content proportions
const THUMB_LINE_WIDTH_TITLE    = '55%'
const THUMB_LINE_WIDTH_SUBTITLE = '35%'
const THUMB_LINE_WIDTH_BODY_LG  = '80%'
const THUMB_LINE_WIDTH_BODY_MD  = '65%'
const THUMB_LINE_WIDTH_BODY_SM  = '72%'

interface Template {
  id:    TemplateId
  label: string
  isPro: boolean
}

const TEMPLATES: Template[] = [
  { id: 'minimalist',  label: 'Minimalist',  isPro: false },
  { id: 'corporate',   label: 'Corporate',   isPro: true  },
  { id: 'modern-dark', label: 'Modern Dark', isPro: true  },
  { id: 'classic',     label: 'Classic',     isPro: false },
]

export interface TemplateSelectorProps {
  selected: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className={styles.grid}>
      {TEMPLATES.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          isSelected={selected === t.id}
          onSelect={onChange}
        />
      ))}
    </div>
  )
}

interface TemplateCardProps {
  template:   Template
  isSelected: boolean
  onSelect:   (id: TemplateId) => void
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const { id, label, isPro } = template

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`${styles.card} ${isSelected ? styles.selectedCard : styles.unselectedCard}`}
    >
      <div className={`${styles.preview} ${isSelected ? styles.selectedPreview : styles.unselectedPreview} invoice-theme-${id}`}>
        <TemplateThumbnail />
      </div>
      <div className={styles.cardFooter}>
        <span className={`${styles.cardLabel} ${isSelected ? styles.selectedLabel : styles.unselectedLabel}`}>
          {label}
        </span>
        {isPro ? <ProBadge /> : <span className={styles.freeLabel}>Free</span>}
      </div>
      {isSelected && <SelectedCheck />}
    </button>
  )
}

function TemplateThumbnail() {
  return (
    <div className={styles.thumbDoc}>
      <div className={styles.thumbHeaderBar} />
      <div className={styles.thumbBody}>
        <div className={styles.thumbLine} style={{ width: THUMB_LINE_WIDTH_TITLE }} />
        <div className={styles.thumbLine} style={{ width: THUMB_LINE_WIDTH_SUBTITLE }} />
        <div className={styles.thumbDivider} />
        <div className={styles.thumbLine} style={{ width: THUMB_LINE_WIDTH_BODY_LG }} />
        <div className={styles.thumbLine} style={{ width: THUMB_LINE_WIDTH_BODY_MD }} />
        <div className={styles.thumbLine} style={{ width: THUMB_LINE_WIDTH_BODY_SM }} />
        <div className={styles.thumbDivider} />
        <div className={styles.thumbAccentLine} />
      </div>
    </div>
  )
}

function ProBadge() {
  return (
    <div className={styles.proBadge}>
      <span className="material-symbols-outlined" aria-hidden="true">crown</span>
      <span>PRO</span>
    </div>
  )
}

function SelectedCheck() {
  return (
    <div className={styles.selectedCheck}>
      <span className="material-symbols-outlined" aria-hidden="true">check</span>
    </div>
  )
}
