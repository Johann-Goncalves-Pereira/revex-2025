import { queryOptions, useQuery } from '@tanstack/react-query'

import { fetchTodos } from '@features/todos/api/todos.api'
import { todoKeys } from '@features/todos/api/todos.query-keys'
import type { TodoFilter } from '@features/todos/api/todos.schema'

function filterTodos(
	todos: Awaited<ReturnType<typeof fetchTodos>>,
	filter: TodoFilter,
) {
	switch (filter) {
		case 'all':
			return todos
		case 'active':
			return todos.filter(todo => !todo.completed)
		case 'done':
			return todos.filter(todo => todo.completed)
	}
}

export function todosQueryOptions(filter: TodoFilter) {
	return queryOptions({
		queryKey: todoKeys.list(filter),
		queryFn: fetchTodos,
		select: todos => filterTodos(todos, filter),
	})
}

export function useTodosQuery(filter: TodoFilter) {
	return useQuery(todosQueryOptions(filter))
}
