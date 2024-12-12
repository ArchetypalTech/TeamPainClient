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
const MANIFEST = setFilePath('../manifest/the_oruggin_trail_meatpuppet.contract_class.json');

// fish this from an env file if in local mode
const KATANA_ENDPOINT = 'http://127.0.0.1:5050';

// fish this from the manifest file also we need all of them
// meatpuppet
//  cat manifest_dev.json | jq -r '.contracts[0].address' 
const ENTITY_ADDRESS = '0x6f758cfd367ac46b8cae5b74770503253f0fd090097cfb0d8772ce275ea1376';
// the world
// cat manifest_dev.json | jq -r '.world.address'
const WORLD_ADDRESS ="0x7f50de543f4d1093b7e9119f204849a75663a2b040ec45e5dc71e469ef5232b";


// Account address |  0x6677fe62ee39c7b07401f754138502bab7fac99d2d3c5d37df7d1c6fab10819
// Private key     |  0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4
// we be using `controller`at this point in the astartup logic
// but right now this is in dev mode and comes direct from katana as its default accounts
const addr = '0x6677fe62ee39c7b07401f754138502bab7fac99d2d3c5d37df7d1c6fab10819';
const pKey = '0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4';




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
