import * as Either from 'effect/Either'
import * as Schema from 'effect/Schema'

const storageKey = 'coopervida-fase-1-v1'

const storedAnswers = Schema.parseJson(
	Schema.Record({ key: Schema.String, value: Schema.Unknown }),
)

export const loadAnswers = (): Record<string, unknown> => {
	const raw = localStorage.getItem(storageKey)
	if (raw === null) {
		return {}
	}
	const decoded = Schema.decodeUnknownEither(storedAnswers)(raw)
	if (Either.isLeft(decoded)) {
		return {}
	}
	return decoded.right
}

export const saveAnswers = (answers: Record<string, unknown>): void => {
	localStorage.setItem(storageKey, JSON.stringify(answers))
}
