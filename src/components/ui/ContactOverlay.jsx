import useStore from '../../store/useStore'
import { contact } from '../../data/contact'
import NNCanvasBackground from './NNCanvasBackground'
import FloatingCode from './FloatingCode'

const ICONS = {
  github:   'GH',
  linkedin: 'LI',
  twitter:  'TW',
  dribbble: 'DR',
}

// ── HUD corner brackets (reused from InputNodeCard aesthetic) ─────────────────
function HudCorners({ color = '#60a5fa' }) {
  const s    = { position: 'absolute', width: 20, height: 20 }
  const line = { position: 'absolute', background: color }
  return (
    <>
      <div style={{ ...s, top: 24, left: 24 }}>
        <div style={{ ...line, top: 0, left: 0, width: 2, height: 18 }} />
        <div style={{ ...line, top: 0, left: 0, width: 18, height: 2 }} />
      </div>
      <div style={{ ...s, top: 24, right: 24 }}>
        <div style={{ ...line, top: 0, right: 0, width: 2, height: 18 }} />
        <div style={{ ...line, top: 0, right: 0, width: 18, height: 2 }} />
      </div>
      <div style={{ ...s, bottom: 24, left: 24 }}>
        <div style={{ ...line, bottom: 0, left: 0, width: 2, height: 18 }} />
        <div style={{ ...line, bottom: 0, left: 0, width: 18, height: 2 }} />
      </div>
      <div style={{ ...s, bottom: 24, right: 24 }}>
        <div style={{ ...line, bottom: 0, right: 0, width: 2, height: 18 }} />
        <div style={{ ...line, bottom: 0, right: 0, width: 18, height: 2 }} />
      </div>
    </>
  )
}

// ── Floating grid lines (NN graph paper aesthetic) ────────────────────────────
function GridLines() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Horizontal lines */}
      {[15, 30, 45, 60, 75, 90].map(pct => (
        <div key={`h${pct}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: `${pct}%`, height: 1,
          background: 'rgba(96,165,250,0.04)',
        }} />
      ))}
      {/* Vertical lines */}
      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(pct => (
        <div key={`v${pct}`} style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${pct}%`, width: 1,
          background: 'rgba(96,165,250,0.04)',
        }} />
      ))}
    </div>
  )
}

// ── Floating signal dots ──────────────────────────────────────────────────────
function SignalDots() {
  const dots = [
    { x: '12%', y: '18%', delay: 0,    dur: 3.2 },
    { x: '78%', y: '25%', delay: 0.6,  dur: 4.1 },
    { x: '88%', y: '65%', delay: 1.1,  dur: 2.8 },
    { x: '22%', y: '72%', delay: 0.3,  dur: 3.7 },
    { x: '55%', y: '14%', delay: 1.5,  dur: 4.5 },
    { x: '40%', y: '82%', delay: 0.8,  dur: 3.0 },
    { x: '68%', y: '45%', delay: 0.2,  dur: 2.5 },
    { x: '15%', y: '50%', delay: 1.8,  dur: 3.9 },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: d.x, top: d.y,
          width: 4, height: 4,
          borderRadius: '50%',
          background: '#60a5fa',
          boxShadow: '0 0 8px #60a5fa, 0 0 20px #60a5fa44',
          animation: `float-dot ${d.dur}s ease-in-out ${d.delay}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes float-dot {
          0%,100% { transform: translateY(0px);   opacity: 0.6; }
          50%      { transform: translateY(-12px); opacity: 1;   }
        }
      `}</style>
    </div>
  )
}

// ── Status row ────────────────────────────────────────────────────────────────
function StatusRow({ color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'monospace', fontSize: 10,
      color: '#1e3a5f', letterSpacing: '0.2em',
      marginBottom: window.innerWidth < 768 ? 18 : 32,
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
        animation: 'status-blink 1.4s ease-in-out infinite',
      }} />
      OUTPUT.LAYER — SIGNAL PROPAGATION COMPLETE
      <style>{`
        @keyframes status-blink {
          0%,100% { opacity:1 } 50% { opacity:0.3 }
        }
      `}</style>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ContactOverlay() {
  const progress  = useStore(s => s.scrollProgress)
  const scrollEl  = useStore(s => s.scrollEl)

  // Circle burst from center — matches nodes converging then exploding outward
  // Starts at 0.83 so it overlaps slightly with the last nodes rushing in
  const slideT    = Math.max(0, Math.min(1, (progress - 0.83) / 0.17))
  const st        = slideT * slideT * (3 - 2 * slideT) // smoothstep
  const clipRadius = st * 160   // 0% → 160% covers full screen including corners
  const opacity   = Math.min(1, slideT * 1.4)

  const color = '#60a5fa'

  // Forward wheel events to the underlying ScrollControls so user can scroll back up
  const handleWheel = (e) => {
    if (scrollEl) scrollEl.scrollTop += e.deltaY
  }

  return (
    <div
      onWheel={handleWheel}
      style={{
      position: 'fixed',
      inset: 0,
      zIndex: 40,
      clipPath: `circle(${clipRadius}% at 50% 50%)`,
      opacity,
      transition: 'none',   // driven purely by scroll, no CSS transition
      pointerEvents: slideT > 0.05 ? 'all' : 'none',
      background: 'rgba(2,5,16,0.92)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* NN canvas background — simple single-color blue */}
      <NNCanvasBackground simple />

      {/* Floating AI/ML code terminals */}
      <FloatingCode />

      <HudCorners color={color} />

      {/* Top edge glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(to right, transparent, ${color}66, ${color}, ${color}66, transparent)`,
        boxShadow: `0 0 24px ${color}88`,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 560, padding: window.innerWidth < 768 ? '0 16px' : '0 24px', width: '100%' }}>

        <StatusRow color={color} />

        {/* Header label */}
        <div style={{
          fontFamily: 'monospace', fontSize: 11,
          color: color, letterSpacing: '0.28em',
          marginBottom: 20, opacity: 0.9,
          textTransform: 'uppercase',
        }}>
          ◈ SIGNAL COMPLETE — REACH OUT
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
          fontWeight: 900, color: '#fff',
          whiteSpace: 'pre-line',
          marginBottom: 16,
          lineHeight: 1.15,
          textShadow: `0 0 60px ${color}55, 0 2px 4px rgba(0,0,0,0.8)`,
          letterSpacing: '-0.01em',
        }}>
          {contact.headline}
        </h2>

        {/* Divider */}
        <div style={{
          height: 1, margin: '0 auto 20px',
          width: 140,
          background: `linear-gradient(to right, transparent, ${color}88, transparent)`,
        }} />

        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 300,
          fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
          color: '#94a3b8',
          marginBottom: window.innerWidth < 768 ? 24 : 36,
          lineHeight: 1.8,
        }}>
          {contact.subtext}
        </p>

        {/* Email CTA */}
        <a
          href={`mailto:${contact.email}`}
          style={{
            display: 'inline-block',
            fontFamily: 'monospace', fontSize: window.innerWidth < 768 ? 11 : 14,
            color,
            textDecoration: 'none',
            border: `1px solid ${color}44`,
            borderRadius: 8, padding: window.innerWidth < 768 ? '10px 16px' : '12px 32px',
            marginBottom: window.innerWidth < 768 ? 20 : 32,
            wordBreak: 'break-all',
            background: `${color}0d`,
            letterSpacing: '0.05em',
            transition: 'all 0.2s',
            boxShadow: `0 0 0px ${color}00`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background  = `${color}1a`
            e.currentTarget.style.borderColor = `${color}88`
            e.currentTarget.style.boxShadow   = `0 0 24px ${color}33`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background  = `${color}0d`
            e.currentTarget.style.borderColor = `${color}44`
            e.currentTarget.style.boxShadow   = `0 0 0px ${color}00`
          }}
        >
          {contact.email}
        </a>

        {/* Social links */}
        <div style={{ display: 'flex', gap: window.innerWidth < 768 ? 8 : 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {contact.social.map(s => (
            <a
              key={s.label}
              href={s.url} target="_blank" rel="noopener noreferrer"
              title={s.label}
              style={{
                fontFamily: 'monospace', fontSize: 12,
                color: '#94a3b8',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, padding: '7px 16px',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color       = color
                e.currentTarget.style.borderColor = `${color}44`
                e.currentTarget.style.background  = `${color}0d`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color       = '#94a3b8'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.background  = 'rgba(255,255,255,0.05)'
              }}
            >
              {ICONS[s.icon] ?? s.label}
            </a>
          ))}
        </div>

        {/* Bottom node indicator */}
        <div style={{
          marginTop: 40,
          fontFamily: 'monospace', fontSize: 9,
          color: '#334155', letterSpacing: '0.25em',
        }}>
          NODE.CONTACT — LAYER 4 / OUTPUT
        </div>

      </div>
    </div>
  )
}
