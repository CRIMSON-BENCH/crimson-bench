'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const ENT_ENDPOINT =
  process.env.NEXT_PUBLIC_ENTITLEMENTS_ENDPOINT ||
  'https://crimson-bench-connect.lovable.app/api/public/entitlements'

interface AuthCtx {
  user: User | null
  loading: boolean
  signInWithGoogle: () => void
  signOut: () => void
}
const Ctx = createContext<AuthCtx>({ user: null, loading: true, signInWithGoogle: () => {}, signOut: () => {} })
export const useAuth = () => useContext(Ctx)

/** After auth changes, read the user's entitlements and mirror them into localStorage
 *  so useIsPro() and the gated runners unlock instantly. */
async function syncEntitlements(session: Session | null) {
  try {
    if (!session) {
      localStorage.removeItem('cb_pro')
      localStorage.removeItem('cb_entitlements')
    } else {
      const res = await fetch(ENT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      })
      const d = await res.json().catch(() => null)
      if (d && d.pro) localStorage.setItem('cb_pro', '1')
      else localStorage.removeItem('cb_pro')
      localStorage.setItem('cb_entitlements', JSON.stringify(d || {}))
    }
  } catch { /* offline / endpoint down — leave prior state */ }
  window.dispatchEvent(new Event('cb-entitlement'))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      syncEntitlements(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      syncEntitlements(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
  const signOut = () => supabase.auth.signOut()

  return <Ctx.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</Ctx.Provider>
}
