<script lang="ts">
    import { onMount } from 'svelte';
    import { helpStore } from '$lib/stores/help_store';
    import Typewriter from './Typewriter.svelte';
    
    let terminalElement: HTMLDivElement;
    
    function scrollToBottom() {
        if (!terminalElement) return;
        setTimeout(() => {
            if (!terminalElement) return;
            terminalElement.scrollTop = terminalElement.scrollHeight;
        }, 0);
    }
    
    $: if (terminalElement) {
        scrollToBottom();
    }
</script>

<div class="help-terminal" bind:this={terminalElement}>
    <div class="title">HELP SYSTEM n23</div>
    <div class="content">
        <Typewriter
            text={$helpStore.currentText}
            minTypingDelay={0}
            maxTypingDelay={0}
            sentenceDelay={0}
        />
    </div>
</div>

<style>
    .help-terminal {
        position: relative;
        width: 100%;
        max-height: 400px;
        background: rgba(0, 0, 0, 0.8);
        color: #ffd700;  /* Gold color for help text */
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        border: 1px solid #ffd700;
    }
    
    .help-terminal::-webkit-scrollbar {
        display: none;
    }
    
    .help-terminal:hover::-webkit-scrollbar {
        display: block;
        width: 8px;
    }
    
    .help-terminal:hover::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    
    .help-terminal:hover::-webkit-scrollbar-thumb {
        background-color: rgba(255, 215, 0, 0.3);
        border-radius: 4px;
    }

    .title {
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 1px solid #ffd700;
        margin-bottom: 10px;
    }

    .content {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style> 