<script lang="ts">
  import type { PageData } from "./$houdini";
  import { torii_client } from "$lib/queries";
  import { Terminal, Wallet } from "$components";

  // move into lib: FIXME
  import { setupThree } from "../three";
  
  // this should move into a util somewhere
  import { getEntityIdFromKeys } from "$lib/utils";
  
  import { onMount } from "svelte";

  const ENTITY_ID = 23;
  export let data: PageData;
  let health = "";

  // basic initial graph query (from +page.gql)
  $: ({ Nodes } = data || {});
  $: results = JSON.stringify($Nodes?.data?.models?.edges?.[1]?.node);

  // subscription to katana (client)
  $: torii_client.listen({ id: getEntityIdFromKeys(ENTITY_ID) });

  // TODO: types for Gql we JSON.stringify right now
  // $: stream = $torii_client.data || "waiting for transaction";

  // POST input data to /api endpoint
  async function dispatch(event: Event) {
    console.log('DISPATCH')
    const form = event.target as HTMLFormElement;
    const body = new FormData(form);
    console.log(body.get('entry'));
    const response = await fetch("/api", {
      method: "POST",
      body,
    });
    const details = await response.json();
    console.log("katana says:", details);
  }

  async function testRequest() {
    console.log('test req')
    const call = await fetch("/api", { method: "GET" });
    const status = await call.json();
    health = JSON.stringify(status);
  }

  onMount(() => {
		setupThree();
		// authenticateUser();
	});

</script>

<!-- <h1>The Trial Trail</h1> -->
<!-- <code>{results || "pending initial query: fetch models"}</code> -->
<!-- <hr /> -->

<!-- <form on:submit|preventDefault={dispatch}>
  <input type="text" name="entry" />
  <button>Submit</button>
</form>
  <code>{ JSON.stringify($torii_client.data?.entityUpdated.models[0].text_o_vision  ) || "SubscriptionDataHere" }</code>
<br /><br /><br />
<button on:click={testRequest}>Test GET Request</button> -->
<!-- <div class="test-style">
  Hello, Tailwind in SvelteKit!
</div> -->
<!-- <div class="text-red-500 text-2xl font-bold">
  This should be red, large, and bold if Tailwind is working.
</div> -->

<div class="w-screen h-screen relative bg-black">
  <!-- <div class="bg-blue-500 text-white p-4 rounded-lg">
    Hello, Tailwind!
  </div> -->
<!-- <h1>The Trial Trail</h1> -->
<!-- <code>{results || "pending initial query: fetch models"}</code> -->
<!-- <hr /> -->
	<div
		class="absolute w-1/3 h-2/3 min-w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
		<Wallet />
		<Terminal />
	</div>
	<div id="viewport"></div>
</div>
<!-- <p>health: {health || "pending test"}</p> -->
