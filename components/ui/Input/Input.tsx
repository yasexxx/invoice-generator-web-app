import styles from './Input.module.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?:        string
  error?:        string
  hint?:         string
  size?:         InputSize
  icon?:         string
  trailingSlot?: React.ReactNode
}

export function Input({
  label,
  error,
  hint,
  size = 'md',
  icon,
  trailingSlot,
  id,
  className,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const inputCls = [
    styles.input,
    styles[size],
    icon          && styles.inputWithIcon,
    trailingSlot  && styles.inputWithTrailing,
    error         && styles.inputError,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && (
          <span className={`material-symbols-outlined ${styles.icon}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <input id={inputId} className={inputCls} aria-invalid={!!error} {...rest} />
        {trailingSlot && <div className={styles.trailing}>{trailingSlot}</div>}
      </div>
      {error  && <span className={styles.error}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
