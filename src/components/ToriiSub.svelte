<script lang="ts">
	import { torii_gql } from '$lib/queries';
	import { addTerminalContent } from '$lib/stores/terminal_content_store';

	export let entityId: string;

    let text_o: string | null;
  
    $: torii_gql.listen({ id: entityId });
  
    $: if ($torii_gql.data?.entityUpdated?.models) {
        const outputModel = $torii_gql.data.entityUpdated.models.find(
        model => model.__typename === 'the_oruggin_trail_Output'
    );
    if (outputModel) {
      text_o = outputModel.text_o_vision;
      console.log("BACON: ", text_o);
      addTerminalContent({ text: text_o, format: 'out' });
    }
  }	
</script>

<!-- This component doesn't render anything, it just sets up and manages the subscriptions -->
