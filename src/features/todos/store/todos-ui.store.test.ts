import { describe, expect, it } from 'vitest'

import { useTodosUiStore } from '@features/todos/store/todos-ui.store'

describe('useTodosUiStore', () => {
	it('starts with the all filter', () => {
		useTodosUiStore.setState({ filter: 'all' })
		expect(useTodosUiStore.getState().filter).toBe('all')
	})

	it('updates the active filter', () => {
		useTodosUiStore.getState().setFilter('active')
		expect(useTodosUiStore.getState().filter).toBe('active')
	})
})
