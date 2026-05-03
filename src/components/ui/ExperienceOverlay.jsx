import useStore from '../../store/useStore'
import { experience } from '../../data/experience'
import { education } from '../../data/education'

const COLOR = '#f59e0b'   // amber — backend/experience layer

// HUD corners matching portfolio aesthetic
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

function TimelineEntry({ entry, index, total }) {
  const isLast = index === total - 1
  return (
    <div style={{ display: 'flex', gap: 0, position: 'relative' }}>

      {/* Left — year + vertical line */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: 56, flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'monospace', fontSize: 10,
          color: COLOR, letterSpacing: '0.15em',
          marginBottom: 6, opacity: 0.9,
        }}>
          {entry.year}
        </div>
        {/* Node dot */}
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: COLOR,
          boxShadow: `0 0 12px ${COLOR}cc, 0 0 24px ${COLOR}55`,
          flexShrink: 0,
          position: 'relative', zIndex: 1,
        }} />
        {/* Connector line */}
        {!isLast && (
          <div style={{
            flex: 1, width: 1,
            background: `linear-gradient(to bottom, ${COLOR}66, ${COLOR}11)`,
            marginTop: 4,
            minHeight: 24,
          }} />
        )}
      </div>

      {/* Right — card */}
      <div style={{ flex: 1, paddingLeft: 16, paddingBottom: isLast ? 0 : 28 }}>
        {/* Role + company */}
        <div style={{ marginBottom: 6 }}>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
            fontWeight: 700, color: '#fff',
          }}>
            {entry.role}
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: 11,
            color: COLOR, opacity: 0.85, marginLeft: 8,
          }}>
            @ {entry.company}
          </span>
        </div>

        {/* Location */}
        <div style={{
          fontFamily: 'monospace', fontSize: 10,
          color: '#475569', letterSpacing: '0.12em',
          marginBottom: 8,
        }}>
          ◈ {entry.location}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(0.78rem, 1.5vw, 0.88rem)',
          color: '#64748b', lineHeight: 1.65,
          margin: '0 0 10px',
        }}>
          {entry.description}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {entry.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'monospace', fontSize: 10,
              color: COLOR, opacity: 0.8,
              background: `${COLOR}10`,
              border: `1px solid ${COLOR}28`,
              borderRadius: 4, padding: '2px 8px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExperienceOverlay() {
  const progress = useStore(s => s.scrollProgress)
  const scrollEl = useStore(s => s.scrollEl)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Enter 0.54→0.62, exit 0.65→0.71
  const inT  = Math.max(0, Math.min(1, (progress - 0.54) / 0.08))
  const outT = Math.max(0, Math.min(1, (progress - 0.65) / 0.06))
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
        width: isMobile ? '100%' : '52%',
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
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%',
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
              background: COLOR, boxShadow: `0 0 8px ${COLOR}`,
              animation: 'exp-blink 1.4s ease-in-out infinite',
            }} />
            HIDDEN.LAYER — CAREER TRAJECTORY
            <style>{`
              @keyframes exp-blink {
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
            ◈ EXPERIENCE — SIGNAL PATH
          </div>

          <h2 style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 900, color: '#fff',
            margin: '0 0 12px',
            lineHeight: 1.2,
            textShadow: `0 0 60px ${COLOR}44, 0 2px 4px rgba(0,0,0,0.8)`,
          }}>
            Career Journey
          </h2>

          <div style={{
            height: 1, margin: '0 auto',
            width: 120,
            background: `linear-gradient(to right, transparent, ${COLOR}88, transparent)`,
          }} />
        </div>

        {/* Timeline */}
        <div>
          {experience.map((entry, i) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              index={i}
              total={experience.length}
            />
          ))}
        </div>

        {/* Education section */}
        <div style={{ marginTop: 36 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 20,
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#60a5fa',
              boxShadow: '0 0 8px #60a5fa',
            }} />
            <span style={{
              fontFamily: 'monospace', fontSize: 11,
              color: '#60a5fa', letterSpacing: '0.2em',
              fontWeight: 700,
            }}>
              EDUCATION
            </span>
            <div style={{
              flex: 1, height: 1,
              background: 'linear-gradient(to right, #60a5fa33, transparent)',
            }} />
          </div>

          {education.map((edu, i) => (
            <div key={edu.id} style={{
              display: 'flex', gap: 0, position: 'relative',
            }}>
              {/* Left — period + vertical line */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: 56, flexShrink: 0,
              }}>
                <div style={{
                  fontFamily: 'monospace', fontSize: 10,
                  color: '#60a5fa', letterSpacing: '0.15em',
                  marginBottom: 6, opacity: 0.9,
                  whiteSpace: 'nowrap',
                }}>
                  {edu.period.split('—')[0].trim()}
                </div>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#60a5fa',
                  boxShadow: '0 0 12px #60a5facc, 0 0 24px #60a5fa55',
                  flexShrink: 0, position: 'relative', zIndex: 1,
                }} />
                {i < education.length - 1 && (
                  <div style={{
                    flex: 1, width: 1,
                    background: 'linear-gradient(to bottom, #60a5fa66, #60a5fa11)',
                    marginTop: 4, minHeight: 24,
                  }} />
                )}
              </div>

              {/* Right — card */}
              <div style={{ flex: 1, paddingLeft: 16, paddingBottom: i < education.length - 1 ? 28 : 0 }}>
                <div style={{ marginBottom: 6 }}>
                  <span style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
                    fontWeight: 700, color: '#fff',
                  }}>
                    {edu.degree}
                  </span>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 11,
                    color: '#60a5fa', opacity: 0.85, marginLeft: 8,
                  }}>
                    @ {edu.shortName}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'monospace', fontSize: 10,
                  color: '#475569', letterSpacing: '0.12em',
                  marginBottom: 8,
                }}>
                  ◈ {edu.location} · {edu.period}
                </div>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 'clamp(0.78rem, 1.5vw, 0.88rem)',
                  color: '#64748b', lineHeight: 1.65,
                  margin: 0,
                }}>
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer label */}
        <div style={{
          marginTop: 24,
          textAlign: 'center',
          fontFamily: 'monospace', fontSize: 9,
          color: '#334155', letterSpacing: '0.25em',
        }}>
          NODE.EXPERIENCE — LAYER 2 / HIDDEN
        </div>

      </div>
    </div>
  )
}
