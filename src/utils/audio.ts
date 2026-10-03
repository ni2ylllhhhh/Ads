/**
 * Web Audio API synthesizer for realistic mechanical stopwatch clicks and alarm chimes.
 * Requires no external audio files or network requests.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Realistic crisp mechanical click sound when buttons are pushed.
 */
export function playClickSound(highPitch = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(highPitch ? 1400 : 980, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(300, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

let tickToggle = false;

/**
 * Ensures AudioContext is initialized and resumed upon user interaction.
 */
export function initAudioOnInteraction(): void {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  } catch {
    // Ignore
  }
}

/**
 * Realistic crisp mechanical clock tick sound (alternating tick / tock escapement).
 */
export function playTickSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    tickToggle = !tickToggle;

    // Escapement primary frequency: 1800Hz on tick, 1420Hz on tock
    const baseFreq = tickToggle ? 1800 : 1420;

    // 1. Tonal click (sine oscillator)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.024);

    oscGain.gain.setValueAtTime(0.18, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.022);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);

    // 2. High-frequency crisp gear click (micro impulse buffer)
    const bufferSize = Math.floor(ctx.sampleRate * 0.008);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(tickToggle ? 4200 : 3600, now);
    noiseFilter.Q.setValueAtTime(3, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.14, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.015);
  } catch {
    // Silent fallback if blocked
  }
}

/**
 * Pleasant 3-note chime when countdown completes.
 */
export function playAlarmChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  } catch {
    // Silent fallback
  }
}
