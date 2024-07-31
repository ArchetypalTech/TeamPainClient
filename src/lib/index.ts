// place files you want to import through the `$lib` alias in this folder.
import { RpcProvider, Account, json, Contract, CallData, byteArray } from 'starknet';
import fs from "fs";
import path from 'path'
import { fileURLToPath } from 'url';


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

const MANIFEST = setFilePath('../manifest/outputter.json')

const KATANA_ENDPOINT = 'http://localhost:5050';
const ENTITY_ADDRESS = '0x5351273085d5dfbf7ab213b6712cd0cd81b12eefcfa278b8f2791e9061af146'

const pKey = '0x1c9053c053edf324aec366a34c6901b1095b07af69495bffec7d7fe21effb1b';
const addr = '0x6b86e40118f29ebe393a75469b4d926c7a44c2e2681b6d319520b7c1156d114';

// SYSTEM CALLS

export const systemCalls = {
    sendMessage
}

// MUTATATION | ACTION

export async function sendMessage(message: string) {

    // set up the provider and account. Writes are not free
    const katanaProvider: RpcProvider = new RpcProvider({ nodeUrl: KATANA_ENDPOINT });
    const burnerAccount: Account = new Account(katanaProvider, addr, pKey);

    // now get the contract abi's from the manifest and make a starknet contract
    const contractAbi = json.parse(fs.readFileSync(MANIFEST()).toString('ascii'));
    const theOutputter: Contract = new Contract(contractAbi.abi, ENTITY_ADDRESS, katanaProvider);
    // connect the account to the contract
    theOutputter.connect(burnerAccount);
    // create message as readable contract data
    const calldata = CallData.compile([byteArray.byteArrayFromString(message)]);
    // call it baby
    const response = await theOutputter.updateOutput(calldata)
    // pray for rain
    await katanaProvider.waitForTransaction(response.transaction_hash);

    // scream shout, let it all out, cmon
    console.log("success", response);
    const data = await response.json();
    console.log("as json", data);
    return data.result;
    // should be using web standards
    // return new Response(JSON.stringify(data), {
    //     headers: {
    //         'Content-Type': "application/json"
    //     }
    // })
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
