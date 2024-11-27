<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { audioStore } from '$lib/stores/audio_store';

    // Configurable parameters
    export let tonalVolume: number = 0.03;
    export let noiseVolume: number = 0.008;
    export let tonalFrequency: number = 220; // Base frequency in Hz (lower tone)
    export let modulationRate: number = 0.1; // Speed of frequency modulation in Hz
    export let modulationDepth: number = 1.5; // How much the frequency varies
    export let volumeModRate: number = 0.05; // Speed of volume modulation in Hz
    export let volumeModDepth: number = 0.7; // How much the volume varies (0-1)
    export let tonalFrequency2: number = 330; // Second frequency in Hz (higher tone)
    export let transitionTime: number = 2; // Time to transition in seconds

    let audioContext: AudioContext;
    let noiseNode: AudioBufferSourceNode;
    let oscillatorNode: OscillatorNode | null;
    let noiseGain: GainNode;
    let oscillatorGain: GainNode;
    let isActive: boolean = true;
    let debugStatus: string = "Initializing...";
    let currentFrequencyIndex: number = 0; // 0 for base frequency, 1 for second

    // Utility functions for audio operations
    function createModulationChain(ctx: AudioContext, targetNode: AudioParam, rate: number, depth: number = 0.425, offset: number = 0.575) {
        const lfoNode = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const lfoOffset = ctx.createConstantSource();

        lfoNode.type = 'sine';
        lfoNode.frequency.setValueAtTime(rate, ctx.currentTime);
        lfoGain.gain.setValueAtTime(depth, ctx.currentTime);
        lfoOffset.offset.setValueAtTime(offset, ctx.currentTime);

        lfoNode.connect(lfoGain);
        lfoGain.connect(targetNode);
        lfoOffset.connect(targetNode);

        return { lfoNode, lfoGain, lfoOffset };
    }

    function smoothTransition(param: AudioParam, value: number, time: number = 1) {
        param.linearRampToValueAtTime(value, audioContext.currentTime + time);
    }

    function setupTonalOscillator(freq: number): OscillatorNode {
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        return osc;
    }

    function addRandomVariations(gainNode: GainNode, freqNode?: OscillatorNode, interval: number = 100) {
        return setInterval(() => {
            if (isActive) {
                const currentVol = gainNode.gain.value;
                const smallVariation = currentVol * (0.97 + Math.random() * 0.06);
                smoothTransition(gainNode.gain, smallVariation, 0.1);

                if (freqNode) {
                    const currentFreq = freqNode.frequency.value;
                    const freqVariation = currentFreq + (Math.random() * 4 - 2);
                    smoothTransition(freqNode.frequency, freqVariation, 0.1);
                }
            }
        }, interval);
    }

    // Create pink noise buffer
    function createPinkNoise(bufferSize: number) {
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // Scale to make -1 to 1
            
            b6 = white * 0.115926;
        }
        
        return buffer;
    }

    function setupAudio() {
        if (!audioContext) {
            audioContext = new AudioContext();
        }

        // Setup noise chain
        const noiseBuffer = createPinkNoise(audioContext.sampleRate * 5);
        noiseNode = audioContext.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;
        noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0, audioContext.currentTime);

        // Setup tonal chain
        oscillatorNode = setupTonalOscillator(tonalFrequency);
        oscillatorGain = audioContext.createGain();
        oscillatorGain.gain.setValueAtTime(0, audioContext.currentTime);

        // Setup modulations
        const freqMod = createModulationChain(audioContext, oscillatorNode.frequency, modulationRate, modulationDepth);
        const tonalVolMod = createModulationChain(audioContext, oscillatorGain.gain, volumeModRate);
        const noiseVolMod = createModulationChain(audioContext, noiseGain.gain, volumeModRate * 0.7);

        // Connect audio chains
        noiseNode.connect(noiseGain).connect(audioContext.destination);
        oscillatorNode.connect(oscillatorGain).connect(audioContext.destination);

        // Only start modulation nodes - actual sound nodes will start when enabled
        [freqMod.lfoNode, freqMod.lfoOffset,
         tonalVolMod.lfoNode, tonalVolMod.lfoOffset,
         noiseVolMod.lfoNode, noiseVolMod.lfoOffset
        ].forEach(node => node.start());

        // Add variations (but they'll have no effect until gain is increased)
        addRandomVariations(oscillatorGain, oscillatorNode);
        addRandomVariations(noiseGain, null, 150);

        debugStatus = "Audio initialized (muted)";
    }

    // Function to switch frequencies
    function switchFrequency() {
        if (!oscillatorNode || !audioContext) return;

        const targetFreq = currentFrequencyIndex === 0 ? tonalFrequency2 : tonalFrequency;
        console.log('Target frequency:', targetFreq);
        smoothTransition(oscillatorNode.frequency, targetFreq, transitionTime);
        currentFrequencyIndex = currentFrequencyIndex === 0 ? 1 : 0;
        debugStatus = `Transitioning to ${targetFreq}Hz`;
    }

    // Subscribe to store changes
    $: if (noiseGain && audioContext) {
        if ($audioStore.windEnabled) {
            let needsNewNode = true;
            if (noiseNode) {
                try {
                    noiseNode.stop();
                    needsNewNode = true;
                } catch {
                    needsNewNode = true;
                }
            }
            
            if (needsNewNode) {
                noiseNode = audioContext.createBufferSource();
                noiseNode.buffer = createPinkNoise(audioContext.sampleRate * 5);
                noiseNode.loop = true;
                noiseNode.connect(noiseGain);
                noiseNode.start();
            }
            smoothTransition(noiseGain.gain, noiseVolume);
        } else {
            smoothTransition(noiseGain.gain, 0);
            if (noiseNode) {
                setTimeout(() => {
                    try {
                        noiseNode.stop();
                    } catch {}
                }, 1000);
            }
        }
    }

    $: if (oscillatorGain && audioContext) {
        if ($audioStore.toneEnabled) {
            if (oscillatorNode) {
                try {
                    oscillatorNode.stop();
                } catch {}
            }
            
            oscillatorNode = setupTonalOscillator(tonalFrequency);
            oscillatorNode.connect(oscillatorGain);
            oscillatorNode.start();
            smoothTransition(oscillatorGain.gain, tonalVolume);
        } else {
            smoothTransition(oscillatorGain.gain, 0);
            if (oscillatorNode) {
                setTimeout(() => {
                    try {
                        if (oscillatorNode) {
                            oscillatorNode.stop();
                            oscillatorNode = null;
                        }
                    } catch {}
                }, 1000);
            }
        }
    }

    // Export the switch function for external use
    export const switchTone = () => switchFrequency();

    onMount(() => {
        console.log("AmbientSound: Mounting component");
        setupAudio();

        // Expose switchTone to the global window object
        (window as any).switchTone = switchTone;
    });

    onDestroy(() => {
        console.log("AmbientSound: Destroying component");
        isActive = false;
        if (noiseNode) noiseNode.stop();
        if (oscillatorNode) oscillatorNode.stop();
        if (audioContext) audioContext.close();
         // Clean up the global reference
        // delete (window as any).switchTone;
    });
</script> 