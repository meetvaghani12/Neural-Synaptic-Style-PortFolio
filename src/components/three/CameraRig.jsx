import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { useScrollCamera } from '../../hooks/useScrollCamera'
import { startAmbientDrone, playAssemblySweep } from '../../hooks/useAudioEngine'
import useStore from '../../store/useStore'

export default function CameraRig() {
  const scroll        = useScroll()
  const setScrollEl   = useStore(s => s.setScrollEl)
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
  })

  return null
}
