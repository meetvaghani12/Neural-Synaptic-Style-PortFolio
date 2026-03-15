import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

// Camera waypoints per scroll progress 0→1
// On mobile use a higher Z (further back) so the full NN fits in a narrow viewport
const WAYPOINTS = MOBILE
  ? [
      { progress: 0.00, pos: [0,  0,  28],  target: [0, 0, 0]  }, // Hero: wide view, further back on mobile
      { progress: 0.18, pos: [0,  0,  26],  target: [0, 0, 0]  }, // Network assembling
      { progress: 0.30, pos: [0,  0,  22],  target: [0, 0, 0]  }, // Full architecture visible
      { progress: 0.50, pos: [-4, 0,  16],  target: [-3, 0, 0] }, // Zoom left — input + hidden 1
      { progress: 0.70, pos: [4,  0,  16],  target: [3,  0, 0] }, // Zoom right — hidden 3 + output
      { progress: 1.00, pos: [0,  8,  20],  target: [0,  0, 0] }, // Bird's eye — contact
    ]
  : [
      // Fully connected NN is 16 units wide (X: -8 to +8), ~6 units tall
      // Camera at Z=14 sees the full network comfortably at FOV 55
      { progress: 0.00, pos: [0,  0,  22],  target: [0, 0, 0]  }, // Hero: scattered nodes, wide view
      { progress: 0.18, pos: [0,  0,  20],  target: [0, 0, 0]  }, // Network assembling
      { progress: 0.30, pos: [0,  0,  17],  target: [0, 0, 0]  }, // Full architecture visible
      { progress: 0.50, pos: [-5, 0,  10],  target: [-4, 0, 0] }, // Zoom left — input + hidden 1
      { progress: 0.70, pos: [5,  0,  10],  target: [4,  0, 0] }, // Zoom right — hidden 3 + output
      { progress: 1.00, pos: [0,  8,  14],  target: [0,  0, 0] }, // Bird's eye — contact
    ]

const tmpPos    = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()

function lerpWaypoints(scroll) {
  // Find surrounding waypoints
  let a = WAYPOINTS[0], b = WAYPOINTS[1]
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (scroll >= WAYPOINTS[i].progress && scroll <= WAYPOINTS[i + 1].progress) {
      a = WAYPOINTS[i]
      b = WAYPOINTS[i + 1]
      break
    }
  }
  const t = a.progress === b.progress
    ? 0
    : (scroll - a.progress) / (b.progress - a.progress)
  const smooth = t * t * (3 - 2 * t) // smoothstep

  tmpPos.lerpVectors(
    new THREE.Vector3(...a.pos),
    new THREE.Vector3(...b.pos),
    smooth
  )
  tmpTarget.lerpVectors(
    new THREE.Vector3(...a.target),
    new THREE.Vector3(...b.target),
    smooth
  )
  return { pos: tmpPos.clone(), target: tmpTarget.clone() }
}

export function useScrollCamera() {
  const scroll      = useScroll()
  const { camera }  = useThree()
  const setProgress = useStore(s => s.setScrollProgress)
  const currentPos  = useRef(new THREE.Vector3(...WAYPOINTS[0].pos))   // matches mobile/desktop first waypoint
  const currentTgt  = useRef(new THREE.Vector3(...WAYPOINTS[0].target)) // matches mobile/desktop first waypoint

  useFrame(() => {
    const p = scroll.offset
    setProgress(p)

    const { pos, target } = lerpWaypoints(p)

    // Smooth camera lerp
    currentPos.current.lerp(pos, 0.04)
    currentTgt.current.lerp(target, 0.04)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTgt.current)
  })
}
