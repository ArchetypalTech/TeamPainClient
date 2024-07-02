<script lang="ts">
  import { graphql } from "$houdini";
  // import { browser } from "$app/environment";
  // import { onMount } from "svelte";
  import type { PageData } from "./$houdini";
  export let data: PageData;

  $: ({ Nodes } = data);

  $: results = $Nodes.data;
  $: console.log(results); // works

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
</script>

<h1>The Trial Trail</h1>
{event}
