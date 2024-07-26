// place files you want to import through the `$lib` alias in this folder.


import { RpcProvider, Account, json, Contract } from 'starknet';
import fs from "fs";


const KATANA_ENDPOINT = 'http://localhost:5050';


//const pKey = process.env.KT_S0_ACT_P_KEY ?? "";
//const addr = process.env.KT_S0_ACT_ADDR ?? "";
const pKey = '0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a';
const addr = '0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828cae';


export async function systemCall() {

    // set up the provider and account. Writes are not free
    const katanaProvider: RpcProvider = new RpcProvider({ nodeUrl: KATANA_ENDPOINT });
    const burnerAccount: Account = new Account(katanaProvider, addr, pKey);

    // now get the contract abi's from the manifest and make a starknet contract
    const contractAbi = json.parse(
        fs.readFileSync('/Users/tims/DATA/bb/DOJO/TOT_ZK/JCEE/src/manifest/manifest.json').toString('ascii')
    );

    const contractAddr: string = '0x5351273085d5dfbf7ab213b6712cd0cd81b12eefcfa278b8f2791e9061af146';

    const theOutputter: Contract = new Contract(contractAbi.abi, contractAddr, katanaProvider);

    // connect the account to the contract
    theOutputter.connect(burnerAccount);
    
    // make calls to contract
    // we need to populate the calldata because of type conversion ? copying starknet.js here
    const call = theOutputter.populate('updateOutput', ["FoobyBarby pink dress death cult"]);
    // call it baby
    const response = await theOutputter.updateOutput(call.calldata);
    // pray for rain
    await katanaProvider.waitForTransaction(response.transaction_hash);

    // get bacon. shoot laser. win
    
    //const params = {
        //contractName: "outputter",
        //entrypoint: "updateOutput",
        //calldata: ["foo"],
    //};

    //const body = JSON.stringify({
        //jsonrpc: "2.0",
        //method: "starknet_chainId",
        //params,
        //id: 1
    //});

    //const response = await fetch(KATANA_ENDPOINT, {
        //method: 'POST',
        //headers: {
            //"Content-Type": 'application/json'
        //},
        //body,
    //});

    // scream shout, let it all out, cmon
    console.log(response);
    const data = await response.json();
    return data.result;

}
