import { z } from 'zod'

const envSchema = z.object({
	MODE: z.enum(['development', 'production', 'test']),
	DEV: z.boolean(),
	PROD: z.boolean(),
	SSR: z.boolean(),
	VITE_API_BASE_URL: z.url().default('https://jsonplaceholder.typicode.com'),
})

export const env = envSchema.parse(import.meta.env)
