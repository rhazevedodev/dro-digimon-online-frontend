const TEST_MODE = true; // 🔁 troque para true para acelerar tempo
const EXPEDITIONS = [
  {
    id: 1,
    name: "Floresta Misteriosa",
    unlocked: true,
    requiredItem: null,
    rewardItem: "Fragmento Floresta",
    inProgress: false,
    finished: false, // ✅ novo estado
    startedAt: null,
    duration: null,
    digimon: null,
    difficulties: [
      { name: "Fácil", duration: 1, powerRequired: 0, rewards: ["Bits", "Fragmento Baby II"] },
      { name: "Média", duration: 3, powerRequired: 1000, rewards: ["Bits", "Fragmento Rookie"] },
      { name: "Difícil", duration: 6, powerRequired: 2500, rewards: ["Bits", "Fragmento Champion"] },
      { name: "Extrema", duration: 12, powerRequired: 5000, rewards: ["Bits", "Fragmento Ultimate"] }
    ]
  },
  {
    id: 2,
    name: "Ruínas Antigas",
    unlocked: false,
    requiredItem: "Fragmento Floresta",
    rewardItem: "Fragmento Ruína",
    inProgress: false,
    finished: false,
    startedAt: null,
    duration: null,
    digimon: null,
    difficulties: [
      { name: "Fácil", duration: 1, powerRequired: 0, rewards: ["Bits", "Fragmento Baby II"] },
      { name: "Média", duration: 3, powerRequired: 1200, rewards: ["Bits", "Fragmento Rookie"] },
      { name: "Difícil", duration: 6, powerRequired: 2700, rewards: ["Bits", "Fragmento Champion"] },
      { name: "Extrema", duration: 12, powerRequired: 5500, rewards: ["Bits", "Fragmento Ultimate"] }
    ]
  },
  {
    id: 3,
    name: "Mina de Dados",
    unlocked: false,
    requiredItem: "Fragmento Ruína",
    rewardItem: "Fragmento Mina",
    inProgress: false,
    finished: false,
    startedAt: null,
    duration: null,
    digimon: null,
    difficulties: [
      { name: "Fácil", duration: 1, powerRequired: 0, rewards: ["Bits", "Fragmento Baby II"] },
      { name: "Média", duration: 3, powerRequired: 1500, rewards: ["Bits", "Fragmento Rookie"] },
      { name: "Difícil", duration: 6, powerRequired: 3000, rewards: ["Bits", "Fragmento Champion"] },
      { name: "Extrema", duration: 12, powerRequired: 6000, rewards: ["Bits", "Fragmento Ultimate", "Equipamento Épico"] }
    ]
  }
];

/* ===================== FUNÇÕES DE PERSISTÊNCIA ===================== */
function saveExpeditions() {
  localStorage.setItem("expeditions", JSON.stringify(EXPEDITIONS));
}

function loadExpeditions() {
  const data = localStorage.getItem("expeditions");
  if (data) {
    const saved = JSON.parse(data);
    saved.forEach((e, i) => {
      if (EXPEDITIONS[i]) Object.assign(EXPEDITIONS[i], e);
    });
  }
}

/* ===================== DESBLOQUEIO AUTOMÁTICO ===================== */
function tryUnlockExpeditions(rewardItem) {
  let unlocked = false;
  EXPEDITIONS.forEach(exp => {
    if (!exp.unlocked && exp.requiredItem === rewardItem) {
      exp.unlocked = true;
      unlocked = true;
      console.log(`✅ Nova expedição desbloqueada: ${exp.name}`);
    }
  });
  if (unlocked) renderExpeditions();
  saveExpeditions();
}

/* ===================== RENDERIZAÇÃO DOS CARDS ===================== */
function renderExpeditions() {
  const container = document.getElementById("expeditions-list");
  container.innerHTML = "";

  EXPEDITIONS.forEach(exp => {
    const div = document.createElement("div");
    div.className = "bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-lg";

    // 🔒 bloqueadas
    if (!exp.unlocked) {
      div.innerHTML = `
        <h2 class="text-lg font-bold mb-2">${exp.name}</h2>
        <p class="text-gray-500">🔒 Bloqueada — Requer: ${exp.requiredItem}</p>
      `;
      container.appendChild(div);
      return;
    }

    // 🎁 expedição finalizada (aguardando coleta)
    if (exp.finished) {
      div.innerHTML = `
        <h2 class="text-lg font-bold mb-2">${exp.name}</h2>
        <p class="text-green-400">🎁 Expedição concluída!</p>
        <button class="mt-3 bg-green-600 hover:bg-green-500 py-2 w-full rounded font-semibold"
          onclick="finishExpedition(${exp.id})">
          Coletar Recompensa
        </button>
      `;
      container.appendChild(div);
      return;
    }

    // ⏳ expedição em andamento
    if (exp.inProgress) {
      const remaining = exp.startedAt + exp.duration - Date.now();

      // Calcula h, m, s restantes
      const h = Math.floor(remaining / (1000 * 60 * 60));
      const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((remaining % (1000 * 60)) / 1000);

      // Garante que o contador nunca fique negativo visualmente
      const hStr = Math.max(h, 0);
      const mStr = Math.max(m, 0);
      const sStr = Math.max(s, 0);

      div.innerHTML = `
        <h2 class="text-lg font-bold mb-2">${exp.name}</h2>
        <p class="text-yellow-400">⏳ Em andamento — ${hStr}h ${mStr}m ${sStr}s restantes</p>
      `;
      container.appendChild(div);
      return;
    }

    // 🟢 expedição disponível
    div.innerHTML = `
      <h2 class="text-lg font-bold mb-2">${exp.name}</h2>
      <p class="text-gray-300 text-sm mb-4">Escolha uma dificuldade para iniciar.</p>
      <button class="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold w-full transition"
        onclick="openDifficultySelection(${exp.id})">
        Iniciar Expedição
      </button>
    `;
    container.appendChild(div);
  });
}

/* ===================== INICIAR EXPEDIÇÃO ===================== */
function startExpedition(expeditionId, difficultyName) {
  const exp = EXPEDITIONS.find(e => e.id === expeditionId);
  const dif = exp.difficulties.find(d => d.name === difficultyName);

  // para testes: cada "hora" = 1 minuto
  exp.inProgress = true;
  exp.finished = false;
  exp.startedAt = Date.now();
  exp.duration = dif.duration * (TEST_MODE ? 60 * 1000 : 60 * 60 * 1000);
  exp.digimon = "Agumon"; // mock
  saveExpeditions();
  closeDifficultyModal();
  renderExpeditions();
}

/* ===================== FINALIZAR EXPEDIÇÃO ===================== */
function finishExpedition(id) {
  const exp = EXPEDITIONS.find(e => e.id === id);
  if (!exp.finished) return;

  exp.finished = false;
  exp.inProgress = false;
  exp.startedAt = null;

  // Simula recompensa da dificuldade usada (por enquanto, aleatória entre as disponíveis)
  const randomDifficulty = exp.difficulties[Math.floor(Math.random() * exp.difficulties.length)];
  const rewards = randomDifficulty.rewards;

  // Mostra modal com recompensas
  showRewardModal(exp.name, rewards);

  console.log(`🎁 Recompensa coletada: ${exp.rewardItem}`);
  tryUnlockExpeditions(exp.rewardItem);
  saveExpeditions();
  renderExpeditions();
}

/* ===================== CONTADOR EM TEMPO REAL ===================== */
function updateTimers() {
  const now = Date.now();
  let updated = false;

  EXPEDITIONS.forEach(exp => {
    if (exp.inProgress) {
      const remaining = exp.startedAt + exp.duration - now;
      if (remaining <= 0) {
        exp.inProgress = false;
        exp.finished = true;
        exp.startedAt = null;
        updated = true;
        console.log(`✅ ${exp.name} concluída e aguardando coleta`);
      }
    }
  });

  if (updated) {
    saveExpeditions();
    renderExpeditions();
  } else {
    renderExpeditions();
  }
}

setInterval(updateTimers, 1000); // 🔁 atualiza a cada segundo

/* ===================== MODAL DE DIFICULDADE ===================== */
function openDifficultySelection(expeditionId) {
  const exp = EXPEDITIONS.find(e => e.id === expeditionId);
  const modal = document.getElementById("difficulty-modal");
  const list = document.getElementById("difficulty-list");
  list.innerHTML = "";

  exp.difficulties.forEach(dif => {
    const btn = document.createElement("button");
    btn.className =
      "bg-gray-700 hover:bg-gray-600 p-3 rounded-lg border border-gray-600 w-full text-left transition";
    btn.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-white">${dif.name}</span>
        <span class="text-sm text-gray-300">${dif.duration}h</span>
      </div>
      <p class="text-sm text-gray-300 mt-1">Poder mínimo: ${dif.powerRequired}</p>
      <p class="text-xs text-gray-400 mt-1">Recompensas: ${dif.rewards.join(", ")}</p>
    `;
    btn.onclick = () => startExpedition(expeditionId, dif.name);
    list.appendChild(btn);
  });

  modal.classList.remove("hidden");
}

function closeDifficultyModal() {
  document.getElementById("difficulty-modal").classList.add("hidden");
}

/* ===================== MODAL DE RECOMPENSA ===================== */
function showRewardModal(expeditionName, rewards) {
  const modal = document.getElementById("reward-modal");
  const nameEl = document.getElementById("reward-expedition-name");
  const listEl = document.getElementById("reward-list");

  nameEl.innerText = `Expedição: ${expeditionName}`;
  listEl.innerHTML = "";

  rewards.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `- ${item}`;
    listEl.appendChild(li);
  });

  modal.classList.remove("hidden");
}

function closeRewardModal() {
  document.getElementById("reward-modal").classList.add("hidden");
}

/* ===================== INICIALIZAÇÃO ===================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-back")?.addEventListener("click", () => {
    window.location.href = "jornada.html";
  });
  document.getElementById("cancel-difficulty")?.addEventListener("click", closeDifficultyModal);
  loadExpeditions();
  renderExpeditions();

  document.getElementById("difficulty-modal")?.addEventListener("click", e => {
    if (e.target.id === "difficulty-modal") closeDifficultyModal();
  });

  document.getElementById("close-reward-modal")?.addEventListener("click", closeRewardModal);
  document.getElementById("reward-modal")?.addEventListener("click", e => {
    if (e.target.id === "reward-modal") closeRewardModal();
  });
});
