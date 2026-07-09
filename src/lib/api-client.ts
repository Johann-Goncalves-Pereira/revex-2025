import type { z } from 'zod'

import { env } from '@lib/env'

class ApiError extends Error {
	readonly status: number

	constructor(message: string, status: number) {
		super(message)
		this.name = 'ApiError'
		this.status = status
	}
}

function resolveUrl(path: string): string {
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}

	const base = env.VITE_API_BASE_URL.replace(/\/$/, '')
	const normalizedPath = path.startsWith('/') ? path : `/${path}`
	return `${base}${normalizedPath}`
}

function parseJson(text: string): unknown {
	if (!text) {
		return null
	}

	const result: unknown = JSON.parse(text)
	return result
}

function createHeaders(init?: RequestInit): Headers {
	const headers = new Headers(init?.headers)
	headers.set('Accept', 'application/json')
	return headers
}

export async function apiGet<T>(
	path: string,
	schema: z.ZodType<T>,
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(resolveUrl(path), {
		...init,
		method: 'GET',
		headers: createHeaders(init),
	})

	if (!response.ok) {
		throw new ApiError(
			`Request failed: ${response.statusText}`,
			response.status,
		)
	}

	const data = await response.text().then(parseJson)
	return schema.parse(data)
}
