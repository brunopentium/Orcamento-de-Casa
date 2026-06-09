const STORAGE_KEY = "orcamentoCasa.v1";

const categories = [
  "Moradia",
  "Contas",
  "Educacao",
  "Saude",
  "Cartao de credito",
  "Mensalidade recorrente",
  "Gastos gerais",
  "Mercado",
  "Gasolina",
  "Uber/transporte",
  "Farmacia",
  "Alimentacao fora",
  "Casa",
  "Vestuario",
  "Pet",
  "Beleza",
  "Carro",
  "Manutencao",
  "Viagem",
  "Presentes",
  "Servicos",
  "Assinaturas",
  "Impostos",
  "Seguros",
  "Investimentos",
  "Lazer",
  "Outros",
];

const chartColors = ["#226a5c", "#bc5d35", "#2f6fb0", "#7c5ab8", "#b98218", "#27784d", "#b92f2f", "#4a7c85", "#8a6f38", "#5a6b54"];

const formSchemas = {
  receita: {
    title: "Receita",
    collection: "receitas",
    fields: [
      ["descricao", "Descricao", "text", true],
      ["valorPrevisto", "Valor previsto", "number", true],
      ["dataPrevista", "Data prevista", "date", true],
      ["dataRealizada", "Data recebida", "date", false],
      ["status", "Status", "select", true, ["previsto", "recebido", "parcial", "atrasado"]],
      ["recorrencia", "Recorrencia", "select", true, ["nao", "sempre", "meses"]],
      ["repetirPorMeses", "Repetir por meses", "number", false],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  despesa: {
    title: "Despesa geral",
    collection: "despesas",
    fields: [
      ["descricao", "Descricao", "text", false],
      ["categoria", "Categoria", "category", true],
      ["valorPrevisto", "Valor previsto", "number", true],
      ["valorRealizado", "Valor pago", "number", false],
      ["vencimento", "Vencimento", "date", true],
      ["dataPagamento", "Data de pagamento", "date", false],
      ["status", "Status", "select", true, ["previsto", "pago", "parcial", "atrasado"]],
      ["recorrencia", "Recorrencia", "select", true, ["nao", "sempre", "meses"]],
      ["repetirPorMeses", "Repetir por meses", "number", false],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  fatura: {
    title: "Fatura de cartao",
    collection: "faturas",
    fields: [
      ["cartao", "Cartao", "text", true],
      ["fechamento", "Fechamento", "date", false],
      ["vencimento", "Vencimento", "date", true],
      ["valorPrevisto", "Valor previsto", "number", true],
      ["valorRealizado", "Valor pago", "number", false],
      ["status", "Status", "select", true, ["previsto", "pago", "parcial", "atrasado"]],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  cartao: {
    title: "Cartao",
    collection: "cartoes",
    fields: [
      ["nome", "Nome do cartao", "text", true],
      ["limite", "Limite", "number", false],
      ["vencimentoDia", "Dia padrao de vencimento", "number", false],
      ["fechamentoDia", "Dia padrao de fechamento", "number", false],
      ["ativo", "Ativo", "select", true, ["sim", "nao"]],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  compra: {
    title: "Compra no cartao",
    collection: "compras",
    fields: [
      ["descricao", "Descricao", "text", false],
      ["cartao", "Cartao", "text", true],
      ["categoria", "Categoria", "category", true],
      ["valorTotal", "Valor total", "number", true],
      ["parcelas", "Quantidade de parcelas", "number", true],
      ["primeiraFatura", "Primeira fatura", "month", true],
      ["parcelaAtualCadastro", "Parcela atual nesta fatura", "number", false],
      ["recorrenciaCartao", "Repeticao", "select", true, ["pontual", "recorrente"]],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  gasto: {
    title: "Gasto geral",
    collection: "gastos",
    fields: [
      ["data", "Data", "date", true],
      ["descricao", "Descricao", "text", false],
      ["categoria", "Categoria", "category", true],
      ["valor", "Valor", "number", true],
      ["formaPagamento", "Forma de pagamento", "select", true, ["Pix", "Debito", "Credito", "Dinheiro"]],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  investimento: {
    title: "Movimentacao de investimento",
    collection: "investimentos",
    fields: [
      ["data", "Data", "date", true],
      ["descricao", "Descricao", "text", false],
      ["tipo", "Tipo", "select", true, ["saldo inicial", "entrada", "saida", "devolucao"]],
      ["valor", "Valor", "number", true],
      ["conta", "Conta/aplicacao", "text", false],
      ["origemDestino", "Origem ou destino", "select", true, ["Recebimento do mes", "Gastos gerais", "Conta corrente", "Outro"]],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
};

const defaultState = {
  config: {
    limiteGastosGerais: 5500,
    googleSheetId: "1qcV1LaaIL-ZBQ3DmImjAEmBZk5Dh_sWD1GX8JT9Obwk",
    appsScriptUrl: "https://script.google.com/macros/s/AKfycbyzaPJQykxUagZVyqMyKorcCkgz3_lh8J-yJmnj_7-ZcoWwnOrXbcyIA1_f4bVWVlhxcQ/exec",
  },
  receitas: [
    sample("receitas", {
      descricao: "Salario",
      valorPrevisto: 0,
      valorRealizado: 0,
      dataPrevista: currentMonthDate(5),
      dataRealizada: "",
      status: "previsto",
      recorrencia: "sempre",
      repetirPorMeses: "",
      observacoes: "",
    }),
  ],
  despesas: [
    sample("despesas", {
      descricao: "Gastos gerais do mes",
      categoria: "Gastos gerais",
      valorPrevisto: 5500,
      valorRealizado: 0,
      vencimento: currentMonthDate(1),
      dataPagamento: "",
      status: "previsto",
      recorrencia: "sempre",
      repetirPorMeses: "",
      observacoes: "Envelope para mercado, gasolina, Uber, farmacia e gastos do dia a dia.",
    }),
  ],
  cartoes: [],
  faturas: [],
  compras: [],
  gastos: [],
  investimentos: [],
};

const syncedCollections = ["receitas", "despesas", "cartoes", "faturas", "compras", "gastos", "investimentos"];
const dateFields = ["data", "dataPrevista", "dataRealizada", "vencimento", "fechamento", "dataPagamento", "primeiraFatura"];

let state = loadState();
let activeMonth = monthKey(new Date());
let activeCardName = "";
let currentFormType = null;
let editingId = null;
let dashboardDrilldowns = new Map();

const dom = {
  pageTitle: document.querySelector("#pageTitle"),
  monthInput: document.querySelector("#monthInput"),
  entryDialog: document.querySelector("#entryDialog"),
  entryForm: document.querySelector("#entryForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogFields: document.querySelector("#dialogFields"),
  drilldownDialog: document.querySelector("#drilldownDialog"),
  drilldownTitle: document.querySelector("#drilldownTitle"),
  drilldownChart: document.querySelector("#drilldownChart"),
  gastoRapidoForm: document.querySelector("#gastoRapidoForm"),
  configForm: document.querySelector("#configForm"),
  syncStatus: document.querySelector("#syncStatus"),
};

function sample(collection, data) {
  return {
    id: crypto.randomUUID(),
    collection,
    month: monthKey(new Date()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    return mergeState(JSON.parse(raw));
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeState(nextState) {
  const base = structuredClone(defaultState);
  const merged = { ...base, ...nextState };
  merged.config = { ...base.config, ...(nextState.config || {}) };
  syncedCollections.forEach((collection) => {
    merged[collection] = (Array.isArray(nextState[collection]) ? nextState[collection] : base[collection]).map(normalizeRow);
  });
  return merged;
}

function normalizeRow(row) {
  const normalized = { ...row };
  if (normalized.month) normalized.month = String(normalized.month).slice(0, 7);
  dateFields.forEach((field) => {
    if (normalized[field]) normalized[field] = String(normalized[field]).slice(0, field === "primeiraFatura" ? 7 : 10);
  });
  return normalized;
}

function sanitizeStateForSheets(nextState) {
  const sanitized = mergeState(nextState);
  sanitized.receitas = sanitized.receitas.map((receita) => {
    const nextReceita = { ...receita };
    updateReceitaRecebida(nextReceita);
    return nextReceita;
  });
  sanitized.despesas = sanitized.despesas.map((despesa) => effectiveExpenseRow(despesa, sanitized));
  return sanitized;
}

function mergeRemoteState(remoteState) {
  const merged = mergeState(remoteState || {});

  merged.config = {
    ...structuredClone(defaultState).config,
    ...(remoteState?.config || {}),
    googleSheetId: state.config.googleSheetId || defaultState.config.googleSheetId,
    appsScriptUrl: state.config.appsScriptUrl || defaultState.config.appsScriptUrl,
  };

  syncedCollections.forEach((collection) => {
    const remoteRows = (Array.isArray(remoteState?.[collection]) ? remoteState[collection] : []).map(normalizeRow);
    if (Array.isArray(remoteState?.[collection])) {
      merged[collection] = remoteRows;
    }
  });

  if (!Array.isArray(remoteState?.investimentos)) {
    merged.investimentos = Array.isArray(state?.investimentos) ? state.investimentos.map(normalizeRow) : [];
  }

  return merged;
}

function isSeedRow(collection, item) {
  return (
    (collection === "receitas" && item.descricao === "Salario" && parseMoney(item.valorPrevisto) === 0) ||
    (collection === "despesas" && item.descricao === "Gastos gerais do mes" && parseMoney(item.valorPrevisto) === 5500)
  );
}

function setSyncStatus(message, variant = "") {
  if (!dom.syncStatus) return;
  dom.syncStatus.textContent = message;
  dom.syncStatus.className = `sync-status ${variant}`.trim();
}

async function persistState(message = "Sincronizando com Google Sheets...") {
  saveState();
  setSyncStatus(message);

  const result = await new GoogleSheetsGateway(state.config).sync(state);
  if (result.ok) {
    setSyncStatus(`Sincronizado com Google Sheets as ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`, "ok");
    return result;
  }

  setSyncStatus(`Salvo localmente. Falha na planilha: ${result.error || result.reason || "verifique a configuracao"}`, "error");
  return result;
}

async function loadFromSheets() {
  const gateway = new GoogleSheetsGateway(state.config);
  const result = await gateway.readAll();

  if (!result.ok) {
    setSyncStatus(`Usando copia local. ${result.error || result.reason || "Nao foi possivel ler a planilha."}`, "error");
    return;
  }

  const previousState = state;
  state = mergeRemoteState(result.data);
  saveState();
  render();

  if (hasLocalRowsNotInRemote(previousState, result.data)) {
    await persistState("Enviando lancamentos locais pendentes...");
    return;
  }

  setSyncStatus(`Dados carregados do Google Sheets as ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`, "ok");
}

function hasLocalRowsNotInRemote(localState, remoteState) {
  return syncedCollections.some((collection) => {
    const remoteIds = new Set((remoteState?.[collection] || []).map((item) => String(item.id)));
    return (localState[collection] || []).some((item) => item.id && !remoteIds.has(String(item.id)) && !isSeedRow(collection, item));
  });
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function compactMoney(value) {
  const amount = parseMoney(value);
  if (Math.abs(amount) >= 1000) {
    const compact = amount / 1000;
    return `R$ ${compact.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  }
  return money(amount);
}

function parseMoney(value) {
  return Number.parseFloat(value || 0) || 0;
}

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function currentMonthDate(day) {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function belongsToMonth(item) {
  if (item.month) return item.month === activeMonth;
  const date = item.data || item.vencimento || item.dataPrevista || item.primeiraFatura;
  return String(date || "").startsWith(activeMonth);
}

function monthItems(collection) {
  return state[collection].filter(belongsToMonth);
}

function sum(items, key) {
  return items.reduce((total, item) => total + parseMoney(item[key]), 0);
}

function groupSum(items, labelGetter, valueGetter) {
  return items.reduce((acc, item) => {
    const label = labelGetter(item) || "Sem categoria";
    acc[label] = (acc[label] || 0) + parseMoney(valueGetter(item));
    return acc;
  }, {});
}

function chartRowsFromGroup(grouped, limit = 8) {
  return Object.entries(grouped)
    .map(([label, value]) => ({ label, value: parseMoney(value) }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function renderEmptyChart(message = "Sem dados para o mes.") {
  return `<div class="chart-empty">${message}</div>`;
}

function renderDonutChart(items, options = {}) {
  const rows = items.filter((item) => parseMoney(item.value) > 0);
  const total = rows.reduce((acc, item) => acc + item.value, 0);
  if (!total) return renderEmptyChart(options.empty);

  let offset = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const segments = rows
    .map((item, index) => {
      const share = item.value / total;
      const dash = share * circumference;
      const color = item.color || chartColors[index % chartColors.length];
      const drillAttrs = item.drillKey ? `data-drill-key="${escapeHtml(item.drillKey)}" tabindex="0"` : "";
      const segment = `<circle class="donut-segment ${item.drillKey ? "drillable" : ""}" ${drillAttrs} cx="60" cy="60" r="${radius}" fill="none" stroke="${color}" stroke-width="18" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" />`;
      offset += dash;
      return segment;
    })
    .join("");

  const legend = rows
    .map((item, index) => {
      const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
      const color = item.color || chartColors[index % chartColors.length];
      const drillAttrs = item.drillKey ? `data-drill-key="${escapeHtml(item.drillKey)}" role="button" tabindex="0"` : "";
      return `
        <div class="chart-legend-row ${item.drillKey ? "drillable" : ""}" ${drillAttrs}>
          <span class="legend-dot" style="background:${color}"></span>
          <span>${escapeHtml(item.label)}</span>
          <strong>${money(item.value)}</strong>
          <small>${percent}%</small>
        </div>
      `;
    })
    .join("");

  return `
    <div class="donut-chart">
      <svg viewBox="0 0 120 120" role="img" aria-label="${escapeHtml(options.label || "Grafico")}">
        <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#eef3ef" stroke-width="18"></circle>
        <g transform="rotate(-90 60 60)">${segments}</g>
        <text x="60" y="56" text-anchor="middle" class="donut-total-label">${escapeHtml(options.centerLabel || "Total")}</text>
        <text x="60" y="75" text-anchor="middle" class="donut-total-value">${compactMoney(total)}</text>
      </svg>
      <div class="chart-legend">${legend}</div>
    </div>
  `;
}

function renderBarChart(items, options = {}) {
  const rows = items.filter((item) => parseMoney(item.value) > 0);
  const max = Math.max(...rows.map((item) => item.value), 0);
  if (!max) return renderEmptyChart(options.empty);

  return `
    <div class="bar-chart">
      ${rows
        .map(
          (item, index) => `
            <div class="bar-row">
              <span>${escapeHtml(item.label)}</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${Math.max((item.value / max) * 100, 2)}%; background:${chartColors[index % chartColors.length]}"></div>
              </div>
              <strong>${money(item.value)}</strong>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderLineChart(items, options = {}) {
  const rows = items.filter((item) => item.label);
  if (!rows.length) return renderEmptyChart(options.empty);

  const values = rows.map((item) => parseMoney(item.value));
  const min = Math.min(0, ...values);
  const max = Math.max(...values, 0);
  const span = max - min || 1;
  const width = 640;
  const height = 220;
  const left = 42;
  const right = 18;
  const top = 18;
  const bottom = 34;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const points = rows.map((item, index) => {
    const x = left + (rows.length === 1 ? plotWidth / 2 : (plotWidth / (rows.length - 1)) * index);
    const y = top + plotHeight - ((parseMoney(item.value) - min) / span) * plotHeight;
    return { ...item, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${top + plotHeight} ${polyline} ${left + plotWidth},${top + plotHeight}`;
  const zeroY = top + plotHeight - ((0 - min) / span) * plotHeight;

  return `
    <div class="line-chart">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(options.label || "Evolucao")}">
        <line x1="${left}" x2="${left + plotWidth}" y1="${zeroY}" y2="${zeroY}" class="axis-line"></line>
        <polygon points="${area}" class="line-area"></polygon>
        <polyline points="${polyline}" class="line-path"></polyline>
        ${points
          .map(
            (point) => `
              <circle cx="${point.x}" cy="${point.y}" r="4" class="line-dot"></circle>
              <text x="${point.x}" y="${height - 10}" text-anchor="middle" class="axis-label">${escapeHtml(point.label)}</text>
            `
          )
          .join("")}
      </svg>
      <div class="chart-legend compact-legend">
        ${rows
          .map(
            (item) => `
              <div class="chart-legend-row">
                <span>${escapeHtml(item.label)}</span>
                <strong>${money(item.value)}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function isGeneralSpendingExpense(item) {
  const text = `${item?.descricao || ""} ${item?.categoria || ""}`.toLowerCase();
  return text.includes("gastos gerais");
}

function isCardExpensePlaceholder(item) {
  const text = `${item?.descricao || ""} ${item?.categoria || ""}`.toLowerCase();
  return text.includes("cartao") || text.includes("cartão");
}

function generalSpendingLimit() {
  return parseMoney(state.config.limiteGastosGerais) || 5500;
}

function generalSpendingUsed(targetMonth = activeMonth, sourceState = state) {
  return (sourceState.gastos || [])
    .filter((item) => belongsToMonthFor(item, targetMonth))
    .reduce((total, item) => total + parseMoney(item.valor), 0);
}

function effectiveGeneralSpendingAmount(targetMonth = activeMonth, sourceState = state) {
  const limit = parseMoney(sourceState.config?.limiteGastosGerais) || generalSpendingLimit();
  return Math.max(limit, generalSpendingUsed(targetMonth, sourceState));
}

function belongsToMonthFor(item, targetMonth) {
  if (item.month) return item.month === targetMonth;
  const date = item.data || item.vencimento || item.dataPrevista || item.primeiraFatura;
  return String(date || "").startsWith(targetMonth);
}

function effectiveExpenseRow(item, sourceState = state) {
  if (!isGeneralSpendingExpense(item)) return item;
  const targetMonth = item.month || String(item.vencimento || item.dataPrevista || activeMonth).slice(0, 7);
  const effectiveAmount = effectiveGeneralSpendingAmount(targetMonth, sourceState);
  return {
    ...item,
    valorPrevisto: effectiveAmount,
    valorRealizado: item.status === "pago" ? effectiveAmount : parseMoney(item.valorRealizado),
  };
}

function effectiveExpenseRows(items, sourceState = state) {
  return items.map((item) => effectiveExpenseRow(item, sourceState));
}

function investmentSignedValue(item) {
  const value = parseMoney(item.valor);
  return item.tipo === "saida" ? -value : value;
}

function investmentBalance(items = state.investimentos) {
  return items.reduce((total, item) => total + investmentSignedValue(item), 0);
}

function investmentTotalsForMonth() {
  const items = monthItems("investimentos");
  return {
    entradas: items.filter((item) => item.tipo === "entrada" || item.tipo === "devolucao").reduce((total, item) => total + parseMoney(item.valor), 0),
    saidas: items.filter((item) => item.tipo === "saida").reduce((total, item) => total + parseMoney(item.valor), 0),
  };
}

function parseRecebimentos(receita) {
  if (!receita?.recebimentos) return [];
  if (Array.isArray(receita.recebimentos)) return receita.recebimentos;
  try {
    const parsed = JSON.parse(receita.recebimentos);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function serializeRecebimentos(recebimentos) {
  return JSON.stringify(
    recebimentos.map((item) => ({
      id: item.id || crypto.randomUUID(),
      data: item.data || new Date().toISOString().slice(0, 10),
      valor: parseMoney(item.valor),
      observacoes: item.observacoes || "",
    }))
  );
}

function receitaValorRecebido(receita) {
  const recebimentos = parseRecebimentos(receita);
  if (!recebimentos.length) return parseMoney(receita.valorRealizado);
  return recebimentos.reduce((total, item) => total + parseMoney(item.valor), 0);
}

function updateReceitaRecebida(receita) {
  const recebido = receitaValorRecebido(receita);
  const previsto = parseMoney(receita.valorPrevisto);
  receita.valorRealizado = recebido;
  if (recebido <= 0) receita.status = "previsto";
  else if (previsto > 0 && recebido >= previsto) receita.status = "recebido";
  else receita.status = "parcial";
  const recebimentos = parseRecebimentos(receita);
  receita.dataRealizada = recebimentos.length ? recebimentos[recebimentos.length - 1].data : "";
  receita.updatedAt = new Date().toISOString();
}

function addMonths(month, amount) {
  const [year, monthNumber] = String(month).slice(0, 7).split("-").map(Number);
  const date = new Date(year, monthNumber - 1 + amount, 1);
  return monthKey(date);
}

function monthDiff(startMonth, endMonth) {
  const [startYear, start] = String(startMonth).slice(0, 7).split("-").map(Number);
  const [endYear, end] = String(endMonth).slice(0, 7).split("-").map(Number);
  return (endYear - startYear) * 12 + (end - start);
}

function cardName(card) {
  return card?.nome || card?.cartao || card?.descricao || "";
}

function getCardNames() {
  const names = new Set();
  (state.cartoes || []).forEach((card) => {
    const name = cardName(card);
    const isActive = !card.ativo || String(card.ativo).toLowerCase() !== "nao";
    if (name && isActive) names.add(name);
  });
  state.compras.forEach((item) => {
    if (item.cartao) names.add(item.cartao);
  });
  state.faturas.forEach((item) => {
    if (item.cartao) names.add(item.cartao);
  });
  return [...names].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function purchaseInstallmentForMonth(item, targetMonth = activeMonth) {
  const firstMonth = cardPurchaseEffectiveFirstMonth(item);
  const installments = Math.max(Number.parseInt(item.parcelas, 10) || 1, 1);
  if (!firstMonth) return null;

  const index = monthDiff(firstMonth, targetMonth);
  const isRecurring = isRecurringCardPurchase(item);
  if (index < 0 || (!isRecurring && index >= installments)) return null;

  const amount = isRecurring ? parseMoney(item.valorTotal) : parseMoney(item.valorTotal) / installments;
  return {
    ...item,
    parcelaAtual: isRecurring ? 0 : index + 1,
    valorParcela: amount,
    faturaMes: targetMonth,
    tipoCobranca: isRecurring ? "recorrente" : installments > 1 ? "parcelado" : "pontual",
  };
}

function isRecurringCardPurchase(item) {
  if (item.recorrenciaCartao) return item.recorrenciaCartao === "recorrente";
  const installments = Math.max(Number.parseInt(item.parcelas, 10) || 1, 1);
  const recurrenceHint = `${item.categoria || ""} ${item.observacoes || ""}`;
  return installments === 1 && /mensalidade recorrente|recorrente/i.test(recurrenceHint);
}

function cardPurchaseFirstMonth(item) {
  return String(item.primeiraFatura || item.month || "").slice(0, 7);
}

function cardPurchaseEffectiveFirstMonth(item) {
  const firstMonth = cardPurchaseFirstMonth(item);
  const registeredInstallment = Math.max(Number.parseInt(item.parcelaAtualCadastro, 10) || 1, 1);
  return registeredInstallment > 1 ? addMonths(firstMonth, -(registeredInstallment - 1)) : firstMonth;
}

function recurringPurchaseKey(item) {
  return [item.cartao, normalizeText(item.descricao), parseMoney(item.valorTotal).toFixed(2)].join("|");
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function cardPurchasesForMonth(card, targetMonth = activeMonth) {
  const cardRows = state.compras.filter((item) => item.cartao === card);
  const latestRecurringMonthByKey = cardRows.reduce((acc, item) => {
    if (!isRecurringCardPurchase(item)) return acc;
    const firstMonth = cardPurchaseEffectiveFirstMonth(item);
    if (!firstMonth || monthDiff(firstMonth, targetMonth) < 0) return acc;
    const key = recurringPurchaseKey(item);
    if (!acc[key] || monthDiff(acc[key], firstMonth) > 0) acc[key] = firstMonth;
    return acc;
  }, {});

  return cardRows
    .filter((item) => {
      if (!isRecurringCardPurchase(item)) return true;
      return cardPurchaseEffectiveFirstMonth(item) === latestRecurringMonthByKey[recurringPurchaseKey(item)];
    })
    .map((item) => purchaseInstallmentForMonth(item, targetMonth))
    .filter(Boolean);
}

function invoiceForCardMonth(card, targetMonth = activeMonth) {
  return state.faturas.find((item) => item.cartao === card && String(item.month || item.vencimento || "").slice(0, 7) === targetMonth);
}

function cardMonthlyDay(cardRow, fallbackDay, ...fields) {
  const value = fields.map((field) => cardRow?.[field]).find((fieldValue) => fieldValue !== undefined && fieldValue !== "");
  return Math.min(Math.max(Number.parseInt(value, 10) || fallbackDay, 1), 31);
}

function dateForCardDay(card, targetMonth, fallbackDay, ...fields) {
  const cardRow = (state.cartoes || []).find((item) => cardName(item) === card);
  const day = cardRow ? cardMonthlyDay(cardRow, fallbackDay, ...fields) : fallbackDay;
  return `${targetMonth}-${String(day).padStart(2, "0")}`;
}

function cardClosingDate(card, invoice, targetMonth = activeMonth) {
  if (invoice?.fechamento) return invoice.fechamento;
  return dateForCardDay(card, targetMonth, 21, "fechamentoDia", "diaFechamento");
}

function cardDueDate(card, invoice, targetMonth = activeMonth) {
  if (invoice?.vencimento) return invoice.vencimento;
  return dateForCardDay(card, targetMonth, 28, "vencimentoDia", "diaVencimento");
}

function calculatedCardInvoices(targetMonth = activeMonth) {
  return getCardNames().map((card) => {
    const purchases = cardPurchasesForMonth(card, targetMonth);
    const invoice = invoiceForCardMonth(card, targetMonth);
    const total = purchases.reduce((acc, item) => acc + item.valorParcela, 0);
    const paid = invoice?.status === "pago" ? total : parseMoney(invoice?.valorRealizado);

    return {
      id: invoice?.id || `calculated-${card}-${targetMonth}`,
      cartao: card,
      fechamento: cardClosingDate(card, invoice, targetMonth),
      vencimento: cardDueDate(card, invoice, targetMonth),
      valorPrevisto: total,
      valorRealizado: paid,
      status: invoice?.status || "previsto",
      sourceInvoiceId: invoice?.id || "",
      purchaseCount: purchases.length,
    };
  });
}

function futureInvoicesForCard(card, months = 6) {
  if (!card) return [];
  return Array.from({ length: months }, (_, index) => {
    const targetMonth = addMonths(activeMonth, index + 1);
    return calculatedCardInvoices(targetMonth).find((item) => item.cartao === card) || {
      cartao: card,
      fechamento: cardClosingDate(card, null, targetMonth),
      vencimento: cardDueDate(card, null, targetMonth),
      valorPrevisto: 0,
      valorRealizado: 0,
      status: "previsto",
      purchaseCount: 0,
    };
  });
}

function init() {
  dom.monthInput.value = activeMonth;
  populateCategorySelects();
  bindEvents();
  render();
  loadFromSheets();
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  document.querySelector("#prevMonth").addEventListener("click", () => shiftMonth(-1));
  document.querySelector("#nextMonth").addEventListener("click", () => shiftMonth(1));
  dom.monthInput.addEventListener("change", () => {
    activeMonth = dom.monthInput.value;
    render();
  });

  document.querySelectorAll("[data-open-form]").forEach((button) => {
    button.addEventListener("click", () => openEntryForm(button.dataset.openForm));
  });

  dom.entryForm.addEventListener("submit", handleEntrySubmit);
  dom.gastoRapidoForm.addEventListener("submit", handleQuickGasto);
  dom.configForm.addEventListener("submit", handleConfigSubmit);
  document.querySelector("#dashboardView").addEventListener("click", handleDashboardDrillClick);
  document.querySelector("#dashboardView").addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target?.dataset?.drillKey) {
      event.preventDefault();
      handleDashboardDrillClick(event);
    }
  });
}

function switchView(view) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `${view}View`);
  });
  const labels = {
    dashboard: "Dashboard",
    receitas: "Receitas",
    despesas: "Despesas gerais",
    cartoes: "Cartoes",
    gastos: "Gastos gerais",
    investimentos: "Investimentos",
    config: "Configuracoes",
  };
  dom.pageTitle.textContent = labels[view];
}

function shiftMonth(delta) {
  const [year, month] = activeMonth.split("-").map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  activeMonth = monthKey(d);
  dom.monthInput.value = activeMonth;
  render();
}

function populateCategorySelects() {
  document.querySelectorAll('select[name="categoria"]').forEach((select) => {
    select.innerHTML = categories.map((category) => `<option>${category}</option>`).join("");
  });
}

function render() {
  renderDashboard();
  renderReceitas();
  renderDespesas();
  renderCartoes();
  renderGastos();
  renderInvestimentos();
  renderConfig();
}

function renderDashboard() {
  const receitas = monthItems("receitas");
  const despesas = effectiveExpenseRows(monthItems("despesas"));
  const faturas = calculatedCardInvoices().filter((item) => item.valorPrevisto || item.valorRealizado);
  const gastos = monthItems("gastos");

  const receitasPrevistas = sum(receitas, "valorPrevisto");
  const receitasRecebidas = receitas.reduce((total, item) => total + receitaValorRecebido(item), 0);
  const despesasPrevistas = sum(despesas, "valorPrevisto");
  const despesasPagas = sum(despesas, "valorRealizado");
  const cartoesPrevistos = sum(faturas, "valorPrevisto");
  const cartoesPagos = sum(faturas, "valorRealizado");
  const despesasPrevistasComCartoes = despesasPrevistas + cartoesPrevistos;
  const despesasPagasComCartoes = despesasPagas + cartoesPagos;
  const gastosUsados = sum(gastos, "valor");
  const limite = generalSpendingLimit();
  const despesasAtuais = despesasPagas + cartoesPagos;
  const saldoAtualApp = receitasRecebidas - despesasAtuais;

  setText("metricReceitasPrevistas", money(receitasPrevistas));
  setText("metricReceitasRecebidas", `Recebido: ${money(receitasRecebidas)}`);
  setText("metricDespesasPrevistas", money(despesasPrevistasComCartoes));
  setText("metricDespesasPagas", `Pago: ${money(despesasPagasComCartoes)}`);
  setText("metricCartoesPrevistos", money(cartoesPrevistos));
  setText("metricCartoesPagos", `Pago: ${money(cartoesPagos)}`);
  setText("metricSaldoPrevisto", money(receitasPrevistas - despesasPrevistas - cartoesPrevistos));
  setText("metricSaldoReal", `Saldo atual no app: ${money(saldoAtualApp)}`);
  setText("metricReceitasAtuais", money(receitasRecebidas));
  setText("metricDespesasAtuais", money(despesasAtuais));
  setText("metricDespesasAtuaisDetalhe", `Despesas: ${money(despesasPagas)} | Cartoes: ${money(cartoesPagos)} | Gastos monitorados: ${money(gastosUsados)}`);
  setText("metricSaldoAtualApp", money(saldoAtualApp));

  const percent = limite > 0 ? Math.min((gastosUsados / limite) * 100, 100) : 0;
  const fill = document.querySelector("#gastosProgress");
  fill.style.width = `${percent}%`;
  fill.classList.toggle("warning", percent >= 75 && percent < 95);
  fill.classList.toggle("danger", percent >= 95);
  setText("gastosDisponivel", `${money(limite - gastosUsados)} disponivel`);
  setText("gastosUsado", `Usado: ${money(gastosUsados)}`);
  setText("gastosLimite", `Limite: ${money(limite)}`);

  renderDashboardCharts({ despesas, gastos, cartoesPrevistos, gastosUsados });
  renderUpcoming(despesas, faturas);
  renderCategories(gastos);
}

function renderDashboardCharts({ despesas, gastos, cartoesPrevistos, gastosUsados }) {
  dashboardDrilldowns = new Map();
  const limite = generalSpendingLimit();
  const envelopeDisponivel = Math.max(limite - gastosUsados, 0);
  const despesasSemConsolidados = despesas.filter((item) => !isGeneralSpendingExpense(item) && !isCardExpensePlaceholder(item));
  const despesasGeraisValor = sum(despesasSemConsolidados, "valorPrevisto");
  const cardPurchases = getCardNames().flatMap((card) => cardPurchasesForMonth(card).map((item) => ({ ...item, cartao: card })));
  const expenseDetails = despesasSemConsolidados.map((item) => detailRow(item.categoria, item.descricao, item.valorPrevisto, "Despesa geral"));
  const cardDetails = cardPurchases.map((item) => detailRow(item.categoria, item.descricao, item.valorParcela, item.cartao || "Cartao"));
  const spendingDetails = gastos.map((item) => detailRow(item.categoria, item.descricao, item.valor, "Gastos gerais"));
  const allCategoryRows = categoryRowsWithDrill("all", "Distribuicao geral", [...expenseDetails, ...cardDetails, ...spendingDetails]);
  const cardAndSpendingRows = categoryRowsWithDrill("card-spending", "Cartoes + gastos gerais", [...cardDetails, ...spendingDetails]);
  const gastosCategoryRows = categoryRowsWithDrill("spending", "Gastos gerais", spendingDetails);
  const cardCategoryRows = categoryRowsWithDrill("cards", "Cartoes", cardDetails);

  setChart("monthlyCompositionChart", renderDonutChart([
    { label: "Despesas gerais", value: despesasGeraisValor, color: "#226a5c" },
    { label: "Cartoes", value: cartoesPrevistos, color: "#bc5d35" },
    { label: "Gastos gerais usados", value: gastosUsados, color: "#2f6fb0" },
    { label: "Gastos gerais disponivel", value: envelopeDisponivel, color: "#cfe0f3" },
  ], { centerLabel: "Mes", empty: "Ainda nao ha valores previstos neste mes." }));

  setChart("allCategoriesChart", renderDonutChart(allCategoryRows, {
    centerLabel: "Geral",
    empty: "Ainda nao ha categorias para consolidar.",
  }));

  setChart("cardAndGeneralSpendingChart", renderDonutChart(cardAndSpendingRows, {
    centerLabel: "Dia a dia",
    empty: "Ainda nao ha compras de cartao ou gastos gerais.",
  }));

  setChart("generalSpendingChart", renderDonutChart(gastosCategoryRows, {
    centerLabel: "Usado",
    empty: "Ainda nao ha gastos gerais lancados.",
  }));

  setChart("cardCategoriesChart", renderDonutChart(cardCategoryRows, {
    centerLabel: "Cartoes",
    empty: "Ainda nao ha compras de cartao neste mes.",
  }));

  const cardEvolution = Array.from({ length: 6 }, (_, index) => {
    const targetMonth = addMonths(activeMonth, index);
    const total = sum(calculatedCardInvoices(targetMonth), "valorPrevisto");
    return { label: monthShortLabel(targetMonth), value: total };
  });
  setChart("cardEvolutionChart", renderBarChart(cardEvolution, { empty: "Nao ha faturas projetadas." }));

  const investmentEvolution = Array.from({ length: 6 }, (_, index) => {
    const targetMonth = addMonths(activeMonth, index - 5);
    return { label: monthShortLabel(targetMonth), value: investmentBalanceUntil(targetMonth) };
  });
  setChart("investmentEvolutionChart", renderLineChart(investmentEvolution, { empty: "Nao ha movimentacoes de investimento." }));
}

function detailRow(category, description, value, source) {
  return {
    category: category || "Sem categoria",
    description: description || category || "Sem descricao",
    value: parseMoney(value),
    source,
  };
}

function categoryRowsWithDrill(scopeKey, scopeTitle, detailRows) {
  const grouped = detailRows.reduce((acc, row) => {
    if (!row.value) return acc;
    const key = row.category || "Sem categoria";
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([category, rows]) => {
      const drillKey = `${scopeKey}:${normalizeText(category)}`;
      dashboardDrilldowns.set(drillKey, {
        title: `${scopeTitle} - ${category}`,
        rows: groupDescriptionRows(rows),
      });
      return {
        label: category,
        value: rows.reduce((total, row) => total + parseMoney(row.value), 0),
        drillKey,
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
}

function groupDescriptionRows(rows) {
  const grouped = rows.reduce((acc, row) => {
    const key = normalizeText(row.description || row.category || "Sem descricao");
    if (!acc[key]) {
      acc[key] = {
        label: row.description || row.category || "Sem descricao",
        value: 0,
      };
    }
    acc[key].value += parseMoney(row.value);
    return acc;
  }, {});
  return Object.values(grouped)
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
}

function setChart(id, html) {
  const element = document.querySelector(`#${id}`);
  if (element) element.innerHTML = html;
}

function handleDashboardDrillClick(event) {
  const target = findDrillTarget(event.target);
  if (!target) return;
  const detail = dashboardDrilldowns.get(target.dataset.drillKey);
  if (!detail || !detail.rows?.length) return;
  dom.drilldownTitle.textContent = detail.title;
  dom.drilldownChart.innerHTML = renderDonutChart(detail.rows, {
    centerLabel: "Detalhe",
    empty: "Sem detalhes para esta categoria.",
  });
  dom.drilldownDialog.showModal();
}

function findDrillTarget(target) {
  let current = target;
  while (current && current !== document) {
    if (current.dataset?.drillKey) return current;
    current = current.parentNode;
  }
  return null;
}

function monthShortLabel(month) {
  const [year, monthNumber] = String(month).slice(0, 7).split("-").map(Number);
  return new Date(year, monthNumber - 1, 1).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
}

function investmentBalanceUntil(targetMonth) {
  return (state.investimentos || [])
    .filter((item) => {
      const itemMonth = String(item.month || item.data || "").slice(0, 7);
      return itemMonth && monthDiff(itemMonth, targetMonth) >= 0;
    })
    .reduce((total, item) => total + investmentSignedValue(item), 0);
}

function renderUpcoming(despesas, faturas) {
  const items = [...despesas, ...faturas]
    .filter((item) => !["pago", "recebido"].includes(item.status))
    .sort((a, b) => String(a.vencimento || "").localeCompare(String(b.vencimento || "")))
    .slice(0, 6);

  const list = document.querySelector("#upcomingList");
  list.innerHTML = items.length
    ? items
        .map(
          (item) => `
            <div class="list-item">
              <div><strong>${escapeHtml(item.descricao || item.cartao)}</strong><br><span>${item.vencimento || ""}</span></div>
              <strong>${money(item.valorPrevisto)}</strong>
            </div>
          `
        )
        .join("")
    : `<p class="empty">Nenhuma despesa pendente neste mes.</p>`;
}

function renderCategories(gastos) {
  const grouped = gastos.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + parseMoney(item.valor);
    return acc;
  }, {});
  const rows = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const list = document.querySelector("#categoryList");
  list.innerHTML = rows.length
    ? rows
        .map(
          ([category, value]) => `
            <div class="list-item">
              <strong>${escapeHtml(category)}</strong>
              <strong>${money(value)}</strong>
            </div>
          `
        )
        .join("")
    : `<p class="empty">Ainda nao ha gastos gerais lancados.</p>`;
}

function renderReceitas() {
  renderRows("receitasTable", monthItems("receitas"), (item) => [
    item.descricao,
    money(item.valorPrevisto),
    `${money(receitaValorRecebido(item))}<br><span>${parseRecebimentos(item).length} recebimento(s)</span>`,
    item.dataPrevista,
    statusBadge(item.status),
    recurrenceLabel(item),
    receitaActions(item),
  ]);
}

function renderDespesas() {
  const despesas = effectiveExpenseRows(monthItems("despesas")).map((item) => ({ ...item, rowKind: "despesa" }));
  const cardExpenses = calculatedCardInvoices()
    .filter((item) => item.valorPrevisto || item.valorRealizado || item.sourceInvoiceId)
    .map((item) => ({
      ...item,
      rowKind: "fatura-cartao",
      descricao: `Fatura - ${item.cartao}`,
      categoria: "Cartao de credito",
    }));

  renderRows("despesasTable", [...despesas, ...cardExpenses], (item) => [
    item.descricao,
    item.categoria,
    money(item.valorPrevisto),
    money(item.valorRealizado),
    item.vencimento,
    statusBadge(item.status),
    item.rowKind === "fatura-cartao" ? "Fatura mensal" : recurrenceLabel(item),
    item.rowKind === "fatura-cartao" ? cardExpenseActions(item) : actions("despesa", item.id, item.status !== "pago" ? "Marcar paga" : ""),
  ]);
}

function renderCartoes() {
  const invoices = calculatedCardInvoices();
  if (!activeCardName || !getCardNames().includes(activeCardName)) {
    activeCardName = invoices[0]?.cartao || getCardNames()[0] || "";
  }

  renderRows("faturasTable", invoices, (item) => [
    `<button class="link-button ${item.cartao === activeCardName ? "active" : ""}" data-action="select-card" data-card="${escapeHtml(item.cartao)}">${escapeHtml(item.cartao)}</button>`,
    item.fechamento,
    item.vencimento,
    money(item.valorPrevisto),
    money(item.valorRealizado),
    statusBadge(item.status),
    cardInvoiceActions(item),
  ]);

  const purchases = activeCardName ? cardPurchasesForMonth(activeCardName) : [];
  renderRows("comprasTable", purchases, (item) => [
    item.descricao,
    money(item.valorParcela),
    item.tipoCobranca === "recorrente" ? "Mensal" : `${item.parcelaAtual}/${item.parcelas || 1}`,
    money(item.valorTotal),
    item.primeiraFatura,
    actions("compra", item.id, ""),
  ]);

  renderRows("faturasFuturasTable", futureInvoicesForCard(activeCardName), (item) => [
    String(item.vencimento || "").slice(0, 7),
    item.fechamento,
    item.vencimento,
    money(item.valorPrevisto),
    `${item.purchaseCount || 0}`,
  ]);
}

function renderGastos() {
  renderRows("gastosTable", monthItems("gastos"), (item) => [
    item.data,
    item.descricao,
    item.categoria,
    money(item.valor),
    item.formaPagamento,
    actions("gasto", item.id, ""),
  ]);
}

function renderInvestimentos() {
  const monthInvestments = monthItems("investimentos").sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
  const monthTotals = investmentTotalsForMonth();

  setText("investimentoSaldo", money(investmentBalance()));
  setText("investimentoEntradas", money(monthTotals.entradas));
  setText("investimentoSaidas", money(monthTotals.saidas));
  setText("investimentoMovimentoMes", money(monthTotals.entradas - monthTotals.saidas));

  renderRows("investimentosTable", monthInvestments, (item) => [
    item.data,
    item.descricao,
    investmentTypeLabel(item.tipo),
    money(parseMoney(item.valor)),
    item.conta || "",
    item.origemDestino || "",
    actions("investimento", item.id, ""),
  ]);
}

function renderConfig() {
  dom.configForm.limiteGastosGerais.value = state.config.limiteGastosGerais;
  dom.configForm.googleSheetId.value = state.config.googleSheetId;
  dom.configForm.appsScriptUrl.value = state.config.appsScriptUrl;
}

function renderRows(targetId, items, mapper) {
  const tbody = document.querySelector(`#${targetId}`);
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty">Nenhum registro neste mes.</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .map((item) => `<tr>${mapper(item).map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  tbody.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleRowAction);
  });
}

function actions(type, id, completeLabel) {
  return `
    <div class="row-actions">
      ${completeLabel ? `<button class="small-button" data-action="complete" data-type="${type}" data-id="${id}">${completeLabel}</button>` : ""}
      <button class="small-button" data-action="edit" data-type="${type}" data-id="${id}">Editar</button>
      <button class="danger-button" data-action="delete" data-type="${type}" data-id="${id}">Excluir</button>
    </div>
  `;
}

function receitaActions(item) {
  return `
    <div class="row-actions">
      <button class="small-button" data-action="add-receipt" data-type="receita" data-id="${item.id}">Adicionar recebido</button>
      ${item.status !== "recebido" ? `<button class="small-button" data-action="complete" data-type="receita" data-id="${item.id}">Marcar recebida</button>` : ""}
      <button class="small-button" data-action="edit" data-type="receita" data-id="${item.id}">Editar</button>
      <button class="danger-button" data-action="delete" data-type="receita" data-id="${item.id}">Excluir</button>
    </div>
  `;
}

function cardInvoiceActions(item) {
  return `
    <div class="row-actions">
      ${item.status !== "pago" ? `<button class="small-button" data-action="pay-card-invoice" data-card="${escapeHtml(item.cartao)}">Marcar paga</button>` : ""}
      <button class="small-button" data-action="adjust-card-invoice" data-card="${escapeHtml(item.cartao)}">Ajustar fatura</button>
      <button class="small-button" data-action="edit-card" data-card="${escapeHtml(item.cartao)}">Editar cartao</button>
      <button class="danger-button" data-action="delete-card" data-card="${escapeHtml(item.cartao)}">Excluir cartao</button>
    </div>
  `;
}

function cardExpenseActions(item) {
  return `
    <div class="row-actions">
      ${item.status !== "pago" ? `<button class="small-button" data-action="pay-card-invoice" data-card="${escapeHtml(item.cartao)}">Marcar paga</button>` : ""}
      <button class="small-button" data-action="adjust-card-invoice" data-card="${escapeHtml(item.cartao)}">Ajustar fatura</button>
    </div>
  `;
}

async function handleRowAction(event) {
  const { action, type, id, card } = event.currentTarget.dataset;

  if (action === "select-card") {
    activeCardName = card;
    renderCartoes();
    return;
  }

  if (action === "edit-card") {
    const item = (state.cartoes || []).find((entry) => cardName(entry) === card);
    if (item) openEntryForm("cartao", item.id);
    return;
  }

  if (action === "delete-card") {
    await deleteCard(card);
    return;
  }

  if (action === "adjust-card-invoice") {
    openCardInvoiceForm(card);
    return;
  }

  if (action === "pay-card-invoice") {
    await markCardInvoicePaid(card);
    return;
  }

  const schema = formSchemas[type];
  const item = state[schema.collection].find((entry) => entry.id === id);
  if (!item) return;

  if (action === "edit") openEntryForm(type, id);
  if (action === "add-receipt") {
    await addRecebimentoReceita(item);
    return;
  }
  if (action === "delete") {
    state[schema.collection] = state[schema.collection].filter((entry) => entry.id !== id);
    render();
    await persistState("Excluindo na planilha...");
  }
  if (action === "complete") {
    if (type === "receita") {
      await completeReceita(item);
      return;
    }
    const expected = type === "despesa" && isGeneralSpendingExpense(item) ? effectiveGeneralSpendingAmount(item.month || activeMonth) : item.valorPrevisto || item.valorTotal || item.valor;
    if (type === "despesa" && isGeneralSpendingExpense(item)) item.valorPrevisto = expected;
    item.valorRealizado = item.valorRealizado || expected;
    item.status = type === "receita" ? "recebido" : "pago";
    item.dataPagamento = item.dataPagamento || new Date().toISOString().slice(0, 10);
    item.dataRealizada = item.dataRealizada || new Date().toISOString().slice(0, 10);
    item.updatedAt = new Date().toISOString();
    render();
    await persistState("Atualizando pagamento na planilha...");
  }
}

async function addRecebimentoReceita(receita, defaults = {}) {
  const amountInput = window.prompt(`Valor recebido de "${receita.descricao}"`, defaults.valor ? String(defaults.valor) : "");
  if (amountInput === null) return;
  const valor = parseMoney(String(amountInput).replace(/\./g, "").replace(",", "."));
  if (valor <= 0) {
    window.alert("Informe um valor maior que zero.");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const dataInput = window.prompt("Data do recebimento", defaults.data || today);
  if (dataInput === null) return;

  const observacoes = window.prompt("Observacao opcional", defaults.observacoes || "") || "";
  const recebimentos = parseRecebimentos(receita);
  recebimentos.push({
    id: crypto.randomUUID(),
    data: dataInput || today,
    valor,
    observacoes,
  });
  receita.recebimentos = serializeRecebimentos(recebimentos);
  updateReceitaRecebida(receita);
  render();
  await persistState("Salvando recebimento na planilha...");
}

async function completeReceita(receita) {
  const restante = Math.max(parseMoney(receita.valorPrevisto) - receitaValorRecebido(receita), 0);
  if (restante <= 0) {
    updateReceitaRecebida(receita);
    render();
    await persistState("Atualizando receita na planilha...");
    return;
  }
  await addRecebimentoReceita(receita, {
    valor: restante,
    observacoes: "Complemento para marcar a receita como recebida.",
  });
}

async function deleteCard(card) {
  const purchases = (state.compras || []).filter((item) => item.cartao === card).length;
  const invoices = (state.faturas || []).filter((item) => item.cartao === card).length;
  const message = `Excluir o cartao "${card}"? Isso tambem remove ${purchases} compra(s)/parcela(s) e ${invoices} fatura(s) vinculada(s).`;
  if (!window.confirm(message)) return;

  state.cartoes = (state.cartoes || []).filter((entry) => cardName(entry) !== card);
  state.compras = (state.compras || []).filter((entry) => entry.cartao !== card);
  state.faturas = (state.faturas || []).filter((entry) => entry.cartao !== card);

  if (activeCardName === card) {
    activeCardName = getCardNames()[0] || "";
  }

  render();
  await persistState("Excluindo cartao na planilha...");
}

function openCardInvoiceForm(card) {
  const invoice = invoiceForCardMonth(card);
  const summary = calculatedCardInvoices().find((item) => item.cartao === card);
  openEntryForm("fatura", invoice?.id || null, {
    cartao: card,
    fechamento: summary?.fechamento || cardClosingDate(card, null),
    vencimento: summary?.vencimento || cardDueDate(card, null),
    valorPrevisto: summary?.valorPrevisto || 0,
    valorRealizado: summary?.valorRealizado || 0,
    status: summary?.status || "previsto",
    observacoes: "Fatura ajustada manualmente para este mes.",
  });
}

async function markCardInvoicePaid(card) {
  const invoiceSummary = calculatedCardInvoices().find((item) => item.cartao === card);
  if (!invoiceSummary) return;

  let invoice = invoiceForCardMonth(card);
  if (!invoice) {
    invoice = {
      id: crypto.randomUUID(),
      collection: "faturas",
      month: activeMonth,
      cartao: card,
      fechamento: invoiceSummary.fechamento,
      vencimento: invoiceSummary.vencimento,
      observacoes: "Fatura criada automaticamente a partir das compras e parcelas do mes.",
      createdAt: new Date().toISOString(),
    };
    state.faturas.push(invoice);
  }

  Object.assign(invoice, {
    month: activeMonth,
    fechamento: invoiceSummary.fechamento,
    vencimento: invoiceSummary.vencimento,
    valorPrevisto: invoiceSummary.valorPrevisto,
    valorRealizado: invoiceSummary.valorPrevisto,
    status: "pago",
    updatedAt: new Date().toISOString(),
  });

  render();
  await persistState("Atualizando pagamento da fatura na planilha...");
}

function openEntryForm(type, id = null, initialData = null) {
  currentFormType = type;
  editingId = id;
  const schema = formSchemas[type];
  const item = id ? state[schema.collection].find((entry) => entry.id === id) : initialData;
  dom.dialogTitle.textContent = id ? `Editar ${schema.title.toLowerCase()}` : `Nova ${schema.title.toLowerCase()}`;
  dom.dialogFields.innerHTML = schema.fields.map((field) => renderField(field, item)).join("") + renderExtraFormContent(type, item);
  dom.entryDialog.showModal();
}

function renderExtraFormContent(type, item) {
  if (type !== "receita" || !item) return "";
  const recebimentos = parseRecebimentos(item);
  const rows = recebimentos.length
    ? recebimentos
        .map((entry) => `<li>${entry.data || ""} - <strong>${money(entry.valor)}</strong>${entry.observacoes ? ` - ${escapeHtml(entry.observacoes)}` : ""}</li>`)
        .join("")
    : "<li>Nenhum recebimento parcial lancado.</li>";
  return `
    <div class="form-note">
      <strong>Recebido ate agora: ${money(receitaValorRecebido(item))}</strong>
      <ul>${rows}</ul>
    </div>
  `;
}

function renderField([name, label, type, required, options], item) {
  const value = item?.[name] ?? defaultFieldValue(name, type);
  const requiredAttr = required ? "required" : "";
  if (name === "cartao" && type === "text") {
    const cards = getCardNames();
    if (cards.length) {
      return `
        <label>${label}
          <select name="${name}" ${requiredAttr}>
            ${cards.map((option) => `<option ${String(value || activeCardName) === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
        </label>
      `;
    }
  }
  if (type === "select" || type === "category") {
    const source = type === "category" ? categories : options;
    return `
      <label>${label}
        <select name="${name}" ${requiredAttr}>
          ${source.map((option) => `<option ${String(value) === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (type === "textarea") {
    return `<label>${label}<textarea name="${name}" ${requiredAttr}>${escapeHtml(value)}</textarea></label>`;
  }
  const step = type === "number" ? `step="0.01" min="0"` : "";
  return `<label>${label}<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${step} ${requiredAttr} /></label>`;
}

function defaultFieldValue(name, type) {
  if (name === "status") return "previsto";
  if (name === "recorrencia") return "nao";
  if (name === "recorrenciaCartao") return "pontual";
  if (name === "formaPagamento") return "Pix";
  if (type === "date") return new Date().toISOString().slice(0, 10);
  if (type === "month") return activeMonth;
  return "";
}

async function handleEntrySubmit(event) {
  event.preventDefault();
  const schema = formSchemas[currentFormType];
  const data = Object.fromEntries(new FormData(dom.entryForm).entries());
  schema.fields.forEach(([name, , type]) => {
    if (type === "number") data[name] = parseMoney(data[name]);
  });
  applyDefaultDescription(data);
  normalizeCardPurchaseFormData(data);

  const existing = editingId ? state[schema.collection].find((entry) => entry.id === editingId) : null;
  if (existing) {
    Object.assign(existing, data, { updatedAt: new Date().toISOString() });
    if (currentFormType === "receita") updateReceitaRecebida(existing);
  } else {
    const nextEntry = {
      id: crypto.randomUUID(),
      collection: schema.collection,
      month: inferMonth(data),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    if (currentFormType === "receita") updateReceitaRecebida(nextEntry);
    state[schema.collection].push(nextEntry);
  }

  render();
  dom.entryDialog.close();
  await persistState("Salvando lancamento na planilha...");
}

function applyDefaultDescription(data) {
  if (String(data.descricao || "").trim()) {
    data.descricao = String(data.descricao).trim();
    return;
  }
  const fallback = data.categoria || data.tipo || data.origemDestino || "";
  if (fallback) data.descricao = fallback;
}

function normalizeCardPurchaseFormData(data) {
  if (currentFormType !== "compra") return;

  const installments = Math.max(Number.parseInt(data.parcelas, 10) || 1, 1);
  data.parcelas = installments;
  data.parcelaAtualCadastro = Math.min(Math.max(Number.parseInt(data.parcelaAtualCadastro, 10) || 1, 1), installments);

  if (data.recorrenciaCartao === "recorrente") {
    data.parcelas = 1;
    data.parcelaAtualCadastro = 1;
  }
}

function inferMonth(data) {
  if (currentFormType === "fatura") return activeMonth;
  return String(data.primeiraFatura || data.data || data.vencimento || data.dataPrevista || activeMonth).slice(0, 7);
}

async function handleQuickGasto(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(dom.gastoRapidoForm).entries());
  applyDefaultDescription(data);
  state.gastos.push({
    id: crypto.randomUUID(),
    collection: "gastos",
    month: data.data.slice(0, 7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
    valor: parseMoney(data.valor),
    observacoes: "",
  });
  dom.gastoRapidoForm.reset();
  dom.gastoRapidoForm.data.value = new Date().toISOString().slice(0, 10);
  populateCategorySelects();
  render();
  await persistState("Salvando gasto na planilha...");
}

async function handleConfigSubmit(event) {
  event.preventDefault();
  state.config = {
    limiteGastosGerais: parseMoney(dom.configForm.limiteGastosGerais.value),
    googleSheetId: dom.configForm.googleSheetId.value.trim(),
    appsScriptUrl: dom.configForm.appsScriptUrl.value.trim(),
  };
  render();
  await persistState("Salvando configuracoes na planilha...");
}

function statusBadge(status) {
  return `<span class="status ${escapeHtml(status)}">${escapeHtml(status)}</span>`;
}

function recurrenceLabel(item) {
  if (item.recorrencia === "sempre") return "Sempre";
  if (item.recorrencia === "meses") return `${item.repetirPorMeses || 0} meses`;
  return "Nao";
}

function investmentTypeLabel(type) {
  const labels = {
    "saldo inicial": "Saldo inicial",
    entrada: "Entrada",
    saida: "Saida",
    devolucao: "Devolucao",
  };
  return labels[type] || type || "";
}

function setText(id, value) {
  document.querySelector(`#${id}`).textContent = value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

class GoogleSheetsGateway {
  constructor(config) {
    this.config = config;
  }

  async readAll() {
    if (!this.config.appsScriptUrl) {
      return { ok: false, reason: "Endpoint do Apps Script ainda nao configurado." };
    }

    try {
      const url = new URL(this.config.appsScriptUrl);
      url.searchParams.set("action", "readAll");
      url.searchParams.set("_", Date.now());
      const response = await fetch(url.toString());
      return response.json();
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async sync(payload) {
    if (!this.config.appsScriptUrl) {
      return { ok: false, reason: "Endpoint do Apps Script ainda nao configurado." };
    }

    try {
      const response = await fetch(this.config.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "sync", payload: sanitizeStateForSheets(payload) }),
      });
      return response.json();
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}

dom.gastoRapidoForm.data.value = new Date().toISOString().slice(0, 10);
init();
