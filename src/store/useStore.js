import { create } from 'zustand'

const useStore = create((set, get) => ({
  // ── Scene state
  sceneReady: false,
  setSceneReady: () => set({ sceneReady: true }),

  // ── Loading
  loading: true,
  setLoading: (v) => set({ loading: v }),

  // ── Scroll 0→1
  scrollProgress: 0,
  setScrollProgress: (p) => set({ scrollProgress: p }),

  // ── Hovered node id (from raycasting)
  hoveredNode: null,
  setHoveredNode: (id) => set({ hoveredNode: id }),

  // ── Active (clicked) node — opens project card
  activeNode: null,
  setActiveNode: (id) => set({ activeNode: id === get().activeNode ? null : id }),

  // ── Activation map: nodeId → activation level 0→1
  activations: {},
  setActivation: (id, value) =>
    set((state) => ({ activations: { ...state.activations, [id]: value } })),
  getActivation: (id) => get().activations[id] ?? 0,

  // ── Active signals: array of { id, edgeIndex, progress, active }
  signals: [],
  setSignals: (signals) => set({ signals }),

  // ── ScrollControls DOM element (set from inside R3F context)
  scrollEl: null,
  setScrollEl: (el) => set({ scrollEl: el }),

  // ── Global NN fade-out (0=visible, 1=faded)
  nnFade: 0,
  setNnFade: (v) => set({ nnFade: v }),
}))

export default useStore
