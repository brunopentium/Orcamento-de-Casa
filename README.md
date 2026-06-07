# Orcamento de Casa

Webapp inicial para planejar e acompanhar o orcamento mensal da casa.

## Estado atual

- App estatico sem dependencias externas.
- Banco inicial criado no Google Sheets.
- Endpoint Google Apps Script configurado para sincronizacao com a planilha.
- Telas iniciais: Dashboard, Receitas, Despesas gerais, Cartoes, Gastos gerais e Configuracoes.

## Banco Google Sheets

Planilha:

```text
https://docs.google.com/spreadsheets/d/1qcV1LaaIL-ZBQ3DmImjAEmBZk5Dh_sWD1GX8JT9Obwk/edit
```

Endpoint Apps Script:

```text
https://script.google.com/macros/s/AKfycbyzaPJQykxUagZVyqMyKorcCkgz3_lh8J-yJmnj_7-ZcoWwnOrXbcyIA1_f4bVWVlhxcQ/exec
```

Abas:

```text
dashboard
configuracoes
meses
receitas
despesas
cartoes
faturas_cartao
compras_cartao
gastos_gerais
categorias
```

## Como abrir

Com um servidor local na pasta do projeto:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:8000/
```

## Proximos passos

1. Ajustar campos e categorias com os dados reais da casa.
2. Implementar leitura/salvamento automatico no app.
3. Implementar geracao automatica de parcelas e recorrencias futuras.
