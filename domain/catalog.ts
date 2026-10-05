import * as Schema from 'effect/Schema'

const FlagSchema = Schema.Struct({
	id: Schema.String.pipe(Schema.minLength(1)),
	label: Schema.String.pipe(Schema.minLength(1)),
})

const text = Schema.String.pipe(Schema.minLength(1))

const CertificateKind = Schema.Struct({
	_tag: Schema.Literal('Certificate'),
	maxAgeDays: Schema.NullOr(Schema.Number),
	flags: Schema.Array(FlagSchema),
})

const CountKind = Schema.Struct({
	_tag: Schema.Literal('Count'),
	expected: Schema.Number,
})

const FileKind = Schema.Struct({
	_tag: Schema.Literal('File'),
})

const IdentityKind = Schema.Struct({
	_tag: Schema.Literal('Identity'),
	field: Schema.Literal('cnpj', 'ie'),
})

const LotKind = Schema.Struct({
	_tag: Schema.Literal('LotSyntax'),
})

const SkuKind = Schema.Struct({
	_tag: Schema.Literal('SkuBarcodes'),
})

const FlagsKind = Schema.Struct({
	_tag: Schema.Literal('Flags'),
	needsEvidence: Schema.Boolean,
	flags: Schema.Array(FlagSchema),
})

const BeverageKind = Schema.Struct({
	_tag: Schema.Literal('BeverageRegistration'),
})

const KindSchema = Schema.Union(
	CertificateKind,
	CountKind,
	FileKind,
	IdentityKind,
	LotKind,
	SkuKind,
	FlagsKind,
	BeverageKind,
)

const SourceSchema = Schema.Union(
	Schema.Struct({
		_tag: Schema.Literal('Url'),
		href: text,
		label: text,
	}),
	Schema.Struct({
		_tag: Schema.Literal('InPerson'),
		where: text,
	}),
)

const CatalogItemSchema = Schema.Struct({
	id: text,
	week: Schema.Literal(1, 2, 3, 4),
	title: text,
	why: text,
	steps: Schema.Array(text).pipe(Schema.minItems(1)),
	source: SourceSchema,
	kind: KindSchema,
})

export type CatalogItem = typeof CatalogItemSchema.Type
export type Flag = typeof FlagSchema.Type

const catalogSchema = Schema.Array(CatalogItemSchema)

export const decodeCatalog = Schema.decodeUnknown(catalogSchema)

const flag = (id: string, label: string): Flag => ({ id, label })

const url = (href: string, label: string): CatalogItem['source'] => ({
	_tag: 'Url',
	href,
	label,
})

const desk = (where: string): CatalogItem['source'] => ({
	_tag: 'InPerson',
	where,
})

export const pilotSkus = [
	{ id: 'sku-01', name: 'Abóbora Cabotiá Orgânica' },
	{ id: 'sku-02', name: 'Cenoura Orgânica (maço 500g ou bandeja)' },
	{ id: 'sku-03', name: 'Batata-Doce Roxa Orgânica (1kg)' },
	{ id: 'sku-04', name: 'Beterraba Orgânica em maço (500g)' },
	{ id: 'sku-05', name: 'Alface Crespa/Americana Orgânica' },
	{ id: 'sku-06', name: 'Abóbora Cabotiá em cubos a vácuo (500g)' },
	{ id: 'sku-07', name: 'Mandioca Orgânica congelada (1kg)' },
	{ id: 'sku-08', name: 'Mix de legumes higienizados para sopa (400g)' },
	{ id: 'sku-09', name: 'Doce/Geleia artesanal de frutas da estação (250g)' },
	{ id: 'sku-10', name: 'Biscoito/Bolacha artesanal orgânica ou polvilho' },
] as const

const none: Flag[] = []

export const catalog: readonly CatalogItem[] = [
	{
		id: 'DOC-W1-01',
		week: 1,
		title: 'Certificado SisOrg para venda indireta',
		why: 'O Festval só recebe orgânico com selo SisOrg. OCS de feira não cobre supermercado.',
		steps: [
			'Separe o certificado vigente do OPAC (Rede Ecovida) ou da certificadora por auditoria.',
			'Confira se o escopo cita produção vegetal in natura e a cozinha agroindustrial.',
			'Confirme que a venda é indireta, no SisOrg, e não só OCS.',
			'Anote número, emissão e validade e guarde o PDF na pasta do dossiê.',
		],
		source: url(
			'https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos',
			'MAPA — Orgânicos e SisOrg',
		),
		kind: {
			_tag: 'Certificate',
			maxAgeDays: null,
			flags: [
				flag('coversInNatura', 'Cobre produção vegetal in natura'),
				flag('coversKitchen', 'Cobre a cozinha agroindustrial'),
			],
		},
	},
	{
		id: 'DOC-W1-02',
		week: 1,
		title: 'Conferência dos 60 produtores no CNPO',
		why: 'Cada cooperado que abastece o Festval precisa constar no Cadastro Nacional de Produtores Orgânicos.',
		steps: [
			'Abra a planilha pública do CNPO no MAPA.',
			'Busque os 60 cooperados de Mandirituba pelo nome ou CPF/CNPJ.',
			'Marque na planilha interna quem foi encontrado e quem está ausente.',
			'Indexe a planilha só quando a contagem encontrada for 60.',
		],
		source: url(
			'https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/organicos/cadastro-nacional-de-produtores-organicos-cnpo',
			'MAPA — Cadastro Nacional de Produtores Orgânicos',
		),
		kind: { _tag: 'Count', expected: 60 },
	},
	{
		id: 'DOC-W1-03',
		week: 1,
		title: 'Alvará sanitário da cozinha (VISA)',
		why: 'O cadastro do Festval exige licença sanitária vigente para vegetal, prato pronto e congelado.',
		steps: [
			'Peça na Secretaria Municipal de Saúde de Mandirituba a via vigente do alvará.',
			'Confira se a atividade cobre o CNAE 10.96-1-00.',
			'Confira se o texto alcança processamento de vegetais, pratos prontos e congelados.',
			'Se estiver vencido, protocole a renovação antes de seguir.',
		],
		source: desk(
			'Secretaria Municipal de Saúde de Mandirituba — Vigilância Sanitária',
		),
		kind: {
			_tag: 'Certificate',
			maxAgeDays: null,
			flags: [
				flag(
					'coversProcessing',
					'Cobre vegetal, prato pronto e congelado (CNAE 10.96-1-00)',
				),
			],
		},
	},
	{
		id: 'DOC-W1-04',
		week: 1,
		title: 'Manual de Boas Práticas de Fabricação',
		why: 'A inspeção de qualidade do varejo pede o BPF da agroindústria, em pasta física e digital.',
		steps: [
			'Reúna a versão assinada pelo responsável técnico.',
			'Confira se o manual descreve a cozinha que vai fornecer ao Festval.',
			'Salve o PDF e anote onde está a via impressa.',
		],
		source: desk('Pasta da cozinha agroindustrial da Coopervida'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W1-05',
		week: 1,
		title: 'POP de higienização',
		why: 'O POP de higienização de instalações e equipamentos faz parte do pacote sanitário.',
		steps: [
			'Localize o procedimento operacional de higienização vigente.',
			'Confira se cobre instalações e equipamentos da cozinha.',
			'Indexe o arquivo digital.',
		],
		source: desk('Pasta de POPs da cozinha agroindustrial'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W1-06',
		week: 1,
		title: 'Laudo de potabilidade da água',
		why: 'O POP de água pede laudo microbiológico semestral.',
		steps: [
			'Solicite ao laboratório o laudo microbiológico da água usada na cozinha.',
			'Confira se a coleta tem menos de 183 dias.',
			'Guarde o PDF com o número do laudo e a data.',
		],
		source: desk('Laboratório que analisa a água da cozinha'),
		kind: { _tag: 'Certificate', maxAgeDays: 183, flags: none },
	},
	{
		id: 'DOC-W1-07',
		week: 1,
		title: 'Certificado de controle de pragas',
		why: 'O cadastro sanitário pede o comprovante da empresa de desinsetização e desratização.',
		steps: [
			'Peça à empresa contratada o certificado vigente.',
			'Confira endereço da cozinha, data e validade.',
			'Indexe o PDF.',
		],
		source: desk('Empresa de controle de pragas contratada pela cooperativa'),
		kind: { _tag: 'Certificate', maxAgeDays: null, flags: none },
	},
	{
		id: 'DOC-W1-08',
		week: 1,
		title: 'ASO dos manipuladores',
		why: 'A saúde ocupacional de quem manipula alimento entra no dossiê da cozinha.',
		steps: [
			'Reúna o Atestado de Saúde Ocupacional de cada operador da cozinha.',
			'Confira se os exames estão dentro do prazo do programa de saúde.',
			'Junte os atestados em um único PDF e indexe.',
		],
		source: desk('Médico do trabalho que atende os manipuladores da cozinha'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W1-09',
		week: 1,
		title: 'Certidão de regularidade do responsável técnico',
		why: 'A cozinha precisa de RT com certidão do CRN ou do CREA vinculada à cooperativa.',
		steps: [
			'Peça ao nutricionista a certidão no CRN-8, ou ao engenheiro a certidão no CREA-PR.',
			'Confira se o documento cita a cozinha da Coopervida.',
			'Indexe número e validade.',
		],
		source: url(
			'https://www.crn8.org.br/',
			'CRN-8 — Conselho Regional de Nutrição',
		),
		kind: { _tag: 'Certificate', maxAgeDays: null, flags: none },
	},
	{
		id: 'DOC-W1-10',
		week: 1,
		title: 'Caldo de cana e registro no MAPA',
		why: 'Bebida vegetal não entra no portfólio só com alvará da VISA. Sem registro de estabelecimento e de produto no MAPA, o item fica de fora.',
		steps: [
			'Verifique se a Coopervida tem registro de estabelecimento e de produto na SFA/PR.',
			'Se o registro não estiver ativo, marque exclusão. Esse item não substitui nenhum dos 10 SKUs.',
			'Se estiver ativo, indexe o número do registro e a validade.',
		],
		source: url(
			'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal/bebidas',
			'MAPA — Bebidas',
		),
		kind: { _tag: 'BeverageRegistration' },
	},
	{
		id: 'DOC-W1-11',
		week: 1,
		title: 'Cartão CNPJ',
		why: 'O cadastro do Festval confere a cooperativa ativa, com CNAE de hortifrúti atacadista e de fabricação de alimentos.',
		steps: [
			'Emita o comprovante de inscrição no site da Receita Federal.',
			'Confira o CNPJ 41.481.732/0001-28 e a situação Ativa.',
			'Confira os CNAEs 46.33-8-01 e 10.96-1-00.',
			'Salve o comprovante em PDF.',
		],
		source: url(
			'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp',
			'Receita Federal — Comprovante de inscrição CNPJ',
		),
		kind: { _tag: 'Identity', field: 'cnpj' },
	},
	{
		id: 'DOC-W1-12',
		week: 1,
		title: 'Inscrição Estadual',
		why: 'A Nota Fiscal e o cadastro de fornecedor exigem IE regular no CAD/ICMS do Paraná.',
		steps: [
			'Consulte o contribuinte no portal da Receita Estadual do Paraná.',
			'Confira a IE 90892453-35 e a situação regular.',
			'Salve o comprovante da consulta.',
		],
		source: url('https://www.fazenda.pr.gov.br/', 'Receita Estadual do Paraná'),
		kind: { _tag: 'Identity', field: 'ie' },
	},
	{
		id: 'DOC-W1-13',
		week: 1,
		title: 'Estatuto social registrado',
		why: 'A Cia Beal pede o estatuto da cooperativa registrado na Junta Comercial.',
		steps: [
			'Localize o estatuto registrado na JUCEPAR.',
			'Se a via autenticada não estiver na sede, peça a certidão na Junta.',
			'Indexe a cópia digital.',
		],
		source: url('https://www.juntacomercial.pr.gov.br/', 'JUCEPAR'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W1-14',
		week: 1,
		title: 'Ata de eleição da diretoria',
		why: 'O cadastro pede a ata da assembleia que elegeu a diretoria em exercício.',
		steps: [
			'Separe a ata da Assembleia Geral Ordinária que elegeu a diretoria atual.',
			'Confira se os nomes coincidem com quem assina o cadastro.',
			'Indexe a cópia.',
		],
		source: url('https://www.juntacomercial.pr.gov.br/', 'JUCEPAR'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W1-15',
		week: 1,
		title: 'CND federal',
		why: 'A triagem pede certidão conjunta da Receita Federal e da PGFN.',
		steps: [
			'Abra o serviço de certidão de regularidade fiscal.',
			'Emita a certidão com o CNPJ 41.481.732/0001-28.',
			'Só indexe se o resultado for negativa ou positiva com efeitos de negativa, e ainda válida.',
		],
		source: url(
			'https://www.gov.br/pt-br/servicos/emitir-certidao-de-regularidade-fiscal',
			'Gov.br — Certidão de regularidade fiscal',
		),
		kind: { _tag: 'Certificate', maxAgeDays: null, flags: none },
	},
	{
		id: 'DOC-W1-16',
		week: 1,
		title: 'CND estadual do Paraná',
		why: 'A triagem pede a certidão de débitos da Fazenda do Paraná.',
		steps: [
			'No portal da Receita Estadual, escolha emitir certidão negativa.',
			'Informe o CNPJ da Coopervida.',
			'Indexe a certidão vigente.',
		],
		source: url(
			'https://www.fazenda.pr.gov.br/servicos/Economia-e-Financas/Certidoes/Emitir-Certidao-Negativa-Receita-Estadual-kZrX5gol',
			'Receita Estadual — Certidão negativa',
		),
		kind: { _tag: 'Certificate', maxAgeDays: null, flags: none },
	},
	{
		id: 'DOC-W1-17',
		week: 1,
		title: 'CND municipal de Mandirituba',
		why: 'A triagem pede a certidão de tributos do município da sede.',
		steps: [
			'Abra Serviços ao Cidadão e Empresas no site da Prefeitura.',
			'Emita a Certidão Negativa de Débitos de Contribuinte com o CNPJ da cooperativa.',
			'Se o portal não emitir, retire no Departamento de Tributação e digitalize.',
		],
		source: url(
			'https://www.mandirituba.pr.gov.br/servicos-ao-cidadao-e-empresas',
			'Prefeitura de Mandirituba — Serviços',
		),
		kind: { _tag: 'Certificate', maxAgeDays: null, flags: none },
	},
	{
		id: 'DOC-W1-18',
		week: 1,
		title: 'CRF do FGTS',
		why: 'O Certificado de Regularidade do FGTS vale 30 dias e entra no pacote de certidões.',
		steps: [
			'Consulte a regularidade do empregador no site da Caixa.',
			'Informe o CNPJ 41.481.732/0001-28 e a UF PR.',
			'Indexe o CRF. A validade não pode passar de 30 dias após a emissão.',
		],
		source: url(
			'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf',
			'Caixa — Consulta de regularidade do FGTS',
		),
		kind: { _tag: 'Certificate', maxAgeDays: 30, flags: none },
	},
	{
		id: 'DOC-W1-19',
		week: 1,
		title: 'CNDT',
		why: 'A Certidão Negativa de Débitos Trabalhistas vale 180 dias.',
		steps: [
			'Emita a CNDT no portal do TST com o CNPJ da Coopervida.',
			'Confira se o prazo entre emissão e validade é de até 180 dias.',
			'Indexe a certidão ainda vigente.',
		],
		source: url(
			'https://www.tst.jus.br/certidao1',
			'TST — Certidão Negativa de Débitos Trabalhistas',
		),
		kind: { _tag: 'Certificate', maxAgeDays: 180, flags: none },
	},
	{
		id: 'DOC-W2-01',
		week: 2,
		title: 'Filiação à GS1 Brasil',
		why: 'O caixa do Festval não aceita código inventado. O prefixo tem de ser da GS1, no CNPJ da cooperativa.',
		steps: [
			'Solicite o código de barras no portal da GS1 Brasil com o CNPJ da Coopervida.',
			'Envie os documentos pedidos e assine o contrato.',
			'Indexe o comprovante de filiação depois do pagamento.',
		],
		source: url(
			'https://www.gs1br.org/solicitar-codigo-de-barras',
			'GS1 Brasil — Solicitar código de barras',
		),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W2-02',
		week: 2,
		title: 'Licença do prefixo GS1',
		why: 'Cada SKU nasce do prefixo proprietário da cooperativa.',
		steps: [
			'Depois da compensação, baixe a licença do prefixo no portal da GS1.',
			'Confira se o prefixo está no CNPJ 41.481.732/0001-28.',
			'Indexe o documento do prefixo.',
		],
		source: url(
			'https://www.gs1br.org/tabela-de-valores',
			'GS1 Brasil — Filiação e prefixo',
		),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W2-03',
		week: 2,
		title: 'EAN-13 e ITF-14 dos 10 SKUs',
		why: 'Cada unidade de venda leva um GTIN-13. Cada caixa de embarque leva um ITF-14. Gramaturas diferentes não compartilham código.',
		steps: [
			'No Cadastro Nacional de Produtos da GS1, gere um EAN-13 para cada um dos 10 SKUs.',
			'Gere o ITF-14 da caixa de transporte de cada SKU.',
			'Copie os números para esta ficha. Códigos repetidos ou com dígito inválido não passam.',
		],
		source: url(
			'https://qualidade.gs1br.org/login-cnp/',
			'GS1 — Cadastro Nacional de Produtos',
		),
		kind: { _tag: 'SkuBarcodes' },
	},
	{
		id: 'DOC-W2-04',
		week: 2,
		title: 'Leiaute de rotulagem',
		why: 'O rótulo precisa da tabela nutricional, da lupa quando couber, do aviso de alérgenos, da declaração de glúten e do selo SisOrg.',
		steps: [
			'Monte a tabela nutricional no padrão da RDC 429/2020 e da IN 75/2020.',
			'Calcule a lupa frontal. Hortaliça pura dispensa. Doce e conserva precisam da conta de açúcar.',
			'Inclua a linha de alérgicos em caixa alta e “CONTÉM GLÚTEN” ou “NÃO CONTÉM GLÚTEN”.',
			'Coloque o selo SisOrg com o nome do certificador e indexe o PDF do leiaute.',
		],
		source: url(
			'https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem',
			'Anvisa — Rotulagem de alimentos',
		),
		kind: {
			_tag: 'Flags',
			needsEvidence: true,
			flags: [
				flag(
					'nutrition',
					'Tabela nutricional no padrão RDC 429/2020 e IN 75/2020',
				),
				flag('allergen', 'Declaração de alérgicos (RDC 727/2022)'),
				flag('gluten', 'Declaração de glúten'),
				flag('sisorgSeal', 'Selo SisOrg com o certificador'),
			],
		},
	},
	{
		id: 'DOC-W3-01',
		week: 3,
		title: 'Caderno de campo dos 60 produtores',
		why: 'A INC 02/2018 e a ADAPAR exigem o caderno de campo de cada propriedade.',
		steps: [
			'Adote uma ficha única: talhão, insumos e datas, colheita prevista e realizada, quantidade.',
			'Entregue a ficha, em papel ou planilha, aos 60 cooperados.',
			'Indexe o modelo em uso.',
		],
		source: desk('Modelo de caderno de campo da Coopervida, com o agrônomo'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W3-02',
		week: 3,
		title: 'Sintaxe do código de lote',
		why: 'O lote precisa ligar o produto ao produtor. O padrão da cooperativa é AAMM-DDD-PP.',
		steps: [
			'Feche a regra: ano e mês (AAMM), dia do mês com três dígitos (001 a 031) e código do produtor com dois dígitos.',
			'Escreva um exemplo real, como 2610-005-01.',
			'Indexe o padrão escrito para a equipe de embalagem.',
		],
		source: url(
			'https://www.gov.br/agricultura/pt-br/assuntos/inspecao/produtos-vegetal',
			'MAPA — Inspeção de produtos vegetais',
		),
		kind: { _tag: 'LotSyntax' },
	},
	{
		id: 'DOC-W3-03',
		week: 3,
		title: 'Etiqueta da caixa e da embalagem',
		why: 'Tudo que entra no Festval mostra produto, razão social, CNPJ, endereço, lote, data e peso líquido.',
		steps: [
			'Desenhe a etiqueta com nome do produto, Coopervida, CNPJ, endereço em Mandirituba, lote, data e peso líquido.',
			'Se houver QR Code, aponte para a página do produtor daquele lote.',
			'Indexe a arte aprovada.',
		],
		source: desk('Arte da etiqueta, na cooperativa'),
		kind: {
			_tag: 'Flags',
			needsEvidence: true,
			flags: [
				flag('productName', 'Nome do produto'),
				flag('company', 'Razão social e CNPJ da Coopervida'),
				flag('address', 'Endereço em Mandirituba'),
				flag('lot', 'Número do lote'),
				flag('date', 'Data de colheita ou embalagem'),
				flag('netWeight', 'Peso líquido'),
			],
		},
	},
	{
		id: 'DOC-W3-04',
		week: 3,
		title: 'Tabela de calibres e descarte',
		why: 'O que está fora do calibre não vai para a gôndola. Vai para a cozinha.',
		steps: [
			'Com o agrônomo, feche o calibre visual dos 10 SKUs.',
			'Escreva o desvio: manchado, com praga ou fora do tamanho segue para a cozinha.',
			'Indexe a tabela.',
		],
		source: desk('Tabela de calibres feita com o agrônomo de campo'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W3-05',
		week: 3,
		title: 'Caixa plástica de transporte',
		why: 'Caixa de madeira, no padrão Ceasa, não entra. A caixa é plástica, vazada, higienizável, 60x40x24 cm, com o nome da cooperativa.',
		steps: [
			'Confirme que a expedição não usa caixa de madeira.',
			'Adote a caixa plástica 60x40x24 cm identificada com a Coopervida.',
			'Indexe a foto ou a nota de adoção do padrão.',
		],
		source: desk('Expedição da Coopervida em Mandirituba'),
		kind: {
			_tag: 'Flags',
			needsEvidence: true,
			flags: [
				flag(
					'plasticCrates',
					'Caixa plástica 60x40x24 cm, com o nome da cooperativa',
				),
				flag('noWood', 'Caixa de madeira fora da expedição para o Festval'),
			],
		},
	},
	{
		id: 'DOC-W4-01',
		week: 4,
		title: 'Planilha de preço B2B',
		why: 'O preço de nota sai do preço de gôndola, menos a margem do Festval, verba, frete, embalagem, retenção e o custo do prazo.',
		steps: [
			'Monte a planilha de trás para frente: gôndola, margem de 35% a 45%, verba de 3% a 5%.',
			'Desconte frete Mandirituba–Curitiba, embalagem, rótulo, GS1, retenção de 10% a 15% e o prazo de 30 a 45 dias.',
			'O resultado é a remuneração do agricultor. Indexe a planilha.',
		],
		source: desk('Planilha do financeiro da Coopervida'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W4-02',
		week: 4,
		title: 'Configuração da NF-e',
		why: 'A nota precisa sair com o CFOP certo antes de fechar a negociação.',
		steps: [
			'No emissor, configure CFOP 5.101 para produção da cozinha e 5.115 para mercadoria recebida de associados.',
			'Confira isenção ou diferimento de ICMS do hortifrúti fresco no RICMS/PR.',
			'Indexe um print ou um PDF da configuração.',
		],
		source: url(
			'https://www.nfe.fazenda.gov.br/portal/principal.aspx',
			'Portal da NF-e',
		),
		kind: {
			_tag: 'Flags',
			needsEvidence: true,
			flags: [
				flag('cfop', 'CFOP 5.101 ou 5.115 configurado no emissor'),
				flag('icms', 'Tratamento de ICMS do fresco e do processado revisado'),
			],
		},
	},
	{
		id: 'DOC-W4-03',
		week: 4,
		title: 'Pitch deck',
		why: 'O comprador recebe um PDF com as 60 famílias, a cozinha, a rastreabilidade e a entrega direta.',
		steps: [
			'Escreva a apresentação institucional das 60 famílias em Mandirituba.',
			'Inclua diferenciais: lote INC 02/2018, selo SisOrg, alvará e entrega direta.',
			'Exporte em PDF e indexe.',
		],
		source: desk('Arquivo comercial da Coopervida'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W4-04',
		week: 4,
		title: 'Catálogo técnico dos 10 SKUs',
		why: 'Cada SKU precisa de foto, peso, medida, EAN-13, validade, temperatura e quantidade por caixa.',
		steps: [
			'Para cada SKU, junte foto em fundo branco, peso líquido, medidas, EAN-13, shelf-life e temperatura.',
			'Informe quantas unidades cabem na caixa de embarque.',
			'Indexe o PDF do catálogo.',
		],
		source: desk('Catálogo comercial da Coopervida'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W4-05',
		week: 4,
		title: 'Ficha cadastral',
		why: 'O cadastro de fornecedor pede CNPJ, IE, endereço e a conta PJ da cooperativa.',
		steps: [
			'Preencha CNPJ, IE, endereço em Mandirituba e os dados da conta PJ.',
			'Confira se a conta é da cooperativa, não de um cooperado.',
			'Indexe a ficha.',
		],
		source: desk('Ficha cadastral preenchida pela diretoria'),
		kind: { _tag: 'File' },
	},
	{
		id: 'DOC-W4-06',
		week: 4,
		title: 'Lista de preços de atacado',
		why: 'A proposta pede prazo de 15 a 28 dias para o fresco de alto giro, em venda firme.',
		steps: [
			'Liste o preço de nota dos 10 SKUs, saído da planilha de mark-up.',
			'Escreva o prazo pedido: 15 a 28 dias para o fresco.',
			'Deixe explícito que a venda é firme, sem consignação.',
			'Indexe a lista.',
		],
		source: desk('Lista de preços assinada pelo comercial'),
		kind: { _tag: 'File' },
	},
]
