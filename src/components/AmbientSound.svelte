<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    // Configurable parameters
    export let tonalVolume: number = 0.03;
    export let noiseVolume: number = 0.008;
    export let tonalFrequency: number = 220; // Base frequency in Hz
    export let modulationRate: number = 0.1; // Speed of frequency modulation in Hz
    export let modulationDepth: number = 1.5; // How much the frequency varies
    export let volumeModRate: number = 0.05; // Speed of volume modulation in Hz
    export let volumeModDepth: number = 0.7; // How much the volume varies (0-1)

    let audioContext: AudioContext;
    let noiseNode: AudioBufferSourceNode;
    let oscillatorNode: OscillatorNode;
    let lfoNode: OscillatorNode;
    let lfoGain: GainNode;
    let volumeLfoNode: OscillatorNode;
    let noiseGain: GainNode;
    let oscillatorGain: GainNode;
    let isActive: boolean = true;
    let debugStatus: string = "Initializing...";

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

        // Create and configure noise
        const noiseBuffer = createPinkNoise(audioContext.sampleRate * 5);
        noiseNode = audioContext.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Create and configure oscillator
        oscillatorNode = audioContext.createOscillator();
        oscillatorNode.type = 'sine';
        oscillatorNode.frequency.setValueAtTime(tonalFrequency, audioContext.currentTime);

        // Create LFO for frequency modulation
        lfoNode = audioContext.createOscillator();
        lfoNode.type = 'sine';
        lfoNode.frequency.setValueAtTime(modulationRate, audioContext.currentTime);

        // Create gain node for LFO depth
        lfoGain = audioContext.createGain();
        lfoGain.gain.setValueAtTime(modulationDepth, audioContext.currentTime);

        // Create LFO for volume modulation
        volumeLfoNode = audioContext.createOscillator();
        volumeLfoNode.type = 'sine';
        volumeLfoNode.frequency.setValueAtTime(volumeModRate, audioContext.currentTime);

        // Create gain nodes for volume control
        noiseGain = audioContext.createGain();
        oscillatorGain = audioContext.createGain();
        
        // Set initial volumes with much more subtle variations
        noiseGain.gain.setValueAtTime(noiseVolume, audioContext.currentTime);
        oscillatorGain.gain.setValueAtTime(tonalVolume, audioContext.currentTime);

        // Connect frequency modulation
        lfoNode.connect(lfoGain);
        lfoGain.connect(oscillatorNode.frequency);

        // Connect volume modulation
        volumeLfoNode.connect(noiseGain.gain);
        volumeLfoNode.connect(oscillatorGain.gain);

        // Connect audio nodes
        noiseNode.connect(noiseGain);
        oscillatorNode.connect(oscillatorGain);
        noiseGain.connect(audioContext.destination);
        oscillatorGain.connect(audioContext.destination);

        // Start all nodes
        noiseNode.start();
        oscillatorNode.start();
        lfoNode.start();
        volumeLfoNode.start();

        // Add subtle random variations
        setInterval(() => {
            if (isActive) {
                // Frequency modulation changes (unchanged)
                const randomRate = modulationRate + (Math.random() * 0.1 - 0.05);
                lfoNode.frequency.setValueAtTime(randomRate, audioContext.currentTime);
                
                const randomDepth = modulationDepth + (Math.random() * 0.5 - 0.25);
                lfoGain.gain.setValueAtTime(randomDepth, audioContext.currentTime);

                // Very subtle volume variations for noise (only ±15% max)
                const randomNoiseVol = noiseVolume * (0.95 + Math.random() * 0.3); // 95-125% of base
                const randomTonalVol = tonalVolume * (0.9 + Math.random() * 0.2); // 90-110% of base
                
                // Longer, smoother transitions
                const transitionTime = 2 + Math.random() * 3; // 2-5 seconds

                noiseGain.gain.linearRampToValueAtTime(
                    randomNoiseVol, 
                    audioContext.currentTime + transitionTime
                );
                oscillatorGain.gain.linearRampToValueAtTime(
                    randomTonalVol, 
                    audioContext.currentTime + transitionTime
                );

                // Occasional very gentle gusts
                if (Math.random() < 0.05) { // 5% chance every 2 seconds
                    const gustVolume = noiseVolume * (1.1 + Math.random() * 0.2); // 110-130% burst
                    const gustDuration = 1 + Math.random() * 1; // 1-2 second gentle gust
                    
                    noiseGain.gain.linearRampToValueAtTime(
                        gustVolume,
                        audioContext.currentTime + 0.5
                    );
                    noiseGain.gain.linearRampToValueAtTime(
                        randomNoiseVol,
                        audioContext.currentTime + gustDuration
                    );
                }
            }
        }, 2000);

        debugStatus = "Audio running";
    }

    onMount(() => {
        console.log("AmbientSound: Mounting component");
        setupAudio();
    });

    onDestroy(() => {
        console.log("AmbientSound: Destroying component");
        isActive = false;
        if (noiseNode) noiseNode.stop();
        if (oscillatorNode) oscillatorNode.stop();
        if (lfoNode) lfoNode.stop();
        if (volumeLfoNode) volumeLfoNode.stop();
        if (audioContext) audioContext.close();
    });
</script>

{#if import.meta.env.DEV}
    <div class="fixed bottom-8 left-0 bg-black/50 text-green-500 p-2 font-mono text-sm z-50">
        AmbientSound Status: {debugStatus}
    </div>
{/if} 