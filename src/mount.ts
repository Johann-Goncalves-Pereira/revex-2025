import { catalog } from '../domain/catalog'
import { demoEmail } from '../domain/email'
import { phase2Gate, validateItem } from '../domain/validators'
import { fillAnswer, readAnswer } from './answers'
import { itemCard } from './cards'
import { lockedPhase, openPhase, paintCard } from './phase'
import { loadAnswers, saveAnswers } from './storage'

const todayIso = (): string => {
	const now = new Date()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	return `${String(now.getFullYear())}-${month}-${day}`
}

const button = (text: string): HTMLButtonElement => {
	const node = document.createElement('button')
	node.type = 'button'
	node.textContent = text
	return node
}

const downloadJson = (filename: string, contents: string): void => {
	const href = URL.createObjectURL(
		new Blob([contents], { type: 'application/json' }),
	)
	const link = document.createElement('a')
	link.href = href
	link.download = filename
	link.click()
	URL.revokeObjectURL(href)
}

export const mount = (root: HTMLElement): void => {
	const today = todayIso()
	let week = 1
	const header = document.createElement('header')
	const title = document.createElement('h1')
	title.textContent = 'Coopervida — Fase 1'
	const lead = document.createElement('p')
	lead.className = 'lead'
	lead.textContent =
		'Auditoria de conformidade, planejamento de produção e arquitetura de marca. Cada item traz o caminho para obter o documento. A Fase 2 só abre com o dossiê válido.'
	const progress = document.createElement('p')
	progress.className = 'progress'
	const tools = document.createElement('div')
	tools.className = 'toolbar'
	const exportButton = button('Baixar índice')
	const printButton = button('Imprimir dossiê')
	tools.append(exportButton, printButton)
	header.append(title, lead, progress, tools)

	const weeks = document.createElement('div')
	weeks.className = 'weeks'
	const weekButtons = [1, 2, 3, 4].map(number => {
		const node = button(`Semana ${String(number)}`)
		node.dataset.weekButton = String(number)
		return node
	})
	weeks.append(...weekButtons)

	const cards = document.createElement('div')
	cards.className = 'cards'
	for (const item of catalog) {
		cards.append(itemCard(item))
	}

	const index = document.createElement('aside')
	const indexTitle = document.createElement('h2')
	indexTitle.textContent = 'Índice'
	const indexList = document.createElement('div')
	indexList.className = 'index-list'
	index.append(indexTitle, indexList)

	const phase = document.createElement('section')
	phase.className = 'phase-2'
	const phaseTitle = document.createElement('h2')
	phaseTitle.textContent = 'Fase 2'
	const banner = document.createElement('p')
	banner.className = 'banner'
	banner.textContent = 'Demonstração — este e-mail não foi enviado.'
	const phaseBody = document.createElement('div')
	phase.append(phaseTitle, banner, phaseBody)

	const layout = document.createElement('div')
	layout.className = 'layout'
	const main = document.createElement('main')
	main.append(weeks, cards, phase)
	layout.append(main, index)
	root.append(header, layout)

	const stored = loadAnswers()
	for (const item of catalog) {
		const card = cards.querySelector(`[data-item="${item.id}"]`)
		const raw = stored[item.id]
		if (card instanceof HTMLElement && raw !== undefined) {
			fillAnswer(item, card, raw)
		}
	}

	const showWeek = (): void => {
		for (const card of cards.querySelectorAll('article')) {
			if (card instanceof HTMLElement) {
				card.hidden = card.dataset.week !== String(week)
			}
		}
		for (const node of weekButtons) {
			node.classList.toggle('active', node.dataset.weekButton === String(week))
		}
	}

	const refresh = (): void => {
		const answers: Record<string, unknown> = {}
		let indexedCount = 0
		indexList.replaceChildren()
		for (const item of catalog) {
			const card = cards.querySelector(`[data-item="${item.id}"]`)
			if (!(card instanceof HTMLElement)) {
				continue
			}
			const answer = readAnswer(item, card)
			answers[item.id] = answer
			const result = validateItem(item, answer, today)
			if (result.ok) {
				indexedCount += 1
			}
			paintCard(card, result)
			const jump = button(`${item.id} · ${result.ok ? 'indexado' : 'pendente'}`)
			jump.className = result.ok ? 'ok' : 'pending'
			jump.addEventListener('click', () => {
				week = item.week
				showWeek()
				card.scrollIntoView({ behavior: 'smooth', block: 'start' })
			})
			indexList.append(jump)
		}
		saveAnswers(answers)
		progress.textContent = `${String(indexedCount)} de ${String(catalog.length)} documentos indexados`
		const gate = phase2Gate(catalog, answers, today)
		dossierJson = JSON.stringify(
			{
				today,
				answers,
				indexed: gate.open ? gate.indexed : [],
			},
			null,
			2,
		)
		phaseBody.replaceChildren(
			gate.open
				? openPhase(demoEmail(gate.indexed))
				: lockedPhase(gate.blockers),
		)
	}

	let dossierJson = ''
	exportButton.addEventListener('click', () => {
		refresh()
		downloadJson('indice-fase-1-coopervida.json', dossierJson)
	})
	printButton.addEventListener('click', () => {
		document.body.classList.add('printing-dossier')
		window.print()
	})
	window.addEventListener('afterprint', () => {
		document.body.classList.remove('printing-dossier')
	})
	for (const node of weekButtons) {
		node.addEventListener('click', () => {
			const selected = Number(node.dataset.weekButton)
			if (
				selected === 1 ||
				selected === 2 ||
				selected === 3 ||
				selected === 4
			) {
				week = selected
				showWeek()
			}
		})
	}
	root.addEventListener('change', event => {
		const target = event.target
		if (
			!(target instanceof HTMLInputElement) ||
			target.dataset.picker !== 'file'
		) {
			return
		}
		const file = target.files?.item(0) ?? null
		const card = target.closest('article')
		const name = card?.querySelector('[data-field="fileName"]')
		if (file !== null && name instanceof HTMLInputElement) {
			name.value = file.name
		}
	})
	root.addEventListener('input', () => {
		refresh()
	})
	root.addEventListener('change', () => {
		refresh()
	})
	showWeek()
	refresh()
}
