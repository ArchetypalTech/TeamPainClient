<script lang="ts">
    import { account, accountAddress, username } from "../gameController/account"; // Import the stores
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

<h2>Your Information</h2>
<div class="info-container">
    {#if $account}
        <p><span class="bold">Account Address:</span> <span class="account-address">{$accountAddress}</span></p>
    {:else}
        <p><span class="bold">No account connected</span></p>
    {/if}

    {#if $username}
        <p><span class="bold">Username:</span> {$username}</p>
    {/if}
</div>
