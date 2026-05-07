import { Suspense } from 'react'
import NodeInstances  from './NodeInstances'
import EdgeSystem     from './EdgeSystem'
import SignalSystem   from './SignalSystem'
import LayerLabels    from './LayerLabels'
import AmbientNetwork from './AmbientNetwork'
import CameraRig      from './CameraRig'
import NodeDetailCard from './NodeDetailCard'
import NodeBeacon     from './NodeBeacon'
import useStore       from '../../store/useStore'

export default function NeuralNetwork() {
  const setFocused = useStore(s => s.setFocusedNode)

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.02} />
      {/* Invisible background plane to catch clicks outside nodes */}
      <mesh
        position={[0, 0, -5]}
        onClick={() => {
          if (useStore.getState().focusedNode) setFocused(null)
        }}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <Suspense fallback={null}>
        <AmbientNetwork />
        <EdgeSystem />
        <NodeInstances />
        <SignalSystem />
        <LayerLabels />
        <NodeDetailCard />
        <NodeBeacon />
      </Suspense>
    </>
  )
}
