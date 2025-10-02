// Mock inicial de rotas
const ROUTES = [
  { id: 1, name: "Rota 1", enemies: 3, unlocked: true, boss: "Greymon" },
  { id: 2, name: "Rota 2", enemies: 4, unlocked: false, boss: "Kabuterimon" },
  { id: 3, name: "Rota 3", enemies: 5, unlocked: false, boss: "Devimon" },
  { id: 4, name: "Rota 4", enemies: 6, unlocked: false, boss: "Ogremon" },
  { id: 5, name: "Rota 5", enemies: 7, unlocked: false, boss: "Leomon" },
  { id: 6, name: "Rota 6", enemies: 8, unlocked: false, boss: "Etemon" },
  { id: 7, name: "Rota 7", enemies: 9, unlocked: false, boss: "Myotismon" },
  { id: 8, name: "Rota 8", enemies: 10, unlocked: false, boss: "Piedmon" }
];

// Carregar progresso salvo do localStorage
function loadProgress() {
  const data = localStorage.getItem("adventureRoutes");
  if (data) {
    const saved = JSON.parse(data);
    saved.forEach((r, i) => {
      if (ROUTES[i]) ROUTES[i].unlocked = r.unlocked;
    });
  }
}

// Renderizar rotas em zig-zag
function renderRoutes() {
  const container = document.getElementById("routes-path");
  container.innerHTML = "";

  ROUTES.filter(route => route.unlocked).forEach((route, index) => {
    const side = index % 2 === 0 ? "self-start pr-12 text-left" : "self-end pl-12 text-right";

    const card = document.createElement("div");
    card.className = `relative w-1/2 ${side}`;

    card.innerHTML = `
      <div class="bg-gray-800 border border-gray-600 rounded-xl p-4 shadow-md cursor-pointer hover:bg-gray-700 transition">
        <h2 class="font-bold">${route.name}</h2>
        <p class="text-sm text-gray-400">Inimigos: ${route.enemies}</p>
        <p class="text-sm text-red-400">Boss: ???</p>
      </div>
    `;

    card.querySelector("div").onclick = () => {
      window.location.href = `battle-adventure-road.html?routeId=${route.id}`;
    };

    container.appendChild(card);
  });
}

// Mostrar banner se desbloqueou rota nova
function showUnlockBanner() {
  const lastUnlocked = localStorage.getItem("lastUnlockedRoute");
  if (lastUnlocked) {
    const banner = document.getElementById("unlock-banner");
    const text = document.getElementById("unlock-banner-text");
    const closeBtn = document.getElementById("close-banner");

    text.innerText = `✨ Nova Rota Desbloqueada: ${lastUnlocked}!`;
    banner.classList.remove("hidden");

    closeBtn.onclick = () => {
      banner.classList.add("hidden");
      localStorage.removeItem("lastUnlockedRoute");
    };

    setTimeout(() => {
      banner.classList.add("hidden");
      localStorage.removeItem("lastUnlockedRoute");
    }, 5000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.getElementById("btn-back");
  backBtn?.addEventListener("click", () => {
    window.history.back();
  });

  loadProgress();
  renderRoutes();
  showUnlockBanner();
});
