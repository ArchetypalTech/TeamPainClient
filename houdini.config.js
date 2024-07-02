/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "watchSchema": {
        "url": "http://127.0.0.1:8080/graphql"
    },
    "plugins": {
        "houdini-svelte": {}
    },

    "scalars": {
        /* in your case, something like */
        "felt252": {                  // <- The GraphQL Scalar
            "type": "YourType_felt252"  // <-  The TypeScript type
        }
    }


}

export default config
