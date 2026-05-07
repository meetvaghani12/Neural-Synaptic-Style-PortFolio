import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { NODES_WITH_POS, getNodeColor, EDGES } from '../../data/network'
import { nodeVertexShader, nodeFragmentShader } from '../../shaders/node'
import { playNodePing, playProjectOpen } from '../../hooks/useAudioEngine'
import useStore from '../../store/useStore'

const NODES = NODES_WITH_POS
const MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

// Scroll range over which nodes travel from scatter → organized positions
const ASSEMBLE_START = 0.08
const ASSEMBLE_END   = 0.28

// Reusable color constants
const WHITE_COLOR = new THREE.Color('#ffffff')
const GREY_COLOR  = new THREE.Color(0.08, 0.10, 0.18)

// Build edge lookup: nodeId → set of connected nodeIds
const connectedNodes = {}
EDGES.forEach(e => {
  if (!connectedNodes[e.from]) connectedNodes[e.from] = new Set()
  if (!connectedNodes[e.to])   connectedNodes[e.to]   = new Set()
  connectedNodes[e.from].add(e.to)
  connectedNodes[e.to].add(e.from)
})

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function NodeMesh({ node }) {
  const meshRef       = useRef()
  const activationRef = useRef(0)
  const setHovered    = useStore(s => s.setHoveredNode)
  const setFocused    = useStore(s => s.setFocusedNode)

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   nodeVertexShader,
    fragmentShader: nodeFragmentShader,
    uniforms: {
      uTime:       { value: 0 },
      uActivation: { value: 0 },
      uColor:      { value: new THREE.Color('#60a5fa') },
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
    const focused = useStore.getState().focusedNode

    // ── Position: scatter → organized ──
    const scatter = node.scatterPosition
    const target  = node.position
    const floatY  = Math.sin(t * 0.4 + (node.scatterPhase ?? 0)) * 0.12
    const floatX  = Math.cos(t * 0.3 + (node.scatterPhase ?? 0) * 1.3) * 0.08
    let x = scatter.x + floatX + (target.x - scatter.x - floatX) * asm
    let y = scatter.y + floatY + (target.y - scatter.y - floatY) * asm
    let z = scatter.z           + (target.z - scatter.z)          * asm

    meshRef.current.position.set(x, y, z)

    // ── Color: blue → layer color ──
    currentColor.copy(heroColor).lerp(targetColor, asm)

    // ── Focus-aware dimming ──
    // When a node is focused, dim unconnected nodes
    let dimT = 0
    let highlightBoost = 0
    if (focused) {
      const isFocused    = node.id === focused
      const isConnected  = connectedNodes[focused]?.has(node.id) ?? false
      if (isFocused) {
        highlightBoost = 0.6
      } else if (isConnected) {
        highlightBoost = 0.3
      } else {
        dimT = 0.7
      }
    }

    if (dimT > 0) currentColor.lerp(GREY_COLOR, dimT * 0.80)
    material.uniforms.uColor.value.copy(currentColor)

    // ── Opacity ──
    const dimmedVisible = 1 - dimT * 0.6
    material.opacity = dimmedVisible
    meshRef.current.visible = dimmedVisible > 0.01

    // ── Activation: hover + highlight boost ──
    const isHov = useStore.getState().hoveredNode === node.id
    const cur   = activationRef.current
    activationRef.current = cur + ((isHov ? 1 : 0) - cur) * (isHov ? 0.14 : 0.05)
    material.uniforms.uActivation.value = Math.max(activationRef.current, highlightBoost)
    material.uniforms.uTime.value = t

    // ── Scale ──
    const baseScale = node.size * 2 * (0.75 + asm * 0.25)
    const hoverBump = activationRef.current * 0.4
    const focusBump = (node.id === focused) ? 0.3 : 0
    meshRef.current.scale.setScalar(baseScale * (1 + hoverBump + focusBump))
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
        setFocused(node.id)
        if (node.type === 'project') playProjectOpen()
        else playNodePing(node.layer)
      }}
    >
      <planeGeometry args={MOBILE ? [1.6, 1.6] : [1, 1]} />
    </mesh>
  )
}

function NodeLabel({ node }) {
  const hoveredNode    = useStore(s => s.hoveredNode)
  const focusedNode    = useStore(s => s.focusedNode)
  const scrollProgress = useStore(s => s.scrollProgress)
  const asm     = smoothstep(ASSEMBLE_START, ASSEMBLE_END, scrollProgress)
  const isHovered = hoveredNode === node.id
  const isFocused = focusedNode === node.id

  // Labels only appear once assembled
  if (asm < 0.3) return null

  const labelOpacity = smoothstep(0.3, 1.0, asm) * (isHovered || isFocused ? 1.0 : 0.85)

  // Input layer → label on left, Output/Exp → label on right, Hidden → label below
  const isInput  = node.layer === 0
  const isOutput = node.layer === 4 || node.layer === 5
  const offset   = node.size * 1.6

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
      color={isHovered || isFocused ? '#ffffff' : getNodeColor(node)}
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
