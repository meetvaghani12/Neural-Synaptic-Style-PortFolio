import { Suspense } from 'react'
import NodeInstances  from './NodeInstances'
import EdgeSystem     from './EdgeSystem'
import SignalSystem   from './SignalSystem'
import LayerLabels    from './LayerLabels'
import AmbientNetwork from './AmbientNetwork'
import CameraRig      from './CameraRig'

export default function NeuralNetwork() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.02} />
      <Suspense fallback={null}>
        {/* Background ambient NN — always present */}
        <AmbientNetwork />
        {/* Main portfolio NN */}
        <EdgeSystem />
        <NodeInstances />
        <SignalSystem />
        <LayerLabels />
      </Suspense>
    </>
  )
}
