import { useState, useEffect, useRef } from 'react'
import useStore from '../../store/useStore'
import { NODES_WITH_POS } from '../../data/network'

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768
const NODE_COUNT = NODES_WITH_POS.length

export default function NodeHint() {
  const hasInteracted = useStore(s => s.hasInteracted)
  const progress      = useStore(s => s.scrollProgress)
  const [visible, setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const timerRef = useRef(null)

  // Show after network assembles (scroll > 0.20), hide after timeout or interaction
  useEffect(() => {
    if (hasInteracted && !dismissed) {
      setDismissed(true)
    }
  }, [hasInteracted, dismissed])

  useEffect(() => {
    if (progress > 0.20 && !dismissed && !visible) {
      setVisible(true)
      // Auto-dismiss after 8 seconds
      timerRef.current = setTimeout(() => setDismissed(true), 8000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [progress > 0.20, dismissed]) // eslint-disable-line react-hooks/exhaustive-deps

  // Don't show during hero
  if (progress < 0.18) return null
  if (dismissed && !visible) return null

  const opacity = visible && !dismissed ? 1 : 0

  return (
    <div style={{
      position: 'fixed',
      bottom: MOBILE ? 80 : 48,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 35,
      pointerEvents: 'none',
      opacity,
      transition: 'opacity 0.6s ease',
    }}
      onTransitionEnd={() => { if (dismissed) setVisible(false) }}
    >
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        {/* Main prompt */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(2,5,16,0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: 8,
          padding: MOBILE ? '10px 16px' : '12px 24px',
        }}>
          {/* Pulsing dot */}
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#60a5fa',
            boxShadow: '0 0 8px #60a5fa, 0 0 16px #60a5fa44',
            animation: 'hint-pulse 1.4s ease-in-out infinite',
          }} />

          <span style={{
            fontFamily: 'monospace',
            fontSize: MOBILE ? 10 : 11,
            color: '#60a5fa',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            {NODE_COUNT} nodes online
          </span>

          <span style={{
            fontFamily: 'monospace',
            fontSize: MOBILE ? 10 : 11,
            color: 'rgba(96,165,250,0.4)',
          }}>
            —
          </span>

          <span style={{
            fontFamily: 'monospace',
            fontSize: MOBILE ? 10 : 11,
            color: '#94a3b8',
            letterSpacing: '0.12em',
          }}>
            {MOBILE ? 'TAP' : 'CLICK'} ANY NODE TO INSPECT
          </span>
        </div>

        {/* Subtle scan line underneath */}
        <div style={{
          width: MOBILE ? 160 : 220,
          height: 1,
          background: 'linear-gradient(to right, transparent, #60a5fa44, #60a5fa, #60a5fa44, transparent)',
          animation: 'hint-scan 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes hint-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes hint-scan {
          0%, 100% { opacity: 0.3; transform: scaleX(0.6); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
