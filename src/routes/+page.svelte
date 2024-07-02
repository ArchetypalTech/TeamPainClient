<script lang="ts">
  import { graphql } from "$houdini";
  // import { browser } from "$app/environment";
  // import { onMount } from "svelte";
  import type { PageData } from "./$houdini";
  export let data: PageData;

  // basic initial graph query (from +page.gql)
  $: ({ Nodes } = data);

  $: results = $Nodes.data;
  $: console.log(results);

  const updates = graphql(`
    subscription Event {
      eventEmitted {
        id
      }
    }
  `);

  // subscription to torri
  $: updates.listen();
  $: event = $updates.data?.eventEmitted?.id || "pending";
  $: console.log($updates.data);

  // POST input data to /api endpoint
  async function dispatch(event: Event) {
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    const response = await fetch("/api", {
      method: "POST",
      body: data,
    });
    const { value } = await response.json();
    console.log("data consumed:", value);
  }
</script>

<h1>The Trial Trail</h1>
<code>{event}</code>
<hr />
<form on:submit|preventDefault={dispatch}>
  <input type="text" name="entry" />
  <button>Submit</button>
</form>
