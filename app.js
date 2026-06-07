const STORAGE_KEY = "orcamentoCasa.v1";

const categories = [
  "Moradia",
  "Contas",
  "Educacao",
  "Saude",
  "Cartao de credito",
  "Gastos gerais",
  "Mercado",
  "Gasolina",
  "Uber/transporte",
  "Farmacia",
  "Alimentacao fora",
  "Casa",
  "Lazer",
  "Outros",
];

const formSchemas = {
  receita: {
    title: "Receita",
    collection: "receitas",
    fields: [
      ["descricao", "Descricao", "text", true],
      ["valorPrevisto", "Valor previsto", "number", true],
      ["valorRealizado", "Valor recebido", "number", false],
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
      ["descricao", "Descricao", "text", true],
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
      ["vencimento", "Vencimento", "date", true],
      ["valorPrevisto", "Valor previsto", "number", true],
      ["valorRealizado", "Valor pago", "number", false],
      ["status", "Status", "select", true, ["previsto", "pago", "parcial", "atrasado"]],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  compra: {
    title: "Compra no cartao",
    collection: "compras",
    fields: [
      ["descricao", "Descricao", "text", true],
      ["cartao", "Cartao", "text", true],
      ["categoria", "Categoria", "category", true],
      ["valorTotal", "Valor total", "number", true],
      ["parcelas", "Quantidade de parcelas", "number", true],
      ["primeiraFatura", "Primeira fatura", "month", true],
      ["observacoes", "Observacoes", "textarea", false],
    ],
  },
  gasto: {
    title: "Gasto geral",
    collection: "gastos",
    fields: [
      ["data", "Data", "date", true],
      ["descricao", "Descricao", "text", true],
      ["categoria", "Categoria", "category", true],
      ["valor", "Valor", "number", true],
      ["formaPagamento", "Forma de pagamento", "select", true, ["Pix", "Debito", "Credito", "Dinheiro"]],
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
  faturas: [],
  compras: [],
  gastos: [],
};

const syncedCollections = ["receitas", "despesas", "cartoes", "faturas", "compras", "gastos"];
const dateFields = ["data", "dataPrevista", "dataRealizada", "vencimento", "dataPagamento", "primeiraFatura"];

let state = loadState();
let activeMonth = monthKey(new Date());
let currentFormType = null;
let editingId = null;

const dom = {
  pageTitle: document.querySelector("#pageTitle"),
  monthInput: document.querySelector("#monthInput"),
  entryDialog: document.querySelector("#entryDialog"),
  entryForm: document.querySelector("#entryForm"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogFields: document.querySelector("#dialogFields"),
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
  return mergeState(nextState);
}

function mergeRemoteState(remoteState) {
  const localState = state;
  const merged = mergeState(remoteState || {});

  merged.config = {
    ...structuredClone(defaultState).config,
    ...(remoteState?.config || {}),
    googleSheetId: state.config.googleSheetId || defaultState.config.googleSheetId,
    appsScriptUrl: state.config.appsScriptUrl || defaultState.config.appsScriptUrl,
  };

  syncedCollections.forEach((collection) => {
    const remoteRows = (Array.isArray(remoteState?.[collection]) ? remoteState[collection] : []).map(normalizeRow);
    const remoteIds = new Set(remoteRows.map((item) => String(item.id)));
    const localExtras = (localState[collection] || []).filter((item) => item.id && !remoteIds.has(String(item.id)) && !isSeedRow(collection, item));
    merged[collection] = [...remoteRows, ...localExtras];
  });

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
}\n
function render() {
  renderDashboard();
  renderReceitas();
  renderDespesas();
  renderCartoes();
  renderGastos();
  renderConfig();
}

function renderDashboard() {
  const receitas = monthItems("receitas");
  const despesas = monthItems("despesas");
  const faturas = monthItems("faturas");
  const gastos = monthItems("gastos");

  const receitasPrevistas = sum(receitas, "valorPrevisto");
  const receitasRecebidas = sum(receitas, "valorRealizado");
  const despesasPrevistas = sum(despesas, "valorPrevisto");
  const despesasPagas = sum(despesas, "valorRealizado");
  const cartoesPrevistos = sum(faturas, "valorPrevisto");
  const cartoesPagos = sum(faturas, "valorRealizado");
  const gastosUsados = sum(gastos, "valor");
  const limite = parseMoney(state.config.limiteGastosGerais);

  setText("metricReceitasPrevistas", money(receitasPrevistas));
  setText("metricReceitasRecebidas", `Recebido: ${money(receitasRecebidas)}`);
  setText("metricDespesasPrevistas", money(despesasPrevistas));
  setText("metricDespesasPagas", `Pago: ${money(despesasPagas)}`);
  setText("metricCartoesPrevistos", money(cartoesPrevistos));
  setText("metricCartoesPagos", `Pago: ${money(cartoesPagos)}`);
  setText("metricSaldoPrevisto", money(receitasPrevistas - despesasPrevistas - cartoesPrevistos));
  setText("metricSaldoReal", `Saldo atual: ${money(receitasRecebidas - despesasPagas - cartoesPagos - gastosUsados)}`);

  const percent = limite > 0 ? Math.min((gastosUsados / limite) * 100, 100) : 0;
  const fill = document.querySelector("#gastosProgress");
  fill.style.width = `${percent}%`;
  fill.classList.toggle("warning", percent >= 75 && percent < 95);
  fill.classList.toggle("danger", percent >= 95);
  setText("gastosDisponivel", `${money(limite - gastosUsados)} disponivel`);
  setText("gastosUsado", `Usado: ${money(gastosUsados)}`);
  setText("gastosLimite", `Limite: ${money(limite)}`);

  renderUpcoming(despesas, faturas);
  renderCategories(gastos);
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
    money(item.valorRealizado),
    item.dataPrevista,
    statusBadge(item.status),
    recurrenceLabel(item),
    actions("receita", item.id, item.status !== "recebido" ? "Marcar recebida" : ""),
  ]);
}

function renderDespesas() {
  renderRows("despesasTable", monthItems("despesas"), (item) => [
    item.descricao,
    item.categoria,
    money(item.valorPrevisto),
    money(item.valorRealizado),
    item.vencimento,
    statusBadge(item.status),
    recurrenceLabel(item),
    actions("despesa", item.id, item.status !== "pago" ? "Marcar paga" : ""),
  ]);
}

function renderCartoes() {
  renderRows("faturasTable", monthItems("faturas"), (item) => [
    item.cartao,
    item.vencimento,
    money(item.valorPrevisto),
    money(item.valorRealizado),
    statusBadge(item.status),
    actions("fatura", item.id, item.status !== "pago" ? "Marcar paga" : ""),
  ]);
  renderRows("comprasTable", state.compras, (item) => [
    item.descricao,
    item.cartao,
    money(item.valorTotal),
    `${item.parcelas || 1}x de ${money(parseMoney(item.valorTotal) / Math.max(parseMoney(item.parcelas), 1))}`,
    item.primeiraFatura,
    actions("compra", item.id, ""),
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

async function handleRowAction(event) {
  const { action, type, id } = event.currentTarget.dataset;
  const schema = formSchemas[type];
  const item = state[schema.collection].find((entry) => entry.id === id);
  if (!item) return;

  if (action === "edit") openEntryForm(type, id);
  if (action === "delete") {
    state[schema.collection] = state[schema.collection].filter((entry) => entry.id !== id);
    render();
    await persistState("Excluindo na planilha...");
  }
  if (action === "complete") {
    const expected = item.valorPrevisto || item.valorTotal || item.valor;
    item.valorRealizado = item.valorRealizado || expected;
    item.status = type === "receita" ? "recebido" : "pago";
    item.dataPagamento = item.dataPagamento || new Date().toISOString().slice(0, 10);
    item.dataRealizada = item.dataRealizada || new Date().toISOString().slice(0, 10);
    item.updatedAt = new Date().toISOString();
    render();
    await persistState("Atualizando pagamento na planilha...");
  }
}

function openEntryForm(type, id = null) {
  currentFormType = type;
  editingId = id;
  const schema = formSchemas[type];
  const item = id ? state[schema.collection].find((entry) => entry.id === id) : null;
  dom.dialogTitle.textContent = id ? `Editar ${schema.title.toLowerCase()}` : `Nova ${schema.title.toLowerCase()}`;
  dom.dialogFields.innerHTML = schema.fields.map((field) => renderField(field, item)).join("");
  dom.entryDialog.showModal();
}

function renderField([name, label, type, required, options], item) {
  const value = item?.[name] ?? defaultFieldValue(name, type);
  const requiredAttr = required ? "required" : "";
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

  const existing = editingId ? state[schema.collection].find((entry) => entry.id === editingId) : null;
  if (existing) {
    Object.assign(existing, data, { updatedAt: new Date().toISOString() });
  } else {
    state[schema.collection].push({
      id: crypto.randomUUID(),
      collection: schema.collection,
      month: inferMonth(data),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    });
  }

  render();
  dom.entryDialog.close();
  await persistState("Salvando lancamento na planilha...");
}

function inferMonth(data) {
  return String(data.primeiraFatura || data.data || data.vencimento || data.dataPrevista || activeMonth).slice(0, 7);
}

async function handleQuickGasto(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(dom.gastoRapidoForm).entries());
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
