/** Biome formats this repo. Prettier stays out: there is no Tailwind setup. */
export default {
	'*.{json,md,yml,yaml,css,mjs,cjs,js,ts}': [
		'biome check --write --no-errors-on-unmatched',
	],
	'*.{ts,js,mjs,cjs}': ['eslint --fix --max-warnings 0'],
}
