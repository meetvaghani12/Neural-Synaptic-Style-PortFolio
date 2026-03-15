import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useScrollCamera } from '../../hooks/useScrollCamera'
import { startAmbientDrone, playAssemblySweep } from '../../hooks/useAudioEngine'
import useStore from '../../store/useStore'

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function CameraRig() {
  const scroll        = useScroll()
  const setScrollEl   = useStore(s => s.setScrollEl)
  const setNnFade     = useStore(s => s.setNnFade)
  const assembleFired = useRef(false)

  useEffect(() => {
    if (scroll?.el) setScrollEl(scroll.el)
  }, [scroll, setScrollEl])

  useScrollCamera()

  useFrame(() => {
    const p = useStore.getState().scrollProgress

    // Start drone on first scroll
    if (p > 0.005) startAmbientDrone()

    // Fire assembly sweep once as network starts assembling
    if (p > 0.09 && !assembleFired.current) {
      assembleFired.current = true
      playAssemblySweep()
    }

    // Fade out main NN between 0.68 and 0.86 — nodes converge then contact bursts out
    const fade = smoothstep(0.68, 0.86, p)
    setNnFade(fade)
  })

  return null
}
