const ROUTES = [
  { 
    id: 1, name: "Rota 1", enemies: 3, unlocked: true,
    digimons: [
      { name: "Agumon", img: "https://digimon.shadowsmith.com/img/agumon.jpg", level: [1, 3], atk: [5, 10], def: [2, 5], spd: [3, 6], hp: [50, 80] },
      { name: "Gabumon", img: "https://digimon.shadowsmith.com/img/gabumon.jpg", level: [1, 3], atk: [6, 11], def: [3, 6], spd: [4, 7], hp: [55, 85] }
    ],
    boss: { name: "Greymon", img: "https://digimon.shadowsmith.com/img/greymon.jpg", level: [5, 6], atk: [15, 20], def: [8, 12], spd: [7, 10], hp: [120, 150] }
  },
  { 
    id: 2, name: "Rota 2", enemies: 4, unlocked: false,
    digimons: [
      { name: "Patamon", img: "https://digimon.shadowsmith.com/img/patamon.jpg", level: [2, 4], atk: [8, 14], def: [4, 7], spd: [5, 8], hp: [70, 100] },
      { name: "Tentomon", img: "https://digimon.shadowsmith.com/img/tentomon.jpg", level: [2, 4], atk: [9, 13], def: [5, 8], spd: [4, 9], hp: [75, 110] }
    ],
    boss: { name: "Kabuterimon", img: "https://digimon.shadowsmith.com/img/kabuterimon.jpg", level: [6, 7], atk: [18, 24], def: [10, 15], spd: [7, 11], hp: [140, 170] }
  },
  { 
    id: 3, name: "Rota 3", enemies: 5, unlocked: false,
    digimons: [
      { name: "Biyomon", img: "https://digimon.shadowsmith.com/img/biyomon.jpg", level: [3, 5], atk: [10, 16], def: [4, 7], spd: [6, 9], hp: [80, 120] },
      { name: "Palmon", img: "https://digimon.shadowsmith.com/img/palmon.jpg", level: [3, 5], atk: [9, 15], def: [5, 8], spd: [5, 8], hp: [85, 125] }
    ],
    boss: { name: "Devimon", img: "https://digimon.shadowsmith.com/img/devimon.jpg", level: [7, 8], atk: [20, 26], def: [12, 16], spd: [9, 12], hp: [160, 200] }
  },
  { 
    id: 4, name: "Rota 4", enemies: 6, unlocked: false,
    digimons: [
      { name: "Elecmon", img: "https://digimon.shadowsmith.com/img/elecmon.jpg", level: [4, 6], atk: [12, 18], def: [6, 9], spd: [6, 10], hp: [100, 140] },
      { name: "Gomamon", img: "https://digimon.shadowsmith.com/img/gomamon.jpg", level: [4, 6], atk: [11, 17], def: [7, 10], spd: [6, 9], hp: [95, 135] }
    ],
    boss: { name: "Ogremon", img: "https://digimon.shadowsmith.com/img/ogremon.jpg", level: [8, 9], atk: [22, 28], def: [13, 17], spd: [8, 12], hp: [180, 220] }
  },
  { 
    id: 5, name: "Rota 5", enemies: 7, unlocked: false,
    digimons: [
      { name: "Palmon", img: "https://digimon.shadowsmith.com/img/palmon.jpg", level: [5, 7], atk: [13, 19], def: [7, 10], spd: [7, 10], hp: [110, 150] },
      { name: "Biyomon", img: "https://digimon.shadowsmith.com/img/biyomon.jpg", level: [5, 7], atk: [14, 20], def: [8, 11], spd: [8, 11], hp: [115, 155] }
    ],
    boss: { name: "Leomon", img: "https://digimon.shadowsmith.com/img/leomon.jpg", level: [9, 10], atk: [24, 30], def: [14, 18], spd: [10, 13], hp: [200, 240] }
  },
  { 
    id: 6, name: "Rota 6", enemies: 8, unlocked: false,
    digimons: [
      { name: "Gizamon", img: "https://digimon.shadowsmith.com/img/gizamon.jpg", level: [6, 8], atk: [15, 21], def: [9, 12], spd: [8, 11], hp: [120, 160] },
      { name: "Unimon", img: "https://digimon.shadowsmith.com/img/unimon.jpg", level: [6, 8], atk: [16, 22], def: [10, 13], spd: [9, 12], hp: [125, 165] }
    ],
    boss: { name: "Etemon", img: "https://digimon.shadowsmith.com/img/etemon.jpg", level: [10, 11], atk: [26, 32], def: [15, 19], spd: [11, 14], hp: [220, 260] }
  },
  { 
    id: 7, name: "Rota 7", enemies: 9, unlocked: false,
    digimons: [
      { name: "Seadramon", img: "https://digimon.shadowsmith.com/img/seadramon.jpg", level: [7, 9], atk: [18, 24], def: [10, 14], spd: [9, 12], hp: [140, 180] },
      { name: "Andromon", img: "https://digimon.shadowsmith.com/img/andromon.jpg", level: [7, 9], atk: [19, 25], def: [11, 15], spd: [10, 13], hp: [145, 185] }
    ],
    boss: { name: "Myotismon", img: "https://digimon.shadowsmith.com/img/myotismon.jpg", level: [11, 12], atk: [28, 35], def: [16, 20], spd: [12, 15], hp: [240, 280] }
  },
  { 
    id: 8, name: "Rota 8", enemies: 10, unlocked: false,
    digimons: [
      { name: "Bakemon", img: "https://digimon.shadowsmith.com/img/bakemon.jpg", level: [8, 10], atk: [20, 26], def: [11, 15], spd: [11, 14], hp: [160, 200] },
      { name: "Dokugumon", img: "https://digimon.shadowsmith.com/img/dokugumon.jpg", level: [8, 10], atk: [21, 27], def: [12, 16], spd: [12, 15], hp: [165, 205] }
    ],
    boss: { name: "Piedmon", img: "https://digimon.shadowsmith.com/img/piedmon.jpg", level: [12, 13], atk: [32, 38], def: [18, 22], spd: [14, 17], hp: [260, 300] }
  }
];

let defeatedCount = 0; 
let fightingBoss = false;

// Funções de utilidade
function randRange(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRouteId() { return parseInt(new URLSearchParams(window.location.search).get("routeId"), 10); }

function saveProgress() { localStorage.setItem("adventureRoutes", JSON.stringify(ROUTES)); }
function loadProgress() {
  const data = localStorage.getItem("adventureRoutes");
  if (data) {
    const saved = JSON.parse(data);
    saved.forEach((r, i) => { if (ROUTES[i]) ROUTES[i].unlocked = r.unlocked; });
  }
}

// HUD do contador
function renderEnemyCounter(route) {
  const counterText = document.getElementById("enemy-counter-text");
  if (!fightingBoss) counterText.innerText = `Inimigos derrotados: ${defeatedCount} / ${route.enemies}`;
  else counterText.innerText = `⚔️ BOSS: ${route.boss.name}`;
  document.getElementById("enemy-counter").classList.remove("hidden");
}

// Render inimigo
function renderDigimon(digi) {
  const level = randRange(...digi.level), atk = randRange(...digi.atk), def = randRange(...digi.def),
        spd = randRange(...digi.spd), hp = randRange(...digi.hp);

  document.getElementById("digimon-img").src = digi.img;
  document.getElementById("digimon-name").innerText = digi.name;
  document.getElementById("digimon-level").innerText = `Nível: ${level}`;
  document.getElementById("hud-hp-text").innerText = `${hp} / ${digi.hp[1]}`;
  document.getElementById("hud-hp-bar").style.width = `${Math.round((hp/digi.hp[1])*100)}%`;
  document.getElementById("attr-atk").innerText = atk;
  document.getElementById("attr-def").innerText = def;
  document.getElementById("attr-spd").innerText = spd;

  const card = document.getElementById("digimon-card");
  card.classList.remove("hidden");
  void card.offsetWidth;
  card.classList.remove("opacity-0","translate-y-6");
  setTimeout(() => { card.classList.add("shake"); card.addEventListener("animationend",()=>card.classList.remove("shake"),{once:true}); },500);
}

// Main
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-back")?.addEventListener("click", () => window.location.href="adventure-road.html");
  loadProgress();

  const routeId = getRouteId(), routeIndex = ROUTES.findIndex(r=>r.id===routeId), route = ROUTES[routeIndex];
  if (!route) { document.getElementById("digimon-name").innerText="Rota inválida!"; return; }

  renderEnemyCounter(route);
  renderDigimon(route.digimons[Math.floor(Math.random()*route.digimons.length)]);
  document.getElementById("battle-actions").classList.remove("hidden");

  document.getElementById("btn-attack").addEventListener("click", () => {
    if (fightingBoss) {
      alert(`🔥 Você derrotou o Boss ${route.boss.name}! Rota concluída!`);
      if (ROUTES[routeIndex+1]) {
        ROUTES[routeIndex+1].unlocked = true;
        localStorage.setItem("lastUnlockedRoute", ROUTES[routeIndex+1].name);
        saveProgress();
      }
      window.location.href="adventure-road.html";
      return;
    }
    defeatedCount++;
    renderEnemyCounter(route);
    if (defeatedCount < route.enemies) renderDigimon(route.digimons[Math.floor(Math.random()*route.digimons.length)]);
    else { fightingBoss = true; renderEnemyCounter(route); renderDigimon(route.boss); }
  });

  document.getElementById("btn-defend").addEventListener("click",()=>alert("Você se defendeu!"));
  document.getElementById("btn-run").addEventListener("click",()=>{ alert("Você fugiu da batalha!"); window.location.href="adventure-road.html"; });
});
