import useStore from '../../store/useStore'
import { projects } from '../../data/projects'

const COLOR = '#f472b6' // pink — output/projects layer

function HudCorners() {
  const s    = { position: 'absolute', width: 20, height: 20 }
  const line = { position: 'absolute', background: COLOR }
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

function ProjectTile({ project, index, isMobile }) {
  const hasGithub = project.github && project.github !== '#'
  const hasLive   = project.live && project.live !== '#'

  return (
    <div style={{
      background: `${COLOR}06`,
      border: `1px solid ${COLOR}18`,
      borderRadius: 12,
      padding: isMobile ? 16 : 20,
      display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'all 0.25s ease',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${COLOR}10`
        e.currentTarget.style.borderColor = `${COLOR}40`
        e.currentTarget.style.boxShadow = `0 0 30px ${COLOR}15, inset 0 0 30px ${COLOR}05`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${COLOR}06`
        e.currentTarget.style.borderColor = `${COLOR}18`
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Index badge */}
      <div style={{
        position: 'absolute', top: 12, right: 14,
        fontFamily: 'monospace', fontSize: 9,
        color: `${COLOR}44`, letterSpacing: '0.1em',
      }}>
        #{String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + year */}
      <div>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          fontWeight: 800, color: '#fff',
          marginBottom: 4,
        }}>
          {project.title}
        </div>
        <div style={{
          fontFamily: 'monospace', fontSize: 10,
          color: COLOR, letterSpacing: '0.15em', opacity: 0.8,
        }}>
          {project.year}
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 'clamp(0.78rem, 1.5vw, 0.87rem)',
        color: '#94a3b8', lineHeight: 1.65,
        margin: 0,
      }}>
        {project.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {project.tags.map(tag => (
          <span key={tag} style={{
            fontFamily: 'monospace', fontSize: 10,
            color: COLOR, opacity: 0.85,
            background: `${COLOR}10`,
            border: `1px solid ${COLOR}22`,
            borderRadius: 4, padding: '2px 8px',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      {(hasGithub || hasLive) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          {hasGithub && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'monospace', fontSize: 10,
              color: '#94a3b8', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, padding: '4px 10px',
              transition: 'all 0.2s',
              letterSpacing: '0.1em',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = COLOR
                e.currentTarget.style.borderColor = `${COLOR}44`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              ↗ GITHUB
            </a>
          )}
          {hasLive && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'monospace', fontSize: 10,
              color: '#94a3b8', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, padding: '4px 10px',
              transition: 'all 0.2s',
              letterSpacing: '0.1em',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = COLOR
                e.currentTarget.style.borderColor = `${COLOR}44`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              ◈ LIVE
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function ProjectsOverlay() {
  const progress = useStore(s => s.scrollProgress)
  const scrollEl = useStore(s => s.scrollEl)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Enter 0.77→0.83, exit 0.85→0.90
  const inT  = Math.max(0, Math.min(1, (progress - 0.77) / 0.06))
  const outT = Math.max(0, Math.min(1, (progress - 0.85) / 0.05))
  const t    = inT * (1 - outT)

  const st      = t * t * (3 - 2 * t)
  const opacity = Math.min(1, st * 1.4)
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
        top: 0,
        right: 0,
        bottom: 0,
        width: isMobile ? '100%' : '56%',
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
        justifyContent: isMobile ? 'flex-start' : 'center',
        overflow: 'hidden',
        borderLeft: isMobile ? 'none' : `1px solid ${COLOR}22`,
      }}
    >
      {/* Left edge gradient blend (desktop) */}
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 56,
            background: 'linear-gradient(to right, rgba(2,5,16,0), rgba(2,5,16,0.88))',
            zIndex: 0, pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 1,
            background: `linear-gradient(to bottom, transparent, ${COLOR}66, ${COLOR}, ${COLOR}66, transparent)`,
            boxShadow: `0 0 20px ${COLOR}44`,
            zIndex: 1,
          }} />
        </>
      )}

      {/* Top edge glow (mobile) */}
      {isMobile && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(to right, transparent, ${COLOR}66, ${COLOR}, ${COLOR}66, transparent)`,
          boxShadow: `0 0 24px ${COLOR}88`,
        }} />
      )}

      <HudCorners />

      {/* Content */}
      <div
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
        style={{
          position: 'relative', zIndex: 2,
          width: '100%',
          padding: isMobile ? '72px 16px 32px' : '0 40px 0 52px',
          maxHeight: isMobile ? '100vh' : '90vh',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          touchAction: 'pan-y',
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
              background: COLOR, boxShadow: `0 0 8px ${COLOR}`,
              animation: 'proj-blink 1.4s ease-in-out infinite',
            }} />
            OUTPUT.LAYER — SIGNAL RESULTS
            <style>{`
              @keyframes proj-blink {
                0%,100% { opacity:1 } 50% { opacity:0.3 }
              }
            `}</style>
          </div>

          <div style={{
            fontFamily: 'monospace', fontSize: 11,
            color: COLOR, letterSpacing: '0.28em',
            marginBottom: 14, opacity: 0.9,
            textTransform: 'uppercase',
          }}>
            ◈ PROJECTS — OUTPUT NODES
          </div>

          <h2 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 900, color: '#fff',
            margin: '0 0 12px',
            lineHeight: 1.2,
            textShadow: `0 0 60px ${COLOR}44, 0 2px 4px rgba(0,0,0,0.8)`,
          }}>
            Built & Shipped
          </h2>

          <div style={{
            height: 1, margin: '0 auto',
            width: 120,
            background: `linear-gradient(to right, transparent, ${COLOR}88, transparent)`,
          }} />
        </div>

        {/* Projects grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 16 : 20,
        }}>
          {projects.map((proj, i) => (
            <ProjectTile key={proj.id} project={proj} index={i} isMobile={isMobile} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 28,
          textAlign: 'center',
          fontFamily: 'monospace', fontSize: 9,
          color: '#334155', letterSpacing: '0.25em',
        }}>
          NODE.PROJECTS — LAYER 4 / OUTPUT
        </div>
      </div>
    </div>
  )
}
