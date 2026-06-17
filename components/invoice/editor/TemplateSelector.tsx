import type { TemplateId } from '../invoice.types'
import styles from './TemplateSelector.module.css'

interface Template {
  id: TemplateId
  label: string
  isPro: boolean
  previewClass: string
}

const TEMPLATES: Template[] = [
  { id: 'minimalist',   label: 'Minimalist',   isPro: false, previewClass: 'bg-white' },
  { id: 'corporate',    label: 'Corporate',    isPro: true,  previewClass: 'bg-gradient-to-br from-surface-container to-surface-container-highest' },
  { id: 'modern-dark',  label: 'Modern Dark',  isPro: true,  previewClass: 'bg-gradient-to-tr from-surface-container-low to-surface-container-highest' },
  { id: 'classic',      label: 'Classic',      isPro: false, previewClass: 'bg-gray-50' },
]

interface TemplateSelectorProps {
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
        <span className={styles.meta}>
          {TEMPLATES.length} Styles Available
        </span>
      </div>
      <div className={styles.grid}>
        {TEMPLATES.map((t) => (
          <TemplateCard key={t.id} template={t} isSelected={selected === t.id} onSelect={onChange} />
        ))}
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  isSelected: boolean
  onSelect: (id: TemplateId) => void
}

function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const { id, label, isPro, previewClass } = template

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`${styles.card} ${isSelected ? styles.selectedCard : styles.unselectedCard}`}
    >
      <div
        className={`${styles.preview} ${previewClass} ${
          isSelected
            ? styles.selectedPreview
            : styles.unselectedPreview
        }`}
      />
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
