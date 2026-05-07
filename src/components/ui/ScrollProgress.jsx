import useStore from '../../store/useStore'

const SECTIONS = [
  { label: 'ABOUT',      at: 0.00, color: '#60a5fa' },
  { label: 'SKILLS',     at: 0.25, color: '#34d399' },
  { label: 'PROJECTS',   at: 0.55, color: '#f472b6' },
  { label: 'EXPERIENCE', at: 0.70, color: '#f59e0b' },
  { label: 'CONTACT',    at: 0.92, color: '#60a5fa' },
]

export default function ScrollProgress() {
  const progress = useStore(s => s.scrollProgress)
  const scrollEl = useStore(s => s.scrollEl)

  // Don't show during hero (< 0.10) or if not loaded
  const show = progress > 0.08

  const handleClick = (at) => {
    if (!scrollEl) return
    scrollEl.scrollTop = at * (scrollEl.scrollHeight - scrollEl.clientHeight)
  }

  return (
    <div style={{
      position: 'fixed',
      right: typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 24,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0,
      opacity: show ? 0.9 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: show ? 'all' : 'none',
    }}>
      {/* Track line */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        width: 1,
        background: 'rgba(255,255,255,0.06)',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 1,
      }} />

      {/* Progress fill */}
      <div style={{
        position: 'absolute',
        top: 0,
        height: `${Math.min(100, progress * 100)}%`,
        width: 1,
        background: 'linear-gradient(to bottom, #60a5fa44, #60a5fa)',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: 1,
        transition: 'height 0.1s linear',
      }} />

      {SECTIONS.map((sec) => {
        const dist  = Math.abs(progress - sec.at)
        const isActive = dist < 0.08
        const isPast   = progress > sec.at + 0.05

        return (
          <div
            key={sec.label}
            onClick={() => handleClick(sec.at)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '12px 0',
              touchAction: 'manipulation',
            }}
          >
            {/* Label (left of dot, desktop only) */}
            {typeof window !== 'undefined' && window.innerWidth >= 768 && (
              <span style={{
                position: 'absolute',
                right: 18,
                fontFamily: 'monospace',
                fontSize: 9,
                color: isActive ? sec.color : '#334155',
                letterSpacing: '0.15em',
                whiteSpace: 'nowrap',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateX(0)' : 'translateX(8px)',
                transition: 'all 0.3s ease',
                pointerEvents: 'none',
              }}>
                {sec.label}
              </span>
            )}

            {/* Dot */}
            <div style={{
              width: isActive ? 10 : 6,
              height: isActive ? 10 : 6,
              borderRadius: '50%',
              background: isActive ? sec.color : isPast ? `${sec.color}66` : 'rgba(255,255,255,0.15)',
              boxShadow: isActive ? `0 0 12px ${sec.color}88, 0 0 24px ${sec.color}44` : 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }} />
          </div>
        )
      })}
    </div>
  )
}
