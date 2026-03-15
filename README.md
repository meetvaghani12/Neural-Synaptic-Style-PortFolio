<div align="center">

# 🧠 Neural Synaptic Portfolio

### *The portfolio that thinks — because it IS a neural network*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-neural--portfolio-blueviolet?style=for-the-badge&logo=vercel&logoColor=white)](https://neural-synaptic-style-port-folio-2i.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-black?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 🔍 What is this?

Most portfolios **have** a decoration in the background.

This portfolio **is** the decoration.

Every node you see rendered in 3D WebGL is a real piece of content — a skill, a project, a bio fact, a career milestone. Electrical signals race between them in real time. You scroll through the network like a camera travelling through a living brain: entering the **Identity layer**, pulling back through **Frontend** and **Backend** skill layers, diving into the **AI/ML** hidden layer, and arriving at the **Output layer** of shipped projects.

The UI is not built *on top of* a neural network. The UI **IS** the neural network.

---

## ✨ Features

- 🌐 **Fully 3D Neural Network** — the entire portfolio is rendered as a real WebGL neural graph using Three.js + React Three Fiber, with layered nodes and GPU-accelerated signal particles
- 🎞️ **Scroll-Driven Camera Journey** — GSAP ScrollTrigger maps your scroll percentage to precise camera waypoints through the network, from the Input layer all the way to the Output layer
- ⚡ **Live Signal Animations** — traveling particles fire continuously between nodes via custom GLSL shaders; the network is always alive, never static
- 🃏 **HUD-Style Node Cards** — click any node to spring-animate a sci-fi heads-up-display card with identity, role, education, and location data
- 🌸 **Bloom + Post-Processing** — selective bloom glow, subtle chromatic aberration, and film grain via `@react-three/postprocessing`
- 🎨 **Semantic Color Layers** — each network layer has a distinct color (`#60a5fa` Input → `#34d399` Frontend → `#f59e0b` Backend → `#a78bfa` AI/ML → `#f472b6` Output)
- ⚙️ **GPU-Optimized Rendering** — `InstancedMesh` for nodes, `BufferGeometry` for edges, `Points` + shaders for signals; targets 60 fps on mid-range laptops
- 📱 **Mobile-Adaptive** — automatically reduces node count, disables bloom, and simplifies shaders on mobile
- 🗂️ **Data-Driven Architecture** — all portfolio content lives in `src/data/`; update your projects, skills, and experience without touching a single component

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Build Tool | Vite | 6 |
| 3D Engine | Three.js | 0.183 |
| WebGL React Bindings | React Three Fiber | 9 |
| 3D Helpers & Controls | @react-three/drei | 10 |
| Post-Processing | @react-three/postprocessing | latest |
| Scroll Animation | GSAP + ScrollTrigger | 3.14 |
| Spring Physics | react-spring / @react-spring/three | 9.7 |
| Global State | Zustand | 5 |
| Styling | Tailwind CSS | v4 |
| Shaders | Custom GLSL (inline JS template literals) | — |
| Deployment | Vercel | — |

---

## 🖼️ Screenshots

> Click the banner below to visit the live site.

[![Neural Portfolio](https://neural-synaptic-style-port-folio-2i.vercel.app)](https://neural-synaptic-style-port-folio-2i.vercel.app)

| | |
|---|---|
| ![Home Page - Neural Network Assembly](./screenshots/home.png) | ![Node Card - HUD Style](./screenshots/node-card.png) |
| *Hero — entering the Input layer* | *HUD identity card on node click* |
| ![Projects Layer](./screenshots/projects.png) | ![Contact Page - Signal Complete](./screenshots/contact.png) |
| *Output layer — shipped projects* | *Bird's-eye full network — Contact* |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/meetvaghani12/neural-portfolio.git
cd neural-portfolio

# 2. Install dependencies
#    (legacy-peer-deps is required for React 19 + react-three ecosystem compatibility)
npm install --legacy-peer-deps

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

---

## 📁 Project Structure

```
neural-portfolio/
├── public/
├── src/
│   ├── data/                  ← ALL portfolio content lives here
│   │   ├── network.js         ← Node and edge definitions
│   │   ├── nodeCards.js       ← HUD card content (identity, role, education, location)
│   │   ├── projects.js        ← Project cards for the Output layer
│   │   ├── skills.js          ← Skills grouped by network layer
│   │   ├── experience.js      ← Work experience entries
│   │   ├── education.js       ← Education entries
│   │   ├── contact.js         ← Contact info and social links
│   │   └── hero.js            ← Name, title, and tagline
│   │
│   ├── components/
│   │   ├── three/             ← All 3D / WebGL components (nodes, edges, signals, camera)
│   │   └── ui/                ← HTML overlay components (cards, nav, loader, HUD)
│   │
│   ├── shaders/               ← GLSL shader strings (kept as JS template literals)
│   │   ├── node.js            ← Pulsing glow sphere shader
│   │   ├── edge.js            ← Faint connection tube with signal shader
│   │   └── signal.js          ← Traveling particle shader
│   │
│   ├── hooks/                 ← Custom React hooks
│   │   ├── useSignalSystem.js ← Fires random signals on interval
│   │   ├── useScrollCamera.js ← Maps scroll % to camera waypoints
│   │   └── useNodeActivation.js ← Tracks hovered / active nodes
│   │
│   └── store/
│       └── useStore.js        ← Global Zustand state
│
├── .npmrc                     ← Sets legacy-peer-deps=true for CI / Vercel builds
├── package.json
├── vite.config.js
└── index.html
```

> **Content updates are zero-component changes.** Edit any file inside `src/data/` to update the live site.

---

## 🎬 Key Animations

### Scroll Journey

The camera travels through the neural network as you scroll, revealing each layer in sequence:

| Scroll % | Camera Position | Layer Visible |
|---|---|---|
| 0% | Inside the Input layer, close-up | Hero — name & title |
| 20% | Pull back — full network visible | Network overview |
| 40% | Facing Hidden layers 1 + 2 | Frontend & Backend skills |
| 60% | Hidden layer 3 | AI / ML skills |
| 80% | Output layer | Shipped projects |
| 100% | Bird's-eye full network | Contact |

### Node Interaction

- **Hover** — node brightens, bloom intensifies, nearby signals re-route
- **Click** — spring-animated HUD card pops in with node-specific data
- **Idle** — network continuously fires GPU particle signals between all layers

### Signal Engine

Signals are GPU particles rendered via `Points` + a custom traveling-particle GLSL shader. Up to **40 concurrent signals** are active at any time. All animation runs through `useFrame` with delta time — no `setInterval`, no JS timers.

### Post-Processing Stack

```
Bloom  →  Chromatic Aberration  →  Film Grain
```

---

## ☁️ Deployment

The project is deployed on **Vercel** with zero configuration.

### Important: `.npmrc`

The React 19 + React Three Fiber ecosystem requires peer-dependency resolution to be relaxed. A `.npmrc` file at the project root sets:

```
legacy-peer-deps=true
```

This ensures Vercel's build pipeline installs dependencies correctly without manual flags.

### Deploy Your Own Fork

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/meetvaghani12/neural-portfolio)

1. Fork this repository
2. Connect it to your Vercel account
3. Vercel auto-detects Vite — no build settings needed
4. Done. Your own live neural portfolio in ~60 seconds.

---

## 🗂️ Featured Projects (Output Layer)

| Project | Year | Stack | Description |
|---|---|---|---|
| **VaghaniGPT** | 2024 | Next.js · OpenAI · LangChain · Node.js | Custom AI assistant with context memory and tool-calling |
| **Vedrix** | 2024 | React · Node.js · AI · WebSockets | AI-powered platform with real-time data and recommendation engine |
| **AnveshaCode** | 2023 | React · Python · Vector DB · OpenAI | Semantic code search across large codebases |
| **HomePraise** | 2023 | Next.js · PostgreSQL · Node.js · AI | Real estate platform with AI-generated listing descriptions |
| **Eventopia** | 2023 | React · Node.js · MongoDB · WebSockets | Scalable event management with real-time ticketing |
| **FinLink** | 2022 | React · Python · ML · PostgreSQL | Personal finance tracker with AI spending insights |

---

## 👤 Author

<div align="center">

**Meet Vaghani**
*Full Stack Developer — AI-driven web applications*
*Ahmedabad, India · Open to opportunities*

[![GitHub](https://img.shields.io/badge/GitHub-meetvaghani12-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/meetvaghani12)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-meet--vaghani-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/meet-vaghani-422a78224/)
[![Twitter](https://img.shields.io/badge/Twitter-meetvaghani-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/meetvaghani)

</div>

---

<div align="center">

*Built with React 19 · Three.js · GSAP · Custom GLSL*

**[Live Demo →](https://neural-synaptic-style-port-folio-2i.vercel.app)**

</div>
