<!-- /*
 *
 * MeaCulpa (mc) 2024 lbdl | itrainspiders
 */ -->

<script lang="ts">
	import { torii_gql } from '$lib/queries';
	import { addTerminalContent } from '$lib/stores/terminal_content_store';

	export let entityId: string;

    let text_o: string | string[] = [];

    function processWhitespaceTags(input: string): string[] {
        const tagRegex = /\\([nrt])/g;
        const replacements: { [key: string]: string } = {
            'n': '\n',
            'r': '\r',
            't': '\t'
        };

        const processedString = input.replace(tagRegex, (match, p1) => replacements[p1] || match);
        
        console.log("Before processing:", input);
        console.log("After processing:", processedString);

        return processedString.split('\n');
    }

    $: torii_gql.listen({ id: entityId });

    $: if ($torii_gql.data?.entityUpdated?.models) {
        const outputModel = $torii_gql.data.entityUpdated.models.find(
            model => model.__typename === 'the_oruggin_trail_Output'
        );
        if (outputModel) {
            text_o = outputModel.text_o_vision;
            console.log("BACON: ", text_o);

            let lines: string[];
            if (typeof text_o === 'string') {
                lines = processWhitespaceTags(text_o);
            } else if (Array.isArray(text_o)) {
                lines = text_o.flatMap(item => processWhitespaceTags(item));
            } else {
                lines = [];
            }

            for (const line of lines) {
                console.log("LINE: ", line);
                addTerminalContent({ text: line, format: 'out' });
            }
        }
    }
</script>

<!-- This component doesn't render anything, it just sets up and manages the subscriptions -->
