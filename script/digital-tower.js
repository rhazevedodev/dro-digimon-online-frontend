const TEST_MODE = true; // 🔁 modo rápido para testes

let towerData = {
  currentFloor: 1,
  maxFloorReached: 1,
  lastDefeatedFloor: null
};

/* ===================== FUNÇÕES DE UTILIDADE ===================== */
function saveTowerData() {
  localStorage.setItem("digitalTower", JSON.stringify(towerData));
}
function loadTowerData() {
  const data = localStorage.getItem("digitalTower");
  if (data) towerData = JSON.parse(data);
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ===================== GERAÇÃO DE INIMIGO ESCALONADA ===================== */
function generateEnemy(floor) {
  const baseAtk = 50, baseDef = 30, baseHp = 200;
  const multiplier = 1 + (floor - 1) * 0.1;
  return {
    name: `Andar ${floor} - Inimigo`,
    img: "https://digimon.shadowsmith.com/img/agumon.jpg",
    atk: Math.round(baseAtk * multiplier),
    def: Math.round(baseDef * multiplier),
    hp: Math.round(baseHp * multiplier)
  };
}

/* ===================== ATUALIZAÇÕES ===================== */
function updateTowerInfo() {
  document.getElementById("tower-floor").textContent = `Andar Atual: ${towerData.currentFloor}`;
  document.getElementById("tower-record").textContent = `Recorde Máximo: ${towerData.maxFloorReached}`;
}

/* ===================== SISTEMA DE BATALHA ===================== */
let playerHp, enemyHp, enemyData;

function startBattle() {
  const battleArea = document.getElementById("battle-area");
  enemyData = generateEnemy(towerData.currentFloor);

  playerHp = 300 + towerData.currentFloor * 10;
  enemyHp = enemyData.hp;

  document.getElementById("enemy-name").textContent = enemyData.name;
  document.getElementById("enemy-img").src = enemyData.img;
  document.getElementById("enemy-stats").textContent = `ATK: ${enemyData.atk} | DEF: ${enemyData.def} | HP: ${enemyData.hp}`;

  updateHpBars(true);
  clearBattleLog();

  document.getElementById("battle-area").classList.remove("hidden");
  document.getElementById("tower-info").classList.add("hidden");

  document.getElementById("btn-attack").onclick = attackTurn;
  document.getElementById("btn-run").onclick = leaveTower;
}

/* ===================== ANIMAÇÕES DE HP ===================== */
function updateHpBars(initial = false) {
  const playerPercent = Math.max(0, (playerHp / (300 + towerData.currentFloor * 10)) * 100);
  const enemyPercent = Math.max(0, (enemyHp / enemyData.hp) * 100);

  const playerBar = document.getElementById("player-hp-bar");
  const enemyBar = document.getElementById("enemy-hp-bar");

  if (!initial) {
    playerBar.style.transition = "width 0.5s ease-in-out";
    enemyBar.style.transition = "width 0.5s ease-in-out";
  }

  playerBar.style.width = `${playerPercent}%`;
  enemyBar.style.width = `${enemyPercent}%`;
}

/* ===================== EFEITOS VISUAIS ===================== */
function flashDamage(targetId, isCritical = false) {
  const el = document.getElementById(targetId);
  el.classList.add(isCritical ? "shake-critical" : "flash-hit");
  setTimeout(() => el.classList.remove("flash-hit", "shake-critical"), 300);
}

/* ===================== BATTLE LOG ===================== */
function addBattleLog(text) {
  const log = document.getElementById("battle-log");
  log.innerHTML += `<p>${text}</p>`;
  log.scrollTop = log.scrollHeight;
}
function clearBattleLog() {
  document.getElementById("battle-log").innerHTML = "";
}

/* ===================== TURNOS DE ATAQUE ===================== */
function attackTurn() {
  const isCrit = Math.random() < 0.2;
  const isBlocked = Math.random() < 0.15;

  let playerDamage = rand(40, 70);
  if (isCrit) playerDamage *= 2;
  if (isBlocked) playerDamage *= 0.2;

  let feedback = "💥 Você causou " + Math.round(playerDamage) + " de dano!";
  if (isCrit) feedback += " ⚡ (Crítico!)";
  if (isBlocked) feedback += " 🛡️ (Ataque Bloqueado!)";

  enemyHp -= playerDamage;
  addBattleLog(feedback);
  flashDamage("enemy-img", isCrit);
  updateHpBars();

  if (enemyHp <= 0) {
    endBattle("victory");
    return;
  }

  // Turno do inimigo
  setTimeout(() => {
    const enemyCrit = Math.random() < 0.15;
    const enemyBlock = Math.random() < 0.1;

    let enemyDamage = rand(enemyData.atk * 0.5, enemyData.atk * 0.9);
    if (enemyCrit) enemyDamage *= 2;
    if (enemyBlock) enemyDamage *= 0.2;

    let feedbackEnemy = `🔥 ${enemyData.name} causou ${Math.round(enemyDamage)} de dano!`;
    if (enemyCrit) feedbackEnemy += " ⚡ (Crítico!)";
    if (enemyBlock) feedbackEnemy += " 🛡️ (Você Bloqueou!)";

    playerHp -= enemyDamage;
    addBattleLog(feedbackEnemy);
    flashDamage("player-hp-bar", enemyCrit);
    updateHpBars();

    if (playerHp <= 0) endBattle("defeat");
  }, TEST_MODE ? 400 : 1000);
}

/* ===================== FIM DE BATALHA ===================== */
function endBattle(result) {
  document.getElementById("battle-buttons").classList.add("hidden");

  if (result === "victory") {
    addBattleLog("<span class='text-green-400 font-bold'>🏆 Vitória!</span>");
    setTimeout(() => showTowerReward(), TEST_MODE ? 800 : 2000);
  } else {
    addBattleLog("<span class='text-red-400 font-bold'>💀 Derrota!</span>");
    towerData.lastDefeatedFloor = towerData.currentFloor;
    towerData.currentFloor = 1; // 🔥 volta para o início
    saveTowerData();
    setTimeout(() => showDefeatOptions(), TEST_MODE ? 1000 : 2000);
  }
}

/* ===================== RECOMPENSA ===================== */
function showTowerReward() {
  const modal = document.getElementById("tower-reward-modal");
  const rewardList = document.getElementById("reward-items");
  const rewardFloor = document.getElementById("reward-floor");
  const rewardTitle = document.getElementById("reward-title");

  const rewardBits = 100 * towerData.currentFloor;
  const rewards = [`${rewardBits} Bits`, "Fragmento Aleatório"];

  rewardList.innerHTML = "";
  rewards.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    rewardList.appendChild(li);
  });

  rewardTitle.textContent = "Vitória!";
  rewardFloor.textContent = `Andar ${towerData.currentFloor} concluído!`;
  modal.classList.remove("hidden");

  towerData.currentFloor++;
  towerData.maxFloorReached = Math.max(towerData.maxFloorReached, towerData.currentFloor);
  saveTowerData();

  document.getElementById("btn-next-floor").onclick = () => {
    modal.classList.add("hidden");
    document.getElementById("battle-area").classList.add("hidden");
    document.getElementById("battle-buttons").classList.remove("hidden");
    document.getElementById("tower-info").classList.remove("hidden");
    updateTowerInfo();
  };
}

/* ===================== DERROTA ===================== */
function showDefeatOptions() {
    const resultDiv = document.getElementById("battle-result");
    resultDiv.classList.remove("hidden");
  
    resultDiv.innerHTML = `
      <p class="text-red-400 font-bold mb-2">Você foi derrotado no andar ${towerData.lastDefeatedFloor}!</p>
      <p class="text-gray-400 text-sm mb-3">Você retornou ao andar 1. Recorde: ${towerData.maxFloorReached}</p>
      <button id="btn-return-tower" class="mt-2 bg-blue-600 hover:bg-blue-500 py-2 w-full rounded-lg font-semibold">
        Voltar à Torre
      </button>
    `;
  
    // ✅ Volta para o menu principal da Torre
    document.getElementById("btn-return-tower").onclick = () => {
      resultDiv.classList.add("hidden");
      document.getElementById("battle-area").classList.add("hidden");
      document.getElementById("battle-buttons").classList.remove("hidden");
      document.getElementById("tower-info").classList.remove("hidden");
      updateTowerInfo();
    };
  }

/* ===================== SAIR DA TORRE ===================== */
function leaveTower() {
  window.location.href = "journey.html";
}

/* ===================== INICIALIZAÇÃO ===================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-back")?.addEventListener("click", () => window.location.href = "jornada.html");
  document.getElementById("btn-start").addEventListener("click", startBattle);
  loadTowerData();
  updateTowerInfo();
});
