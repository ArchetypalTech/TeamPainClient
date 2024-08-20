<script lang="ts">
  import type { PageData } from "./$houdini";
  import { torii_client } from "$lib/queries";
  import { getEntityIdFromKeys } from "$lib/utils";
  import { onMount } from "svelte";
  // import { systemCalls } from "$lib";

  const ENTITY_ID = 23;
  export let data: PageData;
  let health = "";

  // basic initial graph query (from +page.gql)
  $: ({ Nodes } = data || {});
  $: results = JSON.stringify($Nodes?.data?.models?.edges?.[1]?.node);

  // subscription to katana (client)
  $: torii_client.listen({ id: getEntityIdFromKeys(ENTITY_ID) });
  // console.log($torii_client);
  var res : EntityModel$result = $torii_client.data;
  // console.log("RES", res);

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
</script>

<h1>The Trial Trail</h1>
<!-- <code>{results || "pending"}</code> -->
<hr />
<form on:submit|preventDefault={dispatch}>
  <input type="text" name="entry" />
  <button>Submit</button>
</form>
  <code>{ JSON.stringify($torii_client.data?.entityUpdated.models[0].text_o_vision  ) || "SubscriptionDataHere" }</code>
<br /><br /><br />
<button on:click={testRequest}>Test GET Request</button>
<p>health: {health || "pending test"}</p>
