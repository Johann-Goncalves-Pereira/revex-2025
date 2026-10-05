import type { CatalogItem, Flag } from '../domain/catalog'
import { pilotSkus } from '../domain/catalog'

const label = (text: string, control: HTMLElement): HTMLLabelElement => {
	const node = document.createElement('label')
	const span = document.createElement('span')
	span.textContent = text
	node.append(span, control)
	return node
}

const input = (fieldName: string, type: string): HTMLInputElement => {
	const node = document.createElement('input')
	node.dataset.field = fieldName
	node.type = type
	return node
}

const evidence = (): HTMLDivElement => {
	const wrap = document.createElement('div')
	wrap.className = 'evidence'
	const fileName = input('fileName', 'text')
	fileName.placeholder = 'nome-do-arquivo.pdf'
	const picker = document.createElement('input')
	picker.type = 'file'
	picker.dataset.picker = 'file'
	const link = input('link', 'url')
	link.placeholder = 'https://'
	wrap.append(
		label('Nome do arquivo', fileName),
		label('Arquivo neste computador', picker),
		label('Link do documento', link),
	)
	return wrap
}

const flagInputs = (flags: readonly Flag[]): HTMLDivElement => {
	const wrap = document.createElement('div')
	wrap.className = 'flags'
	for (const flag of flags) {
		const box = document.createElement('input')
		box.type = 'checkbox'
		box.dataset.flag = flag.id
		wrap.append(label(flag.label, box))
	}
	return wrap
}

const certificateFields = (flags: readonly Flag[]): readonly HTMLElement[] => [
	label('Número', input('number', 'text')),
	label('Emissão', input('issuedOn', 'date')),
	label('Validade', input('expiresOn', 'date')),
	flagInputs(flags),
	evidence(),
]

const sourceNode = (item: CatalogItem): HTMLElement => {
	if (item.source._tag === 'Url') {
		const link = document.createElement('a')
		link.href = item.source.href
		link.target = '_blank'
		link.rel = 'noreferrer'
		link.textContent = item.source.label
		const paragraph = document.createElement('p')
		paragraph.append(link)
		return paragraph
	}
	const paragraph = document.createElement('p')
	paragraph.textContent = item.source.where
	return paragraph
}

const stepsNode = (steps: readonly string[]): HTMLOListElement => {
	const list = document.createElement('ol')
	for (const step of steps) {
		const item = document.createElement('li')
		item.textContent = step
		list.append(item)
	}
	return list
}

const skuTable = (): HTMLTableElement => {
	const table = document.createElement('table')
	const head = document.createElement('tr')
	for (const title of ['SKU', 'EAN-13', 'ITF-14']) {
		const cell = document.createElement('th')
		cell.textContent = title
		head.append(cell)
	}
	table.append(head)
	for (const sku of pilotSkus) {
		const row = document.createElement('tr')
		const name = document.createElement('td')
		name.textContent = sku.name
		const ean = document.createElement('td')
		const itf = document.createElement('td')
		ean.append(input(`ean-${sku.id}`, 'text'))
		itf.append(input(`itf-${sku.id}`, 'text'))
		row.append(name, ean, itf)
		table.append(row)
	}
	return table
}

const beverageFields = (): HTMLDivElement => {
	const wrap = document.createElement('div')
	const excluded = input('decision', 'radio')
	excluded.name = 'caldo-de-cana'
	excluded.value = 'excluded'
	const registered = input('decision', 'radio')
	registered.name = 'caldo-de-cana'
	registered.value = 'registered'
	const extra = document.createElement('div')
	extra.dataset.registration = 'true'
	extra.hidden = true
	extra.append(...certificateFields([]))
	wrap.append(
		label('Excluir do portfólio inicial', excluded),
		label('Registro MAPA ativo', registered),
		extra,
	)
	return wrap
}

const fieldsFor = (item: CatalogItem): HTMLElement => {
	const wrap = document.createElement('div')
	wrap.className = 'fields'
	switch (item.kind._tag) {
		case 'Certificate':
			wrap.append(...certificateFields(item.kind.flags))
			return wrap
		case 'File':
			wrap.append(evidence())
			return wrap
		case 'Identity':
			wrap.append(
				label(
					item.kind.field === 'cnpj' ? 'CNPJ' : 'Inscrição estadual',
					input('value', 'text'),
				),
				evidence(),
			)
			return wrap
		case 'Count':
			wrap.append(
				label('Produtores encontrados no CNPO', input('count', 'number')),
				evidence(),
			)
			return wrap
		case 'LotSyntax':
			wrap.append(
				label('Código de exemplo (AAMM-DDD-PP)', input('syntax', 'text')),
				evidence(),
			)
			return wrap
		case 'SkuBarcodes':
			wrap.append(skuTable())
			return wrap
		case 'Flags':
			wrap.append(flagInputs(item.kind.flags))
			if (item.kind.needsEvidence) {
				wrap.append(evidence())
			}
			return wrap
		case 'BeverageRegistration':
			wrap.append(beverageFields())
			return wrap
	}
}

export const itemCard = (item: CatalogItem): HTMLElement => {
	const article = document.createElement('article')
	article.className = 'card'
	article.dataset.item = item.id
	article.dataset.week = String(item.week)
	const heading = document.createElement('h2')
	heading.textContent = `${item.id} · ${item.title}`
	const why = document.createElement('p')
	why.textContent = item.why
	const errors = document.createElement('p')
	errors.className = 'errors'
	errors.dataset.errors = item.id
	article.append(
		heading,
		why,
		sourceNode(item),
		stepsNode(item.steps),
		fieldsFor(item),
		errors,
	)
	return article
}
