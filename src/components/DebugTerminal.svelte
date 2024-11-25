<script lang="ts">
    import { onMount } from 'svelte';
    
    let messages: string[] = [];
    let terminalElement: HTMLDivElement;
    
    // Intercept console.log
    onMount(() => {
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : arg
            ).join(' ');
            messages = [...messages, message].slice(-50); // Keep last 50 messages
            originalConsoleLog.apply(console, args);
        };
        
        return () => {
            console.log = originalConsoleLog;
        };
    });
    
    // Auto scroll when content changes
    $: if (terminalElement) {
        terminalElement.scrollTop = terminalElement.scrollHeight;
    }
</script>

<div class="debug-terminal">
    {#each messages as message}
        <div class="message">{message}</div>
    {/each}
</div>

<style>
    .debug-terminal {
        position: fixed;
        top: 10px;
        left: 10px;
        width: 33vw;
        max-height: 200px;
        background: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        overflow-y: auto;
        z-index: 1000;
    }
    
    .message {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style> 