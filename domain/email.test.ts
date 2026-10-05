import { describe, expect, it } from 'vitest'
import { pilotSkus } from './catalog'
import { demoEmail } from './email'

describe('demo email', () => {
	it('addresses Festval and lists the dossier without sending', () => {
		const email = demoEmail([
			{
				id: 'DOC-W1-11',
				title: 'Cartão CNPJ',
				summary: '41.481.732/0001-28',
				fileName: 'cnpj.pdf',
				link: 'https://drive.example/cnpj',
			},
		])
		expect(email.to).toEqual([
			'sac@superfestval.com.br',
			'compras@superfestval.com.br',
		])
		expect(email.subject).toContain('Coopervida')
		expect(email.body).toContain('não foi enviado')
		expect(email.body).toContain('DOC-W1-11')
		expect(email.body).toContain('cnpj.pdf')
		expect(email.body).toContain('https://drive.example/cnpj')
		for (const sku of pilotSkus) {
			expect(email.body).toContain(sku.name)
		}
		expect(
			email.mailto.startsWith(
				'mailto:sac@superfestval.com.br,compras@superfestval.com.br?',
			),
		).toBe(true)
	})
})
