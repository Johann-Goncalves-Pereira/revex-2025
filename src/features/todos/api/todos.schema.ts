import { z } from 'zod'

export const todoFilterSchema = z.enum(['all', 'active', 'done'])

export const todoSchema = z.object({
	id: z.number().int().positive(),
	userId: z.number().int().positive(),
	title: z.string().min(1),
	completed: z.boolean(),
})

export const todosSchema = z.array(todoSchema)

export type TodoFilter = z.infer<typeof todoFilterSchema>
export type Todo = z.infer<typeof todoSchema>
