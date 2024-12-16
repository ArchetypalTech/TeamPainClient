<script lang="ts">
	
	import { onMount } from 'svelte';
  import { writable, get } from "svelte/store";

	// Controller - Cartridge
    import Controller from "@cartridge/controller";
    import {Manifest_Addresses, ETH_CONTRACT, Katana} from "../be_fe_constants.js";
    import UserInfo from '../gameController/UserInfo.svelte';
    import TransferEth from '../gameController/TransferEth.svelte';
    import {account, username, connected} from '../gameController/account';
	
  
	// States and variables
  let loading = true;
  let errorMessage: string | null = null;

  const showAccount = writable(false); // Controls visibility of the account panel
  const activeSection = writable('profile'); // Controls active section ('profile' or 'actions')

	// Controller setup and methods
	let controller = new Controller({
	  policies: [
		{
		  target: Manifest_Addresses.ENTITY_ADDRESS,
		  method: "approve",
		  description: "Approve submiting transactions to play The Oruggin Trail",
		},
		{
		  target: Manifest_Addresses.ENTITY_ADDRESS,
		  method: "reject",
		  description: "Reject submiting transactions to play The Oruggin Trail",
		},
		{
		  target: ETH_CONTRACT.eth_cont,
		  method: "transfer",
		  description: "Transfer ETH to yourself. Just for now",
		},
	  ],
	  rpc: "https://api.cartridge.gg/x/starknet/sepolia",
	});
  
	  // Toggle the account panel
    const toggleAccount = () => {
    showAccount.update((value) => !value);
  };

  // Close the account panel
  const closeAccount = () => {
    showAccount.set(false);
  };

  // Switch sections
  const showProfileSection = () => activeSection.set('profile');
  const showActionsSection = () => activeSection.set('actions');

  // Error handling
  function handleError(error: any) {
    errorMessage = 'An error occurred. Please try again.';
    console.error('Application error:', error);
  }
  
	// Connect to wallet
	async function connect() {
    loading = true;
    try {
      const res = await controller.connect();
      if (res) {
        account.set(Katana.addr);
        username.set(await controller.username());
        connected.set(true);
        showAccount.set(true); // Show the account panel after connection
      }
    } catch (e) {
      handleError(e);
    } finally {
      loading = false;
    }
  }

  
	// Disconnect wallet
	function disconnect() {
	  controller.disconnect();
	  account.set(undefined);
	  username.set(undefined);
    connected.set(false);
	}
  
	onMount(async () => {
	  try {
      if (await controller.probe()) {
        await connect();
      }
    } catch (error) {
      handleError(error);
    } finally {
      loading = false;
    }
	});
</script>
  
<style>
  .wallet-container {
    font-family: monospace;
    background-color: black;
    color: orange;
    border: 1px solid orange;
    border-radius: 0.375rem;
    padding: 1rem;
    position: relative;
    min-height: 75px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 1rem;
    position: relative;
    flex-wrap: wrap; /* Ensures buttons wrap on smaller screens */
  }

  .loading-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.85); /* Slightly darker for better contrast */
    color: #FFA500;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    font-size: 1rem; /* Larger for better visibility */
    text-align: center;
  }

  .account-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    max-width: 90%;
    background-color: black;
    color: orange;
    padding: 1rem;
    border: 2px solid orange;
    border-radius: 0.375rem;
    z-index: 9999;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0s 0.3s;
    pointer-events: none;
  }

  .account-panel.show {
    visibility: visible;
    opacity: 1;
    pointer-events: all;
  }

  .account-panel .close-account-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: rgba(255, 166, 0, 0.9); /* Brighter for hover focus */
    color: black;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
  }

  .account-panel .panel-categories-btns {
    position: relative;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background-color: rgba(255, 166, 0, 0.9); /* Brighter for hover focus */
    color: black;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .account-panel .panel-categories-btns:hover,
  .account-panel .close-account-btn:hover {
    background-color: orange;
    color: black;
  }

  .account-panel-section {
    display: none;
  }

  .account-panel-section.show {
    display: block;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
    visibility: hidden;
    pointer-events: none;
    transition: visibility 0s, opacity 0.3s ease;
  }

  .overlay.show {
    visibility: visible;
    opacity: 1;
    pointer-events: all;
  }

  .error-message {
    color: red;
    font-size: 1rem;
    margin-top: 1rem;
    text-align: center; /* Center for uniformity */
  }

  @media (max-width: 768px) {
    .account-panel {
      width: 90%;
    }

    .button-container {
      gap: 5px;
    }
  }
</style>

<div class="wallet-container">
  <div>Archetypal Tech Wallet Facility no:23</div>
  <div class="button-container">
    {#if loading}
      <span class="loading-text">Loading...</span>
    {:else}
      {#if $account}
        <button on:click={toggleAccount}>
          {$showAccount ? 'Close Account' : 'My Account'}
        </button>
        <button on:click={disconnect}>Disconnect</button>
      {:else}
        <button on:click={connect}>Connect</button>
      {/if}
    {/if}
  </div>
</div>

{#if $account && !loading}
  <div class="account-panel { $showAccount ? 'show' : '' }">
    <div>
      <button class="panel-categories-btns" on:click={showProfileSection}>
        My Profile
      </button>
      <button class="panel-categories-btns" on:click={showActionsSection}>
        My Actions
      </button>
      <button class="close-account-btn" on:click={closeAccount}>
        Close
      </button>
    </div>

    <div class="account-panel-section { $activeSection === 'profile' ? 'show' : '' }">
      <UserInfo accountAddress={$account?.address} user_name={$username} />
    </div>

    <div class="account-panel-section { $activeSection === 'actions' ? 'show' : '' }">
      <TransferEth account={$account} />
    </div>
  </div>
{/if}

{#if $showAccount}
  <button
    class="overlay show"
    on:click={closeAccount}
    aria-label="Close Account"
  ></button>
{/if}

{#if errorMessage}
  <div class="error-message">{errorMessage}</div>
{/if}