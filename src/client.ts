import { HoudiniClient } from '$houdini';
import { createClient } from 'graphql-ws'
import { subscription } from '$houdini/plugins'

export default new HoudiniClient({
    url: 'http://127.0.0.1:8080/graphql',
    plugins: [
        subscription(() => createClient({
            url: 'ws://127.0.0.1:8080/graphql'
        }))
    ],

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
