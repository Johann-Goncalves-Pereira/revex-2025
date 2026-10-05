import { pilotSkus } from './catalog'
import type { IndexedDocument } from './validators'

export const festvalRecipients = [
	'sac@superfestval.com.br',
	'compras@superfestval.com.br',
] as const

const subject =
	'Cadastro de fornecedor — Coopervida — dossiê da Fase 1 e catálogo piloto'

export type DemoEmail = {
	readonly to: readonly string[]
	readonly subject: string
	readonly body: string
	readonly mailto: string
}

const indexLine = (document: IndexedDocument): string =>
	[
		document.id,
		document.title,
		document.summary,
		document.fileName,
		document.link,
	]
		.filter(part => part.trim().length > 0)
		.join(' — ')

export const demoEmail = (indexed: readonly IndexedDocument[]): DemoEmail => {
	const lines = [
		'Demonstração: este e-mail não foi enviado.',
		'',
		'Prezados, Central de Compras da Rede Festval,',
		'',
		'A Cooperativa Agroecológica da Agricultura Familiar e Economia Solidária Cultivando Vida (Coopervida), CNPJ 41.481.732/0001-28, inscrição estadual 90892453-35, em Mandirituba/PR, concluiu a Fase 1: auditoria de conformidade, planejamento de produção e arquitetura de marca.',
		'',
		'Segue o portfólio piloto de 10 SKUs:',
		...pilotSkus.map((sku, index) => `${String(index + 1)}. ${sku.name}`),
		'',
		'Índice do dossiê:',
		...indexed.map(indexLine),
		'',
		'Solicitamos a avaliação comercial deste material. O próximo passo é a Fase 2, semana 5: acompanhamento pelo telefone +55 (41) 3227-8100 e pelo WhatsApp +55 (41) 3148-6507.',
		'',
		'Atenciosamente,',
		'Coopervida — Cultivando Vida',
		'Mandirituba/PR',
	]
	const body = lines.join('\n')
	const mailto = `mailto:${festvalRecipients.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
	return {
		to: festvalRecipients,
		subject,
		body,
		mailto,
	}
}
