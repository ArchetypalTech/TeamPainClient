<script lang="ts">
  console.log("PAGE LOADING TEST");

  import { Terminal, Wallet, ToriiSub } from "$components";
  import { setupThree } from "../three";
  import { getEntityIdFromKeys } from "$lib/utils";
  import { onMount } from "svelte";
  import type { PageData } from './$houdini';
  import DebugTerminal from '../components/DebugTerminal.svelte';
  import { windowsStore, WindowType } from '$lib/stores/windows_store';
  export let data: PageData;

  $: ({ models, gqlAvailable } = data.data);

  const ENTITY_ID = 23;
  const entityId = getEntityIdFromKeys(ENTITY_ID);

  let hasError = false;

    function handleError(error: any) {
        hasError = true;
        console.log('Application error:', error);
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

<div class="w-screen h-screen relative bg-black">
  {#if !hasError}
      {#if $windowsStore[WindowType.DEBUG]}
          <div class="absolute top-5 left-[calc(16.666667%+1rem)] z-50">
              <div class="border border-green-500 rounded-md">
                  <DebugTerminal />
              </div>
          </div>
      {/if}
      <div class="absolute w-1/3 h-2/3 min-w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
          <Wallet />
          <Terminal />
          <ToriiSub {entityId} />
      </div>
      <div id="viewport"></div>
  {:else}
      <div class="flex items-center justify-center h-full">
          <!-- Removed error message div -->
      </div>
  {/if}
</div>

{#if !gqlAvailable}
    <p>GraphQL server is currently unavailable</p>
{/if}

{#if models?.edges?.length}
    <!-- Your existing model rendering code -->
    <ul>
    {#each models.edges as edge}
        <li>{edge.node.name}</li>
    {/each}
    </ul>
{:else}
    <p>No models available</p>
{/if}
