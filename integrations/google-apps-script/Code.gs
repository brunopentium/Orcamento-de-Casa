const SPREADSHEET_ID = "1qcV1LaaIL-ZBQ3DmImjAEmBZk5Dh_sWD1GX8JT9Obwk";

const TABLES = {
  configuracoes: "configuracoes",
  meses: "meses",
  receitas: "receitas",
  despesas: "despesas",
  cartoes: "cartoes",
  faturas: "faturas_cartao",
  compras: "compras_cartao",
  gastos: "gastos_gerais",
  investimentos: "investimentos",
  categorias: "categorias",
};

function doGet(e) {
  const action = e.parameter.action || "readAll";

  if (action === "readAll") {
    return jsonResponse({
      ok: true,
      data: readAllTables(),
    });
  }

  if (action === "readTable") {
    const table = e.parameter.table;
    assertKnownTable(table);
    return jsonResponse({
      ok: true,
      table,
      rows: readTable(table),
    });
  }

  return jsonResponse({ ok: false, error: "Acao GET desconhecida." });
}

function doPost(e) {
  const body = parseBody(e);
  const action = body.action;

  if (action === "sync") {
    writeState(body.payload);
    return jsonResponse({ ok: true, updatedAt: new Date().toISOString() });
  }

  if (action === "upsert") {
    assertKnownTable(body.table);
    upsertRow(body.table, body.row);
    return jsonResponse({ ok: true, table: body.table });
  }

  if (action === "delete") {
    assertKnownTable(body.table);
    deleteRow(body.table, body.id);
    return jsonResponse({ ok: true, table: body.table, id: body.id });
  }

  return jsonResponse({ ok: false, error: "Acao POST desconhecida." });
}

function readAllTables() {
  return {
    config: readConfig(),
    receitas: readTable("receitas"),
    despesas: readTable("despesas"),
    cartoes: readTable("cartoes"),
    faturas: readTable("faturas"),
    compras: readTable("compras"),
    gastos: readTable("gastos"),
    investimentos: readTable("investimentos"),
    categorias: readTable("categorias"),
    meses: readTable("meses"),
  };
}

function readConfig() {
  const rows = readTable("configuracoes");
  return rows.reduce((acc, row) => {
    acc[row.chave] = row.valor;
    return acc;
  }, {});
}

function readTable(table) {
  assertKnownTable(table);
  const sheet = getSheet(table);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(String);
  return values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== ""))
    .map((row) => rowToObject(headers, row));
}

function writeState(payload) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    if (payload.config) {
      const configRows = [
        { id: "limiteGastosGerais", chave: "limiteGastosGerais", valor: payload.config.limiteGastosGerais, observacao: "Envelope mensal de gastos gerais" },
        { id: "googleSheetId", chave: "googleSheetId", valor: payload.config.googleSheetId || SPREADSHEET_ID, observacao: "ID da planilha banco" },
        { id: "appsScriptUrl", chave: "appsScriptUrl", valor: payload.config.appsScriptUrl || "", observacao: "URL do endpoint Apps Script" },
      ];
      replaceRows("configuracoes", configRows);
    }

    replaceRows("receitas", payload.receitas || []);
    replaceRows("despesas", payload.despesas || []);
    replaceRows("cartoes", payload.cartoes || []);
    replaceRows("faturas", payload.faturas || []);
    replaceRows("compras", payload.compras || []);
    replaceRows("gastos", payload.gastos || []);
    replaceRows("investimentos", payload.investimentos || []);
  } finally {
    lock.releaseLock();
  }
}

function replaceRows(table, rows) {
  assertKnownTable(table);
  const sheet = getSheet(table);
  const headers = getHeaders(sheet);
  const lastRow = Math.max(sheet.getLastRow(), 2);

  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }

  if (!rows.length) return;

  const values = rows.map((row) => headers.map((header) => normalizeCell(row[header])));
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}

function upsertRow(table, row) {
  const sheet = getSheet(table);
  const headers = getHeaders(sheet);
  const idIndex = headers.indexOf("id");

  if (idIndex < 0) throw new Error("Tabela sem coluna id.");
  if (!row.id) throw new Error("Linha sem id.");

  const values = sheet.getDataRange().getValues();
  const existingIndex = values.findIndex((valueRow, index) => index > 0 && String(valueRow[idIndex]) === String(row.id));
  const nextValues = headers.map((header) => normalizeCell(row[header]));

  if (existingIndex > 0) {
    sheet.getRange(existingIndex + 1, 1, 1, headers.length).setValues([nextValues]);
  } else {
    sheet.appendRow(nextValues);
  }
}

function deleteRow(table, id) {
  const sheet = getSheet(table);
  const headers = getHeaders(sheet);
  const idIndex = headers.indexOf("id");
  const values = sheet.getDataRange().getValues();
  const existingIndex = values.findIndex((row, index) => index > 0 && String(row[idIndex]) === String(id));

  if (existingIndex > 0) {
    sheet.deleteRow(existingIndex + 1);
  }
}

function getSheet(table) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(TABLES[table]);
  if (!sheet) throw new Error(`Aba nao encontrada: ${TABLES[table]}`);
  return sheet;
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
}

function rowToObject(headers, row) {
  return headers.reduce((acc, header, index) => {
    acc[header] = normalizeOutput(row[index]);
    return acc;
  }, {});
}

function normalizeCell(value) {
  if (value === undefined || value === null) return "";
  return value;
}

function normalizeOutput(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return value;
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}

function assertKnownTable(table) {
  if (!TABLES[table]) throw new Error(`Tabela desconhecida: ${table}`);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
