import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EDGES, NODES_WITH_POS } from '../data/network'
import useStore from '../store/useStore'

const MAX_SIGNALS = 35
const SIGNAL_SPEED = 0.38

let nextId = 0

// Build edge index lookup: nodeId → array of edge indices connected to that node
const nodeEdgeMap = {}
EDGES.forEach((edge, i) => {
  if (!nodeEdgeMap[edge.from]) nodeEdgeMap[edge.from] = []
  if (!nodeEdgeMap[edge.to])   nodeEdgeMap[edge.to]   = []
  nodeEdgeMap[edge.from].push(i)
  nodeEdgeMap[edge.to].push(i)
})

export function useSignalSystem() {
  const signalsRef     = useRef([])
  const timerRef       = useRef(0)
  const focusTimerRef  = useRef(0)
  const prevFocusRef   = useRef(null)
  const setSignals     = useStore(s => s.setSignals)

  // Spawn a new random signal
  const spawnSignal = (edgeIdx) => {
    if (signalsRef.current.length >= MAX_SIGNALS) return
    const idx = edgeIdx ?? Math.floor(Math.random() * EDGES.length)
    signalsRef.current.push({
      id: nextId++,
      edgeIdx: idx,
      progress: 0,
      active: true,
    })
  }

  // Spawn burst of signals along all edges connected to a node
  const spawnFocusBurst = (nodeId) => {
    const edgeIndices = nodeEdgeMap[nodeId] ?? []
    edgeIndices.forEach((idx, i) => {
      // Stagger slightly
      setTimeout(() => spawnSignal(idx), i * 60)
    })
  }

  // Spawn first batch
  useEffect(() => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => spawnSignal(), i * 180)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    timerRef.current += delta
    focusTimerRef.current += delta

    const focused = useStore.getState().focusedNode

    // Detect focus change — fire burst
    if (focused !== prevFocusRef.current) {
      prevFocusRef.current = focused
      if (focused) {
        spawnFocusBurst(focused)
      }
    }

    // Keep firing signals along focused node's edges periodically
    if (focused && focusTimerRef.current > 0.8) {
      focusTimerRef.current = 0
      const edgeIndices = nodeEdgeMap[focused] ?? []
      if (edgeIndices.length > 0) {
        const idx = edgeIndices[Math.floor(Math.random() * edgeIndices.length)]
        spawnSignal(idx)
      }
    }

    // Ambient signals (slower when focused)
    const ambientInterval = focused ? 0.8 + Math.random() * 0.6 : 0.3 + Math.random() * 0.4
    if (timerRef.current > ambientInterval) {
      timerRef.current = 0
      spawnSignal()
    }

    // Advance all signals
    let changed = false
    const next = signalsRef.current
      .map(sig => {
        const newProg = sig.progress + delta * SIGNAL_SPEED
        if (newProg >= 1.0) {
          changed = true
          return null
        }
        if (sig.progress !== newProg) changed = true
        return { ...sig, progress: newProg }
      })
      .filter(Boolean)

    signalsRef.current = next
    if (changed) setSignals([...next])
  })
}

export function useEdgeSignals(edgeIdx) {
  return useStore(s => s.signals.filter(sig => sig.edgeIdx === edgeIdx))
}
