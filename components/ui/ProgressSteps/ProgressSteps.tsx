import styles from './ProgressSteps.module.css'

export interface Step {
  label: string
}

export interface ProgressStepsProps {
  steps: Step[]
  currentStep: number  // 0-based index of the active step
  className?: string
}

export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Progress"
    >
      {steps.map((step, i) => {
        const isDone   = i < currentStep
        const isActive = i === currentStep

        const stepCls = [
          styles.step,
          isDone   && styles.done,
          isActive && styles.active,
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={i} className={stepCls}>
            <div className={styles.indicator}>
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className={styles.number}>{i + 1}</span>
              )}
            </div>

            <span className={styles.label}>{step.label}</span>

            {i < steps.length - 1 && (
              <div className={[styles.connector, isDone && styles.connectorDone].filter(Boolean).join(' ')} aria-hidden />
            )}
          </div>
        )
      })}
    </nav>
  )
}
