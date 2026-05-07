import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NODES_WITH_POS, getNodeColor } from '../../data/network'
import useStore from '../../store/useStore'

const ASSEMBLE_START = 0.08
const ASSEMBLE_END   = 0.28
const HOP_INTERVAL   = 2.5 // seconds between beacon hops

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Pick a random subset of interesting nodes to beacon through
const BEACON_NODES = NODES_WITH_POS.filter(n =>
  ['react', 'meet', 'vedrix', 'llm', 'exp-devx', 'python', 'homepraise'].includes(n.id)
)

export default function NodeBeacon() {
  const ringRef    = useRef()
  const ring2Ref   = useRef()
  const ring3Ref   = useRef()
  const timerRef   = useRef(0)
  const indexRef   = useRef(0)
  const posRef     = useRef(new THREE.Vector3())
  const targetPos  = useRef(new THREE.Vector3())
  const colorRef   = useRef(new THREE.Color('#60a5fa'))
  const fadeRef    = useRef(0) // 0 = invisible, 1 = visible

  const ringGeo = useMemo(() => new THREE.RingGeometry(0.5, 0.55, 32), [])
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#60a5fa',
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])
  const ring2Mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#60a5fa',
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])
  const ring3Mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#60a5fa',
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  useFrame(({ clock }, delta) => {
    const hasInteracted = useStore.getState().hasInteracted
    const p = useStore.getState().scrollProgress
    const asm = smoothstep(ASSEMBLE_START, ASSEMBLE_END, p)

    // Only show after assembly, before first interaction
    const shouldShow = asm > 0.9 && !hasInteracted && p > 0.18
    fadeRef.current += ((shouldShow ? 1 : 0) - fadeRef.current) * 0.05

    if (fadeRef.current < 0.01) {
      ringMat.opacity = 0
      ring2Mat.opacity = 0
      ring3Mat.opacity = 0
      return
    }

    // Hop timer
    timerRef.current += delta
    if (timerRef.current > HOP_INTERVAL) {
      timerRef.current = 0
      indexRef.current = (indexRef.current + 1) % BEACON_NODES.length
    }

    // Target node
    const node = BEACON_NODES[indexRef.current]
    const scatter = node.scatterPosition
    const target  = node.position
    targetPos.current.set(
      scatter.x + (target.x - scatter.x) * asm,
      scatter.y + (target.y - scatter.y) * asm,
      scatter.z + (target.z - scatter.z) * asm
    )

    // Smooth position lerp
    posRef.current.lerp(targetPos.current, 0.08)
    colorRef.current.set(getNodeColor(node))

    const t = clock.getElapsedTime()

    // Ring 1 — expanding pulse
    if (ringRef.current) {
      ringRef.current.position.copy(posRef.current)
      const pulse1 = (t % 1.8) / 1.8
      const scale1 = 0.8 + pulse1 * 1.2
      ringRef.current.scale.setScalar(scale1)
      ringMat.opacity = (1 - pulse1) * 0.5 * fadeRef.current
      ringMat.color.copy(colorRef.current)
    }

    // Ring 2 — delayed pulse
    if (ring2Ref.current) {
      ring2Ref.current.position.copy(posRef.current)
      const pulse2 = ((t + 0.6) % 1.8) / 1.8
      const scale2 = 0.8 + pulse2 * 1.2
      ring2Ref.current.scale.setScalar(scale2)
      ring2Mat.opacity = (1 - pulse2) * 0.35 * fadeRef.current
      ring2Mat.color.copy(colorRef.current)
    }

    // Ring 3 — third wave
    if (ring3Ref.current) {
      ring3Ref.current.position.copy(posRef.current)
      const pulse3 = ((t + 1.2) % 1.8) / 1.8
      const scale3 = 0.8 + pulse3 * 1.2
      ring3Ref.current.scale.setScalar(scale3)
      ring3Mat.opacity = (1 - pulse3) * 0.2 * fadeRef.current
      ring3Mat.color.copy(colorRef.current)
    }
  })

  return (
    <>
      <mesh ref={ringRef} geometry={ringGeo} material={ringMat} />
      <mesh ref={ring2Ref} geometry={ringGeo} material={ring2Mat} />
      <mesh ref={ring3Ref} geometry={ringGeo} material={ring3Mat} />
    </>
  )
}
