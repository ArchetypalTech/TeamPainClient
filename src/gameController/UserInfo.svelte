<script lang="ts">
    import {account} from '../gameController/account';
    export let accountAddr: string | undefined;
	export let username: string | undefined;
</script>

<h2>User Information</h2>
<div>
	{#if accountAddr}
		<p>Account Address: {accountAddr}</p>
	{:else}
		<p>No account connected</p>
	{/if}

	{#if username}
		<p>Username: {username}</p>
	{/if}
</div>
