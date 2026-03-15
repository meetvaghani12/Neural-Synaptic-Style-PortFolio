import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { LAYER_LABELS, LAYER_COLORS, NODES_WITH_POS } from '../../data/network'
import useStore from '../../store/useStore'

const ASSEMBLE_START = 0.08
const ASSEMBLE_END   = 0.30

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Get top Y position of each layer
function getLayerTopY() {
  const byLayer = {}
  NODES_WITH_POS.forEach(n => {
    if (!byLayer[n.layer]) byLayer[n.layer] = []
    byLayer[n.layer].push(n)
  })
  const tops = {}
  Object.entries(byLayer).forEach(([layer, nodes]) => {
    tops[parseInt(layer)] = Math.max(...nodes.map(n => n.position.y)) + 1.2
  })
  return tops
}

const LAYER_TOP_Y = getLayerTopY()

// Get X position of each layer
const LAYER_X = { 0: -8, 1: -4, 2: 0, 3: 4, 4: 8 }

export default function LayerLabels() {
  const opacityRef = useRef(0)

  useFrame(() => {
    const p      = useStore.getState().scrollProgress
    const nnFade = useStore.getState().nnFade
    opacityRef.current = smoothstep(ASSEMBLE_START + 0.1, ASSEMBLE_END + 0.1, p) * (1 - nnFade)
  })

  return (
    <>
      {Object.entries(LAYER_LABELS).map(([layer, label]) => (
        <LayerLabel
          key={layer}
          layer={parseInt(layer)}
          label={label}
          x={LAYER_X[parseInt(layer)]}
          y={LAYER_TOP_Y[parseInt(layer)] ?? 4}
          color={LAYER_COLORS[parseInt(layer)]}
          opacityRef={opacityRef}
        />
      ))}
    </>
  )
}

function LayerLabel({ layer, label, x, y, color, opacityRef }) {
  const textRef = useRef()

  useFrame(() => {
    if (textRef.current?.material) {
      textRef.current.material.opacity = opacityRef.current * 0.85
    }
  })

  return (
    <Text
      ref={textRef}
      position={[x, y, 0]}
      fontSize={0.38}
      color={color}
      anchorX="center"
      anchorY="bottom"
      letterSpacing={0.05}
      material-transparent={true}
      material-opacity={0}
    >
      {label.toUpperCase()}
    </Text>
  )
}
