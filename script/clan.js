// ===== Mock de backend =====
const MOCK_CLAN = {
  id: "CLN-001",
  name: "Digital Tamers",
  tag: "#DTM",
  emblem: "./images/emblems/emblem1.png",
  description: "Um clã focado em coop, raids e evolução. Respeito acima de tudo!",
  motd: "Bem-vindos! Raid no sábado 20h. Não faltem!",
  level: 7,
  xp: { current: 14250, total: 20000 },
  members: [
    { id: "u1", name: "Rafael", role: "leader", level: 32, avatar: "./images/digimons/rookies/renamon.jpg", online: true, contribWeek: 850 },
    { id: "u2", name: "Agus", role: "officer", level: 28, avatar: "./images/digimons/rookies/agumon.jpg", online: false, contribWeek: 420 },
    { id: "u3", name: "Gabu", role: "member", level: 21, avatar: "./images/digimons/rookies/gabumon.jpg", online: true, contribWeek: 1200 },
    { id: "u4", name: "Mon", role: "member", level: 18, avatar: "./images/digimons/rookies/monmon.jpg", online: false, contribWeek: 10000 },
  ],
  capacity: 30,
  perks: [
    "+5% XP em batalhas",
    "+3% chance de drop",
    "Desconto 5% na loja do clã"
  ],
  weekly: { current: 1450, target: 5000, resetAt: "Dom 23:59" },
  activities: [
    { text: "Rafael doou 500 Bits", when: "há 2h" },
    { text: "Agus completou Missão Épica", when: "há 5h" },
    { text: "Novo membro: Gabu", when: "há 1d" },
  ],
  donations: [
    { who: "Rafael", what: "+500 Bits", when: "há 2h" },
    { who: "Agus", what: "+5 Cristais", when: "há 1d" },
  ],
  missions: [
    { id: "m1", title: "Coletar Dados Beta", desc: "Coletar 200 Dados Beta em áreas 2-3.", progress: { current: 120, total: 200 }, reward: "Cofre do Clã x1" },
    { id: "m2", title: "Vencer 10 Batalhas", desc: "Qualquer modo PVP.", progress: { current: 6, total: 10 }, reward: "Tickets x5" },
    { id: "m3", title: "Doações Semanais", desc: "Atingir 5.000 pontos de contribuição.", progress: { current: 1450, total: 5000 }, reward: "Buff +5% XP (48h)" },
  ],
  ranking: [
    { pos: 1, name: "Digital Tamers", score: 12540 },
    { pos: 2, name: "Royal Knights", score: 11890 },
    { pos: 3, name: "Data Breakers", score: 11020 },
  ],
  // O histórico "completo" do chat será preparado na inicialização (seed)
  chatHistory: [],
  // Loja agora só com preço em pontos de contribuição
  shop: [
    { id: "s1", name: "Ticket de Raid", img: "./images/items/ticket_raid.png", desc: "Acesso a raid semanal.", price: { contrib: 500 } },
    { id: "s2", name: "Cápsula de Energia", img: "./images/items/caps_energy.png", desc: "+50 de energia imediata.", price: { contrib: 200 } },
    { id: "s3", name: "Booster Épico", img: "./images/items/booster_epic.png", desc: "Aumenta drop por 2h.", price: { contrib: 800 } },
  ]
};

// Estado do jogador
let PLAYER = {
  id: "u_player",
  name: "Você",
  inClan: true,
  role: "member",
  wallet: {
    // agora a loja usa só estes pontos
    contributionPoints: 1800
  }
};

// ===== Helpers =====
function $(id) { return document.getElementById(id); }
function pct(p) { return Math.min(100, Math.round((p.current / p.total) * 100)); }
function setVisible(el, visible) { el.classList.toggle("hidden", !visible); }
function timeNow() {
  const d = new Date(); const hh = String(d.getHours()).padStart(2, "0"); const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
}

// ===== Seed do chat (gera histórico antigo p/ scroll-up) =====
function seedChatHistory() {
  // mensagens recentes (como se fossem as duas últimas)
  const base = [
    { userId: "u2", user: "Agus", text: "Bora raid sábado?", when: "19:02" },
    { userId: "u1", user: "Rafael", text: "Confirmado! 20h 🕗", when: "19:05" },
  ];
  // mensagens antigas simuladas
  const old = [];
  const users = [
    { id: "u1", name: "Rafael" },
    { id: "u2", name: "Agus" },
    { id: "u3", name: "Gabu" },
    { id: "u4", name: "Mon" },
  ];
  const samples = [
    "Bom dia, tamers!",
    "Alguém ajuda no boss mundial?",
    "Consegui um drop raro ontem 😎",
    "Treino às 18h?",
    "Dica: a fase 3 tá dando muito XP.",
    "Faltam 2 para raid! Quem topa?",
  ];
  // cria ~40 mensagens antigas
  for (let i = 0; i < 40; i++) {
    const u = users[i % users.length];
    const text = samples[i % samples.length];
    old.push({ userId: u.id, user: u.name, text, when: "18:" + String(10 + i).padStart(2, "0") });
  }
  MOCK_CLAN.chatHistory = old.concat(base); // antigas + recentes
}

// ===== Render (hero/overview/members/missions/donations/ranking) =====
function renderHero(c) {
  $("clan-emblem").src = c.emblem;
  $("clan-name").textContent = c.name;
  $("clan-tag").textContent = c.tag;
  $("clan-desc").textContent = c.description;

  $("clan-level").textContent = c.level;
  $("clan-members").textContent = `${c.members.length}/${c.capacity}`;
  $("clan-online").textContent = c.members.filter(m => m.online).length;

  const xpP = pct(c.xp);
  $("clan-xp-bar").style.width = xpP + "%";
  $("clan-xp-text").textContent = `${c.xp.current}/${c.xp.total} (${xpP}%)`;

  // visibilidade
  setVisible($("btn-join"), !PLAYER.inClan);
  setVisible($("btn-leave"), PLAYER.inClan);
  setVisible($("btn-invite"), PLAYER.inClan && (PLAYER.role === "leader" || PLAYER.role === "officer"));
  setVisible($("btn-donate"), PLAYER.inClan);

  // Se for líder e existir qualquer outro membro, bloqueia o "Sair"
  const leaveBtn = $("btn-leave");
  const hasOtherMembers = c.members.some(m => m.id !== PLAYER.id);
  const mustTransfer = PLAYER.inClan && PLAYER.role === "leader" && hasOtherMembers;

  leaveBtn.disabled = mustTransfer;
  leaveBtn.title = mustTransfer ? "Transfira a liderança para sair do clã" : "";
}

function renderOverview(c) {
  // MOTD & botão editar (mantém seu código atual) ...
  $("clan-motd").textContent = c.motd;
  $("motd-edit-wrap").classList.add("hidden");
  $("clan-motd").classList.remove("hidden");

  // Botão "Editar" só para líder
  const canEditMotd = PLAYER.role === "leader";
  setVisible($("btn-motd-edit"), canEditMotd);

  // --- BÔNUS / PERKS (mantém) ---
  const perks = $("clan-perks"); perks.innerHTML = "";
  c.perks.forEach(p => { const li = document.createElement("li"); li.textContent = p; perks.appendChild(li); });

  // --- PROGRESSO SEMANAL (NOVA LÓGICA) ---
  // soma de contribuições semanais informadas por membro
  const totalContrib = (c.members || []).reduce((sum, m) => sum + (m.contribWeek || 0), 0);

  // meta semanal total = meta definida pelo clã * número de membros
  const membersCount = Math.max(1, (c.members || []).length); // evita 0
  const weeklyTarget = Math.max(1, c.weekly?.target || 0);     // evita 0 / undefined
  const metaTotal = weeklyTarget * membersCount;

  // percentual seguro (0..100)
  const wP = Math.min(100, Math.round((totalContrib / metaTotal) * 100));
  $("weekly-bar").style.width = wP + "%";
  $("weekly-text").textContent = `${totalContrib}/${metaTotal} (${wP}%)`;
  $("weekly-reset").textContent = `Reseta: ${c.weekly?.resetAt || "-"}`;

  const feed = $("activity-feed"); feed.innerHTML = "";
  (c.activities || []).forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.text} — ${a.when}`;
    feed.appendChild(li);
  });
}

function renderMembers(c) {
  const list = $("members-list");
  const empty = $("members-empty");
  const q = $("member-search").value.trim().toLowerCase();
  const role = $("member-role").value;

  let data = c.members.slice();
  if (q) data = data.filter(m => m.name.toLowerCase().includes(q));
  if (role !== "all") data = data.filter(m => m.role === role);

  list.innerHTML = "";
  if (!data.length) { setVisible(empty, true); return; }
  setVisible(empty, false);

  data.forEach(m => {
    const weeklyTarget = Math.max(1, MOCK_CLAN.weekly?.target || 1); // evita divisão por zero
    const contribPct = Math.min(100, Math.round((m.contribWeek / weeklyTarget) * 100));
    const card = document.createElement("div");
    card.className = "member-card";
    card.innerHTML = `
    <img class="avatar" src="${m.avatar}" alt="${m.name}">
    <div class="min-w-0">
      <p class="member-name truncate">${m.name} <span class="badge">${m.role}</span></p>
      <p class="member-meta">Nível ${m.level} • Contrib. Semanal: ${m.contribWeek}</p>
  
      <div class="progress member-contrib mt-2">
        <div class="progress-fill green" style="width:${contribPct}%"></div>
        <div class="progress-text">+${m.contribWeek} / ${weeklyTarget} (${contribPct}%)</div>
      </div>
    </div>
    <div class="member-actions">
      <!-- seus botões aqui -->
    </div>
  `;
    list.appendChild(card);
  });

  if (window.feather) feather.replace();
}

function actionButtonsForMember(m) {
  const isLeader = PLAYER.role === "leader";
  const isOfficer = PLAYER.role === "officer";
  const isSelf = m.id === PLAYER.id;

  if (!PLAYER.inClan) return "";

  let actions = "";

  // ----- REGRAS -----
  // 1) NUNCA mostrar "Remover" para alvo líder
  // 2) NUNCA mostrar "Tornar Líder" no card do próprio jogador
  // 3) "Tornar Líder" só aparece se EU sou líder e o alvo NÃO é líder
  // 4) Officer pode gerenciar (promover/remover) apenas membros (não líderes nem oficiais)
  // 5) Líder pode promover/demover/remover qualquer um, EXCETO remover líder
  // -------------------

  const targetIsLeader = m.role === "leader";
  const targetIsOfficer = m.role === "officer";
  const targetIsMember = m.role === "member";

  // Perfil (qualquer um)
  // actions += `<button class="btn btn-ghost" data-act="profile" data-id="${m.id}">
  //               <i data-feather="user"></i><span>Perfil</span>
  //             </button>`;

  // Promover / Rebaixar
  if (isLeader || isOfficer) {
    // Officer só pode agir sobre Membros
    if (isOfficer && targetIsMember && !isSelf) {
      actions += `<button class="btn btn-outline" data-act="promote" data-id="${m.id}">
                    <i data-feather="arrow-up"></i><span>Promover</span>
                  </button>`;
      actions += `<button class="btn btn-danger" data-act="remove" data-id="${m.id}">
                    <i data-feather="user-x"></i><span>Remover</span>
                  </button>`;
    }

    // Líder pode promover membro a oficial e rebaixar oficial a membro
    if (isLeader && !isSelf) {
      if (targetIsMember) {
        actions += `<button class="btn btn-outline" data-act="promote" data-id="${m.id}">
                      <i data-feather="arrow-up"></i><span>Promover</span>
                    </button>`;
      }
      if (targetIsOfficer) {
        actions += `<button class="btn btn-outline" data-act="demote" data-id="${m.id}">
                      <i data-feather="arrow-down"></i><span>Rebaixar</span>
                    </button>`;
      }
    }
  }

  // Remover (nunca remover líder; ninguém remove a si mesmo)
  if (!targetIsLeader && !isSelf) {
    if (isLeader || (isOfficer && targetIsMember)) {
      actions += `<button class="btn btn-danger" data-act="remove" data-id="${m.id}">
                    <i data-feather="user-x"></i><span>Remover</span>
                  </button>`;
    }
  }

  // Tornar Líder (somente se EU sou líder, o alvo NÃO é líder e não sou eu)
  if (isLeader && !targetIsLeader && !isSelf) {
    actions += `<button class="btn btn-primary" data-act="makeLeader" data-id="${m.id}">
                  <i data-feather="star"></i><span>Tornar Líder</span>
                </button>`;
  }

  return actions;
}

function renderMissions(c) {
  const list = $("missions-list");
  const empty = $("missions-empty");
  list.innerHTML = "";
  if (!c.missions.length) { setVisible(empty, true); return; }
  setVisible(empty, false);

  c.missions.forEach(ms => {
    const p = pct(ms.progress);
    const el = document.createElement("div");
    el.className = "mission";
    el.innerHTML = `
      <p class="title">${ms.title}</p>
      <p class="meta">${ms.desc}</p>
      <div class="progress">
        <div class="progress-fill" style="width:${p}%"></div>
        <div class="progress-text">${ms.progress.current}/${ms.progress.total} (${p}%)</div>
      </div>
      <div class="flex items-center justify-between mt-1">
        <p class="meta">Recompensa: <span class="font-bold text-yellow-300">${ms.reward}</span></p>
        <button class="btn btn-primary" data-mission="${ms.id}"><i data-feather="check-circle"></i><span>Contribuir</span></button>
      </div>
    `;
    list.appendChild(el);
  });
  if (window.feather) feather.replace();
}

function renderDonations(c) {
  const log = $("donations-log");
  log.innerHTML = "";
  c.donations.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.who}: ${d.what} — ${d.when}`;
    log.appendChild(li);
  });
}

function renderRanking(c) {
  const list = $("ranking-list");
  const empty = $("ranking-empty");
  list.innerHTML = "";
  if (!c.ranking.length) { setVisible(empty, true); return; }
  setVisible(empty, false);

  c.ranking.forEach(item => {
    const row = document.createElement("div");
    row.className = "rank-item";
    row.innerHTML = `
      <div class="rank-badge">${item.pos}</div>
      <div class="min-w-0">
        <p class="font-bold truncate">${item.name}</p>
        <p class="text-gray-400 text-sm">Pontuação: ${item.score}</p>
      </div>
      <button class="btn btn-ghost"><i data-feather="info"></i><span>Detalhes</span></button>
    `;
    list.appendChild(row);
  });
  if (window.feather) feather.replace();
}

// ===== CHAT (com carregar mais ao rolar para cima) =====
let chatPageSize = 15;
let chatLoadedCount = 0;

function renderChat(c, opts = {}) {
  const list = $("chat-list");
  const participants = $("chat-participants");
  const online = c.members.filter(m => m.online).length;
  participants.textContent = `${online} online / ${c.members.length} membros`;

  const history = c.chatHistory;
  const start = Math.max(0, history.length - chatLoadedCount);
  const slice = history.slice(start); // últimas 'chatLoadedCount' mensagens

  // Render
  const prevScrollHeight = list.scrollHeight;
  const prevTop = list.scrollTop;

  list.innerHTML = "";
  slice.forEach(m => {
    const me = m.userId === PLAYER.id || m.user === PLAYER.name;
    const wrap = document.createElement("div");
    wrap.className = `msg ${me ? "you" : "them"}`;
    wrap.innerHTML = `
      <div class="meta">${m.user} • ${m.when}</div>
      <div>${escapeHtml(m.text)}</div>
    `;
    list.appendChild(wrap);
  });

  // auto-scroll bottom (entrada normal) ou preservar scroll (quando carregou mais)
  if (opts.preserveScroll) {
    const newHeight = list.scrollHeight;
    // mantém a âncora visual após inserir mensagens acima
    list.scrollTop = newHeight - (prevScrollHeight - prevTop);
  } else {
    list.scrollTop = list.scrollHeight;
  }
}

function initChatScroll() {
  const list = $("chat-list");
  list.addEventListener("scroll", () => {
    if (list.scrollTop <= 0 && chatLoadedCount < MOCK_CLAN.chatHistory.length) {
      // carrega mais um "page"
      chatLoadedCount = Math.min(chatLoadedCount + chatPageSize, MOCK_CLAN.chatHistory.length);
      renderChat(MOCK_CLAN, { preserveScroll: true });
    }
  });
}

function openChatTab() {
  // primeira abertura: define quantas mensagens exibir
  if (chatLoadedCount === 0) {
    chatLoadedCount = Math.min(chatPageSize, MOCK_CLAN.chatHistory.length);
  }
  renderChat(MOCK_CLAN);
}

function sendChatMessage() {
  const input = $("chat-text");
  const text = input.value.trim();
  if (!text) return;

  MOCK_CLAN.chatHistory.push({ userId: PLAYER.id, user: PLAYER.name, text, when: timeNow() });

  // se já mostramos todas as mensagens até o fim, mantemos “loaded” atualizado
  chatLoadedCount = Math.min(MOCK_CLAN.chatHistory.length, chatLoadedCount + 1);

  input.value = "";
  renderChat(MOCK_CLAN); // vai rolar para o fim
}

// ===== SHOP (usando pontos de contribuição) =====
function renderShop(c) {
  $("bal-contrib").textContent = `Contribuição: ${PLAYER.wallet.contributionPoints}`;

  const list = $("shop-list");
  const empty = $("shop-empty");
  list.innerHTML = "";
  if (!c.shop.length) { setVisible(empty, true); return; }
  setVisible(empty, false);

  c.shop.forEach(it => {
    const cost = it.price.contrib || 0;
    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <img src="${it.img}" alt="${it.name}">
      <div class="min-w-0">
        <p class="shop-title truncate">${it.name}</p>
        <p class="shop-meta">${it.desc}</p>
        <p class="shop-meta mt-1">
          Custo: <span class="price text-yellow-300">${cost} Pontos de Contribuição</span>
        </p>
      </div>
      <button class="btn btn-primary" data-buy="${it.id}">
        <i data-feather="shopping-cart"></i><span>Comprar</span>
      </button>
    `;
    list.appendChild(card);
  });
  if (window.feather) feather.replace();
}

function buyItem(itemId) {
  const it = MOCK_CLAN.shop.find(i => i.id === itemId);
  if (!it) return;

  const cost = it.price.contrib || 0;
  if (PLAYER.wallet.contributionPoints < cost) {
    alert("Pontos de contribuição insuficientes.");
    return;
  }

  PLAYER.wallet.contributionPoints -= cost;

  // registra no "histórico" como gasto de contribuição (aproveitando a lista de doações)
  MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: `-${cost} Pontos (Loja)`, when: "agora" });

  renderShop(MOCK_CLAN);
  renderDonations(MOCK_CLAN);
  alert(`Você comprou: ${it.name}`);
}

// ===== Ações simuladas =====
function donate(kind) {
  if (!PLAYER.inClan) return alert("Você precisa estar em um clã para doar.");
  let text = "";
  if (kind === "bits-100") text = "+100 Bits";
  if (kind === "bits-500") text = "+500 Bits";
  if (kind === "crystal-5") text = "+5 Cristais";
  MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: text, when: "agora" });
  MOCK_CLAN.weekly.current += kind.includes("bits") ? parseInt(kind.split("-")[1], 10) : 250;

  // NOVO: adiciona na contribuição semanal do jogador
  const me = MOCK_CLAN.members.find(m => m.id === PLAYER.id);
  if (me) me.contribWeek = (me.contribWeek || 0) + points;

  // Se ainda quiser manter o contador antigo, pode deixar a linha abaixo,
  // mas a barra da visão geral agora NÃO usa mais weekly.current para o cálculo:
  // MOCK_CLAN.weekly.current += points;
  
  renderOverview(MOCK_CLAN);
  renderDonations(MOCK_CLAN);
  alert("Obrigado pela doação!");
}

function handleMemberAction(act, id) {
  const idx = MOCK_CLAN.members.findIndex(m => m.id === id);
  if (idx === -1) return;
  const m = MOCK_CLAN.members[idx];

  if (act === "promote" && m.role === "member") {
    m.role = "officer"; alert(`${m.name} foi promovido a Oficial.`);
  }
  if (act === "demote" && m.role === "officer") {
    m.role = "member"; alert(`${m.name} foi rebaixado a Membro.`);
  }

  if (act === "remove") {
    // Ninguém remove líder
    if (m.role === "leader") {
      alert("Você não pode remover o líder do clã.");
      return;
    }
    if (confirm(`Remover ${m.name} do clã?`)) {
      MOCK_CLAN.members.splice(idx, 1);
      alert(`${m.name} removido.`);
    }
  }

  // NOVO: tornar líder
  if (act === "makeLeader") {
    // Apenas o líder pode transferir
    if (PLAYER.role !== "leader" || m.id === PLAYER.id) return;

    // Encontrar o líder atual (PLAYER) dentro da lista e rebaixá-lo a membro
    const meIdx = MOCK_CLAN.members.findIndex(x => x.id === PLAYER.id);
    if (meIdx !== -1) {
      MOCK_CLAN.members[meIdx].role = "member";
    }
    PLAYER.role = "member"; // << antigo líder agora é membro

    // Promover o alvo a líder
    m.role = "leader";

    alert(`${m.name} agora é o líder do clã.`);

    renderHero(MOCK_CLAN);
    renderMembers(MOCK_CLAN);
    return;
  }
}

function joinClan() {
  if (PLAYER.inClan) return;
  PLAYER.inClan = true;
  PLAYER.role = "member";
  MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
  renderHero(MOCK_CLAN);
  alert("Você entrou no clã!");
}

function leaveClan() {
  if (!PLAYER.inClan) return;

  const hasOtherMembers = MOCK_CLAN.members.some(m => m.id !== PLAYER.id);
  if (PLAYER.role === "leader" && hasOtherMembers) {
    alert("Você é o líder. Transfira a liderança para outro membro antes de sair do clã.");
    return;
  }

  if (!confirm("Tem certeza que deseja sair do clã?")) return;

  PLAYER.inClan = false;
  const idx = MOCK_CLAN.members.findIndex(m => m.id === PLAYER.id);
  if (idx !== -1) MOCK_CLAN.members.splice(idx, 1);
  renderHero(MOCK_CLAN);
  alert("Você saiu do clã.");
}

// ===== Tabs =====
function setTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  $("tab-overview").classList.toggle("hidden", tab !== "overview");
  $("tab-members").classList.toggle("hidden", tab !== "members");
  $("tab-missions").classList.toggle("hidden", tab !== "missions");
  $("tab-chat").classList.toggle("hidden", tab !== "chat");
  $("tab-shop").classList.toggle("hidden", tab !== "shop");
  $("tab-donations").classList.toggle("hidden", tab !== "donations");
  $("tab-ranking").classList.toggle("hidden", tab !== "ranking");
}

// ===== Wire =====
document.addEventListener("DOMContentLoaded", () => {
  // Seed do chat com histórico antigo
  seedChatHistory();

  // Header
  $("btn-back").addEventListener("click", () => window.location.href = "home.html");

  // Hero buttons
  $("btn-invite").addEventListener("click", () => alert("Convite enviado (simulação)."));
  $("btn-donate").addEventListener("click", () => setTab("donations"));
  $("btn-leave").addEventListener("click", leaveClan);
  $("btn-join").addEventListener("click", joinClan);

  // Tabs
  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => {
      const tab = t.dataset.tab;
      setTab(tab);
      if (tab === "chat") {
        if (chatLoadedCount === 0) openChatTab();
      }
      if (tab === "shop") renderShop(MOCK_CLAN);
    });
  });

  // Members filters
  $("member-search").addEventListener("input", () => renderMembers(MOCK_CLAN));
  $("member-role").addEventListener("change", () => renderMembers(MOCK_CLAN));

  // Donations quick actions + Missions + Members + Shop + Chat
  document.addEventListener("click", e => {
    const d = e.target.closest("[data-donate]");
    if (d) donate(d.getAttribute("data-donate"));

    const missionBtn = e.target.closest("[data-mission]");
    if (missionBtn) {
      const id = missionBtn.getAttribute("data-mission");
      alert(`Contribuição enviada para a missão ${id} (simulação).`);
    }

    const memberBtn = e.target.closest("[data-act]");
    if (memberBtn) handleMemberAction(memberBtn.getAttribute("data-act"), memberBtn.getAttribute("data-id"));

    const buyBtn = e.target.closest("[data-buy]");
    if (buyBtn) buyItem(buyBtn.getAttribute("data-buy"));
  });

  // ---- Edição do anúncio do líder (MOTD) ----
  $("btn-motd-edit").addEventListener("click", () => {
    $("motd-edit-wrap").classList.remove("hidden");
    $("clan-motd").classList.add("hidden");
    $("motd-textarea").value = MOCK_CLAN.motd || "";
  });

  $("btn-motd-cancel").addEventListener("click", () => {
    $("motd-edit-wrap").classList.add("hidden");
    $("clan-motd").classList.remove("hidden");
  });

  $("btn-motd-save").addEventListener("click", () => {
    const val = $("motd-textarea").value.trim();
    if (!val) { alert("O anúncio não pode ficar vazio."); return; }
    if (val.length > 240) { alert("O anúncio deve ter no máximo 240 caracteres."); return; }

    MOCK_CLAN.motd = val;
    // registra atividade
    MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} atualizou o anúncio do clã`, when: "agora" });

    renderOverview(MOCK_CLAN);
    alert("Anúncio atualizado!");
  });

  // Chat send + scroll infinito
  $("chat-send").addEventListener("click", sendChatMessage);
  $("chat-text").addEventListener("keydown", (e) => { if (e.key === "Enter") sendChatMessage(); });
  initChatScroll();

  // Inicializa seções base
  renderHero(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  renderMissions(MOCK_CLAN);
  renderDonations(MOCK_CLAN);
  renderRanking(MOCK_CLAN);

  if (window.feather) feather.replace();
});
