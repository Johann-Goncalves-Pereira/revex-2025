import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./src/test/setup.ts'],
	},
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './src/app'),
			'@components': path.resolve(__dirname, './src/components'),
			'@features': path.resolve(__dirname, './src/features'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@layout': path.resolve(__dirname, './src/layout'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@shared': path.resolve(__dirname, './src/shared'),
			'@': path.resolve(__dirname, './src'),
		},
	},
})
