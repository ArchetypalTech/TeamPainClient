<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { graphqlStatus } from '$lib/stores/graphqlStatus';
	console.log("LAYOUT----------->");

	// This will run on both server and client
	if (typeof window !== 'undefined') {
		fetch('/graphql').catch(() => {
			console.log('GraphQL server is down, but app continues to run');
			graphqlStatus.set({ isDown: true });
		});
	}
</script>

<slot />
