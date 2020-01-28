# Gestão de Condomínios

## Necessidade do cliente

- Simplicidade
- Rapidez

## Funcionalidades acordadas com o Cliente

- Software para plataforma:
  - Sistema Operacional: `Windows 7`;
  - Arquitetura do Sistema Operacional: `32 bits`;
- Cadastro de Condomínios;
- Cadastro de Apartamentos de um Condomínio;
- Cadastro do Morador do Apartamento (Dono ou Inquilino);
- Rateio de contas do condomínio;
- Geração de Relatórios (tabelas e gráficos);
- Geração de Boletos com os valores calculados pelo sistema;
  - [Boleto Simples](https://suporte.boletosimples.com.br)
- Envio automatizado de e-mails para os inquilinos/proprietários;

## Banco de dados

Administrador:

- ID [auto-increment]
- nome
- email
- senha [crypto - md5]
- DADOS PARA CRIAR O BOLETO

Condomínio:

- ID [auto-increment]
- endereço
  - cidade
  - bairro
  - rua
  - número
- ID do administrador

Apartamento:

- ID [auto-increment]
- número
- ID do condomínio

Morador:

- ID [auto-increment]
- nome
- email
- endereço
- ID do Apartamento
- DADOS PARA CRIAR O BOLETO

Endereço(?):

- cidade
- bairro
- rua
- número condomínio
- número do Apartamento
