import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { NODES_WITH_POS } from '../data/network'

const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

// Camera waypoints — simplified journey THROUGH the network
const WAYPOINTS = MOBILE
  ? [
      { progress: 0.00, pos: [0,   0,  28], target: [0,  0, 0] },
      { progress: 0.15, pos: [0,   0,  24], target: [0,  0, 0] },
      { progress: 0.30, pos: [-4,  0,  16], target: [-2, 0, 0] },
      { progress: 0.50, pos: [0,   0,  14], target: [0,  0, 0] },
      { progress: 0.70, pos: [4,   0,  16], target: [2,  0, 0] },
      { progress: 0.85, pos: [0,   2,  22], target: [0,  0, 0] },
      { progress: 1.00, pos: [0,   4,  24], target: [0,  0, 0] },
    ]
  : [
      { progress: 0.00, pos: [0,   0,  22], target: [0,  0, 0] },
      { progress: 0.15, pos: [0,   0,  18], target: [0,  0, 0] },
      { progress: 0.30, pos: [-5,  0,  14], target: [-3, 0, 0] },
      { progress: 0.45, pos: [-1,  0,  12], target: [0,  0, 0] },
      { progress: 0.60, pos: [4,   0,  14], target: [3,  0, 0] },
      { progress: 0.75, pos: [6,   0,  14], target: [5,  0, 0] },
      { progress: 0.88, pos: [0,   3,  20], target: [0,  0, 0] },
      { progress: 1.00, pos: [0,   5,  22], target: [0,  0, 0] },
    ]

const tmpPos    = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const _v1 = new THREE.Vector3()
const _v2 = new THREE.Vector3()

function lerpWaypoints(scroll) {
  let a = WAYPOINTS[0], b = WAYPOINTS[1]
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (scroll >= WAYPOINTS[i].progress && scroll <= WAYPOINTS[i + 1].progress) {
      a = WAYPOINTS[i]
      b = WAYPOINTS[i + 1]
      break
    }
  }
  if (scroll > WAYPOINTS[WAYPOINTS.length - 1].progress) {
    a = b = WAYPOINTS[WAYPOINTS.length - 1]
  }
  const t = a.progress === b.progress
    ? 0
    : (scroll - a.progress) / (b.progress - a.progress)
  const smooth = t * t * (3 - 2 * t)

  tmpPos.lerpVectors(
    _v1.set(...a.pos),
    _v2.set(...b.pos),
    smooth
  )
  tmpTarget.lerpVectors(
    _v1.set(...a.target),
    _v2.set(...b.target),
    smooth
  )
  return { pos: tmpPos.clone(), target: tmpTarget.clone() }
}

const nodeMap = {}
NODES_WITH_POS.forEach(n => { nodeMap[n.id] = n })

export function useScrollCamera() {
  const scroll      = useScroll()
  const { camera }  = useThree()
  const setProgress = useStore(s => s.setScrollProgress)
  const currentPos  = useRef(new THREE.Vector3(...WAYPOINTS[0].pos))
  const currentTgt  = useRef(new THREE.Vector3(...WAYPOINTS[0].target))

  // Track saved scroll position when focusing a node
  const savedScrollTop = useRef(null)
  const prevFocused    = useRef(null)

  useFrame(() => {
    const focusedId   = useStore.getState().focusedNode
    const focusedNode = focusedId ? nodeMap[focusedId] : null
    const scrollEl    = useStore.getState().scrollEl

    // ── Save/restore scroll position on focus change ──
    if (focusedId && !prevFocused.current) {
      // Just focused — save scroll position
      if (scrollEl) savedScrollTop.current = scrollEl.scrollTop
    } else if (!focusedId && prevFocused.current) {
      // Just unfocused — restore scroll position
      if (scrollEl && savedScrollTop.current !== null) {
        scrollEl.scrollTop = savedScrollTop.current
        savedScrollTop.current = null
      }
    }
    prevFocused.current = focusedId

    // While focused, keep resetting scroll to saved position
    if (focusedId && scrollEl && savedScrollTop.current !== null) {
      scrollEl.scrollTop = savedScrollTop.current
    }

    const p = scroll.offset
    setProgress(p)

    let goalPos, goalTarget

    if (focusedNode) {
      const nodePos = focusedNode.position
      const offsetX = MOBILE ? 0 : -2
      const offsetY = MOBILE ? 2 : 0.5
      goalPos = new THREE.Vector3(nodePos.x + offsetX, nodePos.y + offsetY, nodePos.z + 6)
      goalTarget = new THREE.Vector3(nodePos.x, nodePos.y, nodePos.z)
    } else {
      const wp = lerpWaypoints(p)
      goalPos = wp.pos
      goalTarget = wp.target
    }

    const lerpSpeed = focusedNode ? 0.06 : 0.04
    currentPos.current.lerp(goalPos, lerpSpeed)
    currentTgt.current.lerp(goalTarget, lerpSpeed)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTgt.current)
  })
}
