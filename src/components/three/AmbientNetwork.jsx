/**
 * AmbientNetwork — a lightweight abstract neural network
 * that lives permanently in the background.
 * At scroll < 0.82 it's barely visible (z=-8, behind the main NN).
 * At scroll > 0.82 it brightens as the main NN fades out,
 * becoming the sole background for the contact section.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'

const NODE_COUNT  = 28
const EDGE_RADIUS = 2.8   // max distance for auto-connecting nearby nodes
const BG_Z        = -6    // behind the main NN

// Deterministic pseudo-random
const rng = (() => {
  let s = 999
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
})()

// Generate ambient nodes spread across the viewport
const BG_NODES = Array.from({ length: NODE_COUNT }, (_, i) => ({
  x:     (rng() - 0.5) * 22,
  y:     (rng() - 0.5) * 13,
  phase: rng() * Math.PI * 2,
  speed: 0.18 + rng() * 0.22,
  amp:   0.08 + rng() * 0.14,
  color: ['#1e3a6e', '#0d2d1a', '#1a1040', '#2a1020'][Math.floor(rng() * 4)],
}))

// Auto-connect nodes within EDGE_RADIUS
const BG_EDGES = []
for (let i = 0; i < NODE_COUNT; i++) {
  for (let j = i + 1; j < NODE_COUNT; j++) {
    const dx = BG_NODES[i].x - BG_NODES[j].x
    const dy = BG_NODES[i].y - BG_NODES[j].y
    if (Math.sqrt(dx * dx + dy * dy) < EDGE_RADIUS) {
      BG_EDGES.push([i, j])
    }
  }
}

export default function AmbientNetwork() {
  const nodePositions = useRef(BG_NODES.map(n => new THREE.Vector3(n.x, n.y, BG_Z)))
  const nodeMeshes    = useRef([])
  const lineMats      = useRef([])

  // Node geometry — small spheres
  const nodeGeo = useMemo(() => new THREE.CircleGeometry(0.12, 16), [])

  // Node materials
  const nodeMats = useMemo(() =>
    BG_NODES.map(n => new THREE.MeshBasicMaterial({
      color: n.color,
      transparent: true,
      opacity: 0,
    }))
  , [])

  // Edge geometries + materials
  const edgeData = useMemo(() =>
    BG_EDGES.map(([i, j]) => {
      const pts = [
        new THREE.Vector3(BG_NODES[i].x, BG_NODES[i].y, BG_Z),
        new THREE.Vector3(BG_NODES[j].x, BG_NODES[j].y, BG_Z),
      ]
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({
        color: '#0f1f3d',
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      })
      return { geo, mat }
    })
  , [])

  useFrame(({ clock }) => {
    const t      = clock.getElapsedTime()
    const nnFade = useStore.getState().nnFade
    // Ambient network is dim always, brightens when main NN fades
    const baseVis  = 0.08                          // always slightly visible
    const fadeBoost = nnFade * 0.55               // gets much brighter at contact
    const nodeVis  = baseVis + fadeBoost
    const edgeVis  = (baseVis * 0.5) + nnFade * 0.3

    // Float nodes
    BG_NODES.forEach((n, i) => {
      const ny = n.y + Math.sin(t * n.speed + n.phase) * n.amp
      const nx = n.x + Math.cos(t * n.speed * 0.7 + n.phase) * n.amp * 0.6
      nodePositions.current[i].set(nx, ny, BG_Z)
      if (nodeMeshes.current[i]) {
        nodeMeshes.current[i].position.set(nx, ny, BG_Z)
        nodeMeshes.current[i].material.opacity = nodeVis
      }
    })

    // Update edge endpoints to match floating nodes
    edgeData.forEach(({ geo, mat }, ei) => {
      const [i, j] = BG_EDGES[ei]
      const posArr = geo.attributes.position.array
      posArr[0] = nodePositions.current[i].x
      posArr[1] = nodePositions.current[i].y
      posArr[3] = nodePositions.current[j].x
      posArr[4] = nodePositions.current[j].y
      geo.attributes.position.needsUpdate = true
      mat.opacity = edgeVis
    })
  })

  return (
    <group>
      {BG_NODES.map((n, i) => (
        <mesh
          key={i}
          ref={el => { nodeMeshes.current[i] = el }}
          position={[n.x, n.y, BG_Z]}
          geometry={nodeGeo}
          material={nodeMats[i]}
        />
      ))}
      {edgeData.map((ed, i) => (
        <line key={i} geometry={ed.geo} material={ed.mat} frustumCulled={false} />
      ))}
    </group>
  )
}
