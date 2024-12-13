<script lang="ts">
    import { AccountInterface } from 'starknet';
    import { ETH_CONTRACT } from '../be_fe_constants.js';
    export let account: AccountInterface | undefined;
 
    export async function execute(amount: string, manual: boolean) {
        if (!account) return;
 
        try {
            const result = await account.execute([
                {
                    contractAddress: ETH_CONTRACT,
                    entrypoint: manual ? 'increaseAllowance' : 'approve',
                    calldata: [account.address, amount, '0x0']
                },
                {
                    contractAddress: ETH_CONTRACT,
                    entrypoint: 'transfer',
                    calldata: [account.address, amount, '0x0']
                }
            ]);
            console.log('Transaction hash:', result.transaction_hash);
        } catch (e) {
            console.error(e);
        }
    }
</script>
 
<h2>Transfer Eth</h2>
	<button on:click={() => execute('0x0', false)}>Transfer 0 ETH to self</button>
	<button on:click={() => execute('0x1C6BF52634000', false)}>Transfer 0.005 ETH to self</button>
	<button on:click={() => execute('0x0', true)}>Manual: Transfer 0 ETH to self</button>	