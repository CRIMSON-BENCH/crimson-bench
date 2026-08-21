'use client'

import { startCheckout, type CheckoutType } from '@/lib/checkout'

export default function BuyButton({
  type,
  itemId,
  name,
  amount,
  items,
  className,
  children,
}: {
  type: CheckoutType
  itemId?: string
  /** For one-time toolkits: the product name shown at Stripe checkout. */
  name?: string
  /** For one-time toolkits: exact price in cents (so it charges the real price). */
  amount?: number
  /** For bundles: member product ids to grant on purchase. */
  items?: string[]
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={() => startCheckout(type, { itemId, name, amount, items })} className={className}>
      {children}
    </button>
  )
}
