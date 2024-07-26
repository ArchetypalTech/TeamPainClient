import { exec } from 'child_process';
import type { RequestHandler } from './$types';
import fs from "fs";
import { RpcProvider, Account, json, Contract } from 'starknet';


const KATANA_ENDPOINT = 'http://localhost:5050';
// this SHOULD be a burner account deployed on Katana by default
const pKey = '0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a';
const addr = '0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828cae';


// TODO - this manifest-path will FAIL
const COMMAND = `sozo execute --manifest-path ./tot-dojo/Scarb.toml the_oruggin_trail::systems::outputter::outputter updateOutput --calldata str:"foo"`
// toggle to pass command to Torri client
const debug = true;

// get
export const GET: RequestHandler = async () => {
    // set up the provider and account. Writes are not free
    const katanaProvider: RpcProvider = new RpcProvider({ nodeUrl: KATANA_ENDPOINT });
    const burnerAccount: Account = new Account(katanaProvider, addr, pKey);

    //console.log(burnerAccount)
    //const actionsContractAbi = json.parse(
        //fs.readFileSync('/Users/tims/DATA/bb/DOJO/TOT_ZK/JCEE/src/manifest/actions.json').toString('ascii')
    //);

    const contractAbi = json.parse(
        fs.readFileSync('/Users/tims/DATA/bb/DOJO/TOT_ZK/JCEE/src/manifest/manifest.json').toString('ascii')
    );
    //console.log(contractAbi);

    const contractAddr: string = '0x5351273085d5dfbf7ab213b6712cd0cd81b12eefcfa278b8f2791e9061af146';
    //const actionContractAddr: string = '0x68d70420390be33149d1c82e49096fff612fe1c95abd5528aa559e7c6527f78';

    //const theAction: Contract = new Contract(actionsContractAbi.abi, actionContractAddr, katanaProvider);
    const theOutputter: Contract = new Contract(contractAbi.abi, contractAddr, katanaProvider);
    //console.log(theOutputter);

    // connect the account to the contract
    theOutputter.connect(burnerAccount);
    //theAction.connect(burnerAccount);
    //console.log(theOutputter);

    // make calls to contract
    const call = theOutputter.populate('updateOutput', ["FoobyBarby pink dress death cult"]);
    console.log(call.calldata)

    // call it baby
    //const actionResponse = await theAction.call("spawn");
    const response = await theOutputter.updateOutput(call.calldata);
    //const response = await theOutputter.invoke("updateOutput", ["foo"]);
    //console.log(`-----> res: ${response}`)
    console.log(`-----> res: ${actionResponseResponse}`)

    // pray for rain
    await katanaProvider.waitForTransaction(response.transaction_hash);
    return new Response(JSON.stringify({ success: true}), {
        headers: {
            'Content-Type': "application/json"
        }
    })

}

// POST on route /api
export const POST: RequestHandler = async (event) => {
  const data = await event.request.formData()
  const action = data.get('entry')
  // log recieving POST
  console.log(action)

  const RESPONSE = new Response(JSON.stringify({ success: true, value: action }), {
    headers: {
      'Content-Type': "application/json"
    }
  })
  if (debug) return RESPONSE
  // example to show you can execute server side code here
  return new Promise((resolve, reject) => {
    exec(COMMAND, (error, stdout, stderr) => {
      if (error) console.warn(error);
      if (stdout) resolve(RESPONSE);
      reject(stderr)
    });
  })
}
