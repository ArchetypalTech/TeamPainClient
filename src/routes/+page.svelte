<script lang="ts">
  import type { PageData } from "./$houdini";
  import { katana } from "$lib/queries";
  import { getEntityIdFromKeys } from "$lib/utils";

  const ENTITY_ID = 23;
  export let data: PageData;
  let health = "";

  // basic initial graph query (from +page.gql)
  $: ({ Nodes } = data || {});
  $: results = JSON.stringify($Nodes?.data?.models?.edges?.[1]?.node);

  // subscription to katana (client)
  $: katana.listen({ id: getEntityIdFromKeys(ENTITY_ID) });
  $: stream = $katana.data || "waiting for transaction";

  // POST input data to /api endpoint
  async function dispatch(event: Event) {
    const form = event.target as HTMLFormElement;
    const body = new FormData(form);
    const response = await fetch("/api", {
      method: "POST",
      body,
    });
    const details = await response.json();
    console.log("katana says:", details);
  }

  async function testRequest() {
    const status = await fetch("http://localhost:5173/api", { method: "GET" });
    health = JSON.stringify(status);
  }
</script>

<h1>The Trial Trail</h1>
<code>{results || "pending"}</code>
<hr />
<form on:submit|preventDefault={dispatch}>
  <input type="text" name="entry" />
  <button>Submit</button>
</form>
<code>{stream}</code>
<br /><br /><br />
<button on:click={testRequest}>Test GET Request</button>
<p>health: {health || "pending test"}</p>
