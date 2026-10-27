/**
 * Optional, user-controlled Web Audio harmonic chime synthesizer, ambient soundscape generator,
 * and SpeechSynthesis voice guide.
 * Strictly opt-in: never autoplays, respects mute state, and cleans up resources when stopped.
 */

export type AmbientPreset = 'off' | 'warm_pad' | 'gentle_rain';

let sharedAudioContext: AudioContext | null = null;
let activeAmbientCleanup: (() => void) | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {
      // ignore
    });
  }
  return sharedAudioContext;
}

/**
 * Plays a gentle, low-volume harmonic chime when transitioning breathing phases.
 * Inhale: warm rising C4/G4 fifth (261.6Hz + 392Hz)
 * Hold: calm steady E4 (329.6Hz)
 * Exhale: grounding descending A3/E4 (220Hz + 329.6Hz)
 * Complete: soft triad resolution
 */
export function playGentlePhaseChime(
  phaseId: 'inhale' | 'hold' | 'exhale' | 'complete'
): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies: Record<typeof phaseId, number[]> = {
      inhale: [261.63, 392.0],
      hold: [329.63, 493.88],
      exhale: [220.0, 329.63],
      complete: [261.63, 329.63, 392.0],
    };

    const notes = frequencies[phaseId] || [261.63];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      // Gentle envelope: soft attack, warm 1.4s exponential decay
      gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.045, now + idx * 0.06 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.5);
    });
  } catch {
    // Fail silently if browser blocks or lacks Web Audio support
  }
}

/**
 * Starts an optional, subtle background ambient soundscape using Web Audio synthesis.
 * 'warm_pad': Low-pass filtered sine/triangle harmonic drone (C3 + G3 + E4)
 * 'gentle_rain': Soft low-pass filtered pink noise resembling distant rain
 */
export function setAmbientSoundscape(preset: AmbientPreset): void {
  stopAmbientSoundscape();
  if (preset === 'off') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(preset === 'warm_pad' ? 0.028 : 0.022, now + 1.2);
    masterGain.connect(ctx.destination);

    if (preset === 'warm_pad') {
      const freqs = [130.81, 196.0, 329.63]; // C3, G3, E4
      const oscillators = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, now);

        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, now);
        osc.connect(filter);
        filter.connect(masterGain);
        osc.start(now);
        return osc;
      });

      activeAmbientCleanup = () => {
        try {
          const stopTime = ctx.currentTime;
          masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.35);
          window.setTimeout(() => {
            oscillators.forEach((o) => {
              try {
                o.stop();
                o.disconnect();
              } catch {
                // ignore
              }
            });
            masterGain.disconnect();
          }, 380);
        } catch {
          // ignore
        }
      };
    } else if (preset === 'gentle_rain') {
      // Create a 3-second looping pink-noise buffer filtered through a warm lowpass filter
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0,
        b3 = 0,
        b4 = 0,
        b5 = 0,
        b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, now);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start(now);

      activeAmbientCleanup = () => {
        try {
          const stopTime = ctx.currentTime;
          masterGain.gain.setValueAtTime(masterGain.gain.value, stopTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, stopTime + 0.3);
          window.setTimeout(() => {
            try {
              whiteNoise.stop();
              whiteNoise.disconnect();
              masterGain.disconnect();
            } catch {
              // ignore
            }
          }, 340);
        } catch {
          // ignore
        }
      };
    }
  } catch {
    // Fail silently if AudioContext is blocked
  }
}

export function stopAmbientSoundscape(): void {
  if (activeAmbientCleanup) {
    const fn = activeAmbientCleanup;
    activeAmbientCleanup = null;
    fn();
  }
}

/**
 * Speaks a short calming instruction using the browser's native SpeechSynthesis API
 * only when the user has explicitly enabled Voice Guidance.
 */
export function speakGuidedInstruction(text: string): void {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Calm, unhurried cadence
    utterance.pitch = 0.96;
    utterance.volume = 0.7;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis errors
  }
}

export function stopGuidedSpeech(): void {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
  } catch {
    // Ignore
  }
}
