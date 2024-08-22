<script lang="ts">
  import { Terminal, Wallet, ToriiSub } from "$components";

  import { setupThree } from "../three";
  
  import { getEntityIdFromKeys } from "$lib/utils";
  
  import { onMount } from "svelte";

  // DANK_MODE
  // errm not ideal, we really need to attach an ID per registed player
  // and then tie the output to that id but right now we dont have any form of
  //unique p[layer at all
  const ENTITY_ID = 23;
  const entityId = getEntityIdFromKeys(ENTITY_ID);

  onMount(() => {
		setupThree();
	});

</script>

<div class="w-screen h-screen relative bg-black">
	<div
		class="absolute w-1/3 h-2/3 min-w-[350px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col">
		<Wallet />
		<Terminal />
    <ToriiSub {entityId} />
	</div>
	<div id="viewport"></div>
</div>
