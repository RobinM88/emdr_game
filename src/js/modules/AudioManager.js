export class AudioManager {
    constructor() {
        this.synth = null;
        this.leftOsc = null;
        this.rightOsc = null;
        this.soundEnabled = true;
        this.initialized = false;
    }

    async initializeAudio() {
        if (this.initialized) return;

        try {
            // Wait for user interaction before starting audio
            await Tone.start();
            console.log('Audio context started');

            // Create and configure synth
            this.synth = new Tone.Synth({
                oscillator: {
                    type: 'sine'
                },
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.1,
                    release: 0.1
                }
            }).toDestination();
            this.synth.volume.value = -15;

            // Create and configure hemisync oscillators
            this.leftOsc = new Tone.Oscillator({
                frequency: 200,
                type: "sine",
                volume: -20
            }).connect(new Tone.Panner(-1)).toDestination();

            this.rightOsc = new Tone.Oscillator({
                frequency: 204,
                type: "sine",
                volume: -20
            }).connect(new Tone.Panner(1)).toDestination();

            this.initialized = true;
            console.log('Audio initialized successfully');
        } catch (error) {
            console.error('Error initializing audio:', error);
            this.soundEnabled = false;
        }
    }

    async startHemisync() {
        if (!this.initialized) {
            await this.initializeAudio();
        }

        if (!this.soundEnabled || !this.leftOsc || !this.rightOsc) return;
        
        try {
            this.leftOsc.start();
            this.rightOsc.start();
        } catch (error) {
            console.error('Error starting hemisync:', error);
        }
    }

    stopHemisync() {
        if (!this.soundEnabled || !this.leftOsc || !this.rightOsc) return;
        
        try {
            this.leftOsc.stop();
            this.rightOsc.stop();
        } catch (error) {
            console.error('Error stopping hemisync:', error);
        }
    }

    async playJumpSound() {
        if (!this.initialized) {
            await this.initializeAudio();
        }

        if (!this.soundEnabled || !this.synth) return;
        
        try {
            this.synth.triggerAttackRelease("C4", "0.1");
        } catch (error) {
            console.error('Error playing jump sound:', error);
        }
    }

    async playGameOverSound() {
        if (!this.initialized) {
            await this.initializeAudio();
        }

        if (!this.soundEnabled || !this.synth) return;
        
        try {
            this.synth.triggerAttackRelease(["C4", "E4", "G4"], "0.2");
        } catch (error) {
            console.error('Error playing game over sound:', error);
        }
    }

    stopAll() {
        this.stopHemisync();
        if (this.synth) {
            this.synth.releaseAll();
        }
    }

    updateHemisyncFrequency(speed) {
        if (!this.soundEnabled || !this.leftOsc || !this.rightOsc) return;

        try {
            // Base frequency of 200Hz, with speed affecting the frequency difference
            const baseFreq = 200;
            const freqDiff = 2 + (speed * 0.4); // 2-6Hz difference based on speed
            this.leftOsc.frequency.value = baseFreq;
            this.rightOsc.frequency.value = baseFreq + freqDiff;
        } catch (error) {
            console.error('Error updating hemisync frequency:', error);
        }
    }

    setVolume(value) {
        if (!this.soundEnabled || !this.synth) return;
        
        try {
            const volume = Math.max(-40, Math.min(0, value)); // Clamp between -40 and 0 dB
            this.synth.volume.value = volume;
            if (this.leftOsc && this.rightOsc) {
                this.leftOsc.volume.value = volume;
                this.rightOsc.volume.value = volume;
            }
        } catch (error) {
            console.error('Error setting volume:', error);
        }
    }
}