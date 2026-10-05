import * as Either from 'effect/Either'
import * as Schema from 'effect/Schema'
import { type CatalogItem, pilotSkus } from './catalog'
import {
	cnpjMatchesCoopervida,
	ean13Ok,
	ieMatchesCoopervida,
	itf14Ok,
} from './checks'
import { daysBetween, parseIsoDay } from './dates'

export type IndexedDocument = {
	readonly id: string
	readonly title: string
	readonly summary: string
	readonly fileName: string
	readonly link: string
}

export type ItemResult =
	| { readonly ok: true; readonly indexed: IndexedDocument }
	| { readonly ok: false; readonly errors: readonly string[] }

export type Phase2Gate =
	| { readonly open: true; readonly indexed: readonly IndexedDocument[] }
	| { readonly open: false; readonly blockers: readonly string[] }

const fail = (errors: readonly string[]): ItemResult => ({
	ok: false,
	errors,
})

const pass = (
	item: CatalogItem,
	summary: string,
	fileName: string,
	link: string,
): ItemResult => ({
	ok: true,
	indexed: {
		id: item.id,
		title: item.title,
		summary,
		fileName: fileName.trim(),
		link: link.trim(),
	},
})

const evidenceErrors = (fileName: string, link: string): readonly string[] => {
	const file = fileName.trim()
	const href = link.trim()
	if (file.length === 0 && href.length === 0) {
		return ['Anexe o nome do arquivo ou cole o link do documento.']
	}
	if (
		href.length > 0 &&
		!href.startsWith('https://') &&
		!href.startsWith('http://')
	) {
		return ['O link precisa começar com http:// ou https://.']
	}
	return []
}

const decode = <A, I>(
	schema: Schema.Schema<A, I>,
	raw: unknown,
): Either.Either<A, ItemResult> => {
	const decoded = Schema.decodeUnknownEither(schema)(raw)
	if (Either.isLeft(decoded)) {
		return Either.left(fail(['Preencha os campos deste documento.']))
	}
	return Either.right(decoded.right)
}

const CertificateAnswer = Schema.Struct({
	number: Schema.String,
	issuedOn: Schema.String,
	expiresOn: Schema.String,
	fileName: Schema.String,
	link: Schema.String,
	flags: Schema.Record({ key: Schema.String, value: Schema.Boolean }),
})

const certificateDateErrors = (
	issuedOn: string,
	expiresOn: string,
	today: string,
	maxAgeDays: number | null,
): readonly string[] => {
	const issued = parseIsoDay(issuedOn)
	const expires = parseIsoDay(expiresOn)
	const reference = parseIsoDay(today)
	if (issued === null || expires === null || reference === null) {
		return ['Use datas no formato AAAA-MM-DD.']
	}
	const errors: string[] = []
	if (issued > reference) {
		errors.push('A data de emissão não pode ser futura.')
	}
	if (expires < reference) {
		errors.push('O documento está vencido.')
	}
	if (expires < issued) {
		errors.push('A validade não pode ser anterior à emissão.')
	}
	if (maxAgeDays !== null && daysBetween(issued, expires) > maxAgeDays) {
		errors.push(`A validade passa de ${String(maxAgeDays)} dias.`)
	}
	return errors
}

const flagErrors = (
	required: readonly { readonly id: string; readonly label: string }[],
	flags: Readonly<Record<string, boolean>>,
): readonly string[] => {
	const errors: string[] = []
	for (const flag of required) {
		if (flags[flag.id] !== true) {
			errors.push(`Confirme: ${flag.label}.`)
		}
	}
	return errors
}

const validateCertificate = (
	item: CatalogItem,
	raw: unknown,
	today: string,
	maxAgeDays: number | null,
	requiredFlags: readonly { id: string; label: string }[],
): ItemResult => {
	const decoded = decode(CertificateAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const answer = decoded.right
	if (answer.number.trim().length === 0) {
		return fail(['Informe o número do documento.'])
	}
	const errors = [
		...evidenceErrors(answer.fileName, answer.link),
		...certificateDateErrors(
			answer.issuedOn,
			answer.expiresOn,
			today,
			maxAgeDays,
		),
		...flagErrors(requiredFlags, answer.flags),
	]
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(
		item,
		`${answer.number.trim()} · válido até ${answer.expiresOn}`,
		answer.fileName,
		answer.link,
	)
}

const FileAnswer = Schema.Struct({
	fileName: Schema.String,
	link: Schema.String,
})

const validateFile = (item: CatalogItem, raw: unknown): ItemResult => {
	const decoded = decode(FileAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const answer = decoded.right
	const errors = evidenceErrors(answer.fileName, answer.link)
	if (errors.length > 0) {
		return fail(errors)
	}
	const summary =
		answer.fileName.trim().length > 0
			? answer.fileName.trim()
			: answer.link.trim()
	return pass(item, summary, answer.fileName, answer.link)
}

const IdentityAnswer = Schema.Struct({
	value: Schema.String,
	fileName: Schema.String,
	link: Schema.String,
})

const validateIdentity = (
	item: CatalogItem,
	raw: unknown,
	field: 'cnpj' | 'ie',
): ItemResult => {
	const decoded = decode(IdentityAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const answer = decoded.right
	const matches =
		field === 'cnpj'
			? cnpjMatchesCoopervida(answer.value)
			: ieMatchesCoopervida(answer.value)
	const errors = [
		...evidenceErrors(answer.fileName, answer.link),
		...(matches
			? []
			: [
					field === 'cnpj'
						? 'O CNPJ precisa ser 41.481.732/0001-28, com dígito válido.'
						: 'A IE precisa ser 90892453-35, com dígito válido.',
				]),
	]
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(item, answer.value.trim(), answer.fileName, answer.link)
}

const CountAnswer = Schema.Struct({
	count: Schema.Number,
	fileName: Schema.String,
	link: Schema.String,
})

const validateCount = (
	item: CatalogItem,
	raw: unknown,
	expected: number,
): ItemResult => {
	const decoded = decode(CountAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const answer = decoded.right
	const errors = [
		...evidenceErrors(answer.fileName, answer.link),
		...(answer.count === expected
			? []
			: [
					`Informe exatamente ${String(expected)} produtores encontrados no CNPO.`,
				]),
	]
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(
		item,
		`${String(answer.count)} produtores no CNPO`,
		answer.fileName,
		answer.link,
	)
}

const LotAnswer = Schema.Struct({
	syntax: Schema.String,
	fileName: Schema.String,
	link: Schema.String,
})

const lotOk = (syntax: string): boolean => {
	const match = /^(\d{2})(\d{2})-(\d{3})-(\d{2})$/.exec(syntax.trim())
	if (match === null) {
		return false
	}
	const month = Number(match[2])
	const day = Number(match[3])
	return month >= 1 && month <= 12 && day >= 1 && day <= 31
}

const validateLot = (item: CatalogItem, raw: unknown): ItemResult => {
	const decoded = decode(LotAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const answer = decoded.right
	const errors = [
		...evidenceErrors(answer.fileName, answer.link),
		...(lotOk(answer.syntax)
			? []
			: [
					'O lote deve seguir AAMM-DDD-PP, com mês de 01 a 12 e dia de 001 a 031.',
				]),
	]
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(item, answer.syntax.trim(), answer.fileName, answer.link)
}

const SkuRow = Schema.Struct({
	skuId: Schema.String,
	ean13: Schema.String,
	itf14: Schema.String,
})

const SkuAnswer = Schema.Struct({
	rows: Schema.Array(SkuRow),
})

const validateSkus = (item: CatalogItem, raw: unknown): ItemResult => {
	const decoded = decode(SkuAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const rows = decoded.right.rows
	const errors: string[] = []
	if (rows.length !== pilotSkus.length) {
		errors.push('Informe o código de cada um dos 10 SKUs piloto.')
	}
	const ids = new Set(rows.map(row => row.skuId))
	if (ids.size !== pilotSkus.length) {
		errors.push('Há SKU repetido ou faltando.')
	}
	for (const sku of pilotSkus) {
		if (!ids.has(sku.id)) {
			errors.push(`Falta o código de ${sku.name}.`)
		}
	}
	const eans = new Set<string>()
	const itfs = new Set<string>()
	for (const row of rows) {
		if (!ean13Ok(row.ean13)) {
			errors.push(`EAN-13 inválido para ${row.skuId}.`)
		}
		if (!itf14Ok(row.itf14)) {
			errors.push(`ITF-14 inválido para ${row.skuId}.`)
		}
		const ean = row.ean13.replace(/\D/g, '')
		const itf = row.itf14.replace(/\D/g, '')
		if (eans.has(ean) || itfs.has(itf)) {
			errors.push('Há códigos de barras repetidos.')
		}
		eans.add(ean)
		itfs.add(itf)
	}
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(item, '10 SKUs com EAN-13 e ITF-14', '', '')
}

const FlagsAnswer = Schema.Struct({
	flags: Schema.Record({ key: Schema.String, value: Schema.Boolean }),
	fileName: Schema.optional(Schema.String),
	link: Schema.optional(Schema.String),
})

const validateFlags = (
	item: CatalogItem,
	raw: unknown,
	needsEvidence: boolean,
	requiredFlags: readonly { id: string; label: string }[],
): ItemResult => {
	const decoded = decode(FlagsAnswer, raw)
	if (Either.isLeft(decoded)) {
		return decoded.left
	}
	const answer = decoded.right
	const fileName = answer.fileName ?? ''
	const link = answer.link ?? ''
	const errors = [
		...flagErrors(requiredFlags, answer.flags),
		...(needsEvidence ? evidenceErrors(fileName, link) : []),
	]
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(item, 'Confirmações marcadas', fileName, link)
}

const ExcludedAnswer = Schema.Struct({
	decision: Schema.Literal('excluded'),
})

const RegisteredAnswer = Schema.Struct({
	decision: Schema.Literal('registered'),
	number: Schema.String,
	issuedOn: Schema.String,
	expiresOn: Schema.String,
	fileName: Schema.String,
	link: Schema.String,
})

const validateBeverage = (
	item: CatalogItem,
	raw: unknown,
	today: string,
): ItemResult => {
	const excluded = Schema.decodeUnknownEither(ExcludedAnswer)(raw)
	if (Either.isRight(excluded)) {
		return pass(item, 'Caldo de cana excluído do portfólio inicial', '', '')
	}
	const registered = decode(RegisteredAnswer, raw)
	if (Either.isLeft(registered)) {
		return fail([
			'Para incluir caldo de cana, indexe o registro MAPA vigente. Sem ele, marque a exclusão.',
		])
	}
	const answer = registered.right
	if (answer.number.trim().length === 0) {
		return fail(['Informe o número do registro no MAPA.'])
	}
	const errors = [
		...evidenceErrors(answer.fileName, answer.link),
		...certificateDateErrors(answer.issuedOn, answer.expiresOn, today, null),
	]
	if (errors.length > 0) {
		return fail(errors)
	}
	return pass(
		item,
		`Registro MAPA ${answer.number.trim()} · válido até ${answer.expiresOn}`,
		answer.fileName,
		answer.link,
	)
}

export const validateItem = (
	item: CatalogItem,
	raw: unknown,
	today: string,
): ItemResult => {
	switch (item.kind._tag) {
		case 'Certificate':
			return validateCertificate(
				item,
				raw,
				today,
				item.kind.maxAgeDays,
				item.kind.flags,
			)
		case 'File':
			return validateFile(item, raw)
		case 'Identity':
			return validateIdentity(item, raw, item.kind.field)
		case 'Count':
			return validateCount(item, raw, item.kind.expected)
		case 'LotSyntax':
			return validateLot(item, raw)
		case 'SkuBarcodes':
			return validateSkus(item, raw)
		case 'Flags':
			return validateFlags(item, raw, item.kind.needsEvidence, item.kind.flags)
		case 'BeverageRegistration':
			return validateBeverage(item, raw, today)
	}
}

export const phase2Gate = (
	items: readonly CatalogItem[],
	answers: Readonly<Record<string, unknown>>,
	today: string,
): Phase2Gate => {
	const blockers: string[] = []
	const indexed: IndexedDocument[] = []
	for (const item of items) {
		const raw = answers[item.id]
		if (raw === undefined) {
			blockers.push(`${item.id} ausente`)
			continue
		}
		const result = validateItem(item, raw, today)
		if (!result.ok) {
			blockers.push(`${item.id}: ${result.errors.join(' ')}`)
			continue
		}
		indexed.push(result.indexed)
	}
	if (blockers.length > 0) {
		return { open: false, blockers }
	}
	return { open: true, indexed }
}
