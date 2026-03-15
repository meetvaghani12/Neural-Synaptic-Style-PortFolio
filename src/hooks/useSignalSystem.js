import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EDGES, NODES_WITH_POS } from '../data/network'
import useStore from '../store/useStore'

const MAX_SIGNALS = 35
const SIGNAL_SPEED = 0.38 // units per second along edge (0→1)

let nextId = 0

export function useSignalSystem() {
  const signalsRef = useRef([])
  const timerRef   = useRef(0)
  const setSignals = useStore(s => s.setSignals)

  // Spawn a new random signal on the network
  const spawnSignal = () => {
    if (signalsRef.current.length >= MAX_SIGNALS) return
    const edgeIdx = Math.floor(Math.random() * EDGES.length)
    signalsRef.current.push({
      id: nextId++,
      edgeIdx,
      progress: 0,
      active: true,
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

    // Spawn new signal every 300–700ms
    if (timerRef.current > 0.3 + Math.random() * 0.4) {
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
          return null // remove
        }
        if (sig.progress !== newProg) changed = true
        return { ...sig, progress: newProg }
      })
      .filter(Boolean)

    signalsRef.current = next
    if (changed) setSignals([...next])
  })
}

// Returns signals relevant to a specific edge index
export function useEdgeSignals(edgeIdx) {
  return useStore(s => s.signals.filter(sig => sig.edgeIdx === edgeIdx))
}
