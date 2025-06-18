// Generate sounds directly in the browser using the Web Audio API
// This avoids having to include sound files with the application

/**
 * Generates a pleasant "success" sound for module requests
 * @param volume Volume level between 0 and 1 (default: 0.3)
 * @returns Promise that resolves when the sound finishes playing
 */
export function playModuleRequestSound(volume: number = 0.3): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn('Web Audio API not supported in this browser');
        resolve();
        return;
      }
      
      const audioCtx = new AudioContext();
      
      // Create oscillator nodes for the base tone and harmonic
      const baseOsc = audioCtx.createOscillator();
      const harmonicOsc = audioCtx.createOscillator();
      
      // Create gain nodes for volume control
      const masterGain = audioCtx.createGain();
      const baseGain = audioCtx.createGain();
      const harmonicGain = audioCtx.createGain();
      
      // Configure the oscillators
      baseOsc.type = 'sine';
      baseOsc.frequency.setValueAtTime(440, audioCtx.currentTime); // Start at A4
      baseOsc.frequency.exponentialRampToValueAtTime(
        660, // End higher for a cheerful effect
        audioCtx.currentTime + 0.3
      );
      
      harmonicOsc.type = 'sine';
      harmonicOsc.frequency.setValueAtTime(660, audioCtx.currentTime); // Perfect fifth above
      harmonicOsc.frequency.exponentialRampToValueAtTime(
        990, 
        audioCtx.currentTime + 0.3
      );
      
      // Configure volume envelopes
      masterGain.gain.value = volume;
      baseGain.gain.value = 0.7;
      harmonicGain.gain.value = 0.3;
      
      // Quick attack
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.1);
      
      // Long decay/release
      masterGain.gain.setValueAtTime(volume, audioCtx.currentTime + 0.3);
      masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      
      // Connect the audio graph
      baseOsc.connect(baseGain);
      harmonicOsc.connect(harmonicGain);
      baseGain.connect(masterGain);
      harmonicGain.connect(masterGain);
      masterGain.connect(audioCtx.destination);
      
      // Start and stop the oscillators
      baseOsc.start();
      harmonicOsc.start();
      
      baseOsc.stop(audioCtx.currentTime + 1.2);
      harmonicOsc.stop(audioCtx.currentTime + 1.2);
      
      // Resolve the promise when the sound finishes
      setTimeout(() => {
        audioCtx.close();
        resolve();
      }, 1200);
      
    } catch (error) {
      console.error('Error generating sound:', error);
      reject(error);
    }
  });
}