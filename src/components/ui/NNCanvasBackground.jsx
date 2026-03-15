import { useEffect, useRef } from 'react'

// Match the 3D NN colors exactly
const LAYER_COLORS_FULL = [
  [96,  165, 250],   // blue   — input
  [16,  217, 160],   // teal   — frontend
  [249, 115,  22],   // orange — backend
  [139,  92, 246],   // purple — AI/ML
  [244,  63, 148],   // pink   — output
]
const LAYER_COLORS_SIMPLE = LAYER_COLORS_FULL.map(() => [96, 165, 250])

const LAYERS      = [7, 5, 5, 5, 3]
const MAX_SIGNALS = 15
const FPS         = 24
const FRAME_MS    = 1000 / FPS
const NODE_R      = 11   // visual radius of stamp

function rgba([r, g, b], a) { return `rgba(${r},${g},${b},${a.toFixed(2)})` }

// Pre-render a spherical glowing node stamp onto a small offscreen canvas
function makeNodeStamp(color, radius) {
  const size = radius * 4
  const c    = document.createElement('canvas')
  c.width    = size
  c.height   = size
  const ctx  = c.getContext('2d')
  const cx   = size / 2

  // Outer soft glow
  const glow = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  glow.addColorStop(0,   rgba(color, 0.20))
  glow.addColorStop(0.5, rgba(color, 0.07))
  glow.addColorStop(1,   rgba(color, 0))
  ctx.beginPath()
  ctx.arc(cx, cx, cx, 0, Math.PI * 2)
  ctx.fillStyle = glow
  ctx.fill()

  // Inner sphere gradient (3D look — bright top-left, dark bottom-right)
  const sphere = ctx.createRadialGradient(cx * 0.65, cx * 0.6, 0, cx, cx, radius)
  sphere.addColorStop(0,   rgba(color, 1.0))
  sphere.addColorStop(0.4, rgba(color, 0.85))
  sphere.addColorStop(0.8, rgba(color, 0.55))
  sphere.addColorStop(1,   rgba(color, 0.15))
  ctx.beginPath()
  ctx.arc(cx, cx, radius, 0, Math.PI * 2)
  ctx.fillStyle = sphere
  ctx.fill()

  // Bright ring
  ctx.beginPath()
  ctx.arc(cx, cx, radius, 0, Math.PI * 2)
  ctx.strokeStyle = rgba(color, 0.7)
  ctx.lineWidth   = 1.2
  ctx.stroke()

  return c
}

export default function NNCanvasBackground({ simple = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const COLORS = simple ? LAYER_COLORS_SIMPLE : LAYER_COLORS_FULL

    const offscreen = document.createElement('canvas')  // static edges
    const octx      = offscreen.getContext('2d')
    let stamps      = []   // pre-rendered node images per layer

    let animId, lastTime = 0, frameCount = 0
    let signals = [], nodes = [], edges = []

    function buildLayout() {
      const W = canvas.width
      const H = canvas.height
      offscreen.width  = W
      offscreen.height = H

      const px      = W * 0.07
      const span    = W - px * 2
      const paddingY = H * 0.07
      const maxNodes = Math.max(...LAYERS)
      const gap      = (H - paddingY * 2) / (maxNodes - 1)

      // Pre-render stamps (one per layer color)
      stamps = COLORS.map(c => makeNodeStamp(c, NODE_R))

      nodes = []
      LAYERS.forEach((count, li) => {
        const x  = px + li * (span / (LAYERS.length - 1))
        const th = (count - 1) * gap
        const sy = H / 2 - th / 2   // still center each column vertically within full spread
        for (let i = 0; i < count; i++) {
          nodes.push({
            x, y: sy + i * gap,
            layer: li,
            color: COLORS[li],
            stamp: stamps[li],
            phase: Math.random() * Math.PI * 2,
          })
        }
      })

      // Build all edges — adjacent + skip-1 + skip-2 for dense web
      edges = []
      for (let l = 0; l < LAYERS.length - 1; l++) {
        const from = nodes.filter(n => n.layer === l)
        const to   = nodes.filter(n => n.layer === l + 1)
        from.forEach(f => to.forEach(t =>
          edges.push({ from: f, to: t, color: f.color })
        ))
      }
      // Skip-1 connections
      for (let l = 0; l < LAYERS.length - 2; l++) {
        const from = nodes.filter(n => n.layer === l)
        const to   = nodes.filter(n => n.layer === l + 2)
        from.forEach(f => to.forEach(t =>
          edges.push({ from: f, to: t, color: f.color, skip: true })
        ))
      }

      // Draw ALL edges to offscreen canvas once
      octx.clearRect(0, 0, W, H)

      // Batch by color
      const groups = {}
      edges.forEach(e => {
        const k = e.color.join()
        if (!groups[k]) groups[k] = { color: e.color, adj: [], skip: [] }
        if (e.skip) groups[k].skip.push(e)
        else        groups[k].adj.push(e)
      })

      Object.values(groups).forEach(({ color, adj, skip }) => {
        // Adjacent edges
        if (adj.length) {
          octx.beginPath()
          octx.strokeStyle = rgba(color, 0.22)
          octx.lineWidth   = 1.0
          adj.forEach(({ from, to }) => { octx.moveTo(from.x, from.y); octx.lineTo(to.x, to.y) })
          octx.stroke()
        }
        // Skip edges
        if (skip.length) {
          octx.beginPath()
          octx.strokeStyle = rgba(color, 0.12)
          octx.lineWidth   = 0.7
          skip.forEach(({ from, to }) => { octx.moveTo(from.x, from.y); octx.lineTo(to.x, to.y) })
          octx.stroke()
        }
      })
    }

    function resize() {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
      signals = []
      buildLayout()
    }

    function spawnSignal() {
      if (!edges.length) return
      // Prefer adjacent edges for signals
      const pool = edges.filter(e => !e.skip)
      const e    = pool[Math.floor(Math.random() * pool.length)]
      signals.push({ edge: e, p: 0, speed: 0.003 + Math.random() * 0.004, color: e.color })
    }

    function draw(ts) {
      animId = requestAnimationFrame(draw)
      if (ts - lastTime < FRAME_MS) return
      lastTime = ts
      frameCount++

      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Blit pre-drawn edge layer
      ctx.drawImage(offscreen, 0, 0)

      // Spawn signals
      if (signals.length < MAX_SIGNALS && Math.random() < 0.28) spawnSignal()
      signals = signals.filter(s => s.p < 1)

      // Draw signals — flat colors, no gradients
      signals.forEach(s => {
        s.p = Math.min(1, s.p + s.speed)
        const { from, to } = s.edge
        const x  = from.x + (to.x - from.x) * s.p
        const y  = from.y + (to.y - from.y) * s.p
        const p0 = Math.max(0, s.p - 0.09)
        const tx = from.x + (to.x - from.x) * p0
        const ty = from.y + (to.y - from.y) * p0

        // Trail
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(x, y)
        ctx.strokeStyle = rgba(s.color, 0.6)
        ctx.lineWidth   = 1.6
        ctx.stroke()

        // Head
        ctx.beginPath()
        ctx.arc(x, y, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = rgba(s.color, 1)
        ctx.fill()
      })

      // Draw nodes using pre-rendered stamps (drawImage = very fast)
      nodes.forEach(n => {
        const pulse = 0.72 + 0.28 * Math.sin(frameCount * 0.025 + n.phase)
        const s     = n.stamp
        const half  = s.width / 2
        ctx.globalAlpha = pulse
        ctx.drawImage(s, n.x - half, n.y - half)
        ctx.globalAlpha = 1
      })
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [simple])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
