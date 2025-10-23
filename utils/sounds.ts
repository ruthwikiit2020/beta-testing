// Sound effects utility
export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  private constructor() {
    this.initAudioContext();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initAudioContext();
    }
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generate a simple beep sound
  private generateBeep(frequency: number, duration: number, volume: number = 0.1): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * volume;
    }

    return buffer;
  }

  // Play a sound
  async playSound(frequency: number, duration: number = 0.1, volume: number = 0.1) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const buffer = this.generateBeep(frequency, duration, volume);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.value = volume;
    source.start();
  }

  // Generate card-like sound with multiple frequencies
  private generateCardSound(type: 'flip' | 'swipe' | 'shuffle'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = type === 'flip' ? 0.15 : type === 'swipe' ? 0.25 : 0.3;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      if (type === 'flip') {
        // Card flip: quick whoosh sound
        const freq1 = 600 + Math.sin(t * 20) * 200;
        const freq2 = 800 + Math.sin(t * 15) * 100;
        sample = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * 0.3;
        sample *= Math.exp(-t * 8); // Quick decay
      } else if (type === 'swipe') {
        // Card swipe: sliding sound
        const freq = 300 + t * 400; // Rising frequency
        sample = Math.sin(2 * Math.PI * freq * t) * 0.4;
        sample *= Math.exp(-t * 3); // Gradual decay
        // Add some noise for texture
        sample += (Math.random() - 0.5) * 0.1;
      } else if (type === 'shuffle') {
        // Card shuffle: multiple quick sounds
        const freq = 400 + Math.sin(t * 30) * 200;
        sample = Math.sin(2 * Math.PI * freq * t) * 0.2;
        sample *= Math.exp(-t * 5);
        // Add some randomness for shuffle effect
        if (Math.random() < 0.3) {
          sample += Math.sin(2 * Math.PI * (freq + 100) * t) * 0.1;
        }
      }
      
      data[i] = sample;
    }

    return buffer;
  }

  // Predefined sounds
  async playCardFlip() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const buffer = this.generateCardSound('flip');
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.value = 0.15;
    source.start();
  }

  async playSwipeLeft() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const buffer = this.generateCardSound('swipe');
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.value = 0.2;
    source.start();
  }

  async playSwipeRight() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const buffer = this.generateCardSound('swipe');
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.value = 0.2;
    source.start();
  }

  async playCardShuffle() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const buffer = this.generateCardSound('shuffle');
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    gainNode.gain.value = 0.25;
    source.start();
  }

  async playSuccess() {
    await this.playSound(600, 0.1, 0.1);
    setTimeout(() => this.playSound(800, 0.1, 0.1), 100);
  }

  async playError() {
    await this.playSound(300, 0.3, 0.2);
  }
}

export const soundManager = SoundManager.getInstance();
