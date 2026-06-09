# Estrutura da planilha Google

Planilha criada:

```text
https://docs.google.com/spreadsheets/d/1qcV1LaaIL-ZBQ3DmImjAEmBZk5Dh_sWD1GX8JT9Obwk/edit
```

Esta primeira versao do app ainda pode usar `localStorage` enquanto o Apps Script nao estiver publicado, mas os campos ja foram desenhados para virar abas no Google Sheets.

## configuracoes

| campo | exemplo | observacao |
| --- | --- | --- |
| chave | limiteGastosGerais | Nome da configuracao |
| valor | 5500 | Valor da configuracao |
| observacao | Envelope mensal de gastos gerais | Nota livre |
| id | limiteGastosGerais | Identificador para atualizacao via endpoint |

Chaves usadas pelo app:

- `limiteGastosGerais`: envelope mensal para mercado, gasolina, Uber, farmacia e gastos do dia a dia.
- `googleSheetId`: ID da planilha usada como banco.
- `appsScriptUrl`: endpoint do Apps Script publicado.

## meses

| campo | exemplo |
| --- | --- |
| mes | 2026-06 |
| status | aberto |
| observacoes | Inicio do controle |

## receitas

| campo |
| --- |
| id |
| month |
| descricao |
| valorPrevisto |
| valorRealizado |
| dataPrevista |
| dataRealizada |
| status |
| recorrencia |
| repetirPorMeses |
| observacoes |
| createdAt |
| updatedAt |

## despesas

Use esta aba para as despesas gerais do mes, incluindo a linha do envelope `Gastos gerais do mes` e as faturas consolidadas dos cartoes.

| campo |
| --- |
| id |
| month |
| descricao |
| categoria |
| valorPrevisto |
| valorRealizado |
| vencimento |
| dataPagamento |
| status |
| recorrencia |
| repetirPorMeses |
| observacoes |
| createdAt |
| updatedAt |

## cartoes

| campo |
| --- |
| id |
| nome |
| diaFechamento |
| diaVencimento |
| ativo |

## faturas_cartao

| campo |
| --- |
| id |
| month |
| cartao |
| fechamento |
| vencimento |
| valorPrevisto |
| valorRealizado |
| status |
| observacoes |
| createdAt |
| updatedAt |

## compras_cartao

| campo |
| --- |
| id |
| descricao |
| cartao |
| categoria |
| valorTotal |
| parcelas |
| primeiraFatura |
| observacoes |
| createdAt |
| updatedAt |
| recorrenciaCartao |
| parcelaAtualCadastro |

## gastos_gerais

Use esta aba para os lancamentos diarios dentro do envelope mensal, como mercado, gasolina, Uber e farmacia.

| campo |
| --- |
| id |
| month |
| data |
| descricao |
| categoria |
| valor |
| formaPagamento |
| observacoes |
| createdAt |
| updatedAt |

## categorias

| campo | exemplo |
| --- | --- |
| nome | Mercado |
| tipo | gasto_geral |
| ativo | true |
