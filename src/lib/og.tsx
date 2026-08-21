import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

// Shared branded OpenGraph card. Build-time (force-static) safe.
export function ogImage(headline: string, subline: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1A0507 0%, #3A0A0E 55%, #0B1220 100%)',
          padding: '72px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 14, height: 14, background: '#B01C24', marginRight: 16 }} />
          <div style={{ color: '#F0B34A', fontSize: 26, letterSpacing: 6, textTransform: 'uppercase' }}>
            The Crimson Bench
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: 'white', fontSize: 66, lineHeight: 1.05, maxWidth: 980 }}>{headline}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 30, marginTop: 28 }}>{subline}</div>
        </div>
        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.5)', fontSize: 24, letterSpacing: 2 }}>
          crimsonbench.com · Built by Ivy League operators
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
