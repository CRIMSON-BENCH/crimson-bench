'use client'

import { startCheckout, type CheckoutType } from '@/lib/checkout'

export default function BuyButton({
  type,
  itemId,
  className,
  children,
}: {
  type: CheckoutType
  itemId?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={() => startCheckout(type, itemId)} className={className}>
      {children}
    </button>
  )
}
