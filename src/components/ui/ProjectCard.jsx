import useStore from '../../store/useStore'
import { projects } from '../../data/projects'

const isMobile = () => window.innerWidth < 768

export default function ProjectCard() {
  const activeNode  = useStore(s => s.activeNode)
  const setActive   = useStore(s => s.setActiveNode)

  const project = activeNode ? projects.find(p => p.id === activeNode) : null
  const visible  = !!project
  const mobile   = isMobile()

  const positionStyle = mobile
    ? {
        position: 'fixed',
        top: '50%', left: '50%',
        transform: visible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.88)',
      }
    : {
        position: 'fixed',
        top: '50%', right: '4vw',
        transform: visible ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.88)',
      }

  return (
    <div
      style={{
        ...positionStyle,
        zIndex: 50,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 0.3s, transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275)',
      }}
    >
      {project && (
        <div style={{
          width: mobile ? 'min(320px, 94vw)' : 320,
          background: 'rgba(2, 5, 16, 0.85)',
          border: '1px solid rgba(244, 114, 182, 0.25)',
          borderRadius: 16,
          padding: '1.5rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(244,114,182,0.12), 0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Close button */}
          <button
            onClick={() => setActive(null)}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#475569', fontSize: 18, lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#f472b6'}
            onMouseLeave={e => e.target.style.color = '#475569'}
          >
            ×
          </button>

          {/* Header */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{
              fontFamily: 'monospace', fontSize: 10,
              color: '#f472b6', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: 6, opacity: 0.7,
            }}>
              {project.year} · Project
            </div>
            <h3 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '1.2rem', fontWeight: 700,
              color: '#fff', margin: 0,
            }}>
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.83rem', color: '#64748b',
            lineHeight: 1.65, margin: '0 0 1rem',
          }}>
            {project.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.2rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'monospace', fontSize: 11,
                color: '#f472b6', opacity: 0.8,
                background: 'rgba(244,114,182,0.08)',
                border: '1px solid rgba(244,114,182,0.2)',
                borderRadius: 4, padding: '2px 8px',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {project.github && project.github !== '#' && (
              <a
                href={project.github} target="_blank" rel="noopener noreferrer"
                style={linkStyle}
              >
                GitHub ↗
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live} target="_blank" rel="noopener noreferrer"
                style={{ ...linkStyle, background: 'rgba(244,114,182,0.15)', borderColor: 'rgba(244,114,182,0.35)', color: '#f472b6' }}
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const linkStyle = {
  fontFamily: 'monospace', fontSize: 12,
  color: '#94a3b8',
  background: 'rgba(148,163,184,0.08)',
  border: '1px solid rgba(148,163,184,0.2)',
  borderRadius: 6, padding: '6px 14px',
  textDecoration: 'none',
  transition: 'all 0.2s',
}
