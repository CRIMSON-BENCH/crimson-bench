'use client'

import { useAuth } from '@/lib/auth'

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  if (loading) return null
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors"
      >
        Sign In
      </button>
    )
  }
  return (
    <button
      onClick={signOut}
      title={user.email ?? undefined}
      className="font-mono text-xs tracking-wider uppercase text-slate-600 dark:text-slate-400 hover:text-[#B01C24] transition-colors"
    >
      Sign Out
    </button>
  )
}
