import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production'
	const compiler = [['babel-plugin-react-compiler', { target: '19' }]]

	return {
		define: {
			'process.env.NODE_ENV': JSON.stringify(
				isProduction ? 'production' : 'development',
			),
			__DEV__: !isProduction,
		},
		server: {
			hmr: true,
		},
		plugins: [
			tailwindcss(),
			tanstackRouter({ target: 'react', autoCodeSplitting: true }),
			react({
				jsxRuntime: 'automatic',
				babel: { plugins: isProduction ? compiler : [] },
			}),
		],
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
	}
})
