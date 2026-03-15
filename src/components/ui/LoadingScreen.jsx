import { useEffect, useState } from 'react'

const BOOT_LINES = [
  'Initializing neural network...',
  'Mapping skill connections...',
  'Loading project nodes...',
  'Calibrating signal pathways...',
  'System ready.',
]

export default function LoadingScreen({ onComplete, visible }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setLineIdx(prev => {
        if (prev >= BOOT_LINES.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setFading(true)
            setTimeout(onComplete, 600)
          }, 500)
          return prev
        }
        return prev + 1
      })
    }, 420)
    return () => clearInterval(interval)
  }, [visible, onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#020510',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: fading ? 'none' : 'all',
    }}>
      {/* Pulsing dot */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: '#60a5fa',
          boxShadow: '0 0 20px #60a5fa, 0 0 60px rgba(96,165,250,0.35)',
          animation: 'pulse-dot 1s ease-in-out infinite',
        }} />
      </div>

      {/* Boot lines */}
      <div style={{ fontFamily: 'monospace', width: 340 }}>
        {BOOT_LINES.slice(0, lineIdx + 1).map((line, i) => (
          <div key={i} style={{
            color: i === lineIdx ? '#60a5fa' : '#1e3a5f',
            fontSize: 13,
            marginBottom: 6,
            opacity: i === lineIdx ? 1 : 0.4,
            transition: 'color 0.3s, opacity 0.3s',
          }}>
            <span style={{ color: '#1e3a5f', marginRight: 8 }}>&gt;</span>
            {line}
            {i === lineIdx && <span style={{ animation: 'blink 0.8s step-end infinite' }}>_</span>}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.5); box-shadow: 0 0 30px #60a5fa, 0 0 90px rgba(96,165,250,0.5); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
