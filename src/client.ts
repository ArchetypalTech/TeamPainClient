import { HoudiniClient } from '$houdini';
import { createClient } from 'graphql-ws'
import { subscription } from '$houdini/plugins'

export default new HoudiniClient({
    url: 'https://api.cartridge.gg/x/theoruggintrail/torii/graphql',
    plugins: [
        subscription(() => createClient({
            url: 'wss://api.cartridge.gg/x/theoruggintrail/torii/graphql'
        }))
    ]

    // uncomment this to configure the network call (for things like authentication)
    // for more information, please visit here: https://www.houdinigraphql.com/guides/authentication
    // fetchParams({ session }) {
    //     return {
    //         headers: {
    //             Authentication: `Bearer ${session.token}`,
    //         }
    //     }
    // }
})
