# Fast Fail

`pnpm i` to install deps.



* Run `pnpm deploy:local` on Dojo repo
* Wait until `port:8080` is available ^^
* Run `pnpm dev` 
* Goto `localhost:5173` & Open dev console in browser
* See Models loaded from Torri 👍
* Enter in form & submit see response from `/api` 👍
* Execute Torri Tx and see subscription payload update in web app. 👍


^^ find relevant FE code in `+page.svelte`

See graphql onload query in `+page.gql`

---

## Extend API

Use the `routes/api/+server.ts` to **update** the POST method and trigger a transaction in Katana (from this server)


## scripts

`pnpm deploy:cp_syatem_abis` copies the abi json files from a dojo project, this is assumed to be at ../tot but can ofc be overidden 

