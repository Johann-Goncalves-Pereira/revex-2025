import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { AppProviders } from '@app/providers'

function RootLayout() {
	return (
		<AppProviders>
			<Outlet />

			<TanStackRouterDevtools />
			<ReactQueryDevtools buttonPosition='top-right' />
		</AppProviders>
	)
}

export default RootLayout
