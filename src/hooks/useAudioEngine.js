/**
 * Interstellar-style audio engine — Hans Zimmer / space organ aesthetic
 * Deep, slow, evolving pads. Long reverb. Pipe organ harmonics.
 * Pure Web Audio API — no files.
 */

let ctx          = null
let masterGain   = null
let droneStarted = false
let assembled    = false
let reverbCache  = null

function getCtx() {
  if (!ctx) {
    ctx        = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.85, ctx.currentTime)
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// ── Long, lush reverb (8s tail — Interstellar-scale spaces) ─────────────────
function getReverb(actx, duration = 8, decay = 5) {
  if (reverbCache) return reverbCache
  const conv = actx.createConvolver()
  const rate = actx.sampleRate
  const len  = rate * duration
  const buf  = actx.createBuffer(2, len, rate)
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c)
    for (let i = 0; i < len; i++) {
      // Pink-ish noise impulse for smoother reverb tail
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
    }
  }
  conv.buffer   = buf
  reverbCache   = conv
  conv.connect(masterGain)
  return conv
}

// ── Pipe organ voice — stack of harmonic sines (like Hammond + pipe organ) ──
function createOrganVoice(actx, freq, gainVal, destination, startT, rampT = 4.0) {
  // Harmonics: fundamental + 2nd + 3rd + slight 4th (gives organ warmth)
  const harmonics = [1, 2, 3, 4, 6]
  const weights   = [1.0, 0.5, 0.25, 0.12, 0.06]

  harmonics.forEach((h, i) => {
    const osc  = actx.createOscillator()
    const gain = actx.createGain()
    osc.type            = 'sine'
    osc.frequency.value = freq * h

    // Tiny detune per harmonic — gives it warmth / chorus
    osc.detune.value = (i % 2 === 0 ? 1 : -1) * (i * 2.5)

    gain.gain.setValueAtTime(0, startT)
    gain.gain.linearRampToValueAtTime(gainVal * weights[i], startT + rampT)

    osc.connect(gain)
    gain.connect(destination)
    osc.start(startT)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT DRONE
// Evolving Interstellar organ pad — slow attack, breathing LFO, deep reverb
// ─────────────────────────────────────────────────────────────────────────────
export function startAmbientDrone() {
  if (droneStarted) return
  droneStarted = true
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // Root chord: A minor — A2 (110Hz), E2 (82Hz), A1 (55Hz)
  // Very slow fade-in over 6 seconds
  const chordNotes = [
    { freq: 55,  gain: 0.18, delay: 0.0  },  // A1 — deep sub bass
    { freq: 82,  gain: 0.14, delay: 1.5  },  // E2 — fifth
    { freq: 110, gain: 0.11, delay: 3.0  },  // A2 — root an octave up
    { freq: 138, gain: 0.07, delay: 4.5  },  // C#3 — major 3rd (adds tension)
  ]

  chordNotes.forEach(({ freq, gain, delay }) => {
    createOrganVoice(actx, freq, gain, reverb, t + delay, 5.0)

    // Slow tremolo LFO per voice
    const lfo  = actx.createOscillator()
    const lfoG = actx.createGain()
    lfo.frequency.value = 0.04 + Math.random() * 0.03   // ~0.04–0.07 Hz
    lfoG.gain.value     = gain * 0.3
    lfo.connect(lfoG)
    // We can't easily connect to the gain ramp above — just let the
    // organ voices breathe naturally from detune+room
    lfo.start(t + delay)
  })

  // Slow high shimmer — like the Interstellar choir shimmer
  const shimmerFreqs = [440, 554, 659, 880]
  shimmerFreqs.forEach((freq, i) => {
    const osc  = actx.createOscillator()
    const gain = actx.createGain()
    const lfo  = actx.createOscillator()
    const lfoG = actx.createGain()

    osc.type            = 'sine'
    osc.frequency.value = freq
    osc.detune.value    = i * 3

    lfo.frequency.value = 0.06 + i * 0.02
    lfoG.gain.value     = 0.012

    gain.gain.setValueAtTime(0, t + 6 + i)
    gain.gain.linearRampToValueAtTime(0.025, t + 10 + i)

    lfo.connect(lfoG)
    lfoG.connect(gain.gain)

    osc.connect(gain)
    gain.connect(reverb)
    osc.start(t + 6 + i)
    lfo.start(t + 6 + i)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// NODE HOVER — soft church bell / resonant chime
// Long tail, very gentle, Interstellar-style single note
// ─────────────────────────────────────────────────────────────────────────────
// One note per layer, part of the A minor scale
const LAYER_NOTES = { 0: 220, 1: 277, 2: 185, 3: 247, 4: 165 }

export function playNodePing(layer = 0) {
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime
  const freq   = LAYER_NOTES[layer] ?? 220

  // Bell tone = sine + detuned copy (inharmonic partial = bell character)
  [[freq, 0], [freq * 2.756, -8], [freq * 5.404, 6]].forEach(([f, detune], i) => {
    const osc  = actx.createOscillator()
    const gain = actx.createGain()
    const vol  = i === 0 ? 0.38 : i === 1 ? 0.14 : 0.06

    osc.type        = 'sine'
    osc.frequency.value = f
    osc.detune.value    = detune

    // Bell envelope: instant attack, slow exponential decay
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + (i === 0 ? 3.0 : 2.0))

    osc.connect(gain)
    gain.connect(reverb)
    osc.start(t)
    osc.stop(t + 3.5)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL TICK — barely-there soft breath of air
// Almost silent — just presence, like a distant pulse
// ─────────────────────────────────────────────────────────────────────────────
let lastTick = 0
export function playSignalTick() {
  const now = Date.now()
  if (now - lastTick < 280) return
  lastTick = now

  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  const osc  = actx.createOscillator()
  const gain = actx.createGain()
  osc.type            = 'sine'
  osc.frequency.value = 1760 + Math.random() * 220
  osc.frequency.exponentialRampToValueAtTime(880, t + 0.12)
  gain.gain.setValueAtTime(0.025, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
  osc.connect(gain)
  gain.connect(reverb)
  osc.start(t)
  osc.stop(t + 0.2)
}

// ─────────────────────────────────────────────────────────────────────────────
// NETWORK ASSEMBLY — organ chord rising up like Interstellar's "Cornfield Chase"
// Notes appear one by one, slow and majestic
// ─────────────────────────────────────────────────────────────────────────────
export function playAssemblySweep() {
  if (assembled) return
  assembled = true
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // A minor ascending scale — each note breathes in slowly
  const scale = [110, 123, 138, 165, 185, 220]
  scale.forEach((freq, i) => {
    const delay = i * 0.55
    createOrganVoice(actx, freq, 0.11 - i * 0.008, reverb, t + delay, 2.5)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT OPEN — deep resonant organ chord (like Interstellar "Day One")
// Full warm chord: root + fifth + octave
// ─────────────────────────────────────────────────────────────────────────────
export function playProjectOpen() {
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // A minor triad — 110, 165, 220Hz
  [[110, 0.08], [165, 0.06], [220, 0.05], [330, 0.03]].forEach(([freq, gain], i) => {
    const delay = i * 0.08
    createOrganVoice(actx, freq, gain, reverb, t + delay, 1.2)

    // Fade out slowly after 4 seconds
    const fadeOsc = actx.createOscillator()  // dummy to schedule gain fade
    const fg      = actx.createGain()
    fg.gain.setValueAtTime(gain, t + delay + 1.5)
    fg.gain.linearRampToValueAtTime(0, t + delay + 5.0)
    fg.connect(reverb)
    fadeOsc.connect(fg)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTE / VOLUME
// ─────────────────────────────────────────────────────────────────────────────
export function setMasterVolume(vol) {
  const actx = getCtx()
  masterGain.gain.setTargetAtTime(vol * 0.85, actx.currentTime, 0.3)
}

export function isMuted() {
  return masterGain ? masterGain.gain.value < 0.01 : false
}
