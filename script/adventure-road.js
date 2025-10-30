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

// === FUNÇÕES EXISTENTES ===
function ensureDefaultProgress() {
  if (!localStorage.getItem("adventureRoutes")) {
    localStorage.setItem("adventureRoutes", JSON.stringify(ROUTES));
  }
}

function loadProgress() {
  ensureDefaultProgress();

  const data = localStorage.getItem("adventureRoutes");
  if (data) {
    try {
      const saved = JSON.parse(data);
      ROUTES.forEach((r, i) => {
        if (saved[i]) r.unlocked = !!saved[i].unlocked;
      });
    } catch {
      console.warn("Erro ao carregar progresso. Resetando...");
      localStorage.removeItem("adventureRoutes");
      localStorage.setItem("adventureRoutes", JSON.stringify(ROUTES));
    }
  }
}

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

function renderLatestUnlockedRoute() {
  const routeCard = document.getElementById("route-card");
  const noRoutes = document.getElementById("no-routes");

  const unlockedRoutes = ROUTES.filter(r => r.unlocked);
  if (unlockedRoutes.length === 0) {
    noRoutes.classList.remove("hidden");
    return;
  }

  const latestRoute = unlockedRoutes[unlockedRoutes.length - 1];

  document.getElementById("route-name").innerText = latestRoute.name;
  document.getElementById("route-enemies").innerText = `Inimigos: ${latestRoute.enemies}`;
  document.getElementById("route-boss").innerText = `Boss: ???`;

  routeCard.classList.remove("hidden");

  document.getElementById("btn-enter").onclick = () => {
    window.location.href = `battle-adventure-road.html?routeId=${latestRoute.id}`;
  };
}

// === NOVAS FUNÇÕES ===
function openPreviousRoutesModal() {
  const modal = document.getElementById("previous-routes-modal");
  const list = document.getElementById("previous-routes-list");
  list.innerHTML = "";

  // Lista todas as rotas desbloqueadas, exceto a mais recente
  const unlocked = ROUTES.filter(r => r.unlocked);
  const previous = unlocked.slice(0, unlocked.length - 1);

  if (previous.length === 0) {
    list.innerHTML = `<p class="text-gray-400">Nenhuma rota anterior disponível.</p>`;
  } else {
    previous.forEach(route => {
      const btn = document.createElement("button");
      btn.className = "bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition";
      btn.innerText = `${route.name} — Inimigos: ${route.enemies}`;
      btn.onclick = () => {
        window.location.href = `battle-adventure-road.html?routeId=${route.id}`;
      };
      list.appendChild(btn);
    });
  }

  modal.classList.remove("hidden");
}

function closePreviousRoutesModal() {
  document.getElementById("previous-routes-modal").classList.add("hidden");
}

// === MAIN ===
document.addEventListener("DOMContentLoaded", () => {
  // document.getElementById("btn-back")?.addEventListener("click", () => "jornada.html");

  loadProgress();
  renderLatestUnlockedRoute();
  showUnlockBanner();

  // Novo: abre e fecha modal
  document.getElementById("btn-previous-routes")?.addEventListener("click", openPreviousRoutesModal);
  document.getElementById("close-modal")?.addEventListener("click", closePreviousRoutesModal);

  // Fechar modal ao clicar fora dele
  document.getElementById("previous-routes-modal").addEventListener("click", e => {
    if (e.target.id === "previous-routes-modal") closePreviousRoutesModal();
  });
});
