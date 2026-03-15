import { Suspense, useState, useCallback, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls } from '@react-three/drei'
import NeuralNetwork   from './components/three/NeuralNetwork'
import LoadingScreen   from './components/ui/LoadingScreen'
import NavBar          from './components/ui/NavBar'
import HeroOverlay     from './components/ui/HeroOverlay'
import ProjectCard     from './components/ui/ProjectCard'
import InputNodeCard   from './components/ui/InputNodeCard'
import ContactOverlay  from './components/ui/ContactOverlay'
import MuteButton      from './components/ui/MuteButton'

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
            <ScrollControls pages={5} damping={0.2}>
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
          <ProjectCard />
          <InputNodeCard />
          <ContactOverlay />
          <MuteButton />
        </>
      )}
    </div>
  )
}
