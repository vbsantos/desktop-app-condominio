# Gestão de Condomínios

- Cadastro de Administradores/Beneficiarios;
- Cadastro de Condomínios;
- Cadastro de Pagantes (Dono ou Inquilino);
- Rateio de contas do condomínio;
- Geração de Relatórios (tabelas);

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

### Relações

- Beneficiarios (**1-N**) Condominios
- Condominios (**1-N**) Pagantes
- Condominios (**1-N**) Despesas
- Condominios (**1-N**) Relatorios
- Despesas (**1-N**) Valors
- Pagantes (**1-N**) Relatorios

## Controllers

- Beneficiario
- Condominio
- Pagante
- Despesa
- Valor
- RelatorioGeral
- RelatorioIndividual

## Pages

- Visualizar/Registrar/Editar Administrador/Beneficiário
- Visualizar/Registrar/Editar Condomínio
- Visualizar Relatórios
- Visualizar/Registrar/Editar Despesas
- Confirmar Geração de Relatórios Gerais e Individuais
