import styles from './Textarea.module.css'

export type TextareaSize   = 'sm' | 'md' | 'lg'
export type TextareaResize = 'none' | 'vertical' | 'both'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:   string
  error?:   string
  hint?:    string
  size?:    TextareaSize
  resize?:  TextareaResize
}

export function Textarea({
  label,
  error,
  hint,
  size   = 'md',
  resize = 'vertical',
  id,
  className,
  ...rest
}: TextareaProps) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const cls = [
    styles.textarea,
    styles[size],
    styles[`resize${capitalize(resize)}`],
    error && styles.textareaError,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea id={fieldId} className={cls} aria-invalid={!!error} {...rest} />
      {error  && <span className={styles.error}>{error}</span>}
      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
