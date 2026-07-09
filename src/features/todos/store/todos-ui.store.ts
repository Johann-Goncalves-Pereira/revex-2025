import { create } from 'zustand'

import type { TodoFilter } from '@features/todos/api/todos.schema'

interface TodosUiState {
	filter: TodoFilter
	setFilter: (filter: TodoFilter) => void
}

export const useTodosUiStore = create<TodosUiState>()(set => ({
	filter: 'all',
	setFilter: filter => {
		set({ filter })
	},
}))
