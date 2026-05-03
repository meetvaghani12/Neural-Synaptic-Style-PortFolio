import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

// Camera waypoints per scroll progress 0→1
// Desktop: shift left during content sections so network is visible in the left half
// while the right-side content panel occupies the right half of the screen.
// Mobile: stay centered, further back (panels go full-screen on mobile).
const WAYPOINTS = MOBILE
  ? [
      { progress: 0.00, pos: [0,  0,  28], target: [0,  0, 0] },
      { progress: 0.18, pos: [0,  0,  26], target: [0,  0, 0] },
      { progress: 0.28, pos: [0,  0,  24], target: [0,  0, 0] },
      { progress: 0.47, pos: [0,  0,  22], target: [0,  0, 0] },
      { progress: 0.68, pos: [0,  0,  22], target: [0,  0, 0] },
      { progress: 1.00, pos: [0,  8,  24], target: [0,  0, 0] },
    ]
  : [
      { progress: 0.00, pos: [0,   0, 22], target: [0,  0, 0] },  // Hero — centered
      { progress: 0.18, pos: [-1,  0, 20], target: [-1, 0, 0] },  // Start shifting left
      { progress: 0.28, pos: [-3,  0, 17], target: [-2, 0, 0] },  // Skills panel — network fills left half
      { progress: 0.47, pos: [-2,  0, 15], target: [-1, 0, 0] },  // Experience approaching
      { progress: 0.68, pos: [-2,  0, 15], target: [-1, 0, 0] },  // Projects — similar angle
      { progress: 1.00, pos: [0,   8, 18], target: [0,  0, 0] },  // Contact — bird's-eye
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
