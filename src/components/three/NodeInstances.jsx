import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { NODES_WITH_POS, getNodeColor } from '../../data/network'
import { nodeVertexShader, nodeFragmentShader } from '../../shaders/node'
import { playNodePing, playProjectOpen } from '../../hooks/useAudioEngine'
import useStore from '../../store/useStore'

const NODES = NODES_WITH_POS

// Scroll range over which nodes travel from scatter → organized positions
const ASSEMBLE_START = 0.08  // scatter starts dissolving
const ASSEMBLE_END   = 0.28  // fully assembled into layers

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function NodeMesh({ node }) {
  const meshRef       = useRef()
  const activationRef = useRef(0)
  const setHovered    = useStore(s => s.setHoveredNode)
  const setActive     = useStore(s => s.setActiveNode)
  const scrollProgress = useStore(s => s.scrollProgress)

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   nodeVertexShader,
    fragmentShader: nodeFragmentShader,
    uniforms: {
      uTime:       { value: 0 },
      uActivation: { value: 0 },
      uColor:      { value: new THREE.Color('#60a5fa') },  // starts blue for all
      uIdlePulse:  { value: node.scatterPhase ?? Math.random() * Math.PI * 2 },
    },
    transparent: true,
    depthWrite:  false,
    side:        THREE.DoubleSide,
  }), [node])

  const targetColor  = useMemo(() => new THREE.Color(getNodeColor(node)), [node])
  const heroColor    = useMemo(() => new THREE.Color('#60a5fa'), [])
  const currentColor = useMemo(() => new THREE.Color('#60a5fa'), [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t      = clock.getElapsedTime()
    const p      = useStore.getState().scrollProgress
    const asm    = smoothstep(ASSEMBLE_START, ASSEMBLE_END, p)
    const nnFade = useStore.getState().nnFade
    const visible = 1 - nnFade

    // Hide mesh entirely when fully faded
    meshRef.current.visible = visible > 0.01

    // Interpolate position: scatter → organized
    const scatter = node.scatterPosition
    const target  = node.position

    // Add gentle float to scatter position
    const floatY = Math.sin(t * 0.4 + (node.scatterPhase ?? 0)) * 0.12
    const floatX = Math.cos(t * 0.3 + (node.scatterPhase ?? 0) * 1.3) * 0.08

    let x = scatter.x + floatX + (target.x - scatter.x - floatX) * asm
    let y = scatter.y + floatY + (target.y - scatter.y - floatY) * asm
    let z = scatter.z           + (target.z - scatter.z)          * asm

    // Convergence: nodes rush toward center as nnFade increases
    // Each node has a slight offset delay based on its layer so they converge in sequence
    const layerDelay = node.layer * 0.08
    const convergeT  = Math.max(0, Math.min(1, (nnFade - layerDelay) / (1 - layerDelay + 0.01)))
    const ct = convergeT * convergeT * (3 - 2 * convergeT) // smoothstep
    x = x + (0 - x) * ct
    y = y + (0 - y) * ct
    z = z + (0 - z) * ct * 0.6

    meshRef.current.position.set(x, y, z)

    // Interpolate color: all blue → layer color
    currentColor.copy(heroColor).lerp(targetColor, asm)
    // Brighten toward white as nodes converge (charging up effect)
    const white = new THREE.Color('#ffffff')
    currentColor.lerp(white, ct * 0.7)
    material.uniforms.uColor.value.copy(currentColor)

    // Activation (hover) + convergence glow spike
    const isHov = useStore.getState().hoveredNode === node.id
    const cur   = activationRef.current
    activationRef.current = cur + ((isHov ? 1 : 0) - cur) * (isHov ? 0.14 : 0.05)
    material.uniforms.uActivation.value = Math.max(activationRef.current, ct * 1.2) * visible
    material.uniforms.uTime.value = t
    material.opacity = visible

    // Scale: slightly smaller in scatter mode
    const baseScale = node.size * 2 * (0.75 + asm * 0.25)
    const hoverBump = activationRef.current * 0.4
    meshRef.current.scale.setScalar(baseScale * (1 + hoverBump))
  })

  return (
    <mesh
      ref={meshRef}
      position={node.scatterPosition}
      material={material}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(node.id)
        document.body.style.cursor = 'pointer'
        playNodePing(node.layer)
      }}
      onPointerLeave={() => {
        setHovered(null)
        document.body.style.cursor = 'default'
      }}
      onClick={(e) => {
        e.stopPropagation()
        setActive(node.id)
        if (node.type === 'project') playProjectOpen()
        else playNodePing(node.layer)
      }}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

function NodeLabel({ node }) {
  const hoveredNode    = useStore(s => s.hoveredNode)
  const scrollProgress = useStore(s => s.scrollProgress)
  const asm     = smoothstep(ASSEMBLE_START, ASSEMBLE_END, scrollProgress)
  const isHovered = hoveredNode === node.id

  // Labels only appear once assembled
  if (asm < 0.3) return null

  const labelOpacity = smoothstep(0.3, 1.0, asm) * (isHovered ? 1.0 : 0.85)

  // Input layer → label on left, Output layer → label on right, Hidden → label below
  const isInput  = node.layer === 0
  const isOutput = node.layer === 4
  const offset   = node.size * 1.6  // distance from circle edge

  const labelPos = isInput
    ? [node.position.x - offset - 0.1, node.position.y, node.position.z]
    : isOutput
    ? [node.position.x + offset + 0.1, node.position.y, node.position.z]
    : [node.position.x, node.position.y - offset - 0.05, node.position.z]

  const anchorX = isInput ? 'right' : isOutput ? 'left' : 'center'
  const anchorY = (isInput || isOutput) ? 'middle' : 'top'

  return (
    <Text
      position={labelPos}
      fontSize={0.20}
      color={isHovered ? '#ffffff' : getNodeColor(node)}
      anchorX={anchorX}
      anchorY={anchorY}
      fillOpacity={labelOpacity}
      outlineWidth={0.01}
      outlineColor="#020510"
    >
      {node.label}
    </Text>
  )
}

export default function NodeInstances() {
  return (
    <group>
      {NODES.map(node => <NodeMesh key={node.id} node={node} />)}
      {NODES.map(node => <NodeLabel key={`lbl-${node.id}`} node={node} />)}
    </group>
  )
}
