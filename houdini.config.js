/// <reference types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    watchSchema: {
        url: "http://127.0.0.1:8080/graphql"
    },
    plugins: {
        "houdini-svelte": {}
    },
    scalars: {
        felt252: {
            type: "YourType_felt252"
        },
        ByteArray: {
            type: "YourType_ByteArray"
        }
    },
    schemaPath: './schema.graphql',
    sourceGlob: 'src/**/*.{svelte,ts,js}',
    module: 'esm',
    framework: 'svelte',
};

export default config;
