<script lang="ts">
    //import { account, username } from "../gameController/account"; // Import the stores
    export let accountAddress: string | undefined;
	export let username: string | undefined;
</script>


<style>
    .info-container {
        padding: 1rem;
        font-size: 1rem;
        color: #fff;
    }

    .bold {
        font-weight: bold;
    }

    .account-address {
        font-size: 1.1rem; /* Set a default size for the account address */
        word-wrap: break-word; /* Ensure that long addresses wrap properly */
        white-space: pre-wrap; /* To preserve spaces and wrap long text */
        overflow-wrap: break-word; /* Break long text to fit the container */
    }

    .info-container p {
        margin: 0.5rem 0;
    }
</style>

<h2>User Information</h2>
<!-- <div class="info-container">
    {#if accountAddress}
        <p><span class="bold">Account Address:</span> <span class="account-address">{$accountAddress}</span></p>
    {:else}
        <p><span class="bold">No account connected</span></p>
    {/if}

    {#if user_name}
        <p><span class="bold">Username:</span> {user_name}</p>
    {/if}
</div> -->
<div>
	{#if accountAddress}
		<p>Account Address: {accountAddress}</p>
	{:else}
		<p>No account connected</p>
	{/if}

	{#if username}
		<p>Username: {username}</p>
	{/if}
</div>
