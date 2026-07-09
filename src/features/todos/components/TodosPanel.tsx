import { TodoFilters } from '@features/todos/components/TodoFilters'
import { TodoList } from '@features/todos/components/TodoList'
import { useTodosPage } from '@features/todos/hooks/useTodosPage'

export function TodosPanel() {
	const { todos, isLoading, isError, filter } = useTodosPage()

	return (
		<section className='mx-auto flex w-full max-w-3xl flex-col gap-6 p-6'>
			<header className='space-y-2'>
				<p className='text-sm font-medium tracking-[0.2em] text-stone-500 uppercase dark:text-stone-400'>
					Feature example
				</p>
				<h1 className='text-3xl font-semibold tracking-tight'>
					Typed todos with Query + Zustand
				</h1>
				<p className='max-w-2xl text-sm text-stone-600 dark:text-stone-300'>
					Server state comes from JSONPlaceholder with Zod validation. UI filter
					state lives in a feature-scoped Zustand store.
				</p>
			</header>

			<TodoFilters />

			<p className='text-sm text-stone-500 dark:text-stone-400'>
				Current filter:{' '}
				<span className='font-medium text-stone-800 dark:text-stone-100'>
					{filter}
				</span>
			</p>

			<TodoList todos={todos} isLoading={isLoading} isError={isError} />
		</section>
	)
}
