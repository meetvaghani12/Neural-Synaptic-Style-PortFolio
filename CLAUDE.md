# Neural Network Portfolio — CLAUDE.md

## Project Overview
This is Meet Vaghani's personal portfolio website built as an **interactive 3D neural network**.
The entire UI IS the neural network — not a decoration, but the actual navigation system.
Every node = a piece of content (skill, project, experience). Signals travel between them in real time.

## Tech Stack
- **Framework**: Vite + React 19
- **3D Engine**: Three.js + React Three Fiber (@react-three/fiber)
- **3D Helpers**: @react-three/drei
- **Post-processing**: @react-three/postprocessing
- **Scroll Animation**: GSAP + ScrollTrigger
- **Spring Physics**: react-spring (card pop-ins)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Shaders**: Custom GLSL (inline in JS files)
- **Build**: Vite

## Project Structure
```
src/
  data/           ← ALL portfolio content lives here (edit this to update site)
    network.js    ← nodes and edges definition
    projects.js   ← project details
    skills.js     ← skills by category
    experience.js ← work experience
    education.js  ← education entries
    contact.js    ← contact info and social links
    hero.js       ← name, title, tagline

  components/
    three/        ← all 3D/WebGL components
    ui/           ← HTML overlay components (cards, nav, loader)

  shaders/        ← GLSL shader strings
    node.js       ← pulsing glow sphere shader
    edge.js       ← faint connection tube with signal shader
    signal.js     ← traveling particle shader

  hooks/          ← custom React hooks
    useSignalSystem.js    ← fires random signals on interval
    useScrollCamera.js    ← maps scroll % to camera waypoints
    useNodeActivation.js  ← tracks hovered/active nodes

  store/
    useStore.js   ← global Zustand state
```

## Key Rules
- **Never hardcode content** in components — always import from `src/data/`
- **Dummy data** is in all data files until the user fills in real info
- All data files have clear comments indicating what to replace
- Keep shaders as JS template literals, not separate `.glsl` files (Vite compatibility)
- Use `InstancedMesh` for nodes — never individual meshes (performance)
- Use `BufferGeometry` for edges — never individual line objects
- Signals are GPU particles via `Points` + shader, not individual `Mesh` objects

## Color System
| Layer | Type | Color |
|-------|------|-------|
| Input (Layer 0) | Identity / Bio | `#60a5fa` (blue) |
| Hidden 1 | Frontend skills | `#34d399` (green) |
| Hidden 2 | Backend skills | `#f59e0b` (amber) |
| Hidden 3 | AI/ML skills | `#a78bfa` (purple) |
| Output | Projects | `#f472b6` (pink) |
| Background | Scene | `#020510` (near black) |
| Bloom | Post-FX | drives from node color |

## Performance Rules
- Target 60fps on mid-range laptops
- Bloom pass only — no SSR, no heavy raymarching
- Mobile: reduce node count by 50%, disable bloom, use simpler shaders
- Max simultaneous active signals: 40
- Use `useFrame` with delta time for all animations — never `setInterval`

## Animation Philosophy
- The network is ALWAYS alive — signals never stop firing
- Interaction should feel like you're disturbing a living system
- No jarring snaps — everything springs/eases
- Scroll drives camera through the network (GSAP ScrollTrigger)
- Post-processing: Bloom + subtle chromatic aberration + film grain

## Scroll Journey
| Scroll % | Camera Position | What's Visible |
|----------|----------------|----------------|
| 0% | Inside Input layer, close up | Hero — name, title |
| 20% | Pull back, full network visible | Overview |
| 40% | Face Hidden layers 1+2 | Skills |
| 60% | Hidden layer 3 (AI/ML) | AI skills |
| 80% | Output layer | Projects |
| 100% | Bird's-eye full network | Contact |
