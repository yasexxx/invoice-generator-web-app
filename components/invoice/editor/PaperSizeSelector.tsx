import type { PaperSize } from '../invoice.types'
import { SectionTitle }   from './SectionTitle'
import styles from './PaperSizeSelector.module.css'

interface PaperOption {
  id:         PaperSize
  label:      string
  dimensions: string
}

const PAPER_OPTIONS: PaperOption[] = [
  { id: 'a4',     label: 'A4',     dimensions: '210×297mm' },
  { id: 'letter', label: 'Letter', dimensions: '8.5×11in'  },
  { id: 'legal',  label: 'Legal',  dimensions: '8.5×14in'  },
]

export interface PaperSizeSelectorProps {
  selected: PaperSize
  onChange: (size: PaperSize) => void
}

export function PaperSizeSelector({ selected, onChange }: PaperSizeSelectorProps) {
  return (
    <div className={styles.selector}>
      <SectionTitle icon="description" title="Paper Size" />
      <div className={styles.grid}>
        {PAPER_OPTIONS.map((option) => (
          <PaperCard
            key={option.id}
            option={option}
            isSelected={selected === option.id}
            onSelect={onChange}
          />
        ))}
      </div>
    </div>
  )
}

interface PaperCardProps {
  option:     PaperOption
  isSelected: boolean
  onSelect:   (id: PaperSize) => void
}

function PaperCard({ option, isSelected, onSelect }: PaperCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`${styles.card} ${isSelected ? styles.selectedCard : ''}`}
      aria-pressed={isSelected}
    >
      <div className={styles.thumbnail} data-paper={option.id} />
      <span className={styles.label}>{option.label}</span>
      <span className={styles.dimensions}>{option.dimensions}</span>
    </button>
  )
}
