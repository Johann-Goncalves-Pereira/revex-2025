import { describe, expect, it } from 'vitest'

import {
	todoFilterSchema,
	todoSchema,
	todosSchema,
} from '@features/todos/api/todos.schema'

describe('todos.schema', () => {
	it('parses a valid todo', () => {
		const todo = todoSchema.parse({
			id: 1,
			userId: 1,
			title: 'Ship typed boilerplate',
			completed: false,
		})

		expect(todo.title).toBe('Ship typed boilerplate')
	})

	it('rejects invalid todo payloads', () => {
		expect(() =>
			todoSchema.parse({
				id: '1',
				userId: 1,
				title: '',
				completed: false,
			}),
		).toThrow()
	})

	it('parses todo collections', () => {
		const todos = todosSchema.parse([
			{
				id: 1,
				userId: 1,
				title: 'First',
				completed: true,
			},
		])

		expect(todos).toHaveLength(1)
	})

	it('parses filter values', () => {
		expect(todoFilterSchema.parse('active')).toBe('active')
	})
})
