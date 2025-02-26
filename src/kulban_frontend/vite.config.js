import { fileURLToPath, URL } from 'url';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
	build: {
		emptyOutDir: true
	},
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			}
		}
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:4943',
				changeOrigin: true
			}
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit(),
		environment('all', { prefix: 'CANISTER_' }),
		environment('all', { prefix: 'DFX_' })
	],
	resolve: {
		alias: [
			{
				find: 'declarations',
				replacement: fileURLToPath(new URL('../declarations', import.meta.url))
			}
		],
		dedupe: ['@dfinity/agent']
	},

	test: {
		workspace: [
			{
				extends: './vite.config.js',
				plugins: [svelteTesting()],

				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.js',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
