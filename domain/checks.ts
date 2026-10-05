const digitAt = (digits: string, index: number): number | null => {
	const char = digits[index]
	if (char === undefined) {
		return null
	}
	const value = Number(char)
	if (!Number.isInteger(value)) {
		return null
	}
	return value
}

const weightedSum = (
	digits: string,
	weights: readonly number[],
): number | null => {
	let sum = 0
	for (let index = 0; index < weights.length; index += 1) {
		const weight = weights[index]
		const digit = digitAt(digits, index)
		if (weight === undefined || digit === null) {
			return null
		}
		sum += digit * weight
	}
	return sum
}

const checkDigit = (
	digits: string,
	weights: readonly number[],
): number | null => {
	const sum = weightedSum(digits, weights)
	if (sum === null) {
		return null
	}
	const mod = sum % 11
	return mod < 2 ? 0 : 11 - mod
}

const onlyDigits = (value: string): string => value.replace(/\D/g, '')

const matchesCheckDigits = (
	digits: string,
	bodyLength: number,
	firstWeights: readonly number[],
	secondWeights: readonly number[],
): boolean => {
	const first = checkDigit(digits, firstWeights)
	const second = checkDigit(digits, secondWeights)
	if (first === null || second === null) {
		return false
	}
	return (
		digits === `${digits.slice(0, bodyLength)}${String(first)}${String(second)}`
	)
}

export const cnpjMatchesCoopervida = (value: string): boolean => {
	const digits = onlyDigits(value)
	if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) {
		return false
	}
	return (
		matchesCheckDigits(
			digits,
			12,
			[5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
			[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
		) && digits === '41481732000128'
	)
}

export const ieMatchesCoopervida = (value: string): boolean => {
	const digits = onlyDigits(value)
	if (digits.length !== 10) {
		return false
	}
	return (
		matchesCheckDigits(
			digits,
			8,
			[3, 2, 7, 6, 5, 4, 3, 2],
			[4, 3, 2, 7, 6, 5, 4, 3, 2],
		) && digits === '9089245335'
	)
}

const gtinCheck = (body: string): number | null => {
	let sum = 0
	for (let offset = 0; offset < body.length; offset += 1) {
		const char = body[body.length - 1 - offset]
		if (char === undefined) {
			return null
		}
		const digit = Number(char)
		if (!Number.isInteger(digit)) {
			return null
		}
		const weight = offset % 2 === 0 ? 3 : 1
		sum += digit * weight
	}
	return (10 - (sum % 10)) % 10
}

const gtinOk = (value: string, length: number): boolean => {
	const digits = onlyDigits(value)
	if (digits.length !== length) {
		return false
	}
	const check = gtinCheck(digits.slice(0, length - 1))
	if (check === null) {
		return false
	}
	return digits.endsWith(String(check))
}

export const ean13Ok = (value: string): boolean => gtinOk(value, 13)

export const itf14Ok = (value: string): boolean => gtinOk(value, 14)
