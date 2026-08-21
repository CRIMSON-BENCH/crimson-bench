// Checkout seam. Set NEXT_PUBLIC_CHECKOUT_ENDPOINT in the deploy env to the Lovable/
// Supabase `create-checkout` function URL. When unset, buttons fall back to /contact.

export const CHECKOUT_ENDPOINT = process.env.NEXT_PUBLIC_CHECKOUT_ENDPOINT || ''

export type CheckoutType =
  | 'subscription_monthly'
  | 'subscription_annual'
  | 'sim_3pack'
  | 'company_model'
  | 'toolkit'

/** Start a Stripe Checkout for the given purchase. Redirects to Stripe (or /contact if
 *  no endpoint is configured yet). The Lovable function should return { url }.
 *  For one-time toolkits, pass name + amount (in cents) so it charges the exact price. */
export async function startCheckout(
  type: CheckoutType,
  opts: { itemId?: string; name?: string; amount?: number } = {}
): Promise<void> {
  if (!CHECKOUT_ENDPOINT) { window.location.href = '/contact'; return }
  try {
    const res = await fetch(CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        type,
        item_id: opts.itemId,
        name: opts.name,
        amount: opts.amount,
        return_origin: window.location.origin,
      }),
    })
    const data = await res.json().catch(() => null)
    if (data && data.url) { window.location.href = data.url; return }
    window.location.href = '/contact'
  } catch {
    window.location.href = '/contact'
  }
}
