'use client'

import { useEffect, useRef }    from 'react'
import { InvoiceDocument }      from './InvoiceDocument'
import { ZOOM_MIN, ZOOM_MAX }   from './useFullscreenPreview'
import type { FullscreenPreviewControls } from './useFullscreenPreview'
import type { LineItem, InvoiceFormData, InvoiceTotals } from '../invoice.types'
import styles from './FullscreenPreview.module.css'

export interface FullscreenPreviewProps {
  data:     InvoiceFormData
  totals:   InvoiceTotals
  pages:    LineItem[][]
  controls: FullscreenPreviewControls
}

export function FullscreenPreview({ data, totals, pages, controls }: FullscreenPreviewProps) {
  const { isOpen, currentPage, zoomLevel, close, goNext, goPrev, zoomIn, zoomOut } = controls
  const totalPages  = pages.length
  const scrollerRef = useRef<HTMLDivElement>(null)

  // Scroll to the current page when it changes.
  useEffect(() => {
    const pageEls = scrollerRef.current?.querySelectorAll<HTMLElement>('[data-paper]')
    pageEls?.[currentPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [currentPage])

  // Keyboard navigation while the overlay is open.
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { close(); return }
      if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && currentPage < totalPages - 1) goNext()
      if ((e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   && currentPage > 0)              goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, currentPage, totalPages, close, goNext, goPrev])

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const hasPrev   = currentPage > 0
  const hasNext   = currentPage < totalPages - 1
  const multiPage = totalPages > 1

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Full-screen invoice preview">
      <Toolbar
        currentPage={currentPage}
        totalPages={totalPages}
        multiPage={multiPage}
        zoomLevel={zoomLevel}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onClose={close}
      />

      <div ref={scrollerRef} className={styles.scroller}>
        {/* zoom applied here so page dimensions scale without affecting pagination
            (pagination runs on the normal-preview DOM, not inside this overlay) */}
        <div className={styles.zoomWrapper} style={{ zoom: zoomLevel }}>
          <InvoiceDocument data={data} totals={totals} pages={pages} />
        </div>
      </div>

      {multiPage && (
        <NavControls
          hasPrev={hasPrev}
          hasNext={hasNext}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  )
}

interface ToolbarProps {
  currentPage: number
  totalPages:  number
  multiPage:   boolean
  zoomLevel:   number
  onZoomIn:    () => void
  onZoomOut:   () => void
  onClose:     () => void
}

function Toolbar({ currentPage, totalPages, multiPage, zoomLevel, onZoomIn, onZoomOut, onClose }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.badge}>
        <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
        LIVE PREVIEW
      </div>
      {multiPage && (
        <span className={styles.pageIndicator}>
          {currentPage + 1} / {totalPages}
        </span>
      )}
      <ZoomControls zoomLevel={zoomLevel} onZoomIn={onZoomIn} onZoomOut={onZoomOut} />
      <button
        type="button"
        onClick={onClose}
        className={styles.closeBtn}
        aria-label="Exit full-screen preview"
      >
        <span className="material-symbols-outlined" aria-hidden="true">close_fullscreen</span>
      </button>
    </div>
  )
}

interface ZoomControlsProps {
  zoomLevel: number
  onZoomIn:  () => void
  onZoomOut: () => void
}

function ZoomControls({ zoomLevel, onZoomIn, onZoomOut }: ZoomControlsProps) {
  return (
    <div className={styles.zoomControls}>
      <button
        type="button"
        onClick={onZoomOut}
        disabled={zoomLevel <= ZOOM_MIN}
        className={styles.zoomBtn}
        aria-label="Zoom out"
      >
        <span className="material-symbols-outlined" aria-hidden="true">remove</span>
      </button>
      <span className={styles.zoomLabel}>{Math.round(zoomLevel * 100)}%</span>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={zoomLevel >= ZOOM_MAX}
        className={styles.zoomBtn}
        aria-label="Zoom in"
      >
        <span className="material-symbols-outlined" aria-hidden="true">add</span>
      </button>
    </div>
  )
}

interface NavControlsProps {
  hasPrev: boolean
  hasNext: boolean
  onPrev:  () => void
  onNext:  () => void
}

function NavControls({ hasPrev, hasNext, onPrev, onNext }: NavControlsProps) {
  return (
    <div className={styles.navControls}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        className={styles.navButton}
        aria-label="Previous page"
      >
        <span className="material-symbols-outlined" aria-hidden="true">navigate_before</span>
        Prev
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className={styles.navButton}
        aria-label="Next page"
      >
        Next
        <span className="material-symbols-outlined" aria-hidden="true">navigate_next</span>
      </button>
    </div>
  )
}
