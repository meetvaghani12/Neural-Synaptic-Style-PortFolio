import { useEffect, useState, useRef } from 'react'
import useStore from '../../store/useStore'
import { NODE_CARDS } from '../../data/nodeCards'
import { NODES_WITH_POS } from '../../data/network'

// ── Hook: 3D world position → 2D screen coords ───────────────────────────────
function useNodeScreenPos(nodeId) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const node = NODES_WITH_POS.find(n => n.id === nodeId)
    if (!node) return
    // Input layer nodes are at X=-7, various Y. We estimate screen position
    // by using a fixed left-anchor since the camera faces straight on.
    // Actual projection happens via the Html component in Three.js context.
    // Here we just use rough percentage offsets for the overlay.
    setPos({ x: window.innerWidth * 0.08, y: window.innerHeight * 0.5 })
  }, [nodeId])

  return pos
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text, delay = 0, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    if (!text) return
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay, speed])
  return displayed
}

// ── Border trace animation (SVG) ──────────────────────────────────────────────
function TracingBorder({ color = '#60a5fa', duration = 600 }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <rect
        x="1" y="1"
        width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx="12" ry="12"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2000"
        strokeDashoffset="2000"
        style={{
          animation: `trace-border ${duration}ms ease-out forwards`,
          width: '99%', height: '99%',
        }}
      />
      <style>{`
        @keyframes trace-border {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  )
}

// ── Corner HUD brackets ───────────────────────────────────────────────────────
function HudCorners({ color }) {
  const s = { position: 'absolute', width: 16, height: 16 }
  const line = { position: 'absolute', background: color }
  return (
    <>
      {/* Top-left */}
      <div style={{ ...s, top: 8, left: 8 }}>
        <div style={{ ...line, top: 0, left: 0, width: 2, height: 14 }} />
        <div style={{ ...line, top: 0, left: 0, width: 14, height: 2 }} />
      </div>
      {/* Top-right */}
      <div style={{ ...s, top: 8, right: 8 }}>
        <div style={{ ...line, top: 0, right: 0, width: 2, height: 14 }} />
        <div style={{ ...line, top: 0, right: 0, width: 14, height: 2 }} />
      </div>
      {/* Bottom-left */}
      <div style={{ ...s, bottom: 8, left: 8 }}>
        <div style={{ ...line, bottom: 0, left: 0, width: 2, height: 14 }} />
        <div style={{ ...line, bottom: 0, left: 0, width: 14, height: 2 }} />
      </div>
      {/* Bottom-right */}
      <div style={{ ...s, bottom: 8, right: 8 }}>
        <div style={{ ...line, bottom: 0, right: 0, width: 2, height: 14 }} />
        <div style={{ ...line, bottom: 0, right: 0, width: 14, height: 2 }} />
      </div>
    </>
  )
}

// ── Pulse rings (NN activation effect) ───────────────────────────────────────
function PulseRings({ color }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 14 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute',
          inset: 0,
          border: `1px solid ${color}`,
          borderRadius: 14,
          animation: `pulse-ring 1.2s ease-out ${i * 0.2}s forwards`,
          opacity: 0,
        }} />
      ))}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.8; }
          100% { transform: scale(1.12); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ── Scan line effect ──────────────────────────────────────────────────────────
function ScanLine({ color }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 14, zIndex: 2 }}>
      <div style={{
        position: 'absolute', left: 0, right: 0,
        height: 2,
        background: `linear-gradient(to right, transparent, ${color}44, ${color}88, ${color}44, transparent)`,
        animation: 'scan 0.7s ease-out forwards',
        boxShadow: `0 0 12px ${color}66`,
      }} />
      <style>{`
        @keyframes scan {
          0%   { top: 0%;   opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}

// ── NODE TYPE → accent color ──────────────────────────────────────────────────
const TYPE_COLOR = {
  identity:  '#60a5fa',
  role:      '#34d399',
  education: '#a78bfa',
  location:  '#f59e0b',
}

// ── Main Card ─────────────────────────────────────────────────────────────────
export default function InputNodeCard() {
  const activeNode = useStore(s => s.activeNode)
  const setActive  = useStore(s => s.setActiveNode)

  const node = activeNode ? NODES_WITH_POS.find(n => n.id === activeNode && n.layer === 0) : null
  const data = node ? NODE_CARDS[node.id] : null
  const visible = !!data

  const [phase, setPhase]   = useState('hidden')  // hidden | entering | visible
  const [show, setShow]     = useState(false)
  const prevActive          = useRef(null)

  useEffect(() => {
    if (data && prevActive.current !== activeNode) {
      prevActive.current = activeNode
      setPhase('entering')
      setShow(true)
      setTimeout(() => setPhase('visible'), 50)
    } else if (!data) {
      setPhase('hidden')
      setTimeout(() => setShow(false), 400)
    }
  }, [data, activeNode])

  const color  = data ? TYPE_COLOR[data.type] ?? '#60a5fa' : '#60a5fa'
  const bioTyped = useTypewriter(data?.bio ?? '', 700, 18)

  if (!show && !visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setActive(null)}
        style={{
          position: 'fixed', inset: 0, zIndex: 45,
          background: 'rgba(2,5,16,0.55)',
          backdropFilter: 'blur(3px)',
          opacity: phase === 'visible' ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Card */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: phase === 'visible'
          ? 'translate(-50%, -50%) scale(1)'
          : 'translate(-50%, -50%) scale(0.88)',
        zIndex: 46,
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        width: 'min(420px, 94vw)',
      }}>
        <div style={{
          position: 'relative',
          background: 'rgba(2,5,16,0.96)',
          borderRadius: 14,
          padding: window.innerWidth < 768 ? '1.25rem' : '1.75rem',
          boxShadow: `0 0 60px ${color}22, 0 24px 80px rgba(0,0,0,0.7)`,
          border: '1px solid transparent',
        }}>
          {/* Animated tracing border */}
          {phase === 'visible' && <TracingBorder color={color} duration={500} />}

          {/* HUD corners */}
          <HudCorners color={color} />

          {/* Pulse rings on open */}
          {phase === 'visible' && <PulseRings color={color} />}

          {/* Scan line */}
          {phase === 'visible' && <ScanLine color={color} />}

          {/* Close */}
          <button
            onClick={() => setActive(null)}
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#334155', fontSize: 18, lineHeight: 1, zIndex: 3,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = color}
            onMouseLeave={e => e.target.style.color = '#334155'}
          >×</button>

          {/* Header */}
          <div style={{
            fontFamily: 'monospace', fontSize: 10,
            color, letterSpacing: '0.25em', marginBottom: 16,
            opacity: 0.7, zIndex: 3, position: 'relative',
          }}>
            ◈ {data?.header}
          </div>

          {/* Avatar + Name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, position: 'relative', zIndex: 3 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, ${color}44, ${color}11)`,
              border: `2px solid ${color}66`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color,
              flexShrink: 0,
              boxShadow: `0 0 20px ${color}33`,
            }}>
              {data?.avatar}
            </div>
            <div>
              <div style={{
                fontFamily: 'monospace', fontSize: 11, color: color + 'aa',
                letterSpacing: '0.15em', marginBottom: 3,
              }}>
                NODE.{data?.type?.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'system-ui', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {data?.fields?.[0]?.value}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: `linear-gradient(to right, ${color}44, transparent)`,
            marginBottom: 16, position: 'relative', zIndex: 3,
          }} />

          {/* Fields */}
          <div style={{ marginBottom: 16, position: 'relative', zIndex: 3 }}>
            {data?.fields?.slice(1).map(({ label, value, highlight }, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10,
                fontFamily: 'monospace', fontSize: 12,
                marginBottom: 8,
                animation: `field-in 0.3s ease ${0.3 + i * 0.08}s both`,
              }}>
                <span style={{ color: color + '88', minWidth: 72, letterSpacing: '0.1em' }}>
                  {label}
                </span>
                <span style={{
                  color: highlight ? color : '#94a3b8',
                  fontWeight: highlight ? 600 : 400,
                  textShadow: highlight ? `0 0 10px ${color}66` : 'none',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Bio — typewriter */}
          <div style={{
            fontFamily: 'system-ui', fontSize: '0.82rem',
            color: '#475569', lineHeight: 1.7,
            borderLeft: `2px solid ${color}44`,
            paddingLeft: 10, marginBottom: 16,
            minHeight: 56, position: 'relative', zIndex: 3,
          }}>
            {bioTyped}
            <span style={{ animation: 'blink 0.7s step-end infinite', color }}>_</span>
          </div>

          {/* Links */}
          {data?.links?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 3 }}>
              {data.links.map(link => (
                <a
                  key={link.label}
                  href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontFamily: 'monospace', fontSize: 11,
                    color: color + 'cc',
                    background: color + '11',
                    border: `1px solid ${color}33`,
                    borderRadius: 6, padding: '5px 12px',
                    textDecoration: 'none', letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = color + '22'
                    e.currentTarget.style.borderColor = color + '66'
                    e.currentTarget.style.color = color
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = color + '11'
                    e.currentTarget.style.borderColor = color + '33'
                    e.currentTarget.style.color = color + 'cc'
                  }}
                >
                  {link.icon} ↗
                </a>
              ))}
            </div>
          )}

          {/* Bottom signal indicator */}
          <div style={{
            marginTop: 16, paddingTop: 12,
            borderTop: `1px solid rgba(255,255,255,0.05)`,
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: 10,
            color: '#1e3a5f', position: 'relative', zIndex: 3,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: color, boxShadow: `0 0 6px ${color}`,
              animation: 'blink 1.2s ease-in-out infinite',
            }} />
            SIGNAL ACTIVE — {data?.fields?.[0]?.value?.toUpperCase()}
          </div>
        </div>

        <style>{`
          @keyframes field-in {
            from { opacity: 0; transform: translateX(-6px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes blink {
            0%,100% { opacity:1 } 50% { opacity:0.2 }
          }
        `}</style>
      </div>
    </>
  )
}
