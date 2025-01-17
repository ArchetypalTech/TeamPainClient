<script lang="ts">
	
	import { onMount, tick } from 'svelte';
  import { writable, get } from "svelte/store";

	// Controller - Cartridge
    import Controller from "@cartridge/controller";
    import {Manifest_Addresses, Katana} from "../be_fe_constants.js";
    import UserInfo from '../Wallets/gameController/UserInfo.svelte';
    import TransferEth from '../Wallets/gameController/TransferEth.svelte';
    import { addrContract } from '../FerryTicketToken/FerryTicket_constants.js';
    import {accountController, walletAddressCont, username, connectedToCGC, accountArgentX , walletAddressArX, connectedToArX, providerST} from '../Wallets/account';

  // Argent X - Wallet
    import { connect, disconnect } from "get-starknet";
      
  // Starknet.js
   import { WalletAccount } from 'starknet';
 
  
	// States and variables
  let loading = true;
  let errorMessage: string | null = null;

  const showAccount = writable(false); // Controls visibility of the account panel
  const activeSection = writable('profile'); // Controls active section ('profile' or 'actions')

  //--------------Cartridge Game Controller--------------//
	// Controller setup and methods
	let controller = new Controller({
    colorMode: 'dark',
    //theme: "here will go our theme that needs to be designed and added",
    // Policies are required to be defined betther
	  policies: [
      {
        // target is the meatpuppet system, which is the entry to the world
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
        // Approve minting NFT
        target: addrContract,
        method: "approve",
        description: "Approve minting NFT's",
      },
      {
        // Reject minting NFT
        target: addrContract,
        method: "reject",
        description: "Reject minting NFT's",
      },
      {
        // Approve transfering the NFT
        target: addrContract,
        method: "approve",
        description: "Approve transfering NFT's",
      },
      {
        // Reject transfering NFT
        target: addrContract,
        method: "reject",
        description: "Reject transfering NFT's",
      },
	  ],
    // Network to connect to
    // Can be mainnet, sepolia, slot
	  rpc: "https://api.cartridge.gg/x/starknet/sepolia",
    // List of tokens to follow
    tokens: {
      erc721: [addrContract],
    },
	});

  // Connect to Cartridge Game Controller
	async function connectCGC() {
    loading = true;
    try {
      const res = await controller.connect(); // Get response from the connection 
      console.log("res is", res);
      
      if (res) {
        accountController.set(res); // Store the controller
        console.log("storedController-controller is ", get(accountController));

        username.set(await controller.username()); // Store the username
        console.log("Username is", get(username));        

        //walletAddressCont.set(Katana.addr); // Store the account address. Needed?
        walletAddressCont.set(res.address); // Store the account address. 
        console.log("accountController address 3 is", get(walletAddressCont));

        connectedToCGC.set(true); // Store the connected status to true
      }
    } catch (e) {
      handleError(e);
    } finally {
      loading = false;
    }
  }

  // Open the controller's profile
  const openUserProfile = () => {
    controller.openProfile("inventory");
  };  

  // Disconnect from Cartridge Game Controller
	function disconnectCGC() {
	  controller.disconnect(); // Disconnect the controller
    accountController.set(undefined); // Set to undefine the account
	  username.set(undefined); // Set to undefine the username
    walletAddressCont.set(undefined); // Set to undefine the accountAddr
    connectedToCGC.set(false); // Set to false the connected status
	}

  //--------------Argent X Wallet--------------//
  // Connect to Argent X wallet
  const connectWallet = async () => {     
    // Connect to wallet
    const selectedWalletSWO = await connect({ modalMode: 'alwaysAsk', modalTheme: 'system' });

    // Define myWalletAccount based on the connected wallet above
    const myWalletAccount = new WalletAccount({ nodeUrl: providerST }, selectedWalletSWO);

    // If defined
    if (myWalletAccount) {
      // Store the wallet and the account address
      accountArgentX.set(myWalletAccount); 
      walletAddressArX.set(myWalletAccount.walletProvider?.selectedAddress);

      // If local variable not connected to Argent X
      if (!get(connectedToArX)) {
        // Set local variable connected to true
        connectedToArX.set(true);
        // Debug
        console.log("wallet address is:", get(walletAddressArX));
        console.log("wallet is on:", myWalletAccount );
      }         
    }   
  }

  // Disconnect to Argent X wallet
  const disconnectWallet = async () => {
    await disconnect();
    accountArgentX.set(null);
    walletAddressArX.set(null);
    connectedToArX.set(false);
  }

  // Error handling
  function handleError(error: any) {
    errorMessage = 'An error occurred. Please try again.';
    console.error('Application error:', error);
  }
  
	onMount(async () => {
	  // Try to connect to a previous cartridge controller
    try {
      if (await controller.probe()) {
        await connectCGC();
      }
    } catch (error) {
      handleError(error);
    } finally {
      loading
      = false;
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
      <!--For Cartride Controller -->
      {#if $accountController}
        <button on:click={openUserProfile}>{get(username)}'s Inventory</button>
       
        <button on:click={disconnectCGC}>Disconnect Controller</button>
      {:else}
        <button on:click={connectCGC}>Connect Controller</button>
      {/if}
      <span class="||"> || </span>
       <!--For Argent x -->
      {#if $walletAddressArX}
      <button on:click={disconnectWallet}>Disconnect Wallet</button>
      {:else}
      <button on:click={connectWallet}>Connect Wallet</button>
      {/if}

    {/if}
  </div>
</div>

<!--NOT IN USE, MIGHT NEED TO DELETE -->
<!-- {#if $account && !loading}
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
      <UserInfo accountAddr={$account?.address} username={$username} />
    </div>

    <div class="account-panel-section { $activeSection === 'actions' ? 'show' : '' }">
      <TransferEth account={$account} />
    </div>
  </div>
{/if} -->

{#if $accountController && !loading}
    <UserInfo accountAddress={$accountController.address} username={$username} />
    <TransferEth account={$accountController} />
{/if}

<!-- {#if $showAccount}
  <button
    class="overlay show"
    on:click={closeAccount}
    aria-label="Close Account"
  ></button>
{/if} -->

{#if errorMessage}
  <div class="error-message">{errorMessage}</div>
{/if}