import { sveltekit } from '@sveltejs/kit/vite'
import houdini from 'houdini/vite'
import { defineConfig, UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [houdini(), sveltekit()],
    server: {
        proxy: {
            'api': {
                target: 'http://localhost:5050',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        cors: true
    }
};
export default defineConfig(config);