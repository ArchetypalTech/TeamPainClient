<script lang="ts">

  import { Terminal, Wallet, ToriiSub, DebugTerminal } from "$components";
  import { setupThree } from "../three";
  import { getEntityIdFromKeys } from "$lib/utils";
  import { onMount } from "svelte";
  import { windowsStore, WindowType } from "$lib/stores/windows_store";

  const ENTITY_ID = 23;
  const entityId = getEntityIdFromKeys(ENTITY_ID);

  let hasError = false;

    function handleError(error: any) {
        hasError = true;
        console.error('Application error:', error);
    }

    onMount(() => {
        try {
		        console.log("PAGE::ONMOUNT----------->");
            setupThree();
            console.log("setup:page");
        } catch (error) {
            handleError(error);
        }
    });
</script>

<style>
    :global(:root) {
        --terminal-width: 33.333%;
        --available-space: 33.333%;
        --debug-width: calc(var(--available-space) * 0.6);
        --debug-margin: calc((var(--available-space) - var(--debug-width)) / 2);
    }
</style>

<div class="w-screen h-screen relative bg-black">
  {#if !hasError}
      <div id="viewport"></div>
      <div class="absolute w-1/3 h-2/3 min-w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
          <Wallet />
          <Terminal />
          <ToriiSub {entityId} />
      </div>
      {#if $windowsStore[WindowType.DEBUG]}
          <div class="absolute top-5 z-50" 
               style="width: var(--debug-width); left: var(--debug-margin)">
                  <DebugTerminal />
          </div>
      {/if}
  {:else}
      <div class="flex items-center justify-center h-full">
          <div class="text-red-500 p-4">
              An error occurred. Please refresh the page to try again.
          </div>
      </div>
  {/if}
</div>
