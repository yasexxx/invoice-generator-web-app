'use client'

import { useState, useCallback } from 'react'

export const ZOOM_MIN     = 0.5
export const ZOOM_MAX     = 2.0
export const ZOOM_STEP    = 0.25
export const ZOOM_DEFAULT = 1.0

export interface FullscreenPreviewControls {
  isOpen:      boolean
  currentPage: number
  zoomLevel:   number
  open:        () => void
  close:       () => void
  goNext:      () => void
  goPrev:      () => void
  zoomIn:      () => void
  zoomOut:     () => void
}

export function useFullscreenPreview(): FullscreenPreviewControls {
  const [isOpen,      setIsOpen]      = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [zoomLevel,   setZoomLevel]   = useState(ZOOM_DEFAULT)

  const open  = useCallback(() => { setIsOpen(true); setCurrentPage(0) }, [])
  const close = useCallback(() => { setIsOpen(false); setZoomLevel(ZOOM_DEFAULT) }, [])

  const goNext = useCallback(() => setCurrentPage((p) => p + 1), [])
  const goPrev = useCallback(() => setCurrentPage((p) => Math.max(p - 1, 0)), [])

  const zoomIn  = useCallback(() => setZoomLevel((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX)), [])
  const zoomOut = useCallback(() => setZoomLevel((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN)), [])

  return { isOpen, currentPage, zoomLevel, open, close, goNext, goPrev, zoomIn, zoomOut }
}
