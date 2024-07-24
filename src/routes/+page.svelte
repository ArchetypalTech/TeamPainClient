<script lang="ts">
  import { graphql } from "$houdini";
  import type { PageData } from "./$houdini";
  import { getEntityIdFromKeys } from "$lib/utils";
  import { systemCall } from "$lib";

  export let data: PageData;

  // basic initial graph query (from +page.gql)
  $: ({ Nodes } = data);

  $: results = $Nodes.data;
  $: console.log(results);

  const updates = graphql(`
    subscription Event {
      eventEmitted {
        id
        keys
      }
    }
  `);

  // let entitySub = (id: string) => {
  //   return graphql(`
  //     subscription EntityModel {
  //       entityUpdated(id: id) {
  //         keys
  //         models {
  //           __typename
  //         }
  //       }
  //     }
  //   `);
  // };

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
  let possibleKey = "";

  let asPoison = getEntityIdFromKeys();

  setTimeout(() => {
    systemCall();
  }, 3000);
</script>

<h1>The Trial Trail</h1>
<code>{event}</code>
<code>{results?.outputModels?.edges[0]?.node?.text || "pending"}</code>
<hr />
<form on:submit|preventDefault={dispatch}>
  <input type="text" name="entry" />
  <button>Submit</button>
</form>
<input type="text" bind:value={possibleKey} />
<code>{asPoison}</code>
