import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { NODES_WITH_POS, getNodeColor, LAYER_COLORS } from '../../data/network'
import { NODE_CARDS } from '../../data/nodeCards'
import useStore from '../../store/useStore'

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

const ASSEMBLE_START = 0.08
const ASSEMBLE_END   = 0.28

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const nodeMap = {}
NODES_WITH_POS.forEach(n => { nodeMap[n.id] = n })

const TYPE_COLOR = {
  identity:   '#60a5fa',
  role:       '#34d399',
  education:  '#a78bfa',
  location:   '#f59e0b',
  skill:      '#34d399',
  project:    '#f472b6',
  experience: '#38bdf8',
}

function getColor(data, node) {
  if (data?.type === 'skill') return LAYER_COLORS[node.layer] ?? '#34d399'
  return TYPE_COLOR[data?.type] ?? getNodeColor(node)
}

function useTypewriter(text, active, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    if (!text || !active) return
    let i = 0
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, 400)
    return () => clearTimeout(delay)
  }, [text, active, speed])
  return displayed
}

// Shared card UI used by both mobile and desktop
function CardContent({ data, node, color, onClose }) {
  const bioTyped = useTypewriter(data?.bio ?? '', true)

  return (
    <div
      onClick={e => e.stopPropagation()}
      onTouchStart={e => e.stopPropagation()}
      onTouchMove={e => e.stopPropagation()}
      style={{
        width: MOBILE ? 'min(340px, 90vw)' : 360,
        background: 'rgba(2,5,16,0.96)',
        borderRadius: 14,
        padding: MOBILE ? '1rem' : '1.5rem',
        boxShadow: `0 0 60px ${color}22, 0 24px 80px rgba(0,0,0,0.7)`,
        border: `1px solid ${color}33`,
        position: 'relative',
        fontFamily: 'system-ui, sans-serif',
        pointerEvents: 'auto',
        maxHeight: MOBILE ? '70vh' : 'none',
        overflowY: MOBILE ? 'auto' : 'visible',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* HUD corners */}
      {[
        { top: 8, left: 8 },
        { top: 8, right: 8 },
        { bottom: 8, left: 8 },
        { bottom: 8, right: 8 },
      ].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', width: 14, height: 14, ...pos }}>
          <div style={{
            position: 'absolute',
            [pos.top !== undefined ? 'top' : 'bottom']: 0,
            [pos.left !== undefined ? 'left' : 'right']: 0,
            width: 2, height: 12, background: color,
          }} />
          <div style={{
            position: 'absolute',
            [pos.top !== undefined ? 'top' : 'bottom']: 0,
            [pos.left !== undefined ? 'left' : 'right']: 0,
            width: 12, height: 2, background: color,
          }} />
        </div>
      ))}

      {/* Close button — 44x44 touch target */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 6, right: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#334155', fontSize: 22, lineHeight: 1, zIndex: 3,
          width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'manipulation',
        }}
      >×</button>

      {/* Header tag */}
      <div style={{
        fontFamily: 'monospace', fontSize: 10,
        color, letterSpacing: '0.25em', marginBottom: 14,
        opacity: 0.7,
      }}>
        ◈ {data?.header}
      </div>

      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}44, ${color}11)`,
          border: `2px solid ${color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color,
          flexShrink: 0,
          boxShadow: `0 0 16px ${color}33`,
        }}>
          {data?.avatar}
        </div>
        <div>
          <div style={{
            fontFamily: 'monospace', fontSize: 10, color: color + 'aa',
            letterSpacing: '0.15em', marginBottom: 2,
          }}>
            NODE.{data?.type?.toUpperCase()}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
            {data?.fields?.[0]?.value}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: `linear-gradient(to right, ${color}44, transparent)`,
        marginBottom: 12,
      }} />

      {/* Fields */}
      <div style={{ marginBottom: 12 }}>
        {data?.fields?.slice(1).map(({ label, value, highlight }, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8,
            fontFamily: 'monospace', fontSize: 11,
            marginBottom: 6,
          }}>
            <span style={{ color: color + '88', minWidth: 60, letterSpacing: '0.1em', flexShrink: 0 }}>
              {label}
            </span>
            <span style={{
              color: highlight ? color : '#94a3b8',
              fontWeight: highlight ? 600 : 400,
              textShadow: highlight ? `0 0 8px ${color}66` : 'none',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Bio — typewriter */}
      <div style={{
        fontSize: '0.78rem',
        color: '#475569', lineHeight: 1.7,
        borderLeft: `2px solid ${color}44`,
        paddingLeft: 10, marginBottom: 12,
        minHeight: 40,
      }}>
        {bioTyped}
        <span style={{ animation: 'blink 0.7s step-end infinite', color }}>_</span>
      </div>

      {/* Links */}
      {data?.links?.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {data.links.map(link => (
            <a
              key={link.label}
              href={link.url} target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: 'monospace', fontSize: 10,
                color: color + 'cc',
                background: color + '11',
                border: `1px solid ${color}33`,
                borderRadius: 6, padding: '8px 14px',
                textDecoration: 'none', letterSpacing: '0.1em',
                touchAction: 'manipulation',
              }}
            >
              {link.icon} ↗
            </a>
          ))}
        </div>
      )}

      {/* Bottom signal indicator */}
      <div style={{
        marginTop: 12, paddingTop: 10,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'monospace', fontSize: 9,
        color: '#1e3a5f',
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: color, boxShadow: `0 0 6px ${color}`,
          animation: 'blink 1.2s ease-in-out infinite',
        }} />
        SIGNAL ACTIVE — {data?.fields?.[0]?.value?.toUpperCase()}
      </div>

      <style>{`
        @keyframes blink {
          0%,100% { opacity:1 } 50% { opacity:0.2 }
        }
      `}</style>
    </div>
  )
}

// ── Desktop: 3D-anchored card via drei Html ──────────────────────────────────
function DesktopCard() {
  const focusedNode = useStore(s => s.focusedNode)
  const setFocused  = useStore(s => s.setFocusedNode)
  const groupRef    = useRef()

  const node = focusedNode ? nodeMap[focusedNode] : null
  const data = node ? NODE_CARDS[node.id] : null

  useFrame(() => {
    if (!groupRef.current || !node) return
    const p = useStore.getState().scrollProgress
    const asm = smoothstep(ASSEMBLE_START, ASSEMBLE_END, p)

    const scatter = node.scatterPosition
    const target  = node.position
    const x = scatter.x + (target.x - scatter.x) * asm
    const y = scatter.y + (target.y - scatter.y) * asm
    const z = scatter.z + (target.z - scatter.z) * asm

    groupRef.current.position.set(x, y, z)
  })

  if (!node || !data) return null

  const color = getColor(data, node)

  return (
    <group ref={groupRef}>
      <Html
        position={[2, 0, 0]}
        center
        distanceFactor={10}
        zIndexRange={[50, 0]}
        occlude={false}
        style={{
          transition: 'opacity 0.3s ease',
          opacity: 1,
          pointerEvents: 'auto',
        }}
      >
        <CardContent
          data={data}
          node={node}
          color={color}
          onClose={() => setFocused(null)}
        />
      </Html>
    </group>
  )
}

// ── Mobile: Fixed overlay card (reliable on touch devices) ───────────────────
function MobileCard() {
  const focusedNode = useStore(s => s.focusedNode)
  const setFocused  = useStore(s => s.setFocusedNode)
  const [show, setShow]   = useState(false)
  const [phase, setPhase] = useState('hidden')

  const node = focusedNode ? nodeMap[focusedNode] : null
  const data = node ? NODE_CARDS[node.id] : null

  useEffect(() => {
    if (data) {
      setShow(true)
      requestAnimationFrame(() => setPhase('visible'))
    } else {
      setPhase('hidden')
      const t = setTimeout(() => setShow(false), 350)
      return () => clearTimeout(t)
    }
  }, [data])

  if (!show) return null

  const color = data ? getColor(data, node) : '#60a5fa'

  return null // rendered from App level, not inside Canvas
}

// This is the R3F component — only renders the desktop version
// Mobile card is rendered as HTML overlay from MobileCardOverlay
export default function NodeDetailCard() {
  if (MOBILE) return null
  return <DesktopCard />
}

// Exported for use in App.jsx — renders mobile card as fixed HTML overlay
export function MobileCardOverlay() {
  const focusedNode = useStore(s => s.focusedNode)
  const setFocused  = useStore(s => s.setFocusedNode)
  const [show, setShow]   = useState(false)
  const [phase, setPhase] = useState('hidden')

  const node = focusedNode ? nodeMap[focusedNode] : null
  const data = node ? NODE_CARDS[node.id] : null

  useEffect(() => {
    if (data) {
      setShow(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('visible'))
      })
    } else {
      setPhase('hidden')
      const t = setTimeout(() => setShow(false), 350)
      return () => clearTimeout(t)
    }
  }, [data])

  if (!show || !MOBILE) return null

  const color = data ? getColor(data, node) : '#60a5fa'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setFocused(null)}
        style={{
          position: 'fixed', inset: 0, zIndex: 55,
          background: 'rgba(2,5,16,0.6)',
          backdropFilter: 'blur(4px)',
          opacity: phase === 'visible' ? 1 : 0,
          transition: 'opacity 0.3s ease',
          touchAction: 'manipulation',
        }}
      />

      {/* Card — fixed at bottom of screen, slides up */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 56,
        display: 'flex', justifyContent: 'center',
        padding: '0 12px 24px',
        transform: phase === 'visible' ? 'translateY(0)' : 'translateY(100%)',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
        pointerEvents: phase === 'visible' ? 'auto' : 'none',
      }}>
        {data && (
          <CardContent
            data={data}
            node={node}
            color={color}
            onClose={() => setFocused(null)}
          />
        )}
      </div>
    </>
  )
}
