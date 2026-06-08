import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("outputs");
const outputPath = path.join(outputDir, "orcamento-de-casa-banco.xlsx");

const workbook = Workbook.create();

const sheets = {
  dashboard: workbook.worksheets.add("dashboard"),
  configuracoes: workbook.worksheets.add("configuracoes"),
  meses: workbook.worksheets.add("meses"),
  receitas: workbook.worksheets.add("receitas"),
  despesas: workbook.worksheets.add("despesas"),
  cartoes: workbook.worksheets.add("cartoes"),
  faturas: workbook.worksheets.add("faturas_cartao"),
  compras: workbook.worksheets.add("compras_cartao"),
  gastos: workbook.worksheets.add("gastos_gerais"),
  categorias: workbook.worksheets.add("categorias"),
};

const today = new Date();
const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
const isoDate = today.toISOString().slice(0, 10);

const palette = {
  ink: "#17201B",
  muted: "#647067",
  dark: "#15241F",
  primary: "#226A5C",
  accent: "#BC5D35",
  line: "#DCE3DD",
  soft: "#EEF3EF",
  white: "#FFFFFF",
};

function styleSheet(sheet, widths = []) {
  sheet.showGridLines = false;
  sheet.freezePanes.freezeRows(1);
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
}

function writeTable(sheet, headers, rows, tableName, widths = []) {
  styleSheet(sheet, widths);
  const rowCount = Math.max(rows.length + 1, 2);
  const colCount = headers.length;
  const range = sheet.getRangeByIndexes(0, 0, rowCount, colCount);
  range.values = [headers, ...rows, ...Array.from({ length: rowCount - rows.length - 1 }, () => Array(colCount).fill(""))];
  sheet.getRangeByIndexes(0, 0, 1, colCount).format = {
    fill: palette.primary,
    font: { bold: true, color: palette.white },
    wrapText: true,
  };
  sheet.getRangeByIndexes(0, 0, rowCount, colCount).format.borders = {
    preset: "all",
    style: "thin",
    color: palette.line,
  };
  sheet.tables.add(sheet.getRangeByIndexes(0, 0, 200, colCount), true, tableName);
}

function applyMoney(sheet, columns, rows = 200) {
  for (const column of columns) {
    sheet.getRange(`${column}2:${column}${rows}`).format.numberFormat = 'R$ #,##0.00';
  }
}

function applyDate(sheet, columns, rows = 200) {
  for (const column of columns) {
    sheet.getRange(`${column}2:${column}${rows}`).format.numberFormat = "yyyy-mm-dd";
  }
}

function applyMonth(sheet, columns, rows = 200) {
  for (const column of columns) {
    sheet.getRange(`${column}2:${column}${rows}`).format.numberFormat = "yyyy-mm";
  }
}

writeTable(
  sheets.configuracoes,
  ["chave", "valor", "observacao", "id"],
  [
    ["limiteGastosGerais", 5500, "Envelope mensal para mercado, gasolina, Uber, farmacia e gastos do dia a dia", "limiteGastosGerais"],
    ["saldoRealConta", 0, "Saldo real informado para conciliacao com banco", "saldoRealConta"],
    ["mesAtual", month, "Mes ativo no app", "mesAtual"],
    ["versaoSchema", "1", "Versao inicial do banco", "versaoSchema"],
  ],
  "tbl_configuracoes",
  [190, 180, 520],
);
applyMoney(sheets.configuracoes, ["B"]);

writeTable(
  sheets.meses,
  ["mes", "status", "receitaPrevista", "despesaPrevista", "gastosGeraisLimite", "observacoes"],
  [[month, "aberto", 0, 5500, 5500, "Mes inicial do controle"]],
  "tbl_meses",
  [110, 110, 150, 150, 160, 360],
);
applyMoney(sheets.meses, ["C", "D", "E"]);

writeTable(
  sheets.receitas,
  ["id", "month", "descricao", "valorPrevisto", "valorRealizado", "dataPrevista", "dataRealizada", "status", "recorrencia", "repetirPorMeses", "observacoes", "createdAt", "updatedAt"],
  [["rec-001", month, "Salario", 0, 0, isoDate, "", "previsto", "sempre", "", "", isoDate, isoDate]],
  "tbl_receitas",
  [110, 90, 220, 130, 130, 120, 120, 110, 120, 140, 280, 120, 120],
);
applyMoney(sheets.receitas, ["D", "E"]);
applyDate(sheets.receitas, ["F", "G", "L", "M"]);

writeTable(
  sheets.despesas,
  ["id", "month", "descricao", "categoria", "valorPrevisto", "valorRealizado", "vencimento", "dataPagamento", "status", "recorrencia", "repetirPorMeses", "observacoes", "createdAt", "updatedAt"],
  [["des-001", month, "Gastos gerais do mes", "Gastos gerais", 5500, 0, isoDate, "", "previsto", "sempre", "", "Envelope para mercado, gasolina, Uber, farmacia e outros gastos diarios.", isoDate, isoDate]],
  "tbl_despesas",
  [110, 90, 230, 150, 130, 130, 120, 120, 110, 120, 140, 360, 120, 120],
);
applyMoney(sheets.despesas, ["E", "F"]);
applyDate(sheets.despesas, ["G", "H", "M", "N"]);

writeTable(
  sheets.cartoes,
  ["id", "nome", "diaFechamento", "diaVencimento", "ativo", "observacoes"],
  [
    ["car-001", "Cartao 1", "", "", true, "Renomear com o cartao real"],
    ["car-002", "Cartao 2", "", "", true, "Renomear com o cartao real"],
  ],
  "tbl_cartoes",
  [110, 180, 130, 130, 90, 320],
);

writeTable(
  sheets.faturas,
  ["id", "month", "cartao", "vencimento", "valorPrevisto", "valorRealizado", "status", "observacoes", "createdAt", "updatedAt"],
  [],
  "tbl_faturas_cartao",
  [110, 90, 180, 120, 130, 130, 110, 300, 120, 120],
);
applyMoney(sheets.faturas, ["E", "F"]);
applyDate(sheets.faturas, ["D", "I", "J"]);

writeTable(
  sheets.compras,
  ["id", "descricao", "cartao", "categoria", "valorTotal", "parcelas", "primeiraFatura", "observacoes", "createdAt", "updatedAt"],
  [],
  "tbl_compras_cartao",
  [110, 240, 160, 160, 130, 100, 130, 320, 120, 120],
);
applyMoney(sheets.compras, ["E"]);
applyMonth(sheets.compras, ["G"]);
applyDate(sheets.compras, ["I", "J"]);

writeTable(
  sheets.gastos,
  ["id", "month", "data", "descricao", "categoria", "valor", "formaPagamento", "observacoes", "createdAt", "updatedAt"],
  [],
  "tbl_gastos_gerais",
  [110, 90, 120, 230, 160, 130, 150, 320, 120, 120],
);
applyMoney(sheets.gastos, ["F"]);
applyDate(sheets.gastos, ["C", "I", "J"]);

writeTable(
  sheets.categorias,
  ["nome", "tipo", "ativo", "observacoes"],
  [
    ["Moradia", "despesa", true, ""],
    ["Contas", "despesa", true, ""],
    ["Educacao", "despesa", true, ""],
    ["Saude", "despesa", true, ""],
    ["Cartao de credito", "despesa", true, ""],
    ["Gastos gerais", "despesa", true, ""],
    ["Mercado", "gasto_geral", true, ""],
    ["Gasolina", "gasto_geral", true, ""],
    ["Uber/transporte", "gasto_geral", true, ""],
    ["Farmacia", "gasto_geral", true, ""],
    ["Alimentacao fora", "gasto_geral", true, ""],
    ["Casa", "gasto_geral", true, ""],
    ["Lazer", "gasto_geral", true, ""],
    ["Outros", "gasto_geral", true, ""],
  ],
  "tbl_categorias",
  [190, 150, 90, 320],
);

const dashboard = sheets.dashboard;
dashboard.showGridLines = false;
dashboard.getRange("A1:H1").merge();
dashboard.getRange("A1").values = [["Orcamento de Casa - Banco Google Sheets"]];
dashboard.getRange("A1").format = {
  fill: palette.dark,
  font: { bold: true, color: palette.white, size: 16 },
};
dashboard.getRange("A3:B10").values = [
  ["Indicador", "Valor"],
  ["Receitas previstas", ""],
  ["Receitas realizadas", ""],
  ["Despesas previstas", ""],
  ["Despesas pagas", ""],
  ["Gastos gerais usados", ""],
  ["Limite gastos gerais", ""],
  ["Disponivel gastos gerais", ""],
];
dashboard.getRange("B4:B10").formulas = [
  ['=SUM(receitas!D2:D200)'],
  ['=SUM(receitas!E2:E200)'],
  ['=SUM(despesas!E2:E200)+SUM(faturas_cartao!E2:E200)'],
  ['=SUM(despesas!F2:F200)+SUM(faturas_cartao!F2:F200)'],
  ['=SUM(gastos_gerais!F2:F200)'],
  ['=configuracoes!B2'],
  ['=B9-B8'],
];
dashboard.getRange("A3:B3").format = {
  fill: palette.primary,
  font: { bold: true, color: palette.white },
};
dashboard.getRange("A3:B10").format.borders = { preset: "all", style: "thin", color: palette.line };
dashboard.getRange("B4:B10").format.numberFormat = 'R$ #,##0.00';
dashboard.getRange("D3:H3").merge();
dashboard.getRange("D3").values = [["Observacoes"]];
dashboard.getRange("D4:H8").merge();
dashboard.getRange("D4").values = [["Esta planilha e o banco de dados do webapp. Edite dados nas abas de origem; o dashboard serve apenas como resumo humano."]];
dashboard.getRange("D3:H3").format = { fill: palette.accent, font: { bold: true, color: palette.white } };
dashboard.getRange("D4:H8").format = { fill: palette.soft, wrapText: true, font: { color: palette.ink } };
styleSheet(dashboard, [180, 160, 30, 180, 180, 180, 180, 180]);

const statusValues = '"previsto,pago,recebido,parcial,atrasado"';
for (const sheet of [sheets.receitas, sheets.despesas, sheets.faturas]) {
  const statusColumn = sheet === sheets.receitas ? "H" : sheet === sheets.despesas ? "I" : "G";
  sheet.getRange(`${statusColumn}2:${statusColumn}200`).dataValidation = {
    rule: { type: "list", formula1: statusValues },
  };
}

const recurrenceValues = '"nao,sempre,meses"';
sheets.receitas.getRange("I2:I200").dataValidation = { rule: { type: "list", formula1: recurrenceValues } };
sheets.despesas.getRange("J2:J200").dataValidation = { rule: { type: "list", formula1: recurrenceValues } };

await fs.mkdir(outputDir, { recursive: true });

const inspect = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 4000,
  tableMaxRows: 3,
  tableMaxCols: 8,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  maxChars: 2000,
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "dashboard",
  autoCrop: "all",
  scale: 1,
  format: "png",
});
await fs.writeFile(path.join(outputDir, "dashboard-preview.png"), new Uint8Array(await preview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(outputPath);
