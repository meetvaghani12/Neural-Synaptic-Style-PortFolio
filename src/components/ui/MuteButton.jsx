import { useState } from 'react'
import { setMasterVolume, startAmbientDrone } from '../../hooks/useAudioEngine'

export default function MuteButton() {
  const [muted, setMuted] = useState(false) // sound ON by default

  const toggle = () => {
    const nowMuted = !muted
    setMuted(nowMuted)
    startAmbientDrone()
    setMasterVolume(nowMuted ? 0 : 1)
  }

  return (
    <button
      onClick={toggle}
      title={muted ? 'Unmute' : 'Mute'}
      style={{
        position: 'fixed', bottom: 24, right: 24,
        zIndex: 50,
        background: 'rgba(2,5,16,0.75)',
        border: `1px solid ${muted ? 'rgba(255,255,255,0.1)' : 'rgba(96,165,250,0.35)'}`,
        borderRadius: '50%',
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'border-color 0.2s',
        fontSize: 16,
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
