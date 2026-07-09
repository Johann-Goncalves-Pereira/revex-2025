import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TodoList } from '@features/todos/components/TodoList'

import { renderWithProviders } from '@/test/test-utils'

describe('TodoList', () => {
	it('renders todos returned by the query layer', () => {
		renderWithProviders(
			<TodoList
				isLoading={false}
				isError={false}
				todos={[
					{
						id: 1,
						userId: 7,
						title: 'Write tests',
						completed: false,
					},
				]}
			/>,
		)

		expect(screen.getByText('Write tests')).toBeInTheDocument()
		expect(screen.getByText('User #7')).toBeInTheDocument()
	})

	it('shows a loading state', () => {
		renderWithProviders(<TodoList isLoading isError={false} todos={[]} />)

		expect(screen.getByText('Loading todos...')).toBeInTheDocument()
	})
})
