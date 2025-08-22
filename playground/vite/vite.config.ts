import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import UnoCSS from 'unocss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [UnoCSS(), svelte()],
	build: {
		minify: mode === 'development' ? false : true,
	},
	resolve: {
		alias: [{ find: '$lib', replacement: path.resolve(__dirname, './src/lib') }],
	},
}));
