import type { Todo } from '@features/todos/api/todos.schema'

interface TodoListProps {
	todos: Todo[]
	isLoading: boolean
	isError: boolean
}

export function TodoList({ todos, isLoading, isError }: TodoListProps) {
	if (isLoading) {
		return (
			<p className='text-sm text-stone-500 dark:text-stone-400'>
				Loading todos...
			</p>
		)
	}

	if (isError) {
		return (
			<p className='text-sm text-red-600 dark:text-red-400'>
				Failed to load todos.
			</p>
		)
	}

	if (todos.length === 0) {
		return (
			<p className='text-sm text-stone-500 dark:text-stone-400'>
				No todos match this filter.
			</p>
		)
	}

	return (
		<ul className='divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900'>
			{todos.slice(0, 10).map(todo => (
				<li
					key={todo.id}
					className='flex items-start gap-3 px-4 py-3 text-sm text-stone-800 dark:text-stone-100'
				>
					<span
						className={`mt-1 size-2 rounded-full ${todo.completed ? 'bg-emerald-500' : 'bg-amber-500'}`}
						aria-hidden='true'
					/>
					<div className='space-y-1'>
						<p className='font-medium'>{todo.title}</p>
						<p className='text-xs text-stone-500 dark:text-stone-400'>
							User #{todo.userId}
						</p>
					</div>
				</li>
			))}
		</ul>
	)
}
