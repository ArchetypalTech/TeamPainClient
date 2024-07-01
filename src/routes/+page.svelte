<script lang="ts">
  import { graphql } from "$houdini";
  import { browser } from "$app/environment";
  import type { PageData } from "./$houdini";
  import { onMount } from "svelte";
  export let data: PageData;

  $: ({ Nodes } = data);

  $: results = $Nodes.data;
  $: console.log(results);
  // let updates;
  // // will start listening onMount (browser only)

  // const store = graphql(`
  //   query Test {
  //     models {
  //       edges {
  //         node {
  //           contractAddress
  //         }
  //       }
  //     }
  //   }
  // `);
  // $: thing = updates ? updates : null;
  // $: console.log($thing);
  onMount(() => {
    const updates = graphql(`
      query Test {
        models {
          edges {
            node {
              contractAddress
            }
          }
        }
      }
    `);
    browser && console.log("hello");
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
