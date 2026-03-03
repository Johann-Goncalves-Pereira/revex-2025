import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 24 * 60 * 60 * 1000, // 1 day default; dictionary fits this nicely
			gcTime: 25 * 60 * 60 * 1000, // a bit longer than staleTime
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
})

function RootLayout() {
	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />

			<TanStackRouterDevtools />
			<ReactQueryDevtools buttonPosition='top-right' />
		</QueryClientProvider>
	)
}

export default RootLayout
