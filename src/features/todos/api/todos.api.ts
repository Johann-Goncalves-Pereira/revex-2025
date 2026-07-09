import { apiGet } from '@lib/api-client'

import { todosSchema } from '@features/todos/api/todos.schema'

export async function fetchTodos() {
	return apiGet('/todos', todosSchema)
}
