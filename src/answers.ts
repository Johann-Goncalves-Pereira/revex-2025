import type { CatalogItem } from '../domain/catalog'
import { pilotSkus } from '../domain/catalog'

const textOf = (value: unknown): string => {
	if (typeof value === 'string') {
		return value
	}
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value)
	}
	return ''
}

const recordOf = (value: unknown): Readonly<Record<string, unknown>> | null => {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return null
	}
	return Object.fromEntries(Object.entries(value))
}

const flagsOf = (value: unknown): Readonly<Record<string, boolean>> => {
	const record = recordOf(value)
	if (record === null) {
		return {}
	}
	const flags: Record<string, boolean> = {}
	for (const [key, flag] of Object.entries(record)) {
		if (typeof flag === 'boolean') {
			flags[key] = flag
		}
	}
	return flags
}

const field = (card: ParentNode, name: string): HTMLInputElement | null => {
	const node = card.querySelector(`[data-field="${name}"]`)
	return node instanceof HTMLInputElement ? node : null
}

const fieldValue = (card: ParentNode, name: string): string =>
	field(card, name)?.value ?? ''

const setField = (card: ParentNode, name: string, value: string): void => {
	const input = field(card, name)
	if (input !== null) {
		input.value = value
	}
}

const readFlags = (card: ParentNode): Readonly<Record<string, boolean>> => {
	const flags: Record<string, boolean> = {}
	for (const node of card.querySelectorAll('[data-flag]')) {
		if (node instanceof HTMLInputElement) {
			const id = node.dataset.flag
			if (id !== undefined) {
				flags[id] = node.checked
			}
		}
	}
	return flags
}

const fillFlags = (
	card: ParentNode,
	flags: Readonly<Record<string, boolean>>,
): void => {
	for (const node of card.querySelectorAll('[data-flag]')) {
		if (node instanceof HTMLInputElement) {
			const id = node.dataset.flag
			if (id !== undefined) {
				node.checked = flags[id] === true
			}
		}
	}
}

const readRows = (
	card: ParentNode,
): readonly { skuId: string; ean13: string; itf14: string }[] =>
	pilotSkus.map(sku => ({
		skuId: sku.id,
		ean13: fieldValue(card, `ean-${sku.id}`),
		itf14: fieldValue(card, `itf-${sku.id}`),
	}))

export const readAnswer = (item: CatalogItem, card: ParentNode): unknown => {
	switch (item.kind._tag) {
		case 'Certificate':
			return {
				number: fieldValue(card, 'number'),
				issuedOn: fieldValue(card, 'issuedOn'),
				expiresOn: fieldValue(card, 'expiresOn'),
				fileName: fieldValue(card, 'fileName'),
				link: fieldValue(card, 'link'),
				flags: readFlags(card),
			}
		case 'File':
			return {
				fileName: fieldValue(card, 'fileName'),
				link: fieldValue(card, 'link'),
			}
		case 'Identity':
			return {
				value: fieldValue(card, 'value'),
				fileName: fieldValue(card, 'fileName'),
				link: fieldValue(card, 'link'),
			}
		case 'Count':
			return {
				count: Number(fieldValue(card, 'count')),
				fileName: fieldValue(card, 'fileName'),
				link: fieldValue(card, 'link'),
			}
		case 'LotSyntax':
			return {
				syntax: fieldValue(card, 'syntax'),
				fileName: fieldValue(card, 'fileName'),
				link: fieldValue(card, 'link'),
			}
		case 'SkuBarcodes':
			return { rows: readRows(card) }
		case 'Flags':
			return {
				flags: readFlags(card),
				fileName: fieldValue(card, 'fileName'),
				link: fieldValue(card, 'link'),
			}
		case 'BeverageRegistration':
			return readBeverage(card)
	}
}

const readBeverage = (card: ParentNode): unknown => {
	const selected = card.querySelector('[data-field="decision"]:checked')
	if (!(selected instanceof HTMLInputElement)) {
		return { decision: '' }
	}
	if (selected.value !== 'registered') {
		return { decision: 'excluded' }
	}
	return {
		decision: 'registered',
		number: fieldValue(card, 'number'),
		issuedOn: fieldValue(card, 'issuedOn'),
		expiresOn: fieldValue(card, 'expiresOn'),
		fileName: fieldValue(card, 'fileName'),
		link: fieldValue(card, 'link'),
	}
}

export const fillAnswer = (
	item: CatalogItem,
	card: ParentNode,
	raw: unknown,
): void => {
	const record = recordOf(raw)
	if (record === null) {
		return
	}
	switch (item.kind._tag) {
		case 'Certificate':
			fillCertificate(card, record)
			return
		case 'File':
		case 'Flags':
			fillEvidence(card, record)
			fillFlags(card, flagsOf(record.flags))
			return
		case 'Identity':
			setField(card, 'value', textOf(record.value))
			fillEvidence(card, record)
			return
		case 'Count':
			setField(card, 'count', textOf(record.count))
			fillEvidence(card, record)
			return
		case 'LotSyntax':
			setField(card, 'syntax', textOf(record.syntax))
			fillEvidence(card, record)
			return
		case 'SkuBarcodes':
			fillSkus(card, record.rows)
			return
		case 'BeverageRegistration':
			fillBeverage(card, record)
			return
	}
}

const fillCertificate = (
	card: ParentNode,
	record: Readonly<Record<string, unknown>>,
): void => {
	setField(card, 'number', textOf(record.number))
	setField(card, 'issuedOn', textOf(record.issuedOn))
	setField(card, 'expiresOn', textOf(record.expiresOn))
	fillEvidence(card, record)
	fillFlags(card, flagsOf(record.flags))
}

const fillEvidence = (
	card: ParentNode,
	record: Readonly<Record<string, unknown>>,
): void => {
	setField(card, 'fileName', textOf(record.fileName))
	setField(card, 'link', textOf(record.link))
}

const fillSkus = (card: ParentNode, raw: unknown): void => {
	if (!Array.isArray(raw)) {
		return
	}
	for (const row of raw) {
		const record = recordOf(row)
		if (record === null) {
			continue
		}
		const skuId = textOf(record.skuId)
		setField(card, `ean-${skuId}`, textOf(record.ean13))
		setField(card, `itf-${skuId}`, textOf(record.itf14))
	}
}

const fillBeverage = (
	card: ParentNode,
	record: Readonly<Record<string, unknown>>,
): void => {
	const decision = textOf(record.decision)
	for (const node of card.querySelectorAll('[data-field="decision"]')) {
		if (node instanceof HTMLInputElement) {
			node.checked = node.value === decision
		}
	}
	fillCertificate(card, record)
	const extra = card.querySelector('[data-registration]')
	if (extra instanceof HTMLElement) {
		extra.hidden = decision !== 'registered'
	}
}
