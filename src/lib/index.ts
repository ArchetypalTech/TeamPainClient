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
const MANIFEST = setFilePath('../manifest/systems_outputter.json')

// fish this from an env file if in local mode
const KATANA_ENDPOINT = 'http://127.0.0.1:5050';

// fish this from the manifest file also we need all of them
const ENTITY_ADDRESS = '0x5351273085d5dfbf7ab213b6712cd0cd81b12eefcfa278b8f2791e9061af146'
const WORLD_ADDRESS = "0x5112adeb35112eccb3f3bc823bac1bfe73693a0872f7a579045e510e9219b49";
// this should come from somewhere not quite so bad, i.e it needs to be passed into the setup functions
// should we be using `controller`at this point in the astartup logic
const pKey = '0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b';
const addr = '0x6b86e40118f29ebe393a75469b4d926c7a44c2e2681b6d319520b7c1156d114';




// SYSTEM CALLS
// import these based on the contract abi's
export const systemCalls = {
    sendMessage
}


// MUTATATION | ACTION

export async function sendMessage(message: string) {

    console.log("MSG: ", message );
    // set up the provider and account. Writes are not free
    const katanaProvider: RpcProvider = new RpcProvider({ nodeUrl: KATANA_ENDPOINT });
    const burnerAccount: Account = new Account(katanaProvider, addr, pKey);

    console.log('send');
    // now get the contract abi's from the manifest and make a starknet contract
    const contractAbi = json.parse(fs.readFileSync(MANIFEST()).toString('ascii'));
    const theOutputter: Contract = new Contract(contractAbi.abi, ENTITY_ADDRESS, katanaProvider);
    // console.log(theOutputter);
    // connect the account to the contract
    theOutputter.connect(burnerAccount);
    // create message as readable contract data
    const calldata = CallData.compile([byteArray.byteArrayFromString(message)]);
    console.log('sen-dd');
    // call it baby
    // const response = await theOutputter.updateOutput(calldata);
    let response = await theOutputter.invoke("updateOutput", [calldata])
    console.log('sen-ddd');
    // pray for rain
    console.log('calling katana....');
    await katanaProvider.waitForTransaction(response.transaction_hash);

    // scream shout, let it all out, cmon
    console.log("success", response);
    // const data = await response.json();
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
