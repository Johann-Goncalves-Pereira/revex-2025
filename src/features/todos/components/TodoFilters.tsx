import type { TodoFilter } from '@features/todos/api/todos.schema'
import { useTodosUiStore } from '@features/todos/store/todos-ui.store'

import { Button } from '@components/ui/Button'

const filters = [
	{ value: 'all', label: 'All' },
	{ value: 'active', label: 'Active' },
	{ value: 'done', label: 'Done' },
] as const satisfies readonly { value: TodoFilter; label: string }[]

export function TodoFilters() {
	const filter = useTodosUiStore(state => state.filter)
	const setFilter = useTodosUiStore(state => state.setFilter)

	return (
		<div className='flex flex-wrap gap-2'>
			{filters.map(option => (
				<Button
					key={option.value}
					variant={filter === option.value ? 'primary' : 'ghost'}
					onClick={() => {
						setFilter(option.value)
					}}
				>
					{option.label}
				</Button>
			))}
		</div>
	)
}
