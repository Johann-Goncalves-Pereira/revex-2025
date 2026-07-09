import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import { scan } from 'react-scan'

import App from '@app/App'

import './main.css'

if (import.meta.env.DEV) {
	scan({
		enabled: true,
	})
}

const rootElement = document.getElementById('root')
if (!rootElement) {
	throw new Error('Root element not found')
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
