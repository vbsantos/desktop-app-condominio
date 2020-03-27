# Gestão de Condomínios

- Cadastro de Administradores/Beneficiarios;
- Cadastro de Condomínios;
- Cadastro de Pagantes (Dono ou Inquilino);
- Rateio de contas do condomínio;
- Geração de Relatórios (tabelas);
- Geração e armazenamento de Boletos com os valores calculados pelo sistema;
  - Boletos pela API Boleto.Cloud
- Envio automatizado de e-mails para os inquilinos/proprietários;

---

## Models

Beneficiario:

```bash
yarn sequelize model:generate --name Beneficiario --attributes nome:string,cprf:string,token_acesso:string,token_conta:string,cep:string,uf:string,localidade:string,bairro:string,logradouro:string,numero:string,complemento:string
```

Condominio:

```bash
yarn sequelize model:generate --name Condominio --attributes nome:string,cep:string,uf:string,localidade:string,bairro:string,logradouro:string,numero:string,beneficiarioId:integer
```

Relatorio Geral:

```bash
yarn sequelize model:generate --name RelatorioGeral --attributes report:string,condominioId:integer
```

Despesa:

```bash
yarn sequelize model:generate --name Conta --attributes nome:string,valor:string,rateioAutomatico:boolean,permanente:boolean,condominioId:integer
```

Valor:

```bash
yarn sequelize model:generate --name Valor --attributes valor:string,despesaId:integer,paganteId:integer
```

Pagante:

```bash
yarn sequelize model:generate --name Pagante --attributes nome:string,cprf:string,complemento:string,fracao:string,condominioId:integer
```

Relatorio Individual:

```bash
yarn sequelize model:generate --name RelatorioIndividual --attributes report:string,paganteId:integer
```

Boleto:

```bash
yarn sequelize model:generate --name Boleto --attributes emissao:string,vencimento:string,documento:string,numero:string,titulo:string,valor:string,paganteId:integer
```

### Relações

- Beneficiarios (**1-N**) Condominios
- Condominios (**1-N**) Pagantes
- Condominios (**1-N**) Despesas
- Condominios (**1-N**) Relatorios
- Despesas (**1-N**) Valors
- Pagantes (**1-N**) Boletos
- Pagantes (**1-N**) Relatorios

## Controllers

- Beneficiario
- Condominio
- Pagante
- Despesa
- Boleto
- Valor
- RelatorioGeral
- RelatorioIndividual
- API \*
- Email \*

\* Por fazer

## Pages/Screens

- Visualizar/Registrar/Editar Administrador/Beneficiário
- Visualizar/Registrar/Editar Condomínio
- Visualizar/Registrar/Editar Despesas
- Confirmar Geração de Relatórios
- Relatórios Gerais \*
- Relatórios Individuais \*
- Gerar Boletos \*

\* Por fazer
