import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EDGES, NODES_WITH_POS, getNodeColor } from '../../data/network'
import useStore from '../../store/useStore'
import { useSignalSystem } from '../../hooks/useSignalSystem'
import { playSignalTick } from '../../hooks/useAudioEngine'

const nodeMap = {}
NODES_WITH_POS.forEach(n => { nodeMap[n.id] = n })

export default function SignalSystem() {
  // Kick off the signal logic (updates store)
  useSignalSystem()

  const signals  = useStore(s => s.signals)
  const pointsRef = useRef()

  const MAX = 35

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(MAX * 3)
    const colors    = new Float32Array(MAX * 4)
    const sizes     = new Float32Array(MAX)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    4).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1).setUsage(THREE.DynamicDrawUsage))

    const mat = new THREE.ShaderMaterial({
      vertexShader: /* glsl */`
        attribute float size;
        attribute vec4  color;
        varying   vec4  vColor;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPos.z);
          gl_Position  = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */`
        varying vec4 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float alpha = 1.0 - smoothstep(0.0, 1.0, d);
          alpha = pow(alpha, 1.6);
          gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      vertexColors: false,
    })

    return { geometry: geo, material: mat }
  }, [])

  useFrame(() => {
    if (!pointsRef.current) return
    const pos    = geometry.attributes.position.array
    const col    = geometry.attributes.color.array
    const sizes  = geometry.attributes.size.array
    const c      = new THREE.Color()
    if (signals.length > 0) playSignalTick()

    for (let i = 0; i < MAX; i++) {
      const sig = signals[i]
      if (!sig) {
        pos[i * 3] = pos[i * 3 + 1] = pos[i * 3 + 2] = 0
        col[i * 4 + 3] = 0
        sizes[i] = 0
        continue
      }

      const edge = EDGES[sig.edgeIdx]
      if (!edge) continue
      const from = nodeMap[edge.from]
      const to   = nodeMap[edge.to]
      if (!from || !to) continue

      // Interpolate position along edge
      const p = new THREE.Vector3().lerpVectors(from.position, to.position, sig.progress)
      pos[i * 3]     = p.x
      pos[i * 3 + 1] = p.y
      pos[i * 3 + 2] = p.z

      // Color: blend from source color → warm white → dest color
      const mid = Math.abs(sig.progress - 0.5) * 2
      c.set(getNodeColor(from)).lerp(new THREE.Color('#ffe9a0'), 1 - mid)
      c.lerp(new THREE.Color(getNodeColor(to)), sig.progress * 0.4)

      col[i * 4]     = c.r
      col[i * 4 + 1] = c.g
      col[i * 4 + 2] = c.b
      col[i * 4 + 3] = 0.9

      sizes[i] = 0.06
    }

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.color.needsUpdate    = true
    geometry.attributes.size.needsUpdate     = true
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
