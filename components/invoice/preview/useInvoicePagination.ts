'use client'

import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import type { LineItem } from '../invoice.types'

export type BodyRefCallback = (el: HTMLDivElement | null) => void

export interface PaginationResult {
  pages:        LineItem[][]
  registerBody: (index: number) => BodyRefCallback
}

// ── State & reducer ────────────────────────────────────────────────────────────

interface PaginationState {
  capacities: number[]
}

type PaginationAction =
  | { type: 'reset'; itemCount: number }
  | { type: 'split'; pageIndex: number }

function paginationReducer(state: PaginationState, action: PaginationAction): PaginationState {
  switch (action.type) {
    case 'reset':
      return { capacities: [Math.max(action.itemCount, 1)] }
    case 'split': {
      const cap = state.capacities[action.pageIndex] ?? 0
      if (cap <= 1) return state
      const next = [...state.capacities]
      next[action.pageIndex]     -= 1
      next[action.pageIndex + 1]  = (next[action.pageIndex + 1] ?? 0) + 1
      return { capacities: next }
    }
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useInvoicePagination(items: LineItem[]): PaginationResult {
  const itemCount = items.length

  const [state, dispatch] = useReducer(
    paginationReducer,
    { capacities: [Math.max(itemCount, 1)] },
  )

  const bodyRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // When the item count changes, reset to one page.
  // Overflow detection below re-derives the split from scratch.
  useLayoutEffect(() => {
    dispatch({ type: 'reset', itemCount })
  }, [itemCount])

  // After React commits a layout, check every registered page body for overflow.
  // If a page overflows, split off one item to the next page and dispatch once.
  // The resulting state change re-triggers this effect until no page overflows.
  //
  // Deps on state.capacities ensures we only re-run after a real layout change,
  // not on every render — satisfying the "external system read → dispatch" pattern.
  useLayoutEffect(() => {
    for (let i = 0; i < state.capacities.length; i++) {
      const body = bodyRefs.current.get(i)
      if (!body) continue
      // 2 px tolerance for sub-pixel rounding
      if (body.scrollHeight > body.clientHeight + 2 && state.capacities[i] > 1) {
        dispatch({ type: 'split', pageIndex: i })
        break
      }
    }
  }, [state.capacities])

  // When the viewport is resized, the scaled page height changes.
  // Reset to one page and let the overflow effect re-derive the split.
  useEffect(() => {
    const reset = () => dispatch({ type: 'reset', itemCount })
    window.addEventListener('resize', reset, { passive: true })
    return () => window.removeEventListener('resize', reset)
  }, [itemCount])

  // ── Ref-callback factory ─────────────────────────────────────────────────────

  function registerBody(index: number): BodyRefCallback {
    return (el: HTMLDivElement | null) => {
      if (el) bodyRefs.current.set(index, el)
      else    bodyRefs.current.delete(index)
    }
  }

  // ── Build page slices ────────────────────────────────────────────────────────

  const pages: LineItem[][] = []
  let offset = 0
  for (const cap of state.capacities) {
    const slice = items.slice(offset, offset + cap)
    if (slice.length > 0) pages.push(slice)
    offset += cap
    if (offset >= itemCount) break
  }
  if (pages.length === 0) pages.push([])

  return { pages, registerBody }
}
