import { type ReactNode, useMemo } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import { createQueryClient } from '@lib/query-client'

interface AppProvidersProps {
	children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
	const queryClient = useMemo(() => createQueryClient(), [])

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}
