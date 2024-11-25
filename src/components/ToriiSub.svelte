<!-- /*
 *
 * MeaCulpa (mc) 2024 lbdl | itrainspiders
 */ -->

<script lang="ts">
	import { torii_gql } from '$lib/queries';
	import { addTerminalContent } from '$lib/stores/terminal_content_store';
	import { onMount, onDestroy } from 'svelte';

	export let entityId: string;
    console.log("TORII_SUB_INIT:------>");

    let isConnected = false;
    let connError: string | null = null;
    let text_o: string | string[] = [];
    let connectionAttempts = 0;
    const MAX_RETRIES = 1000;
    const RETRY_DELAY = 5000;

    async function initializeConnection() {
        console.log('---------> XXX');
        try {
             await torii_gql.listen({ id: entityId });
            isConnected = true;
            connError = null;
            console.log('Connected to server...');
        } catch (error: any) {
            console.log('ERR: ----------> *');
            let err_msg = 'Unknown error occurred';
            if (error.cause?.code === 'ECONNREFUSED') {
                err_msg = 'Cannot connect to server. Is it running?';
            } else if (error.networkError) {
                err_msg = `Network error: ${error.networkError.message}`;
            } else if (error.graphQLErrors?.length) {
                err_msg = error.graphQLErrors.map((e: any) => e.message).join(', ');
            } else if (error.message) {
                err_msg = error.message;
            }
            handleConnectionError(err_msg);
        }
    }

    function handleConnectionError(error: string) {
        isConnected = false;
        connError = error;
        console.log('Subscription error:', error);
        
        if (connectionAttempts < MAX_RETRIES) {
            connectionAttempts++;
            console.log(`Retry attempt ${connectionAttempts}/${MAX_RETRIES}`);
            setTimeout(initializeConnection, RETRY_DELAY);
        } else {
            console.log('Maximum connection attempts reached');
        }
    }

    function processWhitespaceTags(input: string): string[] {
        const tagRegex = /\\([nrt])/g;
        const replacements: { [key: string]: string } = {
            'n': '\n',
            'r': '\r',
            't': '\t'
        };

        const processedString = input.replace(tagRegex, (match, p1) => replacements[p1] || match);
        
        console.log("Before processing:", input);
        console.log("After processing:", processedString);

        return processedString.split('\n');
    }

    let unsubscribe: (() => void) | null = null;
    
    onMount(() => {
        initializeConnection();
        return () => {
            // if (unsubscribe) unsubscribe();
        };
    });

    $: if ($torii_gql.errors) {
        const error = $torii_gql.errors[0].message;
        if (isConnected) {
            handleConnectionError(error);
        }
    }

    $: if ($torii_gql.data?.entityUpdated?.models) {
        // Reset connection attempts on successful data
        connectionAttempts = 0;
        
        const outputModel = $torii_gql.data.entityUpdated.models.find(
            model => model.__typename === 'the_oruggin_trail_Output'
        );
        if (outputModel) {
            text_o = outputModel.text_o_vision;
            console.log("BACON: ", text_o);

            let lines: string[];
            if (typeof text_o === 'string') {
                lines = processWhitespaceTags(text_o);
            } else if (Array.isArray(text_o)) {
                lines = text_o.flatMap(item => processWhitespaceTags(item));
            } else {
                lines = [];
            }

            for (const line of lines) {
                console.log("LINE: ", line);
                addTerminalContent({ 
                    text: line,
                    format: 'out',
                    useTypewriter: true 
                });
            }
        }
    } 
    </script>

{#if !isConnected}
    {#if connectionAttempts >= MAX_RETRIES}
        <div class="text-red-500 text-sm p-2">
            <p>Connection failed: {connError}</p>
            <p>Please ensure the server is running at the correct address and port (8080).</p>
            <p>Refresh the page to try again.</p>
        </div>
    {:else if connError }
        <div class="text-yellow-500 text-sm p-2">
            Attempting to connect... ({connectionAttempts}/{MAX_RETRIES})
        </div>
    {/if}
{/if}

<!-- This component doesn't render anything, it just sets up and manages the subscriptions -->
