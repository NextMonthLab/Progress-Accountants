// This script generates a wishlist "ding" sound
// Run this script with Node.js to generate the audio file

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate a simple notification sound
function generateWishlistSound() {
  // Length of the audio in seconds
  const duration = 1.0;
  // Sample rate
  const sampleRate = 44100;
  // Number of channels (1 for mono, 2 for stereo)
  const channels = 1;
  // Bit depth
  const bitDepth = 16;
  
  // The buffer to store the audio data
  const totalSamples = Math.floor(duration * sampleRate);
  const buffer = Buffer.alloc(totalSamples * channels * (bitDepth / 8));
  
  // Generate a simple ding sound with slight chirp
  for (let i = 0; i < totalSamples; i++) {
    // Time in seconds
    const t = i / sampleRate;
    
    // Base frequency with chirp effect (frequency increases over time)
    const freqBase = 440 + 200 * Math.pow(t, 2); // A4 with upward chirp
    
    // Second tone for harmonics
    const freqHarmonic = freqBase * 1.5; // Perfect fifth above
    
    // Volume envelope (fade in and out)
    let envelope = 0;
    if (t < 0.1) {
      // Quick fade in
      envelope = t / 0.1;
    } else if (t > 0.3) {
      // Long fade out
      envelope = 1.0 - ((t - 0.3) / 0.7);
    } else {
      // Full volume in the middle
      envelope = 1.0;
    }
    
    // Final waveform combining base tone and harmonic
    const sample = (
      0.7 * Math.sin(2 * Math.PI * freqBase * t) + 
      0.3 * Math.sin(2 * Math.PI * freqHarmonic * t)
    ) * envelope * 0.8;
    
    // Convert to 16-bit PCM
    const value = Math.floor(sample * 32767);
    
    // Write to buffer
    buffer.writeInt16LE(value, i * channels * (bitDepth / 8));
  }
  
  // Write the raw PCM data to a file
  const outputRawPath = path.join(__dirname, 'wishlist-sound.raw');
  fs.writeFileSync(outputRawPath, buffer);
  
  // Convert raw PCM to MP3 using ffmpeg
  const outputMp3Path = path.join(__dirname, '../../public/assets/wishlist-sound.mp3');
  
  const ffmpegCommand = `ffmpeg -f s16le -ar ${sampleRate} -ac ${channels} -i ${outputRawPath} -y ${outputMp3Path}`;
  
  console.log(`Executing: ${ffmpegCommand}`);
  
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error converting to MP3: ${error.message}`);
      return;
    }
    
    console.log(`MP3 file created at: ${outputMp3Path}`);
    
    // Clean up the raw file
    fs.unlinkSync(outputRawPath);
  });
}

// Generate the sound
generateWishlistSound();