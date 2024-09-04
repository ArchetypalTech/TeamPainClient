# TeamPain Client

This a minimal front end client for the [O'Ruggin Trail](https://github.com/ArchetypalTech/TheOrugginTrail-DoJo) implemenation of the ZORG engine.

It is a Svelekit and GraphQL based app wrapping [Starknet.js](https://github.com/starknet-io/starknet.js).

It also aims to present a simple tutorial for setting up the above mentioned stack for general interaction with :shinto_shrine: [Dojo](https://github.com/dojoengine/dojo) based worlds and contains some shell utilities for copying over the manifest and abi files from a dojo project, deploying itself and also deploying the cotract stack for local development.

For a simple tutorial/template for a Sveltekit/GraphQL app check out branch `pain_lessons/101`.

For a more complex version of the above (more features, etc) check out `pain_lessons/102`.
## Setup and usage

* Run `pnpm deploy:local` on Dojo repo
* Wait until `port:8080` is available ^^
* Run `pnpm dev` 
* Goto `localhost:5173` & Open dev console in browser
* See Models loaded from Torri 👍
* Enter in form & submit see response from `/api` 👍
* Execute Torii Tx and see subscription payload update in web app. 👍


^^ find relevant FE code in `+page.svelte`

See graphql onload query in `+page.gql`

---

## Extend API

Use the `routes/api/+server.ts` to **update** the POST method and trigger a transaction in Katana (from this server)


## Utility scripts

`pnpm deploy:cp_syatem_abis` copies the abi json files from a dojo project, this is assumed to be at ../tot but can ofc be overidden 

