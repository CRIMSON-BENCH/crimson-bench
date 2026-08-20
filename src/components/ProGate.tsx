'use client'

import { useIsPro } from '@/lib/entitlement'
import ProToolRunner from './ProToolRunner'

/** Wraps a Pro simulator: full access for subscribers, blurred preview for everyone else. */
export default function ProGate({ id }: { id: string }) {
  const pro = useIsPro()
  return <ProToolRunner id={id} locked={!pro} />
}
