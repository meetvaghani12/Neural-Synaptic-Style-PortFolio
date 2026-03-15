import * as THREE from 'three'

// ── Layer layout ──────────────────────────────────────────────────────────────
// Classic NN: layers spread on X axis, nodes spread on Y axis, all at Z=0
const LAYER_X   = { 0: -7, 1: -3.5, 2: 0, 3: 3.5, 4: 7 }
const NODE_SIZE = 0.34
const Y_SPACING = 2.0    // enough room for label below each node without overlap

export const LAYER_COLORS = {
  0: '#5b8dee', // blue   — input
  1: '#34d399', // green  — hidden 1 (frontend)
  2: '#f59e0b', // amber  — hidden 2 (backend)
  3: '#a78bfa', // purple — hidden 3 (AI/ML)
  4: '#f472b6', // pink   — output (projects)
}

export const LAYER_LABELS = {
  0: 'Input',
  1: 'Hidden 1',
  2: 'Hidden 2',
  3: 'Hidden 3',
  4: 'Output',
}

// ── Node definitions ──────────────────────────────────────────────────────────
export const NODES = [
  // Input layer (4 nodes)
  { id: 'meet',     label: 'Meet Vaghani',  layer: 0, type: 'identity',  size: NODE_SIZE + 0.06 },
  { id: 'role',     label: 'Full Stack Dev',layer: 0, type: 'identity',  size: NODE_SIZE },
  { id: 'pdeu',     label: 'PDEU',          layer: 0, type: 'education', size: NODE_SIZE },
  { id: 'location', label: 'India',         layer: 0, type: 'identity',  size: NODE_SIZE - 0.04 },

  // Hidden Layer 1 — Frontend (5 nodes)
  { id: 'react',      label: 'React.js',    layer: 1, type: 'skill', skillGroup: 'frontend', size: NODE_SIZE },
  { id: 'nextjs',     label: 'Next.js',     layer: 1, type: 'skill', skillGroup: 'frontend', size: NODE_SIZE },
  { id: 'typescript', label: 'TypeScript',  layer: 1, type: 'skill', skillGroup: 'frontend', size: NODE_SIZE },
  { id: 'tailwind',   label: 'Tailwind',    layer: 1, type: 'skill', skillGroup: 'frontend', size: NODE_SIZE },
  { id: 'threejs',    label: 'Three.js',    layer: 1, type: 'skill', skillGroup: 'frontend', size: NODE_SIZE },

  // Hidden Layer 2 — Backend (5 nodes)
  { id: 'nodejs',    label: 'Node.js',    layer: 2, type: 'skill', skillGroup: 'backend', size: NODE_SIZE },
  { id: 'express',   label: 'Express',    layer: 2, type: 'skill', skillGroup: 'backend', size: NODE_SIZE },
  { id: 'python',    label: 'Python',     layer: 2, type: 'skill', skillGroup: 'backend', size: NODE_SIZE },
  { id: 'postgres',  label: 'PostgreSQL', layer: 2, type: 'skill', skillGroup: 'backend', size: NODE_SIZE },
  { id: 'mongodb',   label: 'MongoDB',    layer: 2, type: 'skill', skillGroup: 'backend', size: NODE_SIZE },

  // Hidden Layer 3 — AI/ML (4 nodes)
  { id: 'llm',       label: 'LLMs',           layer: 3, type: 'skill', skillGroup: 'ai', size: NODE_SIZE + 0.04 },
  { id: 'langchain', label: 'LangChain',      layer: 3, type: 'skill', skillGroup: 'ai', size: NODE_SIZE },
  { id: 'vectordb',  label: 'Vector DBs',     layer: 3, type: 'skill', skillGroup: 'ai', size: NODE_SIZE },
  { id: 'ml',        label: 'ML',             layer: 3, type: 'skill', skillGroup: 'ai', size: NODE_SIZE },

  // Output layer — Projects (6 nodes)
  { id: 'vaghanigpt',  label: 'VaghaniGPT',  layer: 4, type: 'project', size: NODE_SIZE + 0.04 },
  { id: 'vedrix',      label: 'Vedrix',      layer: 4, type: 'project', size: NODE_SIZE },
  { id: 'anveshacode', label: 'AnveshaCode', layer: 4, type: 'project', size: NODE_SIZE },
  { id: 'homepraise',  label: 'HomePraise',  layer: 4, type: 'project', size: NODE_SIZE },
  { id: 'eventopia',   label: 'Eventopia',   layer: 4, type: 'project', size: NODE_SIZE },
  { id: 'finlink',     label: 'FinLink',     layer: 4, type: 'project', size: NODE_SIZE },
]

// ── Assign grid positions (organised NN layout) ───────────────────────────────
function assignGridPositions(nodes) {
  const byLayer = {}
  nodes.forEach(n => {
    if (!byLayer[n.layer]) byLayer[n.layer] = []
    byLayer[n.layer].push(n)
  })
  Object.entries(byLayer).forEach(([layer, layerNodes]) => {
    const count  = layerNodes.length
    const totalH = (count - 1) * Y_SPACING
    layerNodes.forEach((node, i) => {
      node.position = new THREE.Vector3(
        LAYER_X[layer],
        totalH / 2 - i * Y_SPACING,
        0
      )
    })
  })
  return nodes
}

// ── Assign scatter positions (hero BG) ───────────────────────────────────────
const rng = (() => {
  let s = 137
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
})()

function assignScatterPositions(nodes) {
  nodes.forEach(node => {
    node.scatterPosition = new THREE.Vector3(
      (rng() - 0.5) * 20,
      (rng() - 0.5) * 10,
      (rng() - 0.5) * 2
    )
    node.scatterPhase = rng() * Math.PI * 2
  })
  return nodes
}

export const NODES_WITH_POS = assignScatterPositions(assignGridPositions([...NODES]))

// ── Edges: fully connected between adjacent layers ────────────────────────────
export const EDGES = []
const byLayer = {}
NODES_WITH_POS.forEach(n => {
  if (!byLayer[n.layer]) byLayer[n.layer] = []
  byLayer[n.layer].push(n)
})

for (let l = 0; l < 4; l++) {
  const from = byLayer[l]   ?? []
  const to   = byLayer[l+1] ?? []
  from.forEach(f => to.forEach(t => {
    EDGES.push({ from: f.id, to: t.id })
  }))
}

export const getNode      = (id) => NODES_WITH_POS.find(n => n.id === id)
export const getNodeColor = (node) => LAYER_COLORS[node.layer] ?? '#ffffff'
