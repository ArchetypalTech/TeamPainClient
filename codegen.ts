import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: 'https://api.cartridge.gg/x/theoruggintrailv2/torii/graphql',
   documents: ['src/**/*.{svelte,ts,js}'],
   generates: {
      './src/gql/': {
        preset: 'client',
      }
   }
}
export default config