import { Suspense, useState, useCallback, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import NeuralNetwork      from './components/three/NeuralNetwork'
import LoadingScreen      from './components/ui/LoadingScreen'
import NavBar             from './components/ui/NavBar'
import HeroOverlay        from './components/ui/HeroOverlay'
import SkillsOverlay      from './components/ui/SkillsOverlay'
import ExperienceOverlay  from './components/ui/ExperienceOverlay'
import ProjectsOverlay    from './components/ui/ProjectsOverlay'
import ProjectCard        from './components/ui/ProjectCard'
import InputNodeCard      from './components/ui/InputNodeCard'
import ContactOverlay     from './components/ui/ContactOverlay'
import ScrollProgress     from './components/ui/ScrollProgress'
import MuteButton         from './components/ui/MuteButton'
import useStore           from './store/useStore'

// Full-screen section intro — shown before each content panel slides in.
// The 3D network behind it will already have dimmed irrelevant nodes,
// so the user sees only the relevant glowing dots before reading the content.
function SectionIntro({ start, end, title, subtitle, color }) {
  const progress = useStore(s => s.scrollProgress)
  const t    = Math.max(0, Math.min(1, (progress - start) / (end - start)))
  // Ramp in over first 20%, hold full opacity for 60%, ramp out over last 20%
  const inT  = Math.min(1, t / 0.20)
  const outT = Math.max(0, (t - 0.80) / 0.20)
  const opacity = inT * (1 - outT) * 0.95
  if (opacity < 0.01) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 30,
      pointerEvents: 'none',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity,
    }}>
      {/* Radial glow behind the text */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${color}0d 0%, transparent 70%)`,
      }} />

      <div style={{ textAlign: 'center', position: 'relative', padding: '0 24px' }}>
        <div style={{
          fontFamily: 'monospace', fontSize: 10,
          color: color + '77', letterSpacing: '0.4em',
          marginBottom: 16, textTransform: 'uppercase',
        }}>
          ENTERING SECTION
        </div>

        <h2 style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: 900, color: '#fff',
          margin: '0 0 16px',
          letterSpacing: '-0.01em', lineHeight: 1,
          textShadow: `0 0 80px ${color}55, 0 0 160px ${color}22, 0 2px 4px rgba(0,0,0,0.8)`,
        }}>
          {title}
        </h2>

        <div style={{
          fontFamily: 'monospace', fontSize: 11,
          color, letterSpacing: '0.22em',
          opacity: 0.8, textTransform: 'uppercase',
        }}>
          {subtitle}
        </div>

        <div style={{
          width: 56, height: 1, margin: '20px auto 0',
          background: `linear-gradient(to right, transparent, ${color}88, transparent)`,
        }} />
      </div>
    </div>
  )
}

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'#020510', color:'#f472b6', fontFamily:'monospace', fontSize:13, padding:40, textAlign:'center' }}>
          <div>
            <div style={{ marginBottom:12, opacity:0.5 }}>WebGL Error</div>
            <div style={{ color:'#ef4444', wordBreak:'break-all' }}>{this.state.error.message}</div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const handleLoadComplete = useCallback(() => setLoaded(true), [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020510', position: 'relative' }}>

      {/* 3D Canvas — behind everything */}
      <ErrorBoundary>
        <Canvas
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
          camera={{ fov: 50, near: 0.1, far: 200, position: [0, 0, typeof window !== 'undefined' && window.innerWidth < 768 ? 28 : 22] }}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, toneMapping: 0 }}
          dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1] : [1, 1.5]}
        >
          <color attach="background" args={['#020510']} />
          <Suspense fallback={null}>
            <ScrollControls pages={12} damping={0.7}>
              <NeuralNetwork />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Loading screen — always on top */}
      <LoadingScreen onComplete={handleLoadComplete} visible={!loaded} />

      {/* HTML overlays */}
      {loaded && (
        <>
          <NavBar />
          <HeroOverlay />
          <SkillsOverlay />
          <ExperienceOverlay />
          <ProjectsOverlay />
          {/* Section intros — full-screen moment before each panel slides in.
              The 3D network behind shows only the relevant glowing nodes. */}
          <SectionIntro start={0.11} end={0.26} title="Skills"      subtitle="HIDDEN LAYERS · NEURAL WEIGHTS"     color="#34d399" />
          <SectionIntro start={0.44} end={0.56} title="Experience"  subtitle="CAREER TRAJECTORY · SIGNAL PATH"    color="#f59e0b" />
          <SectionIntro start={0.69} end={0.79} title="Projects"    subtitle="OUTPUT NODES · BUILT & SHIPPED"     color="#f472b6" />
          <ProjectCard />
          <InputNodeCard />
          <ContactOverlay />
          <ScrollProgress />
          <MuteButton />
        </>
      )}
    </div>
  )
}
