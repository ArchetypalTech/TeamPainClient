// place files you want to import through the `$lib` alias in this folder.
const KATANA_ENDPOINT = 'http://localhost:5050'
export async function systemCall() {

  const params = {
    contractName: "outputter",
    entrypoint: "updateOutput",
    calldata: ["foo"],
  }

  const body = JSON.stringify({
    jsonrpc: "2.0",
    method: "starknet_chainId",
    params,
    id: 1
  })

  const response = await fetch(KATANA_ENDPOINT, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body,
  })
  console.log(response)
  const data = await response.json()
  return data.result

}