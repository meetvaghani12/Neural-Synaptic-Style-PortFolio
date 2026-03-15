import { useState } from 'react'
import useStore from '../../store/useStore'
import { hero } from '../../data/hero'

const SECTIONS = [
  { label: 'About',    scroll: 0.00 },
  { label: 'Skills',   scroll: 0.35 },
  { label: 'Projects', scroll: 0.75 },
  { label: 'Contact',  scroll: 1.00 },
]

const isMobile = () => window.innerWidth < 768

export default function NavBar() {
  const progress = useStore(s => s.scrollProgress)
  const scrollEl = useStore(s => s.scrollEl)
  const [menuOpen, setMenuOpen] = useState(false)
  const mobile = isMobile()

  const scrollTo = (target) => {
    if (!scrollEl) return
    scrollEl.scrollTop = target * (scrollEl.scrollHeight - scrollEl.clientHeight)
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 40,
        padding: mobile ? '0.9rem 1.2rem' : '1.2rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(2,5,16,0.9) 0%, transparent 100%)',
        backdropFilter: 'blur(4px)',
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'monospace', fontSize: 15, fontWeight: 700,
          color: '#60a5fa', letterSpacing: '0.1em',
          textShadow: '0 0 12px rgba(96,165,250,0.5)',
        }}>
          {hero.name.split(' ')[0].toUpperCase()}
          <span style={{ color: '#1e3a5f', margin: '0 4px' }}>/</span>
          <span style={{ color: '#334155', fontWeight: 400 }}>DEV</span>
        </div>

        {/* Desktop: Nav links */}
        {!mobile && (
          <div style={{ display: 'flex', gap: '2rem' }}>
            {SECTIONS.map(sec => {
              const active = Math.abs(progress - sec.scroll) < 0.14
              return (
                <button
                  key={sec.label}
                  onClick={() => scrollTo(sec.scroll)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'monospace', fontSize: 12,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: active ? '#60a5fa' : '#475569',
                    textShadow: active ? '0 0 12px #60a5fa' : 'none',
                    transition: 'color 0.25s, text-shadow 0.25s',
                    padding: '4px 0',
                  }}
                >
                  {sec.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Available badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: 11, color: '#34d399', opacity: 0.8,
          }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: '#34d399', boxShadow: '0 0 8px #34d399',
              animation: 'npulse 2s ease-in-out infinite',
            }} />
            {!mobile && 'Available'}
          </div>

          {/* Mobile: Hamburger button */}
          {mobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 5,
                padding: '4px 2px',
              }}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 22, height: 2, borderRadius: 1,
                  background: menuOpen ? '#60a5fa' : '#475569',
                  transition: 'background 0.2s',
                }} />
              ))}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 39,
          paddingTop: 60,
          paddingBottom: 16,
          background: 'rgba(2,5,16,0.97)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(96,165,250,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
        }}>
          {SECTIONS.map(sec => {
            const active = Math.abs(progress - sec.scroll) < 0.14
            return (
              <button
                key={sec.label}
                onClick={() => scrollTo(sec.scroll)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'monospace', fontSize: 13,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: active ? '#60a5fa' : '#475569',
                  textShadow: active ? '0 0 12px #60a5fa' : 'none',
                  padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {sec.label}
              </button>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes npulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>
    </>
  )
}
