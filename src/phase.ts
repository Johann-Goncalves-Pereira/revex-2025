import type { DemoEmail } from '../domain/email'
import type { ItemResult } from '../domain/validators'

export const paintCard = (card: HTMLElement, result: ItemResult): void => {
	card.dataset.status = result.ok ? 'indexed' : 'pending'
	const errors = card.querySelector('[data-errors]')
	if (errors instanceof HTMLElement) {
		errors.textContent = result.ok ? 'Indexado.' : result.errors.join(' ')
	}
	const extra = card.querySelector('[data-registration]')
	const selected = card.querySelector('[data-field="decision"]:checked')
	if (extra instanceof HTMLElement && selected instanceof HTMLInputElement) {
		extra.hidden = selected.value !== 'registered'
	}
}

const button = (text: string): HTMLButtonElement => {
	const node = document.createElement('button')
	node.type = 'button'
	node.textContent = text
	return node
}

const copyText = (text: string): void => {
	const area = document.createElement('textarea')
	area.value = text
	document.body.append(area)
	area.select()
	document.execCommand('copy')
	area.remove()
}

export const lockedPhase = (blockers: readonly string[]): HTMLElement => {
	const wrap = document.createElement('div')
	const locked = document.createElement('p')
	locked.textContent =
		'A Fase 2 abre quando cada documento obrigatório estiver indexado e válido.'
	const list = document.createElement('ul')
	for (const blocker of blockers) {
		const item = document.createElement('li')
		item.textContent = blocker
		list.append(item)
	}
	wrap.append(locked, list)
	return wrap
}

export const openPhase = (email: DemoEmail): HTMLElement => {
	const wrap = document.createElement('div')
	const intro = document.createElement('p')
	intro.textContent =
		'Semana 5: envie o catálogo e este dossiê à Central de Compras e acompanhe por telefone +55 (41) 3227-8100 ou WhatsApp +55 (41) 3148-6507.'
	const message = `Para: ${email.to.join(', ')}\nAssunto: ${email.subject}\n\n${email.body}`
	const preview = document.createElement('pre')
	preview.textContent = message
	const actions = document.createElement('div')
	actions.className = 'toolbar'
	const copyButton = button('Copiar e-mail')
	copyButton.addEventListener('click', () => {
		copyText(message)
	})
	const mail = document.createElement('a')
	mail.href = email.mailto
	mail.textContent = 'Abrir no aplicativo de e-mail'
	actions.append(copyButton, mail)
	wrap.append(intro, preview, actions)
	return wrap
}
