import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.1}
        mipmapBlur
        radius={0.8}
      />
      <Vignette offset={0.35} darkness={0.65} />
    </EffectComposer>
  )
}
