import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EDGES, NODES_WITH_POS, getNodeColor } from '../../data/network'
import useStore from '../../store/useStore'

const ASSEMBLE_START = 0.08
const ASSEMBLE_END   = 0.30

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function EdgeSystem() {
  const nodeMap = useMemo(() => {
    const m = {}
    NODES_WITH_POS.forEach(n => { m[n.id] = n })
    return m
  }, [])

  // Build all edge geometries + materials once
  const edgeData = useMemo(() => {
    return EDGES.map((edge) => {
      const from = nodeMap[edge.from]
      const to   = nodeMap[edge.to]
      if (!from || !to) return null

      const points = [from.position.clone(), to.position.clone()]
      const geo    = new THREE.BufferGeometry().setFromPoints(points)

      // Color: blend between layers
      const cFrom = new THREE.Color(getNodeColor(from))
      const cTo   = new THREE.Color(getNodeColor(to))
      const blended = cFrom.clone().lerp(cTo, 0.5)

      const mat = new THREE.LineBasicMaterial({
        color: blended,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      return { geo, mat, from, to }
    }).filter(Boolean)
  }, [nodeMap])

  useFrame(() => {
    const p       = useStore.getState().scrollProgress
    const asm     = smoothstep(ASSEMBLE_START, ASSEMBLE_END, p)
    const nnFade  = useStore.getState().nnFade
    const visible = 1 - nnFade
    const signals = useStore.getState().signals

    edgeData.forEach((ed, i) => {
      const hasSignal   = signals.some(s => s.edgeIdx === i)
      const baseOpacity = asm * 0.28 * visible
      const target      = hasSignal ? Math.min(0.85, asm * 0.85) * visible : baseOpacity
      ed.mat.opacity    = THREE.MathUtils.lerp(ed.mat.opacity, target, 0.07)
    })
  })

  return (
    <group>
      {edgeData.map((ed, i) => (
        <line key={i} geometry={ed.geo} material={ed.mat} frustumCulled={false} />
      ))}
    </group>
  )
}
