'use client'

import { useEffect, useState } from 'react'

/**
 * Whether the current visitor has Toolkit Pro access.
 *
 * Lovable owns login + subscriptions. It signals Pro access to this static site
 * in either of two ways after a subscriber logs in:
 *   - window.__CB_PRO__ = true         (set by the app shell / auth provider), or
 *   - localStorage 'cb_pro' = '1'      (set on login, cleared on logout)
 *
 * Until that signal is present, everyone is treated as free → tools show the
 * blurred preview + unlock CTA. This is the single seam to wire real entitlement.
 */
export function useIsPro(): boolean {
  const [pro, setPro] = useState(false)
  useEffect(() => {
    const read = () => {
      try {
        const w = (window as unknown as { __CB_PRO__?: boolean }).__CB_PRO__ === true
        const ls = localStorage.getItem('cb_pro') === '1'
        setPro(w || ls)
      } catch { /* SSR / no storage */ }
    }
    read()
    window.addEventListener('cb-entitlement', read)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener('cb-entitlement', read)
      window.removeEventListener('storage', read)
    }
  }, [])
  return pro
}

/** Where the unlock CTA sends people. Point this at the membership checkout when live. */
export const TOOLKIT_PRO_URL = '/digital-products/the-crimson-bench-vault'
