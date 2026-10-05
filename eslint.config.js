import js from '@eslint/js'
import qualityBar from 'eslint-plugin-quality-bar'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: ['dist', 'build', 'coverage', 'node_modules'] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'quality-bar': qualityBar,
		},
		rules: {
			...qualityBar.configs.recommended.rules,
		},
	},
]
