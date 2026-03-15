import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'
import { hero } from '../../data/hero'
import NNCanvasBackground from './NNCanvasBackground'
import FloatingCode from './FloatingCode'

const COLOR = '#60a5fa'

export default function HeroOverlay() {
  const progress = useStore(s => s.scrollProgress)
  const [typed,   setTyped]   = useState('')
  const [showSub, setShowSub] = useState(false)
  const [entered, setEntered] = useState(false)
  const full = hero.name

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) { clearInterval(id); setTimeout(() => setShowSub(true), 300) }
    }, 68)
    return () => clearInterval(id)
  }, [full])

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 150)
    return () => clearTimeout(t)
  }, [])

  const opacity        = Math.max(0, 1 - progress * 10)
  const scrollClip     = Math.max(0, 160 * (1 - progress * 10))
  const clipRadius     = entered ? scrollClip : 0
  const clipTransition = entered && progress < 0.01
    ? 'clip-path 0.85s cubic-bezier(0.34,1.56,0.64,1)' : 'none'

  if (opacity <= 0) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 20,
      pointerEvents: 'none',
      clipPath: `circle(${clipRadius}% at 50% 50%)`,
      transition: clipTransition,
      opacity,
    }}>
      {/* Dark bg */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,5,16,0.92)', zIndex: 0 }} />

      {/* NN canvas */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <NNCanvasBackground />
      </div>

      {/* Floating AI/ML code terminals */}
      <FloatingCode />

      {/* ── Content — Option C: Layered Minimal ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0' }}>

          {/* Name — huge gradient */}
          <h1 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 900,
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            background: `linear-gradient(135deg, #ffffff 0%, #ffffff 45%, ${COLOR} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(96,165,250,0.25))',
          }}>
            {typed}
            {typed.length < full.length && (
              <span style={{
                WebkitTextFillColor: COLOR,
                animation: 'hblink 0.7s step-end infinite',
              }}>|</span>
            )}
          </h1>

          {/* Divider with ◈ node */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            width: 'clamp(280px, 50vw, 520px)',
            marginTop: 20, marginBottom: 20,
            opacity: showSub ? 1 : 0,
            transition: 'opacity 0.6s 0.1s',
          }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${COLOR}55)` }} />
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              border: `1.5px solid ${COLOR}88`,
              background: `${COLOR}22`,
              margin: '0 14px',
              boxShadow: `0 0 12px ${COLOR}66`,
              animation: 'hpulse 2s ease-in-out infinite',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${COLOR}55)` }} />
          </div>

          {/* R1 — Boxed role tag */}
          <div style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(0.7rem, 1.4vw, 0.92rem)',
            fontWeight: 300,
            color: '#ffffff',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            border: `1px solid ${COLOR}88`,
            padding: '6px 20px',
            borderRadius: 4,
            background: `${COLOR}18`,
            opacity: showSub ? 1 : 0,
            transform: showSub ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.5s 0.2s, transform 0.5s 0.2s',
          }}>
            {hero.title}
          </div>

          {/* T1 — Tagline with highlighted keywords */}
          <div style={{
            marginTop: 24,
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.85rem, 1.4vw, 1rem)',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.85,
            maxWidth: 'min(420px, 88vw)',
            padding: '0 8px',
            opacity: showSub ? 1 : 0,
            transform: showSub ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s 0.32s, transform 0.5s 0.32s',
          }}>
            <span style={{ color: `${COLOR}99`, marginRight: 6 }}>//</span>
            {'I build scalable, '}
            <span style={{ color: COLOR, opacity: 0.9 }}>AI-driven</span>
            {' applications\nthat live at the intersection of '}
            <span style={{ color: COLOR, opacity: 0.9 }}>code</span>
            {' & '}
            <span style={{ color: COLOR, opacity: 0.9 }}>creativity</span>
            {'.'}
          </div>

          {/* S2 — Stacked chevrons, fade in sequence */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            marginTop: 44,
            opacity: showSub ? 1 : 0,
            transition: 'opacity 0.5s 0.55s',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 10, height: 10,
                borderRight: `1.5px solid ${COLOR}`,
                borderBottom: `1.5px solid ${COLOR}`,
                transform: 'rotate(45deg)',
                animation: `chevron 1.4s ease-in-out ${i * 0.18}s infinite`,
              }} />
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes hblink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hpulse   { 0%,100%{box-shadow:0 0 12px ${COLOR}66} 50%{box-shadow:0 0 22px ${COLOR}cc} }
        @keyframes chevron  {
          0%   { opacity:0.15; transform:rotate(45deg) translate(-3px,-3px); }
          50%  { opacity:1;    transform:rotate(45deg) translate(3px,3px);   }
          100% { opacity:0.15; transform:rotate(45deg) translate(-3px,-3px); }
        }
      `}</style>
    </div>
  )
}
