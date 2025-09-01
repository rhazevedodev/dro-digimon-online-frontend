// ===== Mock "backend" =====
const WALLET = { bits: 1250, crystals: 80 };

const ACHIEVEMENTS = [
  { id: "ACH_BATTLE_001", title: "Primeira Batalha", desc: "Vença 1 batalha.",
    category: "battle", status: "completed", progress: { current: 1, total: 1 },
    reward: { bits: 100, crystals: 0 }, icon: "sword" },
  { id: "ACH_BATTLE_010", title: "Veterano de Arena", desc: "Vença 10 batalhas.",
    category: "battle", status: "in_progress", progress: { current: 7, total: 10 },
    reward: { bits: 300, crystals: 5 }, icon: "shield" },
  { id: "ACH_EVOLVE_001", title: "Primeira Evolução", desc: "Evolua um Digimon pela primeira vez.",
    category: "evolution", status: "completed", progress: { current: 1, total: 1 },
    reward: { bits: 200, crystals: 3 }, icon: "zap" },
  { id: "ACH_COLLECTION_005", title: "Colecionador", desc: "Tenha 5 Digimons diferentes.",
    category: "collection", status: "claimed", progress: { current: 5, total: 5 },
    reward: { bits: 500, crystals: 10 }, icon: "grid" },
  { id: "ACH_EXPLORE_003", title: "Explorador", desc: "Complete 3 áreas exploráveis.",
    category: "exploration", status: "in_progress", progress: { current: 2, total: 3 },
    reward: { bits: 250, crystals: 4 }, icon: "map" },
  { id: "ACH_SOCIAL_001", title: "Novo Amigo", desc: "Adicione 1 amigo.",
    category: "social", status: "in_progress", progress: { current: 0, total: 1 },
    reward: { bits: 50, crystals: 0 }, icon: "user-plus" }
];

// ===== Util =====
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
function $(id) { return document.getElementById(id); }
function pct(p) { return Math.round((p.current / p.total) * 100); }

function statusBadgeClass(s) {
  return s === "completed" ? "completed"
       : s === "claimed"   ? "claimed"
       : "in_progress";
}
function labelStatus(s) {
  if (s === "in_progress") return "Em progresso";
  if (s === "completed")   return "Concluída";
  if (s === "claimed")     return "Resgatada";
  return s;
}

// Novo: lista de recompensa em UL
function rewardListHTML(r) {
  const items = [];
  if (r.bits) items.push(`<li>${r.bits} Bits</li>`);
  if (r.crystals) items.push(`<li>${r.crystals} Cristais</li>`);
  return `<ul class="reward-list">${items.join("")}</ul>`;
}

function renderWallet() {
  $("wallet-bits").textContent = `${state.wallet.bits} Bits`;
  $("wallet-crystals").textContent = `${state.wallet.crystals} Cristais`;
}

function renderClaimButton(a) {
  const canClaim = a.status === "completed";
  const disabled = !canClaim;
  return `
    <button data-claim="${a.id}"
            class="claim-btn ${canClaim ? "enabled" : "disabled"}"
            ${disabled ? "disabled" : ""}>
      ${canClaim ? "Resgatar" : "Indisponível"}
    </button>
  `;
}

// ===== State =====
let state = {
  search: "",
  filterStatus: "all",
  filterCategory: "all",
  data: deepClone(ACHIEVEMENTS),
  wallet: { ...WALLET }
};

// ===== Render list =====
function renderList() {
  const list = $("achievements-list");
  const empty = $("empty-state");
  list.innerHTML = "";

  const filtered = state.data.filter(a => {
    const byText = state.search
      ? (a.title + " " + a.desc).toLowerCase().includes(state.search.toLowerCase())
      : true;
    const byStatus = state.filterStatus === "all" ? true : a.status === state.filterStatus;
    const byCategory = state.filterCategory === "all" ? true : a.category === state.filterCategory;
    return byText && byStatus && byCategory;
  });

  if (!filtered.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  for (const a of filtered) {
    const percent = pct(a.progress);
    const card = document.createElement("div");
    card.className = "ach-card";
    card.innerHTML = `
      <div class="ach-icon">
        <i data-feather="${a.icon}"></i>
      </div>
      <div class="ach-body">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="ach-title truncate">${a.title}</p>
            <p class="ach-meta">${a.desc}</p>
          </div>
          <span class="badge ${statusBadgeClass(a.status)}">${labelStatus(a.status)}</span>
        </div>

        <div class="mt-3">
          <div class="progress">
            <div class="progress-fill" style="width:${percent}%"></div>
            <div class="progress-text">${a.progress.current}/${a.progress.total} (${percent}%)</div>
          </div>
        </div>

        <!-- Recompensa em lista -->
        <div class="mt-3">
          <p class="ach-reward text-gray-300">Recompensa:</p>
          ${rewardListHTML(a.reward)}
        </div>

        <!-- Botão no final -->
        <div class="ach-actions">
          ${renderClaimButton(a)}
        </div>
      </div>
    `;

    const btn = card.querySelector("button[data-claim]");
    if (btn) btn.addEventListener("click", () => claimAchievement(a.id));

    list.appendChild(card);
  }

  if (window.feather && typeof window.feather.replace === "function") feather.replace();
}

// ===== Actions =====
function claimAchievement(id) {
  const a = state.data.find(x => x.id === id);
  if (!a || a.status !== "completed") return;
  state.wallet.bits += a.reward.bits || 0;
  state.wallet.crystals += a.reward.crystals || 0;
  a.status = "claimed";
  renderWallet();
  renderList();
  alert(`Recompensa resgatada!`);
}

function claimAll() {
  const claimable = state.data.filter(a => a.status === "completed");
  if (!claimable.length) {
    alert("Não há conquistas concluídas para resgatar.");
    return;
  }
  claimable.forEach(a => {
    state.wallet.bits += a.reward.bits || 0;
    state.wallet.crystals += a.reward.crystals || 0;
    a.status = "claimed";
  });
  renderWallet();
  renderList();
  alert(`Resgatou ${claimable.length} conquista(s)!`);
}

function clearFilters() {
  state.search = "";
  state.filterStatus = "all";
  state.filterCategory = "all";
  $("search").value = "";
  $("filter-status").value = "all";
  $("filter-category").value = "all";
  renderList();
}

// ===== Wire =====
document.addEventListener("DOMContentLoaded", () => {
  renderWallet();
  renderList();

  $("search").addEventListener("input", e => {
    state.search = e.target.value;
    renderList();
  });
  $("filter-status").addEventListener("change", e => {
    state.filterStatus = e.target.value;
    renderList();
  });
  $("filter-category").addEventListener("change", e => {
    state.filterCategory = e.target.value;
    renderList();
  });
  $("btn-clear").addEventListener("click", clearFilters);
  $("btn-claim-all").addEventListener("click", claimAll);
});
