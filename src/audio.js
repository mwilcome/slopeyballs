export function createAudio() {
  let context = null
  let muted = false

  function ensure() {
    if (!context) context = new AudioContext()
    if (context.state === 'suspended') context.resume()
  }

  function tone(freq, duration, type, gain, slide) {
    if (muted || !context) return
    const start = context.currentTime
    const osc = context.createOscillator()
    const amp = context.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), start + duration)
    amp.gain.setValueAtTime(gain, start)
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(amp)
    amp.connect(context.destination)
    osc.start(start)
    osc.stop(start + duration + 0.02)
  }

  return {
    unlock: ensure,
    setMuted(value) { muted = value },
    launch() { tone(220, 0.16, 'sine', 0.05, 480) },
    good() { tone(520, 0.12, 'triangle', 0.05, 780) },
    bad() { tone(160, 0.18, 'sine', 0.04, 80) },
    coin() { tone(860, 0.05, 'square', 0.025, 1200) },
    win() { tone(523, 0.16, 'triangle', 0.05, 784) },
    fail() { tone(140, 0.28, 'sine', 0.05, 70) },
  }
}
