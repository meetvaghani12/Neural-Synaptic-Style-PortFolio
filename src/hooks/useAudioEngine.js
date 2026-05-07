/**
 * Interstellar audio engine — Hans Zimmer organ + ticking clock aesthetic
 * Inspired by: "Cornfield Chase", "No Time For Caution", "Stay", "Day One"
 * Deep pipe organ pads, ticking clock pulse, massive reverb, tension swells.
 * Pure Web Audio API — no external files.
 */

let ctx          = null
let masterGain   = null
let droneStarted = false
let assembled    = false
let reverbCache  = null
let tickInterval = null

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

// ── Cathedral reverb (10s tail — massive church organ space) ────────────────
function getReverb(actx, duration = 10, decay = 4.5) {
  if (reverbCache) return reverbCache
  const conv = actx.createConvolver()
  const rate = actx.sampleRate
  const len  = rate * duration
  const buf  = actx.createBuffer(2, len, rate)
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c)
    for (let i = 0; i < len; i++) {
      // Colored noise impulse with early reflections + late diffusion
      const env = Math.pow(1 - i / len, decay)
      // Early reflections (first 800ms)
      const early = i < rate * 0.8 ? Math.sin(i * 0.0017) * 0.4 : 0
      ch[i] = ((Math.random() * 2 - 1) + early) * env
    }
  }
  conv.buffer   = buf
  reverbCache   = conv
  conv.connect(masterGain)
  return conv
}

// ── Dry bus (no reverb, for tick clock) ─────────────────────────────────────
function getDryBus() {
  return masterGain
}

// ── Pipe organ voice — church organ harmonics (drawbar-style) ──────────────
function createOrganVoice(actx, freq, gainVal, destination, startT, rampT = 4.0) {
  // Church organ drawbar harmonics: 16', 8', 5⅓', 4', 2⅔', 2'
  const harmonics = [0.5, 1, 1.5, 2, 3, 4, 6, 8]
  const weights   = [0.7, 1.0, 0.3, 0.5, 0.2, 0.25, 0.08, 0.04]

  harmonics.forEach((h, i) => {
    const osc  = actx.createOscillator()
    const gain = actx.createGain()
    osc.type            = 'sine'
    osc.frequency.value = freq * h

    // Slight detune per voice — chorus / warmth
    osc.detune.value = (i % 2 === 0 ? 1 : -1) * (i * 1.8 + Math.random() * 2)

    gain.gain.setValueAtTime(0, startT)
    gain.gain.linearRampToValueAtTime(gainVal * weights[i], startT + rampT)

    osc.connect(gain)
    gain.connect(destination)
    osc.start(startT)
  })
}

// ── Ticking clock — the iconic Interstellar metronome ──────────────────────
// Soft metallic tick every 1.2 seconds (like the "Mountains" scene)
function startTickClock(actx, reverb) {
  if (tickInterval) return
  const dry = getDryBus()

  function tick() {
    const t = actx.currentTime

    // Primary tick — short noise burst shaped like a clock mechanism
    const bufLen = actx.sampleRate * 0.025 // 25ms
    const buf    = actx.createBuffer(1, bufLen, actx.sampleRate)
    const data   = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) {
      const env = Math.exp(-i / (bufLen * 0.15))
      data[i] = (Math.random() * 2 - 1) * env
    }

    const src  = actx.createBufferSource()
    src.buffer = buf

    // Bandpass filter — makes it sound metallic, clock-like
    const filter = actx.createBiquadFilter()
    filter.type            = 'bandpass'
    filter.frequency.value = 3200 + Math.random() * 400
    filter.Q.value         = 8

    const tickGain = actx.createGain()
    tickGain.gain.setValueAtTime(0.12, t)
    tickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)

    src.connect(filter)
    filter.connect(tickGain)
    tickGain.connect(dry)

    // Tiny reverb send for space
    const reverbGain = actx.createGain()
    reverbGain.gain.value = 0.03
    tickGain.connect(reverbGain)
    reverbGain.connect(reverb)

    src.start(t)
    src.stop(t + 0.1)

    // Secondary resonance — faint sine ping (like watch spring)
    const ping     = actx.createOscillator()
    const pingGain = actx.createGain()
    ping.type            = 'sine'
    ping.frequency.value = 4200
    pingGain.gain.setValueAtTime(0.04, t)
    pingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
    ping.connect(pingGain)
    pingGain.connect(dry)
    ping.start(t)
    ping.stop(t + 0.08)
  }

  // Tick every 1.2 seconds — the Interstellar "Mountains" tempo
  tickInterval = setInterval(tick, 1200)
  // First tick immediately
  setTimeout(tick, 600)
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT DRONE — "Cornfield Chase" organ + "Stay" sub-bass + clock
// Deep church organ pad with breathing LFO, evolving shimmer, ticking clock
// ─────────────────────────────────────────────────────────────────────────────
export function startAmbientDrone() {
  if (droneStarted) return
  droneStarted = true
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // Start the ticking clock
  startTickClock(actx, reverb)

  // ── Deep organ pad — "Stay" chord (D minor) ──
  // D minor = D, F, A — darker, more emotional than A minor
  const chordNotes = [
    { freq: 36.7,  gain: 0.14, delay: 0.0 },  // D1 — 32' pedal stop (sub-bass rumble)
    { freq: 73.4,  gain: 0.16, delay: 1.0 },  // D2 — 16' foundation
    { freq: 87.3,  gain: 0.10, delay: 2.5 },  // F2 — minor third
    { freq: 110,   gain: 0.12, delay: 3.5 },  // A2 — fifth
    { freq: 146.8, gain: 0.07, delay: 5.0 },  // D3 — octave
  ]

  chordNotes.forEach(({ freq, gain, delay }) => {
    createOrganVoice(actx, freq, gain, reverb, t + delay, 6.0)

    // Slow breathing LFO — the organ "breathes" like in Interstellar
    const lfo  = actx.createOscillator()
    const lfoG = actx.createGain()
    lfo.type            = 'sine'
    lfo.frequency.value = 0.03 + Math.random() * 0.025   // ~0.03–0.055 Hz (very slow)
    lfoG.gain.value     = gain * 0.25
    lfo.connect(lfoG)
    lfo.start(t + delay)
  })

  // ── High organ shimmer — "No Time For Caution" upper register ──
  // Haunting octave doublings in the upper register
  const shimmerFreqs = [293.7, 440, 587.3, 880]  // D4, A4, D5, A5
  shimmerFreqs.forEach((freq, i) => {
    const osc  = actx.createOscillator()
    const gain = actx.createGain()
    const lfo  = actx.createOscillator()
    const lfoG = actx.createGain()

    osc.type            = 'sine'
    osc.frequency.value = freq
    osc.detune.value    = (i % 2 === 0 ? 4 : -4) + Math.random() * 3

    // Very slow crescendo — arrives ~12s in
    lfo.type            = 'sine'
    lfo.frequency.value = 0.04 + i * 0.015
    lfoG.gain.value     = 0.008

    gain.gain.setValueAtTime(0, t + 8 + i * 1.5)
    gain.gain.linearRampToValueAtTime(0.018, t + 14 + i * 1.5)

    lfo.connect(lfoG)
    lfoG.connect(gain.gain)

    osc.connect(gain)
    gain.connect(reverb)
    osc.start(t + 8 + i * 1.5)
    lfo.start(t + 8 + i * 1.5)
  })

  // ── Sub-bass throb — "Mountains" pressure wave ──
  const subOsc  = actx.createOscillator()
  const subGain = actx.createGain()
  const subLfo  = actx.createOscillator()
  const subLfoG = actx.createGain()
  subOsc.type            = 'sine'
  subOsc.frequency.value = 36.7  // D1
  subLfo.type            = 'sine'
  subLfo.frequency.value = 0.083 // ~12s cycle — tidal pulse
  subLfoG.gain.value     = 0.06
  subGain.gain.setValueAtTime(0, t + 4)
  subGain.gain.linearRampToValueAtTime(0.10, t + 10)
  subLfo.connect(subLfoG)
  subLfoG.connect(subGain.gain)
  subOsc.connect(subGain)
  subGain.connect(masterGain) // direct to master, no reverb on sub
  subOsc.start(t + 4)
  subLfo.start(t + 4)
}

// ─────────────────────────────────────────────────────────────────────────────
// NODE HOVER — "Stay" piano-like resonant tone
// Single struck organ pipe with bell-like decay
// ─────────────────────────────────────────────────────────────────────────────
const LAYER_NOTES = {
  0: 293.7,  // D4
  1: 349.2,  // F4
  2: 220,    // A3
  3: 261.6,  // C4
  4: 196,    // G3
  5: 174.6,  // F3
}

export function playNodePing(layer = 0) {
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime
  const freq   = LAYER_NOTES[layer] ?? 293.7

  // Organ pipe strike — fundamental + octave + fifth partial
  const partials = [
    [freq,         0.30, 0],       // Fundamental
    [freq * 2,     0.12, 3],       // Octave
    [freq * 3,     0.05, -5],      // 12th (octave + fifth)
    [freq * 4,     0.03, 7],       // Double octave
  ]

  partials.forEach(([f, vol, detune]) => {
    const osc  = actx.createOscillator()
    const gain = actx.createGain()
    osc.type            = 'sine'
    osc.frequency.value = f
    osc.detune.value    = detune

    // Soft attack (not instant — organ pipes don't click)
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(vol, t + 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.5)

    osc.connect(gain)
    gain.connect(reverb)
    osc.start(t)
    osc.stop(t + 4.0)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL TICK — distant ticking echo (matches the clock but randomized)
// Like hearing the clock through a long corridor
// ─────────────────────────────────────────────────────────────────────────────
let lastTick = 0
export function playSignalTick() {
  const now = Date.now()
  if (now - lastTick < 350) return
  lastTick = now

  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // Pitched tick — high metallic tap
  const osc  = actx.createOscillator()
  const gain = actx.createGain()
  const filter = actx.createBiquadFilter()

  osc.type            = 'sine'
  osc.frequency.value = 2800 + Math.random() * 600
  filter.type         = 'highpass'
  filter.frequency.value = 2000
  filter.Q.value      = 2

  gain.gain.setValueAtTime(0.018, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(reverb)
  osc.start(t)
  osc.stop(t + 0.15)
}

// ─────────────────────────────────────────────────────────────────────────────
// NETWORK ASSEMBLY — "Cornfield Chase" rising organ swell
// Notes appear one by one, each breath deeper, building to full chord
// ─────────────────────────────────────────────────────────────────────────────
export function playAssemblySweep() {
  if (assembled) return
  assembled = true
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // D minor ascending — pedal notes breathing in one by one
  const scale = [73.4, 87.3, 110, 146.8, 174.6, 220, 293.7]
  scale.forEach((freq, i) => {
    const delay = i * 0.65
    createOrganVoice(actx, freq, 0.09 - i * 0.006, reverb, t + delay, 3.0)
  })

  // Final sustained chord swell — the emotional peak
  setTimeout(() => {
    const t2 = actx.currentTime
    ;[146.8, 220, 293.7, 440].forEach((freq, i) => {
      createOrganVoice(actx, freq, 0.06, reverb, t2 + i * 0.12, 2.0)
    })
  }, scale.length * 650 + 500)
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT/NODE OPEN — "No Time For Caution" organ swell
// Full dramatic chord — like the docking scene
// ─────────────────────────────────────────────────────────────────────────────
export function playProjectOpen() {
  const actx   = getCtx()
  const reverb = getReverb(actx)
  const t      = actx.currentTime

  // D minor power chord with octave doubling
  const chord = [
    [73.4,  0.08],  // D2
    [110,   0.07],  // A2 (fifth)
    [146.8, 0.06],  // D3
    [220,   0.05],  // A3
    [293.7, 0.04],  // D4
    [440,   0.02],  // A4 (high shimmer)
  ]

  chord.forEach(([freq, gain], i) => {
    const delay = i * 0.06
    createOrganVoice(actx, freq, gain, reverb, t + delay, 1.0)

    // Slow fade out over 5 seconds
    const osc    = actx.createOscillator()
    const fg     = actx.createGain()
    osc.type            = 'sine'
    osc.frequency.value = freq
    fg.gain.setValueAtTime(gain * 0.3, t + delay + 1.5)
    fg.gain.linearRampToValueAtTime(0, t + delay + 5.5)
    osc.connect(fg)
    fg.connect(reverb)
    osc.start(t + delay + 1.0)
    osc.stop(t + delay + 6.0)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTE / VOLUME
// ─────────────────────────────────────────────────────────────────────────────
export function setMasterVolume(vol) {
  const actx = getCtx()
  masterGain.gain.setTargetAtTime(vol * 0.85, actx.currentTime, 0.3)
  // Mute/unmute clock
  if (vol < 0.01 && tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  } else if (vol > 0.01 && !tickInterval && droneStarted) {
    startTickClock(actx, getReverb(actx))
  }
}

export function isMuted() {
  return masterGain ? masterGain.gain.value < 0.01 : false
}
