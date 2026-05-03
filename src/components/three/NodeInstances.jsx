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
const ASSEMBLE_START = 0.08
const ASSEMBLE_END   = 0.28

// Reusable color constants — never allocate inside useFrame
const WHITE_COLOR = new THREE.Color('#ffffff')
const GREY_COLOR  = new THREE.Color(0.08, 0.10, 0.18)  // muted dark-blue grey for dimmed nodes

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

    // ── Position: scatter → organized ──
    const scatter = node.scatterPosition
    const target  = node.position
    const floatY  = Math.sin(t * 0.4 + (node.scatterPhase ?? 0)) * 0.12
    const floatX  = Math.cos(t * 0.3 + (node.scatterPhase ?? 0) * 1.3) * 0.08
    let x = scatter.x + floatX + (target.x - scatter.x - floatX) * asm
    let y = scatter.y + floatY + (target.y - scatter.y - floatY) * asm
    let z = scatter.z           + (target.z - scatter.z)          * asm

    // ── Convergence ──
    const layerDelay = node.layer * 0.08
    const convergeT  = Math.max(0, Math.min(1, (nnFade - layerDelay) / (1 - layerDelay + 0.01)))
    const ct = convergeT * convergeT * (3 - 2 * convergeT)
    x = x + (0 - x) * ct
    y = y + (0 - y) * ct
    z = z + (0 - z) * ct * 0.6
    meshRef.current.position.set(x, y, z)

    // ── Color: blue → layer color → white (convergence) ──
    currentColor.copy(heroColor).lerp(targetColor, asm)
    currentColor.lerp(WHITE_COLOR, ct * 0.7)

    // ── Section-aware dimming ──────────────────────────────────────────────────
    // Each content section highlights its relevant layers; others fade to near-grey.
    // Dimming fades IN before the panel slides in (intro moment) and OUT as it exits.
    const skillsDim = smoothstep(0.11, 0.24, p) * (1 - smoothstep(0.40, 0.46, p))
    const expDim    = smoothstep(0.44, 0.54, p) * (1 - smoothstep(0.65, 0.71, p))
    const projDim   = smoothstep(0.69, 0.77, p) * (1 - smoothstep(0.85, 0.90, p))

    const isSkillNode = node.layer === 1 || node.layer === 2 || node.layer === 3
    const isExpNode   = node.layer === 0 || node.layer === 5
    const isProjNode  = node.layer === 4

    let dimT           = 0
    let highlightBoost = 0
    if (!isSkillNode) dimT = Math.max(dimT, skillsDim)
    else              highlightBoost = Math.max(highlightBoost, skillsDim * 0.35)
    if (!isExpNode)   dimT = Math.max(dimT, expDim)
    else              highlightBoost = Math.max(highlightBoost, expDim * 0.35)
    if (!isProjNode)  dimT = Math.max(dimT, projDim)
    else              highlightBoost = Math.max(highlightBoost, projDim * 0.35)

    // Shift dimmed nodes toward a muted grey-blue
    if (dimT > 0) currentColor.lerp(GREY_COLOR, dimT * 0.80)
    material.uniforms.uColor.value.copy(currentColor)

    // ── Opacity / visibility ──
    const dimmedVisible = visible * (1 - dimT * 0.85)
    material.opacity = dimmedVisible
    meshRef.current.visible = dimmedVisible > 0.01

    // ── Activation: hover + convergence spike + highlight boost ──
    const isHov = useStore.getState().hoveredNode === node.id
    const cur   = activationRef.current
    activationRef.current = cur + ((isHov ? 1 : 0) - cur) * (isHov ? 0.14 : 0.05)
    material.uniforms.uActivation.value = Math.max(activationRef.current, ct * 1.2, highlightBoost) * visible
    material.uniforms.uTime.value = t

    // ── Scale ──
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
