<script lang="ts">

  import { Terminal, Wallet, ToriiSub, DebugTerminal, HelpTerminal } from "$components";
  import { setupThree } from "../three";
  import { getEntityIdFromKeys } from "$lib/utils";
  import { onMount } from "svelte";
  import { windowsStore, WindowType } from "$lib/stores/windows_store";
  import { helpStore } from '$lib/stores/help_store';
  import CameraShake from "$components/CameraShake.svelte";
  import Ambient from "$components/Ambient.svelte";

  // Controller - Cartridge
  import Controller from "@cartridge/controller";
  import { setAccountAddress, setUsername } from '../gameController/account';
  import {Manifest_Addresses, ETH_CONTRACT, Username} from "../be_fe_constants.js";
  import UserInfo from '../gameController/UserInfo.svelte';
  import TransferEth from '../gameController/TransferEth.svelte';

  const ENTITY_ID = 23;
  const entityId = getEntityIdFromKeys(ENTITY_ID);
  console.log("ID:------------> ", entityId);

  let hasError = false;
  let ambientSoundComponent: { switchTone: () => void };

  // Game Controller
  let loading: boolean = true;
  let account: any;
  let username: any;

  let controller = new Controller ({
        policies: [
            {
                target: Manifest_Addresses.ENTITY_ADDRESS,
                method: "approve",
                description: "Approve action",
            },
            {
            target: Manifest_Addresses.ENTITY_ADDRESS,
            method: "Don't allow",
            description: "Don't approve action",
            },
            {
            target: ETH_CONTRACT.eth_cont,
            method: "transfer",
            description: "Transfert ETH",
            },
            
        ],
        rpc: "https://api.cartridge.gg/x/starknet/sepolia" // sepolia, mainnet, or slot
    });

    function handleError(error: any) {
        hasError = true;
        console.error('Application error:', error);
    }

    // Connect to wallet
    async function connect() {
        try {
            const res = await controller.connect();
            if (res) {
             
                account = setAccountAddress(controller);                
                username = setUsername(Username.username);
                account.set(controller);
                username.set(await account.username());
            }
        } catch (e) {
            console.log("--->Wallet connection error: %d", e);
        }
    }

    // Disconnect wallet
    function disconnect() {
        controller.disconnect();
        account.set(undefined);
        username.set(undefined);
    }

    onMount(async() => {
        try {
            setupThree();
        } catch (error) {
            handleError(error);
        }

        // Connect to wallet automatically
        if (await controller.probe()) {
            // auto connect
            await connect();
            
        }
        loading = false;
        
    });
</script>

<style>
    :global(:root) {
        --terminal-width: 30%;
        --available-space: calc(100% - var(--terminal-width));
        --debug-width: calc(var(--terminal-width) * 0.8);
        --debug-margin: 2rem;
    }
</style>

<div class="w-screen h-screen relative bg-black">
  {#if !hasError}
      <div id="viewport" class="absolute inset-0 z-0"></div>
      <CameraShake />
      <Ambient 
          bind:this={ambientSoundComponent}
          tonalFrequency={220}
          tonalFrequency2={330}
          transitionTime={2}
      />
      
      <div class="relative z-10 w-full h-full">
          <div class="absolute w-[30%] h-2/3 min-w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
              <Wallet />
              <Terminal />
              <ToriiSub {entityId} />
          </div>

          {#if $windowsStore[WindowType.DEBUG]}
              <div class="absolute top-5" 
                   style="width: var(--debug-width); left: var(--debug-margin);">
                  <DebugTerminal />
              </div>
          {/if}

          {#if $helpStore.isVisible}
              <div class="absolute top-5 right-8" style="width: var(--debug-width);">
                  <HelpTerminal />
              </div>
          {/if}
      </div>
  {:else}
      <div class="flex items-center justify-center h-full">
          <div class="text-red-500 p-4">
              An error occurred. Please refresh the page to try again.
          </div>
      </div>
  {/if}

  {#if loading}
        <p>Loading</p>
    {:else if $account}
        <button on:click={disconnect}>Disconnect</button>
    {:else}
        <button on:click={connect}>Connect</button>
    {/if}

    
</div>
{#if $account && !loading}
    <UserInfo accountAddress={$account?.address} username={$username} />
    <TransferEth account={$account} />
{/if}
