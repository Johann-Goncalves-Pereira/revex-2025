import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { type CatalogItem, catalog, decodeCatalog, pilotSkus } from './catalog'
import { phase2Gate, validateItem } from './validators'

const today = '2026-10-05'

const eanByIndex = [
	'7890000000017',
	'7890000000024',
	'7890000000031',
	'7890000000048',
	'7890000000055',
	'7890000000062',
	'7890000000079',
	'7890000000086',
	'7890000000093',
	'7890000000109',
] as const

const itfByIndex = [
	'17890000000014',
	'17890000000021',
	'17890000000038',
	'17890000000045',
	'17890000000052',
	'17890000000069',
	'17890000000076',
	'17890000000083',
	'17890000000090',
	'17890000000106',
] as const

const addDays = (iso: string, days: number): string => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
	if (match === null) {
		return iso
	}
	const year = Number(match[1])
	const month = Number(match[2])
	const day = Number(match[3])
	const date = new Date(Date.UTC(year, month - 1, day))
	date.setUTCDate(date.getUTCDate() + days)
	return date.toISOString().slice(0, 10)
}

const evidence = {
	fileName: 'comprovante.pdf',
	link: 'https://drive.example/comprovante',
}

const validRaw = (item: (typeof catalog)[number]): Record<string, unknown> => {
	switch (item.kind._tag) {
		case 'Certificate': {
			const maxAge = item.kind.maxAgeDays
			const expiresOn = addDays(today, maxAge ?? 90)
			const flags: Record<string, boolean> = {}
			for (const flag of item.kind.flags) {
				flags[flag.id] = true
			}
			return {
				number: `NUM-${item.id}`,
				issuedOn: today,
				expiresOn,
				...evidence,
				flags,
			}
		}
		case 'Count':
			return { count: item.kind.expected, ...evidence }
		case 'File':
			return { ...evidence }
		case 'Identity':
			return {
				value:
					item.kind.field === 'cnpj' ? '41.481.732/0001-28' : '90892453-35',
				...evidence,
			}
		case 'LotSyntax':
			return { syntax: '2610-005-01', ...evidence }
		case 'SkuBarcodes':
			return {
				rows: pilotSkus.map((sku, index) => {
					const ean13 = eanByIndex[index] ?? ''
					const itf14 = itfByIndex[index] ?? ''
					return { skuId: sku.id, ean13, itf14 }
				}),
			}
		case 'Flags': {
			const flags: Record<string, boolean> = {}
			for (const flag of item.kind.flags) {
				flags[flag.id] = true
			}
			return item.kind.needsEvidence ? { flags, ...evidence } : { flags }
		}
		case 'BeverageRegistration':
			return { decision: 'excluded' }
	}
}

const itemById = (id: string): CatalogItem => {
	const item = catalog.find(entry => entry.id === id)
	if (item === undefined) {
		throw new Error(`missing catalog item ${id}`)
	}
	return item
}

const answersFor = (
	items: readonly (typeof catalog)[number][],
): Record<string, unknown> => {
	const answers: Record<string, unknown> = {}
	for (const item of items) {
		answers[item.id] = validRaw(item)
	}
	return answers
}

describe('catalog', () => {
	it('decodes every Phase 1 item', () => {
		const decoded = Effect.runSync(decodeCatalog(catalog))
		expect(decoded).toHaveLength(catalog.length)
		expect(catalog.length).toBeGreaterThan(0)
	})

	it('gives each item steps and a public source', () => {
		const ids = catalog.map(item => item.id)
		expect(new Set(ids).size).toBe(ids.length)
		for (const item of catalog) {
			expect(item.steps.length).toBeGreaterThan(0)
			expect(item.why.length).toBeGreaterThan(0)
			if (item.source._tag === 'Url') {
				expect(item.source.href.startsWith('https://')).toBe(true)
				expect(item.source.label.length).toBeGreaterThan(0)
			} else {
				expect(item.source.where.length).toBeGreaterThan(0)
			}
		}
	})

	it('lists the ten PCRF pilot SKUs', () => {
		expect(pilotSkus).toHaveLength(10)
		expect(pilotSkus.map(sku => sku.name)).toEqual([
			'Abóbora Cabotiá Orgânica',
			'Cenoura Orgânica (maço 500g ou bandeja)',
			'Batata-Doce Roxa Orgânica (1kg)',
			'Beterraba Orgânica em maço (500g)',
			'Alface Crespa/Americana Orgânica',
			'Abóbora Cabotiá em cubos a vácuo (500g)',
			'Mandioca Orgânica congelada (1kg)',
			'Mix de legumes higienizados para sopa (400g)',
			'Doce/Geleia artesanal de frutas da estação (250g)',
			'Biscoito/Bolacha artesanal orgânica ou polvilho',
		])
	})
})

describe('document checks', () => {
	it('accepts the Coopervida CNPJ and IE and rejects a bad check digit', () => {
		const cnpj = itemById('DOC-W1-11')
		const ie = itemById('DOC-W1-12')
		expect(cnpj.id).toBe('DOC-W1-11')
		expect(validateItem(cnpj, validRaw(cnpj), today).ok).toBe(true)
		expect(
			validateItem(
				cnpj,
				{ ...validRaw(cnpj), value: '41.481.732/0001-29' },
				today,
			).ok,
		).toBe(false)
		expect(validateItem(ie, validRaw(ie), today).ok).toBe(true)
		expect(
			validateItem(ie, { ...validRaw(ie), value: '90892453-36' }, today).ok,
		).toBe(false)
	})

	it('rejects an expired certificate and a CRF older than 30 days', () => {
		const sisorg = itemById('DOC-W1-01')
		const crf = itemById('DOC-W1-18')
		const cndt = itemById('DOC-W1-19')
		expect(
			validateItem(
				sisorg,
				{ ...validRaw(sisorg), expiresOn: '2026-10-04' },
				today,
			).ok,
		).toBe(false)
		expect(
			validateItem(
				sisorg,
				{ ...validRaw(sisorg), flags: { coversInNatura: true } },
				today,
			).ok,
		).toBe(false)
		expect(
			validateItem(
				crf,
				{ ...validRaw(crf), issuedOn: '2026-01-01', expiresOn: '2026-03-01' },
				'2026-02-01',
			).ok,
		).toBe(false)
		expect(
			validateItem(
				crf,
				{ ...validRaw(crf), issuedOn: '2026-01-01', expiresOn: '2026-01-31' },
				'2026-01-15',
			).ok,
		).toBe(true)
		expect(
			validateItem(
				cndt,
				{
					...validRaw(cndt),
					issuedOn: '2026-01-01',
					expiresOn: '2026-06-30',
				},
				'2026-06-01',
			).ok,
		).toBe(true)
		expect(
			validateItem(
				cndt,
				{
					...validRaw(cndt),
					issuedOn: '2026-01-01',
					expiresOn: '2026-07-01',
				},
				'2026-06-01',
			).ok,
		).toBe(false)
	})

	it('requires 60 CNPO names, a lot code, and unique barcodes', () => {
		const cnpo = itemById('DOC-W1-02')
		const lot = itemById('DOC-W3-02')
		const barcodes = itemById('DOC-W2-03')
		expect(validateItem(cnpo, { ...validRaw(cnpo), count: 59 }, today).ok).toBe(
			false,
		)
		expect(validateItem(lot, validRaw(lot), today).ok).toBe(true)
		expect(
			validateItem(lot, { ...validRaw(lot), syntax: '2613-005-01' }, today).ok,
		).toBe(false)
		expect(validateItem(barcodes, validRaw(barcodes), today).ok).toBe(true)
		const rows = pilotSkus.map((sku, index) => ({
			skuId: sku.id,
			ean13: eanByIndex[0] ?? '',
			itf14: itfByIndex[index] ?? '',
		}))
		expect(validateItem(barcodes, { rows }, today).ok).toBe(false)
		expect(
			validateItem(barcodes, { rows: [{ skuId: 'nope' }] }, today).ok,
		).toBe(false)
	})

	it('accepts excluding caldo de cana and rejects a registration without a certificate', () => {
		const caldo = itemById('DOC-W1-10')
		expect(validateItem(caldo, { decision: 'excluded' }, today).ok).toBe(true)
		expect(validateItem(caldo, { decision: 'registered' }, today).ok).toBe(
			false,
		)
	})
})

describe('phase 2 gate', () => {
	it('stays closed while any required document is missing', () => {
		const answers = answersFor(catalog)
		const first = catalog[0]
		if (first === undefined) {
			throw new Error('empty catalog')
		}
		expect(first.id).toBe('DOC-W1-01')
		delete answers[first.id]
		const gate = phase2Gate(catalog, answers, today)
		expect(gate.open).toBe(false)
		if (!gate.open) {
			expect(gate.blockers.some(blocker => blocker.includes(first.id))).toBe(
				true,
			)
		}
	})

	it('opens when the fixture dossier is complete', () => {
		const gate = phase2Gate(catalog, answersFor(catalog), today)
		expect(gate.open).toBe(true)
		if (gate.open) {
			expect(gate.indexed).toHaveLength(catalog.length)
			expect(gate.indexed[0]?.id).toBe(catalog[0]?.id)
		}
	})
})
