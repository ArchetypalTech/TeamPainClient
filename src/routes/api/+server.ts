import { exec } from 'child_process';
import type { RequestHandler } from './$types';

// TODO - this manifest-path will FAIL
const COMMAND = `sozo execute --manifest-path ./tot-dojo/Scarb.toml the_oruggin_trail::systems::outputter::outputter updateOutput --calldata str:"foo"`
// toggle to pass command to Torri client
const debug = true;

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
