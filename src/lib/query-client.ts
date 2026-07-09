import { QueryClient } from '@tanstack/react-query'

export function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 24 * 60 * 60 * 1000,
				gcTime: 25 * 60 * 60 * 1000,
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	})
}
