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
      return { geo, mat, from, to, edge }
    }).filter(Boolean)
  }, [nodeMap])

  useFrame(() => {
    const p       = useStore.getState().scrollProgress
    const asm     = smoothstep(ASSEMBLE_START, ASSEMBLE_END, p)
    const signals = useStore.getState().signals
    const focused = useStore.getState().focusedNode

    edgeData.forEach((ed, i) => {
      const hasSignal = signals.some(s => s.edgeIdx === i)

      // Check if this edge is connected to the focused node
      const isConnectedToFocus = focused && (ed.edge.from === focused || ed.edge.to === focused)
      const isFocusActive = !!focused

      let targetOpacity
      if (isFocusActive) {
        if (isConnectedToFocus) {
          // Bright glow for connected edges
          targetOpacity = asm * 0.9
        } else {
          // Very dim for unconnected edges
          targetOpacity = asm * 0.06
        }
      } else {
        // Normal mode: base opacity with signal boost
        const baseOpacity = asm * 0.28
        targetOpacity = hasSignal ? Math.min(0.85, asm * 0.85) : baseOpacity
      }

      // Signal boost even in focus mode
      if (hasSignal && isConnectedToFocus) {
        targetOpacity = Math.min(1.0, targetOpacity + 0.15)
      }

      ed.mat.opacity = THREE.MathUtils.lerp(ed.mat.opacity, targetOpacity, 0.07)
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
