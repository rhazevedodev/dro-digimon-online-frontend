// ===== Mock de backend =====

const MOCK_CLAN = {
  id: "CLN-001",
  name: "Digital Tamers",
  tag: "#DTM",
  emblem: "./images/emblems/emblem1.png",
  description: "Um clã focado em coop, raids e evolução. Respeito acima de tudo!",
  motd: "Bem-vindos! Raid no sábado 20h. Não faltem!",
  level: 10,
  maxLevel: 10,
  xp: { current: 14250, total: 20000 },
  members: [
    { id: "u1", name: "Rafael", role: "leader", level: 32, avatar: "./images/digimons/rookies/renamon.jpg", online: true, contribWeek: 850 },
    { id: "u2", name: "Agus", role: "officer", level: 28, avatar: "./images/digimons/rookies/agumon.jpg", online: false, contribWeek: 420 },
    { id: "u3", name: "Gabu", role: "member", level: 21, avatar: "./images/digimons/rookies/gabumon.jpg", online: true, contribWeek: 1200 },
    { id: "u4", name: "Mon", role: "member", level: 18, avatar: "./images/digimons/rookies/monmon.jpg", online: false, contribWeek: 20000 },
  ],
  capacity: 30,
  perks: [
    "+5% XP em batalhas",
    "+3% chance de drop",
    "Desconto 5% na loja do clã"
  ],
  weekly: { current: 0, target: 5000, resetAt: "Dom 23:59", claimed: false },
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
    { id: "m1", title: "Coletar Dados Beta", desc: "Coletar 200 Dados Beta em áreas 2-3.", progress: { current: 300, total: 200 }, reward: { contrib: 300 } },
    { id: "m2", title: "Vencer 10 Batalhas", desc: "Qualquer modo PVP.", progress: { current: 6, total: 10 }, reward: { contrib: 500 } },
    { id: "m3", title: "Doações Semanais", desc: "Atingir 5.000 pontos de contribuição.", progress: { current: 1450, total: 5000 }, reward: { contrib: 1000 } },
  ],
  ranking: [
    { pos: 1, name: "Digital Tamers", score: 12540 },
    { pos: 2, name: "Royal Knights", score: 11890 },
    { pos: 3, name: "Data Breakers", score: 11020 },
  ],
  chatHistory: [],
  shop: [
    { id: "s1", name: "Ticket de Raid", img: "./images/items/ticket_raid.png", desc: "Acesso a raid semanal.", price: { contrib: 500 } },
    { id: "s2", name: "Cápsula de Energia", img: "./images/items/caps_energy.png", desc: "+50 de energia imediata.", price: { contrib: 200 } },
    { id: "s3", name: "Booster Épico", img: "./images/items/booster_epic.png", desc: "Aumenta drop por 2h.", price: { contrib: 800 } },
  ],// Configurações do clã (padrões)
  settings: {
    minJoinLevel: 10,          // nível mínimo para entrar
    recruitment: "invite",     // "open" | "closed" | "invite"
    requireApproval: true,     // exige aprovação manual
    region: "BR",              // opcional: região/servidor
    notes: ""                  // observações internas do clã
  },
  joinRequests: [
    { id: "rq1", name: "Kari", level: 12, avatar: "./images/digimons/rookies/patamon.jpg", note: "Quero jogar com amigos 😄", when: "há 10m" },
    { id: "rq2", name: "TK", level: 8, avatar: "./images/digimons/rookies/gomamon.jpg", note: "Sou ativo todo dia", when: "há 1h" }
  ],
};

// ===== Estado do jogador =====
let PLAYER = {
  id: "u_player",
  name: "Você",
  inClan: true,
  role: "leader",
  wallet: {
    contributionPoints: 1800
  }
};

// Missões pré-definidas por nível (exemplo até nível 10)
const MISSION_CATALOG = [
  { id: "mL1", reqLevel: 1, title: "Boas-vindas ao Clã", desc: "Apresente-se no chat do clã.", progress: { current: 0, total: 1 }, reward: { contrib: 100 } },
  { id: "mL2", reqLevel: 2, title: "Coleta Inicial", desc: "Coletar 50 Dados Beta.", progress: { current: 0, total: 50 }, reward: { contrib: 150 } },
  { id: "mL3", reqLevel: 3, title: "Treino em Equipe", desc: "Vencer 5 batalhas em grupo.", progress: { current: 0, total: 5 }, reward: { contrib: 250 } },
  { id: "mL4", reqLevel: 4, title: "Sentinela das Raids", desc: "Participar de 1 raid semanal.", progress: { current: 0, total: 1 }, reward: { contrib: 350 } },
  { id: "mL5", reqLevel: 5, title: "Expansão do Clã", desc: "Convidar 2 novos membros (aprovados).", progress: { current: 0, total: 2 }, reward: { contrib: 500 } },
  { id: "mL6", reqLevel: 6, title: "Aprimorar Estratégias", desc: "Compartilhar 3 dicas úteis no chat.", progress: { current: 0, total: 3 }, reward: { contrib: 300 } },
  { id: "mL7", reqLevel: 7, title: "Forja de Recursos", desc: "Doar 2.000 pontos de contribuição ao total.", progress: { current: 0, total: 2000 }, reward: { contrib: 700 } },
  { id: "mL8", reqLevel: 8, title: "Coordenação Avançada", desc: "Completar 3 missões épicas em grupo.", progress: { current: 0, total: 3 }, reward: { contrib: 900 } },
  { id: "mL9", reqLevel: 9, title: "Domínio de Campo", desc: "Vencer 10 partidas PVP como clã.", progress: { current: 0, total: 10 }, reward: { contrib: 1200 } },
  { id: "mL10", reqLevel: 10, title: "Elite do Servidor", desc: "Ficar no Top 3 do ranking semanal.", progress: { current: 0, total: 1 }, reward: { contrib: 1500 } },
];

function syncMissionsFromCatalog(c) {
  if (!Array.isArray(c.missions)) c.missions = [];

  // Apenas missões liberadas (reqLevel <= nível atual)
  const allowed = MISSION_CATALOG.filter(m => (m.reqLevel ?? 1) <= (c.level ?? 1));
  const prev = new Map(c.missions.map(m => [m.id, m]));

  const next = allowed.map(src => {
    const old = prev.get(src.id);
    return {
      id: src.id,
      reqLevel: src.reqLevel,
      title: src.title,
      desc: src.desc,
      reward: { ...(src.reward || {}) },
      progress: old?.progress ? { ...old.progress } : { ...src.progress },
      completed: !!old?.completed
    };
  });

  // Ordena: não concluídas primeiro, depois por reqLevel e título
  next.sort((a, b) => {
    const ac = a.completed ? 1 : 0, bc = b.completed ? 1 : 0;
    if (ac !== bc) return ac - bc;
    const ar = a.reqLevel ?? 1, br = b.reqLevel ?? 1;
    if (ar !== br) return ar - br;
    return a.title.localeCompare(b.title);
  });

  c.missions = next;
}

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

// ===== Seed do chat =====
function seedChatHistory() {
  const base = [
    { userId: "u2", user: "Agus", text: "Bora raid sábado?", when: "19:02" },
    { userId: "u1", user: "Rafael", text: "Confirmado! 20h 🕗", when: "19:05" },
  ];
  const old = [];
  const users = [
    { id: "u1", name: "Rafael" },
    { id: "u2", name: "Agus" },
    { id: "u3", name: "Gabu" },
    { id: "u4", name: "Mon" },
  ];
  const samples = [
    "Bom dia, tamers!", "Alguém ajuda no boss mundial?", "Consegui um drop raro ontem 😎",
    "Treino às 18h?", "Dica: a fase 3 tá dando muito XP.", "Faltam 2 para raid! Quem topa?",
  ];
  for (let i = 0; i < 40; i++) {
    const u = users[i % users.length];
    const text = samples[i % samples.length];
    old.push({ userId: u.id, user: u.name, text, when: "18:" + String(10 + i).padStart(2, "0") });
  }
  MOCK_CLAN.chatHistory = old.concat(base);
}

// ===== Renderizações =====
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

  // ====== VISIBILIDADE / ESTADO DOS BOTÕES ======
  const inClan = !!PLAYER.inClan;

  // Descobre meu papel olhando a lista (fonte de verdade da UI)
  const selfMember = c.members.find(x => x.id === PLAYER.id);
  const myRole = selfMember ? selfMember.role : PLAYER.role; // fallback

  // JOIN: só mostra se NÃO estiver em clã
  const btnJoin = $("btn-join");
  if (btnJoin) {
    btnJoin.classList.toggle("hidden", inClan);
    btnJoin.disabled = inClan;
  }

  // LEAVE: só mostra se estiver em clã; só bloqueia se AINDA for líder E houver outros membros
  const btnLeave = $("btn-leave");
  if (btnLeave) {
    btnLeave.classList.toggle("hidden", !inClan);
    const hasOtherMembers = c.members.some(m => m.id !== PLAYER.id);
    const mustTransfer = inClan && myRole === "leader" && hasOtherMembers;
    btnLeave.disabled = !!mustTransfer;
    btnLeave.title = mustTransfer ? "Transfira a liderança para sair do clã" : "";
  }

  // INVITE: em clã e (líder ou oficial)
  const btnInvite = $("btn-invite");
  if (btnInvite) {
    const canInvite = inClan && (myRole === "leader" || myRole === "officer");
    btnInvite.classList.toggle("hidden", !canInvite);
    btnInvite.disabled = !canInvite;
  }

  // DONATE: em clã e existir painel de doações
  const btnDonate = $("btn-donate");
  if (btnDonate) {
    const hasDonationsTab = !!$("tab-donations");
    const canDonate = inClan && hasDonationsTab;
    btnDonate.classList.toggle("hidden", !canDonate);
    btnDonate.disabled = !canDonate;
  }

  // Exibir aba "Pedidos" apenas para líder/oficial e quando fizer sentido
  const requestsTabBtn = $("tabbtn-requests");
  const shouldShowRequests =
    (PLAYER.inClan) &&
    ((PLAYER.role === "leader" || PLAYER.role === "officer")) &&
    ((c.settings?.recruitment === "invite") || (c.settings?.requireApproval === true));

  if (requestsTabBtn) {
    requestsTabBtn.classList.toggle("hidden", !shouldShowRequests);
    // badge com contagem
    const badge = $("badge-requests");
    if (badge) {
      const n = (c.joinRequests || []).length;
      badge.textContent = String(n);
      badge.classList.toggle("hidden", n === 0);
    }
  }
}

function renderRequests(c) {
  const list = $("requests-list");
  const empty = $("requests-empty");
  if (!list || !empty) return;

  const items = c.joinRequests || [];
  list.innerHTML = "";

  if (!items.length) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
  }

  items.forEach(req => {
    const card = document.createElement("div");
    card.className = "request-card flex flex-col sm:flex-row sm:items-center items-stretch gap-3 p-3 rounded bg-gray-800";

    card.innerHTML = `
    <div class="flex items-center gap-3">
      <img src="${req.avatar}" alt="${req.name}" class="w-12 h-12 rounded object-cover flex-shrink-0">
      <div class="min-w-0">
        <p class="font-semibold truncate">${req.name} <span class="text-xs text-gray-300">nível ${req.level}</span></p>
        <p class="text-sm text-gray-400 truncate">${req.note || ""}</p>
        <p class="text-xs text-gray-500">${req.when || "-"}</p>
      </div>
    </div>
  
    <div class="actions grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">
      <button class="btn btn-ghost w-full sm:w-auto" data-profile="${req.id}">
        <i data-feather="user"></i><span>Perfil</span>
      </button>
      <button class="btn btn-primary w-full sm:w-auto" data-approve="${req.id}">
        <i data-feather="check"></i><span>Aprovar</span>
      </button>
      <button class="btn btn-danger col-span-2 sm:col-span-1 w-full sm:w-auto" data-deny="${req.id}">
        <i data-feather="x"></i><span>Negar</span>
      </button>
    </div>
  `;
    list.appendChild(card);
  });

  // Atualiza badge no botão da aba
  const badge = $("badge-requests");
  if (badge) {
    const n = items.length;
    badge.textContent = String(n);
    badge.classList.toggle("hidden", n === 0);
  }

  if (window.feather) feather.replace();
}

function approveRequest(reqId) {
  // Somente líder ou oficial
  const myMember = MOCK_CLAN.members.find(x => x.id === PLAYER.id);
  const myRole = myMember ? myMember.role : PLAYER.role;
  if (!(PLAYER.inClan && (myRole === "leader" || myRole === "officer"))) {
    alert("Apenas Líder ou Oficial podem aprovar pedidos.");
    return;
  }

  const idx = (MOCK_CLAN.joinRequests || []).findIndex(r => r.id === reqId);
  if (idx === -1) return;

  const req = MOCK_CLAN.joinRequests[idx];

  // Regras: nível mínimo e capacidade
  const minLv = MOCK_CLAN.settings?.minJoinLevel ?? 1;
  if (req.level < minLv) {
    alert(`Nível mínimo para entrar é ${minLv}.`);
    return;
  }
  if (MOCK_CLAN.members.length >= MOCK_CLAN.capacity) {
    alert("Capacidade do clã atingida. Aumente a capacidade ou remova membros.");
    return;
  }

  // Aprova: entra como membro
  MOCK_CLAN.members.push({
    id: `m_${Date.now()}`, // id fake de mock
    name: req.name,
    role: "member",
    level: req.level,
    avatar: req.avatar,
    online: false,
    contribWeek: 0
  });

  // Remove da fila
  MOCK_CLAN.joinRequests.splice(idx, 1);

  // Log de atividade
  MOCK_CLAN.activities.unshift({ text: `${req.name} entrou no clã (aprovado)`, when: "agora" });

  // Re-render
  renderHero(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  renderRequests(MOCK_CLAN);
  alert(`${req.name} foi aprovado(a).`);
}

function denyRequest(reqId) {
  const myMember = MOCK_CLAN.members.find(x => x.id === PLAYER.id);
  const myRole = myMember ? myMember.role : PLAYER.role;
  if (!(PLAYER.inClan && (myRole === "leader" || myRole === "officer"))) {
    alert("Apenas Líder ou Oficial podem negar pedidos.");
    return;
  }

  const idx = (MOCK_CLAN.joinRequests || []).findIndex(r => r.id === reqId);
  if (idx === -1) return;

  const req = MOCK_CLAN.joinRequests[idx];
  MOCK_CLAN.joinRequests.splice(idx, 1);
  MOCK_CLAN.activities.unshift({ text: `Pedido de ${req.name} foi negado`, when: "agora" });

  renderRequests(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
}

function renderOverview(c) {
  $("clan-motd").textContent = c.motd;
  $("motd-edit-wrap").classList.add("hidden");
  $("clan-motd").classList.remove("hidden");

  const canEditMotd = PLAYER.role === "leader";
  setVisible($("btn-motd-edit"), canEditMotd);

  const perks = $("clan-perks"); perks.innerHTML = "";
  c.perks.forEach(p => { const li = document.createElement("li"); li.textContent = p; perks.appendChild(li); });

  // --- PROGRESSO SEMANAL (cálculo por soma / (meta * membros)) ---
  const totalContrib = (c.members || []).reduce((sum, m) => sum + (m.contribWeek || 0), 0);
  const membersCount = Math.max(1, (c.members || []).length);
  const weeklyTarget = Math.max(1, c.weekly?.target || 0);
  const metaTotal = weeklyTarget * membersCount;

  const wP = Math.min(100, Math.round((totalContrib / metaTotal) * 100));
  $("weekly-bar").style.width = wP + "%";
  $("weekly-text").textContent = `${totalContrib}/${metaTotal} (${wP}%)`;
  $("weekly-reset").textContent = `Reseta: ${c.weekly?.resetAt || "-"}`;

  // ---------- Estados do botão de resgate ----------
  const btnClaim = $("btn-weekly-claim");
  const isLeader = PLAYER.role === "leader";
  const reached = totalContrib >= metaTotal;
  const claimed = !!c.weekly?.claimed;

  // mostra o botão só para líder (como antes)
  setVisible(btnClaim, isLeader);

  // define estado/label do botão
  if (isLeader) {
    if (claimed) {
      btnClaim.disabled = true;
      btnClaim.innerHTML = `<i data-feather="check"></i><span>Recompensa resgatada</span>`;
    } else if (reached) {
      btnClaim.disabled = false;
      btnClaim.innerHTML = `<i data-feather="gift"></i><span>Resgatar Recompensa Semanal</span>`;
    } else {
      btnClaim.disabled = true;
      btnClaim.innerHTML = `<i data-feather="gift"></i><span>Meta não atingida</span>`;
    }
    if (window.feather) feather.replace(); // re-render ícones após trocar innerHTML
  }

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
    const weeklyTarget = Math.max(1, MOCK_CLAN.weekly?.target || 1);
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
      <div class="member-actions"></div>
    `;
    card.querySelector(".member-actions").innerHTML = actionButtonsForMember(m);
    list.appendChild(card);
  });

  if (window.feather) feather.replace();
}

function actionButtonsForMember(m) {
  // Descobre meu papel olhando a lista (fonte da UI)
  const selfMember = MOCK_CLAN.members.find(x => x.id === PLAYER.id);
  const myRole = selfMember ? selfMember.role : PLAYER.role; // fallback
  const isLeader = myRole === "leader";
  const isOfficer = myRole === "officer";
  const isSelf = m.id === PLAYER.id;

  if (!PLAYER.inClan) return "";

  let actions = "";
  const targetIsLeader = m.role === "leader";
  const targetIsOfficer = m.role === "officer";
  const targetIsMember = m.role === "member";

  if (isOfficer && targetIsMember && !isSelf) {
    actions += `<button class="btn btn-outline" data-act="promote" data-id="${m.id}">
                  <i data-feather="arrow-up"></i><span>Promover</span>
                </button>`;
    actions += `<button class="btn btn-danger" data-act="remove" data-id="${m.id}">
                  <i data-feather="user-x"></i><span>Remover</span>
                </button>`;
  }

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
    if (!targetIsLeader) {
      actions += `<button class="btn btn-danger" data-act="remove" data-id="${m.id}">
                    <i data-feather="user-x"></i><span>Remover</span>
                  </button>`;
    }
  }

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
    const reached = (ms.progress?.current ?? 0) >= (ms.progress?.total ?? 0);
    const isCompleted = !!ms.completed;

    // Label/ícone
    const btnLabel = isCompleted ? "Concluída" : "Finalizar";
    const btnIcon = isCompleted ? "check" : "flag";

    // Classes: concluída (verde, disabled) | pronta p/ finalizar (primária) | em progresso (disabled)
    const baseBtn = "btn w-full mt-3";
    const clsDone = "opacity-80 cursor-not-allowed bg-green-600 hover:bg-green-600 border-green-600";
    const clsReady = "btn-primary";
    const clsWip = "opacity-50 cursor-not-allowed";

    let btnClass = baseBtn;
    let btnDisabledAttr = "";

    if (isCompleted) {
      btnClass += " " + clsDone;
      btnDisabledAttr = "disabled";
    } else if (reached) {
      btnClass += " " + clsReady;
      // habilitado para clicar
    } else {
      btnClass += " " + clsWip;
      btnDisabledAttr = "disabled";
    }

    const p = pct(ms.progress);
    const el = document.createElement("div");
    el.className = "mission";
    el.innerHTML = `
  <p class="title">${ms.title}</p>
  <p class="meta">${ms.desc}</p>

  <div class="progress mt-2">
    <div class="progress-fill" style="width:${p}%"></div>
    <div class="progress-text">${ms.progress.current}/${ms.progress.total} (${p}%)</div>
  </div>

  <div class="mt-3">
    <p class="meta">Recompensa:
      <span class="font-bold text-yellow-300">
        ${ms.reward?.contrib || 0} Pontos de Contribuição
      </span>
    </p>

    <button class="${btnClass}" data-mission="${ms.id}" ${btnDisabledAttr}>
      <i data-feather="${btnIcon}"></i><span>${btnLabel}</span>
    </button>
  </div>
`;
    list.appendChild(el);
  });
  if (window.feather) feather.replace();
}

// function renderDonations(c) {
//   const log = $("donations-log");
//   log.innerHTML = "";
//   c.donations.forEach(d => {
//     const li = document.createElement("li");
//     li.textContent = `${d.who}: ${d.what} — ${d.when}`;
//     log.appendChild(li);
//   });
// }

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

// ===== CHAT =====
let chatPageSize = 15;
let chatLoadedCount = 0;

function renderChat(c, opts = {}) {
  const list = $("chat-list");
  const participants = $("chat-participants");
  const online = c.members.filter(m => m.online).length;
  participants.textContent = `${online} online / ${c.members.length} membros`;

  const history = c.chatHistory;
  const start = Math.max(0, history.length - chatLoadedCount);
  const slice = history.slice(start);

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

  if (opts.preserveScroll) {
    const newHeight = list.scrollHeight;
    list.scrollTop = newHeight - (prevScrollHeight - prevTop);
  } else {
    list.scrollTop = list.scrollHeight;
  }
}

function initChatScroll() {
  const list = $("chat-list");
  list.addEventListener("scroll", () => {
    if (list.scrollTop <= 0 && chatLoadedCount < MOCK_CLAN.chatHistory.length) {
      chatLoadedCount = Math.min(chatLoadedCount + chatPageSize, MOCK_CLAN.chatHistory.length);
      renderChat(MOCK_CLAN, { preserveScroll: true });
    }
  });
}

function openChatTab() {
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
  chatLoadedCount = Math.min(MOCK_CLAN.chatHistory.length, chatLoadedCount + 1);

  input.value = "";
  renderChat(MOCK_CLAN);
}

function renderSettings(c) {
  // Protege caso o bloco não exista
  c.settings = c.settings || {
    minJoinLevel: 1,
    recruitment: "invite",
    requireApproval: true,
    region: "BR",
    notes: ""
  };

  // Inputs
  $("set-weekly-target").value = c.weekly?.target ?? 5000;
  $("set-min-level").value = c.settings.minJoinLevel ?? 1;

  // Radios recruitment
  const recruitment = c.settings.recruitment || "invite";
  document.querySelectorAll('input[name="recruitment"]').forEach(r => {
    r.checked = (r.value === recruitment);
  });

  // Check e extras
  $("set-require-approval").checked = !!c.settings.requireApproval;
  $("set-region").value = c.settings.region || "";
  $("set-notes").value = c.settings.notes || "";

  if (window.feather) feather.replace();
}

function saveSettings() {
  if (PLAYER.role !== "leader" && PLAYER.role !== "officer") {
    alert("Apenas Líder ou Oficiais podem alterar configurações.");
    return;
  }

  // Leitura
  const weeklyTarget = parseInt($("set-weekly-target").value, 10);
  const minLv = parseInt($("set-min-level").value, 10);
  const recRadio = document.querySelector('input[name="recruitment"]:checked');
  const recruitment = recRadio ? recRadio.value : "invite";
  const requireApproval = $("set-require-approval").checked;
  const region = $("set-region").value.trim();
  const notes = $("set-notes").value.trim();

  // Validações simples
  if (!Number.isFinite(weeklyTarget) || weeklyTarget < 1) {
    return alert("Informe uma meta semanal válida (>= 1).");
  }
  if (!Number.isFinite(minLv) || minLv < 1) {
    return alert("Informe um nível mínimo válido (>= 1).");
  }

  // Persistência no mock
  MOCK_CLAN.weekly.target = weeklyTarget;
  MOCK_CLAN.settings.minJoinLevel = minLv;
  MOCK_CLAN.settings.recruitment = recruitment;
  MOCK_CLAN.settings.requireApproval = requireApproval;
  MOCK_CLAN.settings.region = region;
  MOCK_CLAN.settings.notes = notes;

  // Log de atividade
  MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} atualizou as configurações do clã`, when: "agora" });

  // Re-render em áreas afetadas (ex.: overview usa weekly.target)
  renderOverview(MOCK_CLAN);

  alert("Configurações salvas com sucesso!");
}

// ===== SHOP =====
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
  MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: `-${cost} Pontos (Loja)`, when: "agora" });

  renderShop(MOCK_CLAN);
  // renderDonations(MOCK_CLAN);
  alert(`Você comprou: ${it.name}`);
}

// ===== Ações =====
function donate(kind) {
  if (!PLAYER.inClan) return alert("Você precisa estar em um clã para doar.");
  let text = "";
  let points = 0;

  if (kind === "bits-100") { text = "+100 Bits"; points = 100; }
  else if (kind === "bits-500") { text = "+500 Bits"; points = 500; }
  else if (kind === "crystal-5") { text = "+5 Cristais"; points = 250; }

  MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: text, when: "agora" });

  const me = MOCK_CLAN.members.find(m => m.id === PLAYER.id);
  if (me) me.contribWeek = (me.contribWeek || 0) + points;

  renderOverview(MOCK_CLAN);
  // renderDonations(MOCK_CLAN);
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
    if (m.role === "leader") {
      alert("Você não pode remover o líder do clã.");
      return;
    }
    if (confirm(`Remover ${m.name} do clã?`)) {
      MOCK_CLAN.members.splice(idx, 1);
      alert(`${m.name} removido.`);
    }
  }

  if (act === "makeLeader") {
    if (PLAYER.role !== "leader") {
      alert("Apenas o líder atual pode transferir a liderança.");
      return;
    }
    if (m.id === PLAYER.id) {
      alert("Você já é o líder.");
      return;
    }

    // Caixa de confirmação
    const ok = confirm(
      `Confirmar transferência de liderança?\n\n` +
      `Você está prestes a tornar ${m.name} o novo Líder do clã.\n` +
      `Após isso, seu papel passará a ser Membro.`
    );
    if (!ok) return;

    // 1) Despromove o líder atual na lista (se houver)
    const currentLeader = MOCK_CLAN.members.find(x => x.role === "leader");
    if (currentLeader && currentLeader.id !== m.id) {
      currentLeader.role = "member"; // ou "officer", se preferir
    }

    // 2) Promove o alvo
    m.role = "leader";

    // 3) Sincroniza o estado local do PLAYER
    if (PLAYER.id === (currentLeader && currentLeader.id)) {
      PLAYER.role = "member";
    }
    if (PLAYER.id === m.id) {
      PLAYER.role = "leader";
    }

    // 4) Feedback e re-render
    alert(`${m.name} agora é o líder do clã.`);
    renderHero(MOCK_CLAN);
    renderMembers(MOCK_CLAN);
    return;
  }

  renderHero(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
}

function setClanLevel(newLevel) {
  const maxL = MOCK_CLAN.maxLevel || newLevel;
  MOCK_CLAN.level = Math.max(1, Math.min(maxL, newLevel));
  syncMissionsFromCatalog(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
  renderMissions(MOCK_CLAN);
  renderHero(MOCK_CLAN);
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
    alert("Você é o líder. Transfira a liderança antes de sair.");
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
  // Botões de aba (se existirem)
  document.querySelectorAll(".tab").forEach(btn => {
    if (!btn) return;
    const isActive = btn.dataset && btn.dataset.tab === tab;
    btn.classList.toggle("active", !!isActive);
  });

  // Painéis: pega tudo que começar com id="tab-" (não precisa lista fixa)
  document.querySelectorAll('[id^="tab-"]').forEach(panel => {
    if (!panel) return;
    const id = panel.id.replace(/^tab-/, "");
    panel.classList.toggle("hidden", id !== tab);
  });
}

// ===== Wire =====
document.addEventListener("DOMContentLoaded", () => {
  seedChatHistory();
  $("btn-back").addEventListener("click", () => window.location.href = "home.html");
  $("btn-invite").addEventListener("click", () => alert("Convite enviado (simulação)."));
  // $("btn-donate").addEventListener("click", () => setTab("donations"));
  $("btn-leave").addEventListener("click", leaveClan);
  $("btn-join").addEventListener("click", joinClan);

  // Botões da aba de configurações
  const saveBtn = $("btn-settings-save");
  if (saveBtn) saveBtn.addEventListener("click", saveSettings);

  const cancelBtn = $("btn-settings-cancel");
  if (cancelBtn) cancelBtn.addEventListener("click", () => renderSettings(MOCK_CLAN));

  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => {
      const tab = t.dataset.tab;
      setTab(tab);
      if (tab === "chat" && chatLoadedCount === 0) openChatTab();
      if (tab === "shop") renderShop(MOCK_CLAN);
      if (tab === "settings") renderSettings(MOCK_CLAN); // <-- aqui
      if (tab === "requests") renderRequests(MOCK_CLAN);

    });
  });

  $("member-search").addEventListener("input", () => renderMembers(MOCK_CLAN));
  $("member-role").addEventListener("change", () => renderMembers(MOCK_CLAN));

  document.addEventListener("click", e => {
    const d = e.target.closest("[data-donate]");
    if (d) donate(d.getAttribute("data-donate"));

    const missionBtn = e.target.closest("[data-mission]");
    if (missionBtn) {
      const id = missionBtn.getAttribute("data-mission");
      const ms = MOCK_CLAN.missions.find(m => m.id === id);
      if (!ms) return;

      // Se já marcou como concluída antes, não faz nada
      if (ms.completed) return;

      // Permite finalizar só quando objetivo foi atingido
      if ((ms.progress?.current ?? 0) < (ms.progress?.total ?? 0)) {
        alert("A missão ainda não está concluída.");
        return;
      }

      // Marca como concluída AGORA (apenas no clique)
      ms.completed = true;

      // (Opcional) recompensa
      const pts = ms.reward?.contrib || 0;
      if (pts > 0) {
        PLAYER.wallet.contributionPoints += pts;
        MOCK_CLAN.activities.unshift({
          text: `${PLAYER.name} finalizou "${ms.title}" (+${pts} Pontos de Contribuição)`,
          when: "agora"
        });
      } else {
        MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} finalizou "${ms.title}"`, when: "agora" });
      }

      renderMissions(MOCK_CLAN);
      // renderShop(MOCK_CLAN); // se quiser atualizar saldo visível
      alert("Missão concluída!");
    }
    const memberBtn = e.target.closest("[data-act]");
    if (memberBtn) handleMemberAction(memberBtn.getAttribute("data-act"), memberBtn.getAttribute("data-id"));

    const buyBtn = e.target.closest("[data-buy]");
    if (buyBtn) buyItem(buyBtn.getAttribute("data-buy"));

    const approveBtn = e.target.closest("[data-approve]");
    if (approveBtn) {
      approveRequest(approveBtn.getAttribute("data-approve"));
    }

    const denyBtn = e.target.closest("[data-deny]");
    if (denyBtn) {
      denyRequest(denyBtn.getAttribute("data-deny"));
    }
  });


  // MOTD
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
    if (!val) return alert("O anúncio não pode ficar vazio.");
    if (val.length > 240) return alert("Máx. 240 caracteres.");
    MOCK_CLAN.motd = val;
    MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} atualizou o anúncio`, when: "agora" });
    renderOverview(MOCK_CLAN);
    alert("Anúncio atualizado!");
  });

  $("btn-weekly-claim").addEventListener("click", () => {
    if (PLAYER.role !== "leader") return;
    const totalContrib = MOCK_CLAN.members.reduce((s, m) => s + (m.contribWeek || 0), 0);
    const membersCount = Math.max(1, MOCK_CLAN.members.length);
    const metaTotal = MOCK_CLAN.weekly.target * membersCount;
    if (totalContrib < metaTotal) return alert("Meta não atingida.");
    if (MOCK_CLAN.weekly.claimed) return alert("Já resgatada.");
    MOCK_CLAN.weekly.claimed = true;
    MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} resgatou recompensa semanal`, when: "agora" });
    renderOverview(MOCK_CLAN);
    alert("Recompensa semanal resgatada!");
  });

  $("chat-send").addEventListener("click", sendChatMessage);
  $("chat-text").addEventListener("keydown", e => { if (e.key === "Enter") sendChatMessage(); });
  initChatScroll();

  renderHero(MOCK_CLAN);
  setVisible(document.querySelector('.tab[data-tab="settings"]'), (PLAYER.role === "leader" || PLAYER.role === "officer"));

  renderOverview(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  syncMissionsFromCatalog(MOCK_CLAN);
  renderMissions(MOCK_CLAN);
  // renderDonations(MOCK_CLAN);
  renderRanking(MOCK_CLAN);
  if (window.feather) feather.replace();
});
