# Neural Network Portfolio — Full Plan

## Concept
The entire website IS a living neural network. No hero image, no hero text, no generic sections.
The network IS the UI. Every node holds content. Signals fire constantly between nodes.
You navigate by scrolling through the network — camera drifts layer by layer.

---

## Network Architecture

```
INPUT LAYER (Layer 0) — Who You Are
├── Node: Meet Vaghani — Full Stack Developer
├── Node: PDEU · B.Tech Computer Engineering (2021–2025)
├── Node: Ahmedabad, India
└── Node: Open to Opportunities

HIDDEN LAYER 1 (Layer 1) — Frontend Skills
├── React.js
├── Next.js
├── Three.js / WebGL
├── Tailwind CSS
├── TypeScript
└── Framer Motion

HIDDEN LAYER 2 (Layer 2) — Backend Skills
├── Node.js
├── Express.js
├── Python
├── PostgreSQL / MongoDB
├── REST APIs
└── WebSockets (real-time)

HIDDEN LAYER 3 (Layer 3) — AI / ML Layer
├── LLMs / OpenAI API
├── LangChain
├── Vector Databases
├── AI Pipelines
└── Machine Learning

OUTPUT LAYER (Layer 4) — Projects
├── VaghaniGPT     ← LLMs + Next.js + Node.js
├── Vedrix         ← React + Node.js + AI
├── AnveshaCode    ← React + AI + APIs
├── HomePraise     ← Next.js + Backend + DB
├── Eventopia      ← Full Stack (React + Node)
└── FinLink        ← Backend + AI + APIs
```

---

## Visual Design

### Color Palette
- Background: `#020510` — deep space black
- Input nodes: `#60a5fa` — electric blue
- Frontend nodes: `#34d399` — emerald green
- Backend nodes: `#f59e0b` — warm amber
- AI/ML nodes: `#a78bfa` — soft purple
- Project nodes: `#f472b6` — hot pink
- Signals: gradient along path (blue → white → gold)
- Edges: `rgba(255,255,255,0.04)` — barely visible threads

### Post-Processing Stack
1. **UnrealBloomPass** — nodes + signals bleed light into dark background
2. **ChromaticAberrationEffect** — subtle RGB split at screen edges
3. **VignetteEffect** — darkens corners, pulls focus to center
4. **NoiseEffect** — fine film grain, makes it feel analog/alive

---

## Animations

### Idle (always on)
- 20–40 signals traveling along edges simultaneously
- Each signal: glowing particle moving from node A → B along edge path
- Signal color: starts at source node color, fades to white/gold at destination
- Each node pulses softly with a sin wave even when idle
- Signal interval: random 200–800ms, random path through network

### Load Sequence
```
0.0s — Black screen, single point of light at center
0.5s — Point explodes outward, Input layer nodes appear
1.0s — Edges draw themselves outward (like dendrites growing)
2.0s — Hidden layers materialize layer by layer
3.0s — First signals start firing
3.5s — "INITIALIZING NEURAL NETWORK..." text fades in then out
4.0s — UI overlay (nav, scroll hint) fades in
```

### Cursor Interaction
- Cursor position → raycasted to 3D world coordinates
- Nodes within radius 2.0 → gently pulled toward cursor
- Nodes within radius 0.5 → full activation (bright glow, scale 1.3x)
- Activated node → fires cascade signals to all connected nodes
- Cascade spreads 2–3 layers deep before dampening

### Hover on Skill Node
- Node scales up + glows fully
- All edges FROM this node highlight (brighter, thicker)
- Downstream connected nodes partially glow
- Tooltip appears: skill name + proficiency bar
- "Reasoning paths" visible: you can see which projects use this skill

### Click on Project Node
- Node fully activates with burst animation
- Floating glassmorphism card appears anchored to node
- Card shows: project name, description, tech stack tags, GitHub + Demo links
- Thin glowing tether line connects card to node
- Click elsewhere → card dismisses with spring animation

### Scroll Camera
```
0%   → Camera at Input layer, slight tilt, close to nodes
20%  → Camera pulls back revealing full network depth
40%  → Camera rotates, faces Hidden layers 1+2 (skills)
60%  → Camera drifts to Hidden layer 3 (AI/ML cluster)
80%  → Camera reaches Output layer (projects glow brighter)
100% → Camera at bird's-eye view, all nodes visible, contact UI
```

---

## GLSL Shaders

### Node Shader
Each node is an instanced sphere with a custom fragment shader:
- Pulsing core: `sin(time * 3.0) * 0.5 + 0.5`
- Inner glow: `1.0 - smoothstep(0.0, 0.5, dist_from_center)`
- Outer corona: appears only when `activation > 0`
- White flash on activation event
- Color driven by `uColor` uniform (per layer)

### Edge Shader
Edges are `BufferGeometry` line segments:
- Base color: barely visible `rgba(255,255,255,0.04)`
- Active signal: bright moving glow along `vProgress` (0→1 along edge)
- Signal glow: `exp(-distToSignal * 20.0)` falloff
- Color gradient: source node color → gold at destination

---

## File Structure
```
src/
  data/
    network.js      ← nodes[] and edges[] arrays (THE MAP)
    projects.js     ← project details (description, tags, links)
    skills.js       ← skills grouped by category + level
    experience.js   ← work experience entries
    education.js    ← education entries
    contact.js      ← email, social links
    hero.js         ← name, title, tagline

  components/
    three/
      NeuralNetwork.jsx   ← master scene, composes all 3D
      NodeInstances.jsx   ← InstancedMesh for all nodes
      EdgeSystem.jsx      ← BufferGeometry for all edges
      SignalSystem.jsx    ← GPU particle signals
      CameraRig.jsx       ← scroll-driven camera movement
      PostFX.jsx          ← bloom + chromatic aberration

    ui/
      ProjectCard.jsx     ← floating glassmorphism card
      SkillTooltip.jsx    ← hover tooltip on skill nodes
      NavBar.jsx          ← minimal fixed nav
      LoadingScreen.jsx   ← boot-up animation overlay
      ContactSection.jsx  ← final section overlay

  shaders/
    node.js       ← node vert + frag GLSL strings
    edge.js       ← edge vert + frag GLSL strings

  hooks/
    useSignalSystem.js    ← manages signal state + timing
    useScrollCamera.js    ← maps scroll to camera waypoints
    useNodeActivation.js  ← raycasting + activation state

  store/
    useStore.js   ← Zustand: activeNode, signals[], scrollProgress
```

---

## Build Phases

### Phase 1 — Foundation ✅ (setup)
- [ ] Vite + React project scaffold
- [ ] Install all dependencies
- [ ] Tailwind CSS v4 config
- [ ] Basic Canvas with R3F + dark background

### Phase 2 — Static Network
- [ ] `data/network.js` — nodes and edges data
- [ ] `NodeInstances.jsx` — render all nodes as InstancedMesh
- [ ] `EdgeSystem.jsx` — render all edges as BufferGeometry lines
- [ ] Basic node glow shader

### Phase 3 — Animations
- [ ] Signal particle system (signals travel along edges)
- [ ] Idle random signal firing loop
- [ ] Node activation on hover (raycasting)
- [ ] Cascade activation effect

### Phase 4 — Camera + Scroll
- [ ] GSAP ScrollTrigger setup
- [ ] Camera waypoints per scroll %
- [ ] Smooth camera interpolation
- [ ] Post-processing (bloom, chromatic aberration)

### Phase 5 — UI Overlay
- [ ] Project card component
- [ ] Skill tooltip component
- [ ] Loading screen animation
- [ ] Navigation bar
- [ ] Contact section

### Phase 6 — Polish
- [ ] Load sequence animation
- [ ] Film grain + vignette
- [ ] Sound design (optional)
- [ ] Mobile fallback
- [ ] Performance optimization

---

## Data to Replace (Dummy → Real)
When Meet is ready to add real data, update these files in `src/data/`:

| File | What to Replace |
|------|----------------|
| `hero.js` | Name, title, tagline |
| `skills.js` | Real tech stack + proficiency |
| `projects.js` | Vedrix, AnveshaCode, HomePraise, Eventopia, VaghaniGPT, FinLink details |
| `experience.js` | Real internships/jobs |
| `education.js` | PDEU + BAPS details |
| `contact.js` | Real email, GitHub, LinkedIn, Twitter |
| `network.js` | Real node-to-project connections |

---

## Reference: Meet's Real Data (from current portfolio)
- **Name**: Meet Vaghani
- **Role**: Full Stack Developer
- **Education**: B.Tech Computer Engineering, PDEU (2021–2025)
- **Prior**: BAPS Swaminarayan Vidyamandir (2018–2021)
- **Projects**: Vedrix, AnveshaCode, HomePraise, Eventopia, VaghaniGPT, FinLink
- **LinkedIn**: linkedin.com/in/meet-vaghani-422a78224
- **Interests**: Web dev, Machine Learning, Scalable AI apps, LLMs, Real-time systems
