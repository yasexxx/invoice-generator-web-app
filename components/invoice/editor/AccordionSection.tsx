'use client'

import { useState } from 'react'
import styles from './AccordionSection.module.css'

export interface AccordionSectionProps {
  icon:         string
  title:        string
  defaultOpen?: boolean
  children:     React.ReactNode
}

export function AccordionSection({ icon, title, defaultOpen = true, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={styles.section}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className={styles.titleRow}>
          <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
          <h2 className="title-md">{title}</h2>
        </div>
        <span
          className={`material-symbols-outlined ${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        >
          keyboard_arrow_down
        </span>
      </button>
      {isOpen && <div className={styles.body}>{children}</div>}
    </div>
  )
}
