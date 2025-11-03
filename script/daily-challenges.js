const CHALLENGES = [
  { id: 1, name: "Faça login hoje", type: "login", reward: { item: "Bits", amount: 100 } },
  { id: 2, name: "Faça um combate na Torre Digital", type: "tower", reward: { item: "Fragmento Rookie", amount: 1 } },
  { id: 3, name: "Faça uma Expedição", type: "expedition", reward: { item: "Fragmento Champion", amount: 1 } },
  { id: 4, name: "Faça uma Jornada", type: "journey", reward: { item: "Bits", amount: 200 } },
];

function loadProgress() {
  const data = localStorage.getItem("dailyChallenges");
  if (data) return JSON.parse(data);
  return initChallenges();
}

function initChallenges() {
  const today = new Date().toDateString();
  const challenges = CHALLENGES.map(c => ({ ...c, completed: false, collected: false }));
  const data = { date: today, challenges, dailyRewardCollected: false };
  localStorage.setItem("dailyChallenges", JSON.stringify(data));
  return data;
}

function saveProgress(data) {
  localStorage.setItem("dailyChallenges", JSON.stringify(data));
}

function renderChallenges() {
  const container = document.getElementById("challenges-list");
  container.innerHTML = "";

  const allCompleted = data.challenges.every(c => c.completed && c.collected);
  const dailyReward = document.getElementById("daily-reward");
  dailyReward.classList.toggle("hidden", !allCompleted || data.dailyRewardCollected);

  data.challenges.forEach(ch => {
    const div = document.createElement("div");

    // 💡 Cor do card conforme o estado
    let bgColor = "bg-gray-800 border-gray-700"; // padrão
    if (ch.completed && !ch.collected) bgColor = "bg-green-800 border-green-600"; // concluído mas não coletado
    if (ch.collected) bgColor = "bg-green-900 border-green-700 opacity-70"; // coletado

    div.className = `p-4 rounded-xl border transition ${bgColor}`;

    const status = ch.completed ? (ch.collected ? "✅" : "🟢") : "⬜";
    let rewardText = `${ch.reward.amount} ${ch.reward.item}`;

    div.innerHTML = `
      <h2 class="font-bold mb-1">${status} ${ch.name}</h2>
      <p class="text-sm text-gray-300 mb-2">Recompensa: ${rewardText}</p>
    `;

    if (ch.completed && !ch.collected) {
      const btn = document.createElement("button");
      btn.className = "bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-sm font-semibold";
      btn.textContent = "Coletar Recompensa";
      btn.onclick = () => collectReward(ch.id);
      div.appendChild(btn);
    }

    container.appendChild(div);
  });
}

function collectReward(id) {
  const ch = data.challenges.find(c => c.id === id);
  if (!ch || ch.collected) return;
  ch.collected = true;
  saveProgress(data);
  showRewardModal(`Você recebeu ${ch.reward.amount} ${ch.reward.item}!`);
  renderChallenges();
}

function showRewardModal(text) {
  document.getElementById("reward-modal-text").textContent = text;
  document.getElementById("reward-modal").classList.remove("hidden");
}

function closeRewardModal() {
  document.getElementById("reward-modal").classList.add("hidden");
}

function collectDailyReward() {
  data.dailyRewardCollected = true;
  saveProgress(data);
  showRewardModal("🎁 Você abriu o Baú Diário e recebeu recompensas bônus!");
  renderChallenges();
}

function autoCompleteLogin() {
  const loginChallenge = data.challenges.find(c => c.type === "login");
  if (loginChallenge && !loginChallenge.completed) {
    loginChallenge.completed = true;
    saveProgress(data);
  }
}

function checkDailyReset() {
  const today = new Date().toDateString();
  if (data.date !== today) {
    data = initChallenges();
  }
}

function updateTimer() {
  const now = new Date();
  const resetTime = new Date();
  resetTime.setHours(24, 0, 0, 0);
  const diff = resetTime - now;

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("reset-timer").textContent = `Renova em ${h}h ${m}m ${s}s`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-back").addEventListener("click", () => {
    window.location.href = "jornada.html"; // ajuste conforme seu fluxo
  });

  data = loadProgress();
  checkDailyReset();
  autoCompleteLogin();
  renderChallenges();
  setInterval(updateTimer, 1000);

  document.getElementById("btn-daily-reward").addEventListener("click", collectDailyReward);
});
