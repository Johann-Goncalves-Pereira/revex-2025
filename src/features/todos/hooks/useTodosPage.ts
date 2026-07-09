import { useTodosQuery } from '@features/todos/api/todos.queries'
import { useTodosUiStore } from '@features/todos/store/todos-ui.store'

export function useTodosPage() {
	const filter = useTodosUiStore(state => state.filter)
	const { data = [], isLoading, isError } = useTodosQuery(filter)

	return {
		filter,
		todos: data,
		isLoading,
		isError,
	}
}
