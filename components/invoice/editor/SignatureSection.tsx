'use client'

import { useRef, useState, useCallback } from 'react'
import styles from './SignatureSection.module.css'

export interface SignatureSectionProps {
  signature: string
  onChange:  (value: string) => void
}

type SignatureMode = 'draw' | 'upload'

const CANVAS_WIDTH    = 400
const CANVAS_HEIGHT   = 120
const DRAW_LINE_WIDTH = 2
const DRAW_COLOR      = '#111827'

export function SignatureSection({ signature, onChange }: SignatureSectionProps) {
  const [mode, setMode] = useState<SignatureMode>('draw')

  return (
    <div className={styles.section}>
      <ModeToggle mode={mode} onModeChange={setMode} />
      {mode === 'draw'
        ? <SignatureCanvas onConfirm={onChange} />
        : <SignatureUpload onUpload={onChange} />
      }
      {signature && <CurrentSignature signature={signature} onRemove={() => onChange('')} />}
    </div>
  )
}

interface ModeToggleProps {
  mode:         SignatureMode
  onModeChange: (m: SignatureMode) => void
}

function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className={styles.modeToggle}>
      <button
        type="button"
        onClick={() => onModeChange('draw')}
        className={`${styles.modeBtn} ${mode === 'draw' ? styles.modeBtnActive : ''}`}
      >
        <span className="material-symbols-outlined" aria-hidden="true">gesture</span>
        Draw
      </button>
      <button
        type="button"
        onClick={() => onModeChange('upload')}
        className={`${styles.modeBtn} ${mode === 'upload' ? styles.modeBtnActive : ''}`}
      >
        <span className="material-symbols-outlined" aria-hidden="true">upload</span>
        Upload
      </button>
    </div>
  )
}

function SignatureCanvas({ onConfirm }: { onConfirm: (dataUrl: string) => void }) {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null)
  const isDrawing  = useRef(false)
  const lastPoint  = useRef<{ x: number; y: number } | null>(null)

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect   = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH  / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    }
  }

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current  = true
    lastPoint.current  = getPoint(e)
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx  = canvas.getContext('2d')
    const last = lastPoint.current
    if (!ctx || !last) return
    const current = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(current.x, current.y)
    ctx.strokeStyle = DRAW_COLOR
    ctx.lineWidth   = DRAW_LINE_WIDTH
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
    ctx.stroke()
    lastPoint.current = current
  }, [])

  const onPointerUp = useCallback(() => {
    isDrawing.current = false
    lastPoint.current = null
  }, [])

  function handleClear() {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.getContext('2d')?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  function handleConfirm() {
    const canvas = canvasRef.current
    if (!canvas) return
    onConfirm(canvas.toDataURL('image/png'))
  }

  return (
    <div className={styles.canvasWrapper}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      <p className={styles.canvasHint}>Draw your signature in the box above</p>
      <div className={styles.canvasActions}>
        <button type="button" onClick={handleClear} className={styles.clearBtn}>
          Clear
        </button>
        <button type="button" onClick={handleConfirm} className={styles.confirmBtn}>
          Apply Signature
        </button>
      </div>
    </div>
  )
}

function SignatureUpload({ onUpload }: { onUpload: (dataUrl: string) => void }) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') onUpload(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <label className={styles.uploadLabel}>
      <span className="material-symbols-outlined" aria-hidden="true">upload_file</span>
      <span className={styles.uploadText}>Click to upload signature image</span>
      <span className={styles.uploadHint}>PNG, JPG or SVG</span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className={styles.uploadInput}
        onChange={handleFile}
      />
    </label>
  )
}

interface CurrentSignatureProps {
  signature: string
  onRemove:  () => void
}

function CurrentSignature({ signature, onRemove }: CurrentSignatureProps) {
  return (
    <div className={styles.currentSignature}>
      <span className={styles.currentSignatureLabel}>Current signature</span>
      <div className={styles.currentSignaturePreview}>
        <img src={signature} alt="Signature preview" className={styles.signatureImg} />
        <button type="button" onClick={onRemove} className={styles.removeBtn} aria-label="Remove signature">
          <span className="material-symbols-outlined" aria-hidden="true">delete</span>
        </button>
      </div>
    </div>
  )
}
