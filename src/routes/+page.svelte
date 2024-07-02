<script lang="ts">
  import { graphql } from "$houdini";
  // import { browser } from "$app/environment";
  // import { onMount } from "svelte";
  import type { PageData } from "./$houdini";
  export let data: PageData;

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

  $: updates.listen();
  $: event = $updates.data?.eventEmitted?.id || "pending";
  $: console.log($updates.data);

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
