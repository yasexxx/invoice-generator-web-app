import type { TemplateId } from '../invoice.types'
import styles from './TemplateSelector.module.css'

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
    <div className={styles.selector}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className="material-symbols-outlined" aria-hidden="true">palette</span>
          <h2 className="title-md">Template Style</h2>
        </div>
        <span className={styles.meta}>{TEMPLATES.length} Styles Available</span>
      </div>
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
        <div className={styles.thumbLine} style={{ width: '55%' }} />
        <div className={styles.thumbLine} style={{ width: '35%' }} />
        <div className={styles.thumbDivider} />
        <div className={styles.thumbLine} style={{ width: '80%' }} />
        <div className={styles.thumbLine} style={{ width: '65%' }} />
        <div className={styles.thumbLine} style={{ width: '72%' }} />
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
