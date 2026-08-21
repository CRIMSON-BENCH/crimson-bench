'use client'

import { startCheckout, type CheckoutType } from '@/lib/checkout'

export default function BuyButton({
  type,
  itemId,
  name,
  amount,
  className,
  children,
}: {
  type: CheckoutType
  itemId?: string
  /** For one-time toolkits: the product name shown at Stripe checkout. */
  name?: string
  /** For one-time toolkits: exact price in cents (so it charges the real price). */
  amount?: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={() => startCheckout(type, { itemId, name, amount })} className={className}>
      {children}
    </button>
  )
}
