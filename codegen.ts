import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: 'http://127.0.0.1:8080/graphql',
   documents: ['src/**/*.{svelte,ts,js}'],
   generates: {
      './src/gql/': {
        preset: 'client',
      }
   }
}
export default config