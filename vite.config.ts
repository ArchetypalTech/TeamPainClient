import { sveltekit } from '@sveltejs/kit/vite'
import houdini from 'houdini/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [houdini(), sveltekit()],
    server: {
        proxy: {
            '*': {
                target: 'http:://localhost:5050',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        cors: true
    }
});
