import useStore from '../../store/useStore'
import { skills } from '../../data/skills'

const CATEGORIES = [
  { key: 'frontend', label: 'FRONTEND', color: '#34d399', icon: '◆' },
  { key: 'backend',  label: 'BACKEND',  color: '#f59e0b', icon: '◆' },
  { key: 'ai',       label: 'AI / ML',  color: '#a78bfa', icon: '◆' },
]

function HudCorners({ color = '#34d399' }) {
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

function LevelBar({ level, max = 5, color }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: max }, (_, i) => (
        <div key={i} style={{
          width: 24, height: 4, borderRadius: 2,
          background: i < level ? color : `${color}20`,
          boxShadow: i < level ? `0 0 8px ${color}44` : 'none',
          transition: 'all 0.3s ease',
        }} />
      ))}
      <span style={{
        fontFamily: 'monospace', fontSize: 9,
        color: `${color}88`, marginLeft: 6,
      }}>
        {level}/{max}
      </span>
    </div>
  )
}

function SkillCard({ skill, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      background: `${color}08`,
      border: `1px solid ${color}18`,
      borderRadius: 8,
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}14`
        e.currentTarget.style.borderColor = `${color}40`
        e.currentTarget.style.boxShadow = `0 0 20px ${color}15`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${color}08`
        e.currentTarget.style.borderColor = `${color}18`
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <span style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 'clamp(0.8rem, 1.6vw, 0.92rem)',
        fontWeight: 600, color: '#e2e8f0',
      }}>
        {skill.name}
      </span>
      <LevelBar level={skill.level} color={color} />
    </div>
  )
}

function CategorySection({ category }) {
  const items = skills[category.key] || []
  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 14,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: category.color,
          boxShadow: `0 0 10px ${category.color}88`,
        }} />
        <span style={{
          fontFamily: 'monospace', fontSize: 11,
          color: category.color, letterSpacing: '0.2em',
          fontWeight: 700,
        }}>
          {category.label}
        </span>
        <div style={{
          flex: 1, height: 1,
          background: `linear-gradient(to right, ${category.color}33, transparent)`,
        }} />
      </div>

      {/* Skills list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(skill => (
          <SkillCard key={skill.id} skill={skill} color={category.color} />
        ))}
      </div>
    </div>
  )
}

export default function SkillsOverlay() {
  const progress = useStore(s => s.scrollProgress)
  const scrollEl = useStore(s => s.scrollEl)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Enter 0.24→0.32, exit 0.40→0.46
  const inT  = Math.max(0, Math.min(1, (progress - 0.24) / 0.08))
  const outT = Math.max(0, Math.min(1, (progress - 0.40) / 0.06))
  const t    = inT * (1 - outT)

  const st      = t * t * (3 - 2 * t)
  const opacity = Math.min(1, st * 1.4)
  // Desktop: slide in from right. Mobile: slide up from bottom.
  const translateX = isMobile ? 0        : (1 - st) * 60
  const translateY = isMobile ? (1 - st) * 40 : 0

  const isVisible = st > 0.02

  const handleWheel = (e) => {
    if (scrollEl) scrollEl.scrollTop += e.deltaY
  }

  if (!isVisible) return null

  return (
    <div
      onWheel={handleWheel}
      style={{
        position: 'fixed',
        // Desktop: right-side panel — network stays visible on the left.
        // Mobile: full-screen overlay.
        top: 0,
        right: 0,
        bottom: 0,
        width: isMobile ? '100%' : '54%',
        zIndex: 35,
        opacity,
        transform: isMobile
          ? `translateY(${translateY}px)`
          : `translateX(${translateX}px)`,
        transition: 'none',
        pointerEvents: 'all',
        background: isMobile ? 'rgba(2,5,16,0.93)' : 'rgba(2,5,16,0.88)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        flexDirection: 'column',
        // On mobile: start from top so nav padding works. Desktop: centered.
        justifyContent: isMobile ? 'flex-start' : 'center',
        overflow: 'hidden',
        // Left edge border glow on desktop
        borderLeft: isMobile ? 'none' : '1px solid rgba(52,211,153,0.18)',
      }}
    >
      {/* Left edge gradient blend — fades panel into the 3D scene (desktop only) */}
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 56,
            background: 'linear-gradient(to right, rgba(2,5,16,0), rgba(2,5,16,0.88))',
            zIndex: 0, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(to bottom, transparent, #34d39966, #34d399, #34d39966, transparent)',
            boxShadow: '0 0 20px #34d39944',
            zIndex: 1,
          }} />
        </>
      )}

      {/* Top edge glow (mobile) */}
      {isMobile && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(to right, transparent, #34d39966, #34d399, #34d39966, transparent)',
          boxShadow: '0 0 24px #34d39988',
        }} />
      )}

      <HudCorners color="#34d399" />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%',
        // Mobile: top padding clears the fixed navbar (~56px) + breathing room.
        // Desktop: horizontal padding only; container centers vertically.
        padding: isMobile ? '72px 20px 32px' : '0 40px 0 52px',
        maxHeight: isMobile ? '100vh' : '90vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 36 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: 10,
            color: '#1e3a5f', letterSpacing: '0.2em',
            marginBottom: 16,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#34d399', boxShadow: '0 0 8px #34d399',
              animation: 'skills-blink 1.4s ease-in-out infinite',
            }} />
            HIDDEN.LAYERS — NEURAL WEIGHTS
            <style>{`
              @keyframes skills-blink {
                0%,100% { opacity:1 } 50% { opacity:0.3 }
              }
            `}</style>
          </div>

          <div style={{
            fontFamily: 'monospace', fontSize: 11,
            color: '#34d399', letterSpacing: '0.28em',
            marginBottom: 14, opacity: 0.9,
            textTransform: 'uppercase',
          }}>
            ◈ SKILLS — ACTIVATION MAP
          </div>

          <h2 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 900, color: '#fff',
            margin: '0 0 12px',
            lineHeight: 1.2,
            textShadow: '0 0 60px #34d39944, 0 2px 4px rgba(0,0,0,0.8)',
          }}>
            Technical Arsenal
          </h2>

          <div style={{
            height: 1, margin: '0 auto',
            width: 120,
            background: 'linear-gradient(to right, transparent, #34d39988, transparent)',
          }} />
        </div>

        {/* Categories grid */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 28 : 32,
        }}>
          {CATEGORIES.map(cat => (
            <CategorySection key={cat.key} category={cat} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 28,
          textAlign: 'center',
          fontFamily: 'monospace', fontSize: 9,
          color: '#334155', letterSpacing: '0.25em',
        }}>
          NODE.SKILLS — LAYERS 1-3 / HIDDEN
        </div>
      </div>
    </div>
  )
}
