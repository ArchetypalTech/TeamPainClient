// Katana burner account
export const Katana = {
    // Endpoint connection to Katana. // fish this from an env file if in local mode
    KATANA_ENDPOINT: 'http://localhost:5050',
    
    // this should be a burner account deployed on Katana by default
    // we be using `controller`at this point in the astartup logic
    // but right now this is in dev mode and comes direct from katana as its default accounts
    addr: '0x6677fe62ee39c7b07401f754138502bab7fac99d2d3c5d37df7d1c6fab10819',
    pKey: '0x3e3979c1ed728490308054fe357a9f49cf67f80f9721f44cc57235129e090f4',
    
};

export const Manifest_Addresses = {
    // fish this from the manifest file also we need all of them
    // meatpuppet
    // cat TeamPainClient/src/manifest/manifest_dev.json | jq -r '.contracts[0].address'     
    ENTITY_ADDRESS: '0x6f758cfd367ac46b8cae5b74770503253f0fd090097cfb0d8772ce275ea1376',

    // outputter
    // cat ~TeamPainClient/src/manifest/manifest_dev.json | jq -r '.contracts[1].address'
    OUTPUTTER_ADDRESS: '0x743573d012b712630f5c2a0b4d0ce8886986e9cac50e294dee45b7298106589',

    // the world
    // cat TeamPainClient/src/manifest/manifest_dev.json | jq -r '.world.address'
    WORLD_ADDRESS: '0x067631b711ce310b8e6b32fb88f5427244534dba2a2584bb07c35256f618affa',  
}

export const Username = {
    username: "DarkGod"
}

export const ETH_CONTRACT = {
    eth_cont: Katana.addr
}



