export const parseIsoDay = (iso: string): number | null => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
	if (match === null) {
		return null
	}
	const yearText = match[1]
	const monthText = match[2]
	const dayText = match[3]
	if (
		yearText === undefined ||
		monthText === undefined ||
		dayText === undefined
	) {
		return null
	}
	const year = Number(yearText)
	const month = Number(monthText)
	const day = Number(dayText)
	if (
		!Number.isInteger(year) ||
		!Number.isInteger(month) ||
		!Number.isInteger(day)
	) {
		return null
	}
	const date = new Date(Date.UTC(year, month - 1, day))
	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		return null
	}
	return date.getTime()
}

const dayMs = 86_400_000

export const daysBetween = (startMs: number, endMs: number): number =>
	Math.round((endMs - startMs) / dayMs)
