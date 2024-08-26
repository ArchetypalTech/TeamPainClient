// place files you want to import through the `$lib` alias in this folder.
import { RpcProvider, Account, json, Contract, CallData, byteArray } from 'starknet';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export * from './system';



// ES6 work around for getting project relative paths
// const filepath = setFilePath('../manifest/outputter.json') // => filepath()
export const setFilePath = (target: string) => {
    // relative to $lib
    return () => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        return path.resolve(__dirname, target)
    }
}


// make this go away into a setup function
const MANIFEST = setFilePath('../manifest/system_meatpuppet.json')

// fish this from an env file if in local mode
const KATANA_ENDPOINT = 'http://127.0.0.1:5050';

// fish this from the manifest file also we need all of them
// meatpuppet
const ENTITY_ADDRESS = '0x39866b4c1b158743e06f0d415bac5f179a0eb9355e6f85362a48eeba191dac9'
const WORLD_ADDRESS = "0x1d6ab7a11c6729cb00cf4f6bc3dcc03178eab9cb47cbfad3ecac0808ed4d3c8";
// this should come from somewhere not quite so bad, i.e it needs to be passed into the setup functions
// should we be using `controller`at this point in the astartup logic
const pKey = '0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b';
const addr = '0x6b86e40118f29ebe393a75469b4d926c7a44c2e2681b6d319520b7c1156d114';




// SYSTEM CALLS
// import these based on the contract abi's
export const systemCalls = {
    sendMessage
}

// MUTATATION | ACTION | POST
/**
 * This should take a msg type that we parse out from the
 * contract abi's but right now we dont: FIXME!!
 * 
 * @param message 
 * @returns 
 */
export async function sendMessage(message: string) {

    console.log("MSG: ", message );
    const cmds_raw = message.split(/\s+/);
    const cmds = cmds_raw.filter(word => word !== "");
    console.log(cmds); 
    /** 
     * NO! this need to be passed the endpoint form the env or somewhere
     * worth remebering that `katana` doesnt listen on `localhost:*`
     */
    const katanaProvider: RpcProvider = new RpcProvider({ nodeUrl: KATANA_ENDPOINT });
    const burnerAccount: Account = new Account(katanaProvider, addr, pKey);

    // now get the contract abi's from the manifest and make a starknet contract
    const contractAbi = json.parse(fs.readFileSync(MANIFEST()).toString('ascii'));
    const theOutputter: Contract = new Contract(contractAbi.abi, ENTITY_ADDRESS, katanaProvider);

    // connect the account to the contract
    theOutputter.connect(burnerAccount);
    // create message as readable contract data
    const cmd_array = cmds.map(cmd => {
        return byteArray.byteArrayFromString(cmd);
    });
    // console.log(cmd_array);
    const calldata = CallData.compile([cmd_array, 23]);
    console.log('sending');
    console.log(calldata);
    // ionvoke the contract as we are doing a write
    let response = await theOutputter.invoke("listen", [calldata]);

    return new Response(JSON.stringify(response), {
        headers: {
            'Content-Type': "application/json"
        }
    })
}

// How we expect to use a standard RPC call
async function standardRPC() {
    // get bacon. shoot laser. win
    const params = {
        contractName: "outputter",
        entrypoint: "updateOutput",
        calldata: ["foo"],
    };

    const body = JSON.stringify({
        jsonrpc: "2.0",
        method: "starknet_chainId",
        params,
        id: 1
    });

    const response = await fetch(KATANA_ENDPOINT, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body,
    });
}
