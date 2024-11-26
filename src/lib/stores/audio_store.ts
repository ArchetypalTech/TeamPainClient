import { writable } from 'svelte/store';

interface AudioState {
    windEnabled: boolean;
    toneEnabled: boolean;
    cricketEnabled: boolean;
}

function createAudioStore() {
    const { subscribe, update } = writable<AudioState>({
        windEnabled: true,
        toneEnabled: true,
        cricketEnabled: true
    });

    return {
        subscribe,
        toggleWind: () => update(state => {
            console.log('---------->TOG:WIND');
            const newState = { ...state, windEnabled: !state.windEnabled };
            console.log('🌬️ Wind toggled:', { previous: state.windEnabled, new: newState.windEnabled });
            return newState;
        }),
        toggleTone: () => update(state => {
            const newState = { ...state, toneEnabled: !state.toneEnabled };
            console.log('🎵 Tone toggled:', { previous: state.toneEnabled, new: newState.toneEnabled });
            return newState;
        }),
        toggleCricket: () => update(state => {
            const newState = { ...state, cricketEnabled: !state.cricketEnabled };
            console.log('🦗 Cricket toggled:', { previous: state.cricketEnabled, new: newState.cricketEnabled });
            return newState;
        })
    };
}

export const audioStore = createAudioStore(); 