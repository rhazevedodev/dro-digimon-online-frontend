/* ============================================================================
   Digimon Revolution Online — CLÃ
   scripts/clan.js (versão comentada)
   ----------------------------------------------------------------------------
   Este arquivo centraliza toda a lógica de front para a página de Clã:
   - Estado do jogador e do clã (mocks)
   - Renderizações (hero, overview, members, missions, chat, shop, requests)
   - Mecânica completa da LOJA (catálogo, rotação semanal/diária, limites)
   - Navegação por abas, eventos, e helpers utilitários
   ============================================================================ */

/* =========================
   0) HELPERS BÁSICOS
   ========================= */

/** Atalho para pegar elemento por id */
function $(id) { return document.getElementById(id); }

/** Calcula % (0-100) de um progresso {current,total} */
function pct(p) { return Math.min(100, Math.round((p.current / p.total) * 100)); }

/** Mostra/oculta um elemento adicionando/removendo 'hidden' */
function setVisible(el, visible) { if (el) el.classList.toggle("hidden", !visible); }

/** Hora no formato HH:MM (para chat/atividades) */
function timeNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

/** Escapa HTML simples (segurança no chat) */
function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

/* =========================
   1) MOCKS DE ESTADO
   ========================= */

/** Estado do jogador logado */
let PLAYER = {
  id: "u_player",
  name: "Você",
  inClan: true,          // se false → mostra tela de browse
  role: "leader",        // leader | officer | member
  wallet: { contributionPoints: 1800 }, // Pontos de Contribuição (PC) individuais
  // (opcional) inventário de chaves/itens pessoais
  keys: { raid: 0 }
};

/** Clãs disponíveis para browse (quando não está em clã) */
const CLAN_DIRECTORY = [
  { id:"CLN-001", name:"Digital Tamers", tag:"#DTM", emblem:"./images/emblems/emblem1.png",
    level:7, members:24, capacity:30,
    settings:{minJoinLevel:10, recruitment:"invite", requireApproval:true},
    blurb:"Coop, raids e evolução."
  },
  { id:"CLN-002", name:"Royal Knights", tag:"#RKN", emblem:"./images/emblems/emblem2.png",
    level:5, members:30, capacity:30,
    settings:{minJoinLevel:1, recruitment:"closed", requireApproval:true},
    blurb:"Hardcore, competitivo."
  },
  { id:"CLN-003", name:"Data Breakers", tag:"#DTB", emblem:"./images/emblems/emblem3.png",
    level:3, members:12, capacity:25,
    settings:{minJoinLevel:5, recruitment:"open", requireApproval:false},
    blurb:"Casual e acolhedor."
  }
];

/** Estado do clã atual (mock principal) */
const MOCK_CLAN = {
  id: "CLN-001",
  name: "Digital Tamers",
  tag: "#DTM",
  emblem: "./images/emblems/emblem1.png",
  description: "Um clã focado em coop, raids e evolução. Respeito acima de tudo!",
  motd: "Bem-vindos! Raid no sábado 20h. Não faltem!",
  level: 7,
  maxLevel: 10,
  xp: { current: 14250, total: 20000 },
  members: [
    { id:"u1", name:"Rafael", role:"leader",  level:32, avatar:"./images/digimons/rookies/renamon.jpg", online:true,  contribWeek:850  },
    { id:"u2", name:"Agus",   role:"officer", level:28, avatar:"./images/digimons/rookies/agumon.jpg",  online:false, contribWeek:420  },
    { id:"u3", name:"Gabu",   role:"member",  level:21, avatar:"./images/digimons/rookies/gabumon.jpg", online:true,  contribWeek:1200 },
    { id:"u4", name:"Mon",    role:"member",  level:18, avatar:"./images/digimons/rookies/monmon.jpg",  online:false, contribWeek:20000}
  ],
  capacity: 30,
  settings: {
    minJoinLevel: 10,
    recruitment: "invite",     // open | invite | closed
    requireApproval: true,
    region: "BR",
    notes: ""
  },
  weekly: { current:0, target:5000, resetAt:"Dom 23:59", claimed:false },
  perks: ["+5% XP em batalhas","+3% chance de drop","Desconto 5% na loja do clã"],
  activities: [],
  donations: [],
  ranking: [],
  chatHistory: [],
  missions: [],                // será preenchido a partir do catálogo de missões
  // Pedidos de entrada (aba "Pedidos")
  joinRequests: [
    { id:"rq_101", name:"Kaori", level:16, avatar:"./images/digimons/rookies/patamon.jpg",   note:"Jogo todo dia à noite. Curto raids e coop.", when:"há 10 min" },
    { id:"rq_102", name:"Dante", level:9,  avatar:"./images/digimons/rookies/terriermon.jpg", note:"Voltei agora pro jogo, procuro clã friendly.", when:"há 27 min" },
    { id:"rq_103", name:"Maya",  level:22, avatar:"./images/digimons/rookies/labramon.jpg",  note:"Tenho experiência em PVP. Posso ajudar no ranking.", when:"há 1h" },
    { id:"rq_104", name:"Theo",  level:5,  avatar:"./images/digimons/rookies/palmon.jpg",    note:"Sou novo, quero aprender e contribuir.", when:"há 2h" },
    { id:"rq_105", name:"Aria",  level:13, avatar:"./images/digimons/rookies/gatomon.jpg",   note:"Faço doações semanais e jogo finais de semana.", when:"ontem" }
  ]
};

/* =========================
   2) CATÁLOGO DE MISSÕES (por nível do clã)
   =========================
   - Missões liberadas conforme nível do clã (reqLevel).
   - Sempre recompensa em Pontos de Contribuição.
   */
const MISSION_CATALOG = [
  { id:"mL1",  reqLevel:1,  title:"Boas-vindas ao Clã",    desc:"Apresente-se no chat do clã.",                progress:{current:0,total:1},    reward:{contrib:100}  },
  { id:"mL2",  reqLevel:2,  title:"Coleta Inicial",        desc:"Coletar 50 Dados Beta.",                      progress:{current:0,total:50},   reward:{contrib:150}  },
  { id:"mL3",  reqLevel:3,  title:"Treino em Equipe",      desc:"Vencer 5 batalhas em grupo.",                 progress:{current:0,total:5},    reward:{contrib:250}  },
  { id:"mL4",  reqLevel:4,  title:"Sentinela das Raids",   desc:"Participar de 1 raid semanal.",               progress:{current:0,total:1},    reward:{contrib:350}  },
  { id:"mL5",  reqLevel:5,  title:"Expansão do Clã",       desc:"Convidar 2 novos membros (aprovados).",       progress:{current:0,total:2},    reward:{contrib:500}  },
  { id:"mL6",  reqLevel:6,  title:"Aprimorar Estratégias", desc:"Compartilhar 3 dicas úteis no chat.",         progress:{current:0,total:3},    reward:{contrib:300}  },
  { id:"mL7",  reqLevel:7,  title:"Forja de Recursos",     desc:"Doar 2.000 pontos de contribuição ao total.", progress:{current:0,total:2000}, reward:{contrib:700}  },
  { id:"mL8",  reqLevel:8,  title:"Coordenação Avançada",  desc:"Completar 3 missões épicas em grupo.",        progress:{current:0,total:3},    reward:{contrib:900}  },
  { id:"mL9",  reqLevel:9,  title:"Domínio de Campo",      desc:"Vencer 10 partidas PVP como clã.",            progress:{current:0,total:10},   reward:{contrib:1200} },
  { id:"mL10", reqLevel:10, title:"Elite do Servidor",     desc:"Ficar no Top 3 do ranking semanal.",          progress:{current:0,total:1},    reward:{contrib:1500} }
];

/** Sincroniza missões do catálogo com o nível atual do clã */
function syncMissionsFromCatalog(c){
  if (!Array.isArray(c.missions)) c.missions = [];
  const allowed = MISSION_CATALOG.filter(m => (m.reqLevel ?? 1) <= (c.level ?? 1));
  // preserva progresso/completed já existente
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
  // ordena: incompletas primeiro, depois por nível
  next.sort((a,b)=>{
    const ac=a.completed?1:0, bc=b.completed?1:0;
    if(ac!==bc) return ac-bc;
    const ar=a.reqLevel??1, br=b.reqLevel??1;
    if(ar!==br) return ar-br;
    return a.title.localeCompare(b.title);
  });
  c.missions = next;
}

/* =========================
   3) LOJA DO CLÃ — CATÁLOGO E ESTADO
   =========================
   - SHOP_CATALOG: itens com requisitos de nível, estoque, limites, etc.
   - shopLevel: nível da loja (permite evoluir no futuro)
   - shopActive: estado atual (estoque semanal + vitrine diária)
   - shopCounters: contadores por jogador (daily/weekly) para limites
   - activeBuffs: buffs ativos de clã com expiração
   */
const SHOP_CATALOG = [
  { id:"s_ticket_raid", name:"Ticket de Raid", img:"./images/items/ticket_raid.png",
    desc:"Acesso a raid semanal.", price:{contrib:500}, type:"key",
    minClanLevel:1, minShopLevel:1, stock:{weekly:50}, perMember:{weekly:2} },

  { id:"s_buff_xp_5", name:"Buff XP +5% (24h)", img:"./images/items/buff_xp.png",
    desc:"Buff de XP para todo o clã por 24h.", price:{contrib:1200}, type:"clan-buff",
    durationHours:24, minClanLevel:3, minShopLevel:2, stock:{weekly:10}, perClan:{weekly:3} },

  { id:"s_caps_energia", name:"Cápsula de Energia", img:"./images/items/caps_energy.png",
    desc:"+50 de energia imediata.", price:{contrib:200}, type:"personal",
    minClanLevel:1, minShopLevel:1, stock:{weekly:200}, perMember:{daily:3} },

  { id:"s_booster_epic", name:"Booster Épico (2h)", img:"./images/items/booster_epic.png",
    desc:"Aumenta chance de drop por 2h (pessoal).", price:{contrib:800}, type:"personal",
    minClanLevel:4, minShopLevel:2, stock:{weekly:100}, perMember:{weekly:2} },

  { id:"s_skin_emblema", name:"Emblema Dourado (cosmético)", img:"./images/items/emblem_gold.png",
    desc:"Cosmético para o clã.", price:{contrib:2500}, type:"clan-cosmetic",
    minClanLevel:6, minShopLevel:3, stock:{seasonal:5}, perClan:{seasonal:1} }
];

// Estados da loja (acoplados ao clã)
MOCK_CLAN.shopLevel = MOCK_CLAN.shopLevel || 1;
MOCK_CLAN.shopLastRefresh = MOCK_CLAN.shopLastRefresh || ""; // "YYYY-MM-DD"
MOCK_CLAN.shopActive = MOCK_CLAN.shopActive || { weekly: {}, daily: [] }; // weekly: { itemId: {stockLeft} }
MOCK_CLAN.shopCounters = MOCK_CLAN.shopCounters || {}; // { [userId]: { [itemId]: {daily,weekly,seasonal} } }
MOCK_CLAN.activeBuffs = MOCK_CLAN.activeBuffs || [];   // buffs de clã ativos

/** Reabastece estoque semanal dos itens desbloqueados e zera contadores semanais */
function resetShopWeekly() {
  const unlocked = SHOP_CATALOG.filter(it =>
    (MOCK_CLAN.level >= (it.minClanLevel || 1)) &&
    (MOCK_CLAN.shopLevel >= (it.minShopLevel || 1))
  );
  unlocked.forEach(it => {
    const wk = it.stock?.weekly;
    if (wk) {
      MOCK_CLAN.shopActive.weekly[it.id] = { stockLeft: wk };
    }
  });
  // zera contadores semanais para todos os jogadores
  Object.values(MOCK_CLAN.shopCounters).forEach(perUser => {
    Object.values(perUser).forEach(cnt => { cnt.weekly = 0; });
  });
}

/** Seleciona 4 itens para a vitrine diária e zera contadores diários */
function refreshShopDaily() {
  const today = new Date().toISOString().slice(0,10);
  if (MOCK_CLAN.shopLastRefresh === today) return;

  const pool = SHOP_CATALOG.filter(it =>
    (MOCK_CLAN.level >= (it.minClanLevel || 1)) &&
    (MOCK_CLAN.shopLevel >= (it.minShopLevel || 1))
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  MOCK_CLAN.shopActive.daily = shuffled.slice(0, 4).map(x => x.id);
  MOCK_CLAN.shopLastRefresh = today;

  // zera contadores diários
  Object.values(MOCK_CLAN.shopCounters).forEach(perUser => {
    Object.values(perUser).forEach(cnt => { cnt.daily = 0; });
  });
}

/** Valida compra: níveis, estoque, limites e saldo */
function canBuyItem(userId, item) {
  // checa níveis de clã/loja
  if (MOCK_CLAN.level < (item.minClanLevel || 1)) return { ok:false, reason:"Nível do clã insuficiente." };
  if (MOCK_CLAN.shopLevel < (item.minShopLevel || 1)) return { ok:false, reason:"Nível da loja insuficiente." };

  // checa estoque semanal global
  const wk = MOCK_CLAN.shopActive.weekly[item.id];
  if (item.stock?.weekly && (!wk || wk.stockLeft <= 0)) return { ok:false, reason:"Sem estoque." };

  // checa limites do jogador (diário/semanal)
  const counters = (MOCK_CLAN.shopCounters[userId] ||= {});
  const c = (counters[item.id] ||= { daily:0, weekly:0, seasonal:0 });
  const perM = item.perMember || {};
  if (perM.daily && c.daily >= perM.daily)   return { ok:false, reason:"Limite diário atingido." };
  if (perM.weekly && c.weekly >= perM.weekly) return { ok:false, reason:"Limite semanal atingido." };

  // checa saldo
  const cost = item.price?.contrib || 0;
  if (PLAYER.wallet.contributionPoints < cost) return { ok:false, reason:"Pontos de contribuição insuficientes." };

  return { ok:true };
}

/** Aplica o efeito do item após a compra (mock) */
function applyItemEffect(item) {
  if (item.type === "personal") {
    // Ex.: adicionar em inventário do jogador (não implementado, apenas exemplo)
    return;
  }
  if (item.type === "key") {
    PLAYER.keys = PLAYER.keys || {};
    PLAYER.keys.raid = (PLAYER.keys.raid || 0) + 1;
    return;
  }
  if (item.type === "clan-buff") {
    const now = Date.now();
    const ms = (item.durationHours || 24) * 3600 * 1000;
    MOCK_CLAN.activeBuffs.push({
      id: "buff_" + item.id + "_" + now,
      itemId: item.id,
      name: item.name,
      expiresAt: now + ms
    });
    return;
  }
  if (item.type === "clan-cosmetic") {
    // Ex.: alterar emblema do clã (mock)
    // MOCK_CLAN.emblem = item.img;
    return;
  }
}

/** Processa a compra: debita PC, atualiza contadores/estoque e loga */
function purchaseItem(itemId) {
  const item = SHOP_CATALOG.find(i => i.id === itemId);
  if (!item) return alert("Item inválido.");

  const chk = canBuyItem(PLAYER.id, item);
  if (!chk.ok) return alert(chk.reason);

  // debita moeda
  const cost = item.price?.contrib || 0;
  PLAYER.wallet.contributionPoints -= cost;

  // atualiza contadores do usuário
  const counters = (MOCK_CLAN.shopCounters[PLAYER.id] ||= {});
  const c = (counters[item.id] ||= { daily:0, weekly:0, seasonal:0 });
  c.daily++; c.weekly++;

  // reduz estoque global semanal
  if (item.stock?.weekly) {
    const wk = MOCK_CLAN.shopActive.weekly[item.id];
    if (wk) wk.stockLeft = Math.max(0, (wk.stockLeft || 0) - 1);
  }

  // aplica efeito
  applyItemEffect(item);

  // log e re-render
  MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} comprou ${item.name}`, when: "agora" });
  renderShop(MOCK_CLAN);
  alert(`Você comprou: ${item.name}`);
}

/* =========================
   4) CHAT — semente e render
   ========================= */

function seedChatHistory(){
  const base = [
    { userId:"u2", user:"Agus",   text:"Bora raid sábado?", when:"19:02" },
    { userId:"u1", user:"Rafael", text:"Confirmado! 20h 🕗", when:"19:05" }
  ];
  const old = [];
  const users = [
    { id:"u1", name:"Rafael" }, { id:"u2", name:"Agus" },
    { id:"u3", name:"Gabu" },   { id:"u4", name:"Mon" }
  ];
  const samples = [
    "Bom dia, tamers!","Alguém ajuda no boss mundial?","Consegui um drop raro ontem 😎",
    "Treino às 18h?","Dica: a fase 3 tá dando muito XP.","Faltam 2 para raid! Quem topa?"
  ];
  for (let i=0;i<40;i++){
    const u = users[i%users.length];
    const text = samples[i%samples.length];
    old.push({ userId:u.id, user:u.name, text, when:"18:"+String(10+i).padStart(2,"0") });
  }
  MOCK_CLAN.chatHistory = old.concat(base);
}

let chatPageSize=15, chatLoadedCount=0;

function renderChat(c,opts={}){
  const list=$("chat-list");
  const participants=$("chat-participants");
  if (!list || !participants) return;

  const online = c.members.filter(m=>m.online).length;
  participants.textContent = `${online} online / ${c.members.length} membros`;

  const history = c.chatHistory;
  const start = Math.max(0, history.length - chatLoadedCount);
  const slice = history.slice(start);

  const prevScrollHeight=list.scrollHeight, prevTop=list.scrollTop;

  list.innerHTML="";
  slice.forEach(m=>{
    const me=(m.userId===PLAYER.id||m.user===PLAYER.name);
    const wrap=document.createElement("div");
    wrap.className=`msg ${me?"you":"them"}`;
    wrap.innerHTML = `<div class="meta">${m.user} • ${m.when}</div><div>${escapeHtml(m.text)}</div>`;
    list.appendChild(wrap);
  });

  if (opts.preserveScroll){
    const newHeight=list.scrollHeight;
    list.scrollTop = newHeight - (prevScrollHeight - prevTop);
  } else {
    list.scrollTop = list.scrollHeight;
  }
}

function initChatScroll(){
  const list=$("chat-list");
  if(!list) return;
  list.addEventListener("scroll",()=>{
    if (list.scrollTop<=0 && chatLoadedCount<MOCK_CLAN.chatHistory.length){
      chatLoadedCount = Math.min(chatLoadedCount + chatPageSize, MOCK_CLAN.chatHistory.length);
      renderChat(MOCK_CLAN,{preserveScroll:true});
    }
  });
}

function openChatTab(){
  if (chatLoadedCount===0){
    chatLoadedCount = Math.min(chatPageSize, MOCK_CLAN.chatHistory.length);
  }
  renderChat(MOCK_CLAN);
}

function sendChatMessage(){
  const input=$("chat-text");
  const text=(input?.value||"").trim();
  if (!text) return;
  MOCK_CLAN.chatHistory.push({ userId:PLAYER.id, user:PLAYER.name, text, when: timeNow() });
  chatLoadedCount = Math.min(MOCK_CLAN.chatHistory.length, chatLoadedCount + 1);
  input.value = "";
  renderChat(MOCK_CLAN);
}

/* =========================
   5) RENDERIZAÇÕES (HERO, OVERVIEW, MEMBERS, MISSIONS, SHOP, REQUESTS, BROWSE)
   ========================= */

/** Atualiza visibilidade das abas conforme estado (em clã vs fora de clã) */
function updateNavVisibility() {
  const inClan = !!PLAYER.inClan;

  // Botão "Procurar Clãs" só fora de clã
  const browseBtn = $("tabbtn-browse");
  if (browseBtn) browseBtn.classList.toggle("hidden", inClan);

  // Outras abas só quando estiver em clã
  const protectedTabs = ["overview","members","missions","chat","shop","ranking","settings","donations","requests"];
  protectedTabs.forEach(t => {
    const btn = document.querySelector(`.tab[data-tab="${t}"]`);
    if (btn) btn.classList.toggle("hidden", !inClan);
  });

  // Painéis: sem clã → mostra apenas "browse"
  if (!inClan) {
    protectedTabs.forEach(id => setVisible($("tab-"+id), false));
    setVisible($("tab-browse"), true);
  }
}

/** Banner do clã (HERO). Esconde-se quando não em clã. */
function renderHero(c){
  const heroWrap = $("clan-hero");

  // sempre atualiza a visibilidade das abas
  updateNavVisibility();

  // se não está em clã, esconde banner e sai
  if (heroWrap) heroWrap.classList.toggle("hidden", !PLAYER.inClan);
  if (!PLAYER.inClan) return;

  // Preenche informações do banner
  $("clan-emblem").src = c.emblem;
  $("clan-name").textContent = c.name;
  $("clan-tag").textContent = c.tag;
  $("clan-desc").textContent = c.description;

  $("clan-level").textContent = c.level;
  $("clan-members").textContent = `${c.members.length}/${c.capacity}`;
  $("clan-online").textContent = c.members.filter(m=>m.online).length;

  const xpP = pct(c.xp);
  $("clan-xp-bar").style.width = xpP+"%";
  $("clan-xp-text").textContent = `${c.xp.current}/${c.xp.total} (${xpP}%)`;

  // Botões no banner (join/leave/invite/donate)
  const inClan = !!PLAYER.inClan;
  const selfMember = c.members.find(x=>x.id===PLAYER.id);
  const myRole = selfMember ? selfMember.role : PLAYER.role;

  const btnJoin=$("btn-join");
  if (btnJoin){ btnJoin.classList.toggle("hidden", inClan); btnJoin.disabled = inClan; }

  const btnLeave=$("btn-leave");
  if (btnLeave){
    btnLeave.classList.toggle("hidden", !inClan);
    const hasOtherMembers = c.members.some(m=>m.id!==PLAYER.id);
    const mustTransfer = inClan && myRole==="leader" && hasOtherMembers;
    btnLeave.disabled = !!mustTransfer;
    btnLeave.title = mustTransfer ? "Transfira a liderança para sair do clã" : "";
  }

  const btnInvite=$("btn-invite");
  if (btnInvite){
    const canInvite = inClan && (myRole==="leader"||myRole==="officer");
    btnInvite.classList.toggle("hidden", !canInvite);
    btnInvite.disabled = !canInvite;
  }

  const btnDonate=$("btn-donate");
  if (btnDonate){
    const hasDonTab = !!$("tab-donations");
    const canDonate = inClan && hasDonTab;
    btnDonate.classList.toggle("hidden", !canDonate);
    btnDonate.disabled = !canDonate;
  }
}

/** Visão geral: MOTD, meta semanal, perks e atividades */
function renderOverview(c){
  const elMotd = $("clan-motd");
  if (elMotd) elMotd.textContent = c.motd;
  setVisible($("motd-edit-wrap"), false);
  setVisible($("clan-motd"), true);

  const canEditMotd = (PLAYER.role==="leader");
  setVisible($("btn-motd-edit"), canEditMotd);

  // perks (lista simples)
  const perks=$("clan-perks");
  if (perks){
    perks.innerHTML="";
    (c.perks||[]).forEach(p=>{
      const li=document.createElement("li");
      li.textContent=p;
      perks.appendChild(li);
    });
  }

  // Progresso semanal agregado: soma das contribuições dos membros
  const totalContrib=(c.members||[]).reduce((s,m)=>s+(m.contribWeek||0),0);
  const membersCount=Math.max(1,(c.members||[]).length);
  const weeklyTarget=Math.max(1,c.weekly?.target||0);
  const metaTotal=weeklyTarget*membersCount;
  const wP=Math.min(100,Math.round((totalContrib/metaTotal)*100));

  $("weekly-bar").style.width=wP+"%";
  $("weekly-text").textContent=`${totalContrib}/${metaTotal} (${wP}%)`;
  $("weekly-reset").textContent=`Reseta: ${c.weekly?.resetAt||"-"}`;

  // Botão de resgate semanal: apenas líder, habilita se meta atingida e não foi resgatada
  const btnClaim=$("btn-weekly-claim");
  const isLeader=(PLAYER.role==="leader");
  const reached=totalContrib>=metaTotal;
  const claimed=!!c.weekly?.claimed;
  setVisible(btnClaim, isLeader);
  if (isLeader && btnClaim){
    if (claimed){ btnClaim.disabled=true; btnClaim.innerHTML=`<i data-feather="check"></i><span>Recompensa resgatada</span>`; }
    else if (reached){ btnClaim.disabled=false; btnClaim.innerHTML=`<i data-feather="gift"></i><span>Resgatar Recompensa Semanal</span>`; }
    else { btnClaim.disabled=true; btnClaim.innerHTML=`<i data-feather="gift"></i><span>Meta não atingida</span>`; }
    if (window.feather) feather.replace();
  }

  // Atividades (feed simples)
  const feed=$("activity-feed");
  if (feed){
    feed.innerHTML="";
    (c.activities||[]).forEach(a=>{
      const li=document.createElement("li");
      li.textContent=`${a.text} — ${a.when}`;
      feed.appendChild(li);
    });
  }
}

/** Ações disponíveis em cada card de membro (conforme seu cargo) */
function actionButtonsForMember(m){
  const isLeader=(PLAYER.role==="leader");
  const isOfficer=(PLAYER.role==="officer");
  const isSelf=(m.id===PLAYER.id);
  if (!PLAYER.inClan) return "";

  let actions="";
  const targetIsLeader=(m.role==="leader");
  const targetIsOfficer=(m.role==="officer");
  const targetIsMember=(m.role==="member");

  if (isOfficer && targetIsMember && !isSelf){
    actions+=`<button class="btn btn-outline" data-act="promote" data-id="${m.id}">
                <i data-feather="arrow-up"></i><span>Promover</span>
              </button>`;
    actions+=`<button class="btn btn-danger" data-act="remove" data-id="${m.id}">
                <i data-feather="user-x"></i><span>Remover</span>
              </button>`;
  }
  if (isLeader && !isSelf){
    if (targetIsMember){
      actions+=`<button class="btn btn-outline" data-act="promote" data-id="${m.id}">
                  <i data-feather="arrow-up"></i><span>Promover</span>
                </button>`;
    }
    if (targetIsOfficer){
      actions+=`<button class="btn btn-outline" data-act="demote" data-id="${m.id}">
                  <i data-feather="arrow-down"></i><span>Rebaixar</span>
                </button>`;
    }
    if (!targetIsLeader){
      actions+=`<button class="btn btn-danger" data-act="remove" data-id="${m.id}">
                  <i data-feather="user-x"></i><span>Remover</span>
                </button>`;
    }
  }
  if (isLeader && !targetIsLeader && !isSelf){
    actions+=`<button class="btn btn-primary" data-act="makeLeader" data-id="${m.id}">
                <i data-feather="star"></i><span>Tornar Líder</span>
              </button>`;
  }
  return actions;
}

/** Lista de membros com filtros (nome/cargo) */
function renderMembers(c){
  const list=$("members-list"), empty=$("members-empty");
  if (!list || !empty) return;

  const q = (($("member-search")||{}).value||"").trim().toLowerCase();
  const role = (($("member-role")||{}).value)||"all";

  let data=c.members.slice();
  if (q) data=data.filter(m=>m.name.toLowerCase().includes(q));
  if (role!=="all") data=data.filter(m=>m.role===role);

  list.innerHTML="";
  if (!data.length){ setVisible(empty,true); return; }
  setVisible(empty,false);

  data.forEach(m=>{
    const weeklyTarget=Math.max(1,MOCK_CLAN.weekly?.target||1);
    const contribPct=Math.min(100,Math.round((m.contribWeek/weeklyTarget)*100));

    const card=document.createElement("div");
    card.className="member-card";
    card.innerHTML=`
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

/** Render de missões com botão 'Finalizar' (só habilita quando progresso atingiu a meta) */
function renderMissions(c){
  const list=$("missions-list"), empty=$("missions-empty");
  if (!list || !empty) return;

  list.innerHTML="";
  if (!c.missions.length){ setVisible(empty,true); return; }
  setVisible(empty,false);

  c.missions.forEach(ms=>{
    const p=pct(ms.progress);
    const reached=(ms.progress?.current??0)>=(ms.progress?.total??0);
    const isCompleted=!!ms.completed;

    // Decide estado do botão
    const baseBtn="btn w-full mt-3";
    const clsDone="opacity-80 cursor-not-allowed bg-green-600 hover:bg-green-600 border-green-600";
    const clsReady="btn-primary";
    const clsWip="opacity-50 cursor-not-allowed";

    let btnClass=baseBtn, btnDisabled="", btnLabel="Finalizar", btnIcon="flag";
    if (isCompleted){ btnClass+=` ${clsDone}`; btnDisabled="disabled"; btnLabel="Concluída"; btnIcon="check"; }
    else if (reached){ btnClass+=` ${clsReady}`; /* clique habilitado */ }
    else { btnClass+=` ${clsWip}`; btnDisabled="disabled"; btnLabel="Em progresso"; btnIcon="loader"; }

    const el=document.createElement("div");
    el.className="mission";
    el.innerHTML=`
      <p class="title">${ms.title}</p>
      <p class="meta">${ms.desc}</p>
      <div class="progress mt-2">
        <div class="progress-fill" style="width:${p}%"></div>
        <div class="progress-text">${ms.progress.current}/${ms.progress.total} (${p}%)</div>
      </div>
      <div class="mt-3">
        <p class="meta">Recompensa:
          <span class="font-bold text-yellow-300">${ms.reward?.contrib||0} Pontos de Contribuição</span>
        </p>
        <button class="${btnClass}" data-mission="${ms.id}" ${btnDisabled}>
          <i data-feather="${btnIcon}"></i><span>${btnLabel}</span>
        </button>
      </div>`;
    list.appendChild(el);
  });

  if (window.feather) feather.replace();
}

/** Render da LOJA com estoque/limites, usando rotação e checagens */
function renderShop(c){
  // Atualiza saldo exibido
  const bal=$("bal-contrib");
  if (bal) bal.textContent = `Contribuição: ${PLAYER.wallet.contributionPoints}`;

  const list=$("shop-list"), empty=$("shop-empty");
  if (!list || !empty) return;

  // Garante que a rotação/estoques estão preparados
  if (Object.keys(MOCK_CLAN.shopActive.weekly).length === 0) resetShopWeekly();
  refreshShopDaily();

  // Se houver vitrine diária, exibe somente os itens sorteados; senão, todos desbloqueados
  const dailyIds=new Set(MOCK_CLAN.shopActive.daily || []);
  let items = SHOP_CATALOG.filter(it =>
    (c.level >= (it.minClanLevel || 1)) && (c.shopLevel >= (it.minShopLevel || 1))
  );
  const dailyList = items.filter(i => dailyIds.has(i.id));
  if (dailyList.length) items = dailyList;

  list.innerHTML="";
  if (!items.length){ empty.classList.remove("hidden"); return; }
  empty.classList.add("hidden");

  const counters = (MOCK_CLAN.shopCounters[PLAYER.id] ||= {});

  items.forEach(it=>{
    const cost = it.price?.contrib || 0;

    // Estoque semanal (global)
    const wk = MOCK_CLAN.shopActive.weekly[it.id];
    const stockText = it.stock?.weekly ? `Estoque: ${wk ? wk.stockLeft : 0}/${it.stock.weekly}` : "Estoque: —";

    // Limites por jogador
    const cnt = (counters[it.id] ||= { daily:0, weekly:0, seasonal:0 });
    const perM = it.perMember || {};
    const limitTextParts = [];
    if (perM.daily)  limitTextParts.push(`Você hoje: ${cnt.daily}/${perM.daily}`);
    if (perM.weekly) limitTextParts.push(`Você semana: ${cnt.weekly}/${perM.weekly}`);
    const limitText = limitTextParts.join(" • ") || "";

    // Checagem para decidir estado do botão
    const check = canBuyItem(PLAYER.id, it);
    const disabledAttr = check.ok ? "" : "disabled";
    const titleAttr = check.ok ? "" : `title="${check.reason}"`;

    const card=document.createElement("div");
    card.className="shop-card";
    card.innerHTML=`
      <img src="${it.img}" alt="${it.name}">
      <div class="min-w-0">
        <p class="shop-title truncate">${it.name}</p>
        <p class="shop-meta">${it.desc}</p>
        <p class="shop-meta mt-1">Custo: <span class="price text-yellow-300">${cost} PC</span></p>
        <p class="shop-meta mt-1">${stockText}</p>
        ${limitText ? `<p class="shop-meta mt-1">${limitText}</p>` : ""}
      </div>
      <button class="btn btn-primary" data-buy="${it.id}" ${disabledAttr} ${titleAttr}>
        <i data-feather="shopping-cart"></i><span>Comprar</span>
      </button>
    `;
    list.appendChild(card);
  });

  if (window.feather) feather.replace();
}

/** Pedidos de entrada — lista com ações Aprovar/Negar (e Perfil) */
function renderRequests(c){
  const list=$("requests-list"), empty=$("requests-empty");
  if(!list||!empty) return;

  const items=c.joinRequests||[];
  list.innerHTML="";
  setVisible(empty, items.length===0);

  items.forEach(req=>{
    const card=document.createElement("div");
    card.className="request-card flex flex-col sm:flex-row sm:items-center items-stretch gap-3 p-3 rounded bg-gray-800";
    card.innerHTML=`
      <div class="flex items-center gap-3">
        <img src="${req.avatar}" alt="${req.name}" class="w-12 h-12 rounded object-cover flex-shrink-0">
        <div class="min-w-0">
          <p class="font-semibold truncate">${req.name} <span class="text-xs text-gray-300">nível ${req.level}</span></p>
          <p class="text-sm text-gray-400 truncate">${req.note||""}</p>
          <p class="text-xs text-gray-500">${req.when||"-"}</p>
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
      </div>`;
    list.appendChild(card);
  });

  const badge=$("badge-requests");
  if(badge){
    const n=items.length;
    badge.textContent=String(n);
    badge.classList.toggle("hidden", n===0);
  }

  if (window.feather) feather.replace();
}

/** Aprovar pedido (valida nível e espaço) */
function approveRequest(reqId){
  const myMember=MOCK_CLAN.members.find(x=>x.id===PLAYER.id);
  const myRole=myMember?myMember.role:PLAYER.role;
  if(!(PLAYER.inClan && (myRole==="leader"||myRole==="officer"))) return alert("Apenas Líder ou Oficial podem aprovar pedidos.");

  const idx=(MOCK_CLAN.joinRequests||[]).findIndex(r=>r.id===reqId);
  if(idx===-1) return;
  const req=MOCK_CLAN.joinRequests[idx];

  const minLv=MOCK_CLAN.settings?.minJoinLevel??1;
  if(req.level<minLv) return alert(`Nível mínimo para entrar é ${minLv}.`);
  if(MOCK_CLAN.members.length>=MOCK_CLAN.capacity) return alert("Capacidade do clã atingida.");

  MOCK_CLAN.members.push({ id:`m_${Date.now()}`, name:req.name, role:"member", level:req.level, avatar:req.avatar, online:false, contribWeek:0 });
  MOCK_CLAN.joinRequests.splice(idx,1);
  MOCK_CLAN.activities.unshift({ text: `${req.name} entrou no clã (aprovado)`, when: "agora" });

  renderHero(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  renderRequests(MOCK_CLAN);
  alert(`${req.name} foi aprovado(a).`);
}

/** Negar pedido */
function denyRequest(reqId){
  const myMember=MOCK_CLAN.members.find(x=>x.id===PLAYER.id);
  const myRole=myMember?myMember.role:PLAYER.role;
  if(!(PLAYER.inClan && (myRole==="leader"||myRole==="officer"))) return alert("Apenas Líder ou Oficial podem negar pedidos.");
  const idx=(MOCK_CLAN.joinRequests||[]).findIndex(r=>r.id===reqId);
  if(idx===-1) return;
  const req=MOCK_CLAN.joinRequests[idx];
  MOCK_CLAN.joinRequests.splice(idx,1);
  MOCK_CLAN.activities.unshift({ text: `Pedido de ${req.name} foi negado`, when: "agora" });
  renderRequests(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
}

/** Lista de clãs (quando não está em clã). Modo lista, largura limitada. */
function renderClanBrowser() {
  const list = $("browse-list");
  const empty = $("browse-empty");
  const browseSection = $("tab-browse");
  if (!list || !empty || !browseSection) return;

  // Mantém layout de LISTA e limita largura via Tailwind já no HTML
  list.className = "space-y-3";
  list.innerHTML = "";

  const items = CLAN_DIRECTORY.slice();
  if (!items.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  items.forEach(c => {
    const full = c.members >= c.capacity;
    const minLv = c.settings?.minJoinLevel ?? 1;
    const rec   = c.settings?.recruitment ?? "invite"; // open | invite | closed

    let actionHtml = "";
    if (rec === "closed") {
      actionHtml = `<button class="btn btn-ghost opacity-60 cursor-not-allowed w-full sm:w-auto" disabled>Fechado</button>`;
    } else if (rec === "open" && !full) {
      actionHtml = `<button class="btn btn-primary w-full sm:w-auto" data-join="${c.id}">
                      <i data-feather="log-in"></i><span>Entrar</span>
                    </button>`;
    } else {
      const disabled = full ? "disabled" : "";
      const classes  = full ? "btn btn-ghost opacity-60 cursor-not-allowed" : "btn btn-outline";
      const label    = full ? "Lotado" : "Solicitar Entrada";
      const dataAttr = full ? "" : `data-request="${c.id}"`;
      actionHtml = `<button class="${classes} w-full sm:w-auto" ${dataAttr} ${disabled}>
                      <i data-feather="mail"></i><span>${label}</span>
                    </button>`;
    }

    const li = document.createElement("div");
    li.className = "flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded bg-gray-800 w-full";
    li.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <img src="${c.emblem}" alt="${c.name}" class="w-12 h-12 rounded object-cover">
        <div class="min-w-0">
          <p class="font-semibold truncate">
            ${c.name} <span class="text-xs text-gray-300">${c.tag}</span>
          </p>
          <p class="text-sm text-gray-400 truncate">
            Nível ${c.level} • ${c.members}/${c.capacity} membros
          </p>
          <p class="text-xs text-gray-400 truncate">
            Requisitos: Nível mín. ${minLv} • Recrutamento: ${rec}
          </p>
          ${c.blurb ? `<p class="text-xs text-gray-500 truncate">${c.blurb}</p>` : ""}
        </div>
      </div>
      <div class="sm:ml-auto flex gap-2 w-full sm:w-auto">
        ${actionHtml}
      </div>
    `;
    list.appendChild(li);
  });

  if (window.feather) feather.replace();
}

/* =========================
   6) AÇÕES DO CLÃ (promover/demover/remover/transferir liderança)
   ========================= */

function handleMemberAction(act,id){
  const idx=MOCK_CLAN.members.findIndex(m=>m.id===id);
  if(idx===-1) return;
  const m=MOCK_CLAN.members[idx];

  if (act==="promote"&&m.role==="member"){ m.role="officer"; alert(`${m.name} foi promovido a Oficial.`); }
  if (act==="demote"&&m.role==="officer"){ m.role="member"; alert(`${m.name} foi rebaixado a Membro.`); }

  if (act==="remove"){
    if (m.role==="leader") return alert("Você não pode remover o líder do clã.");
    if (confirm(`Remover ${m.name} do clã?`)){ MOCK_CLAN.members.splice(idx,1); alert(`${m.name} removido.`); }
  }

  if (act==="makeLeader"){
    if (PLAYER.role!=="leader") return alert("Apenas o líder atual pode transferir a liderança.");
    if (m.id===PLAYER.id) return alert("Você já é o líder.");
    // Confirmação explícita
    const ok=confirm(`Confirmar transferência de liderança?\n\nVocê está prestes a tornar ${m.name} o novo Líder do clã.\nApós isso, seu papel passará a ser Membro.`);
    if(!ok) return;

    const currentLeader=MOCK_CLAN.members.find(x=>x.role==="leader");
    if (currentLeader && currentLeader.id!==m.id){ currentLeader.role="member"; }
    m.role="leader";

    // Atualiza papel do PLAYER consistente com o mock
    if (PLAYER.id===(currentLeader&&currentLeader.id)) PLAYER.role="member";
    if (PLAYER.id===m.id) PLAYER.role="leader";

    alert(`${m.name} agora é o líder do clã.`);
    renderHero(MOCK_CLAN); renderMembers(MOCK_CLAN);
    return;
  }

  renderHero(MOCK_CLAN); renderMembers(MOCK_CLAN);
}

/** Entrar no clã (mock) */
function joinClan(){
  if(PLAYER.inClan) return;
  PLAYER.inClan=true; PLAYER.role="member";
  MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
  updateNavVisibility();
  renderHero(MOCK_CLAN);
  setTab("overview");
  alert("Você entrou no clã!");
}

/** Sair do clã (mock) — Líder precisa transferir antes se houver outros membros */
function leaveClan(){
  if(!PLAYER.inClan) return;
  const hasOtherMembers=MOCK_CLAN.members.some(m=>m.id!==PLAYER.id);
  if (PLAYER.role==="leader"&&hasOtherMembers) return alert("Você é o líder. Transfira a liderança antes de sair.");
  if (!confirm("Tem certeza que deseja sair do clã?")) return;
  PLAYER.inClan=false;
  const idx=MOCK_CLAN.members.findIndex(m=>m.id===PLAYER.id);
  if(idx!==-1) MOCK_CLAN.members.splice(idx,1);
  updateNavVisibility();
  const heroWrap=$("clan-hero"); if (heroWrap) heroWrap.classList.add("hidden");
  setTab("browse");
  alert("Você saiu do clã.");
}

/* =========================
   7) NAVEGAÇÃO POR ABAS
   ========================= */

/** Mostra painel da aba escolhida e oculta os demais */
function setTab(tab){
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===tab));
  ["overview","members","missions","chat","shop","donations","ranking","settings","requests","browse"]
    .forEach(id=>{ const el=$("tab-"+id); if(el) el.classList.toggle("hidden", tab!==id); });
}

/* =========================
   8) BOOT/WIRE — Listeners e renders iniciais
   ========================= */

document.addEventListener("DOMContentLoaded",()=>{

  // Popular histórico do chat (mock) e listeners do chat
  seedChatHistory();
  initChatScroll();

  // Botões do header/hero
  $("btn-back")?.addEventListener("click",()=>window.history.back());
  $("btn-invite")?.addEventListener("click",()=>alert("Convite enviado (simulação)."));
  $("btn-donate")?.addEventListener("click",()=>{ if($("tab-donations")) setTab("donations"); else alert("A seção de doações está indisponível no momento."); });
  $("btn-leave")?.addEventListener("click", leaveClan);
  $("btn-join")?.addEventListener("click", joinClan);

  // Tabs: click → troca painel e render específico; controla banner fora de clã e na aba 'browse'
  document.querySelectorAll(".tab").forEach(t=>{
    t.addEventListener("click",()=>{
      const tab=t.dataset.tab;
      setTab(tab);

      // Banner só aparece quando em clã e não está na aba 'browse'
      const heroWrap = $("clan-hero");
      if (heroWrap) {
        const showHero = PLAYER.inClan && tab !== "browse";
        heroWrap.classList.toggle("hidden", !showHero);
      }

      if (tab==="chat" && chatLoadedCount===0) openChatTab();
      if (tab==="shop") renderShop(MOCK_CLAN);
      if (tab==="settings") renderSettings(MOCK_CLAN);
      if (tab==="requests") renderRequests(MOCK_CLAN);
      if (tab==="browse") renderClanBrowser();
    });
  });

  // Filtros de membros
  $("member-search")?.addEventListener("input",()=>renderMembers(MOCK_CLAN));
  $("member-role")?.addEventListener("change",()=>renderMembers(MOCK_CLAN));

  // Delegação global de cliques (doações, missões, membros, loja, pedidos, browse)
  document.addEventListener("click", e=>{
    // Doações rápidas (se usar a aba)
    const d=e.target.closest("[data-donate]"); if(d) donate(d.getAttribute("data-donate"));

    // MISSÕES: 'Finalizar' só no clique (não muda automaticamente ao atingir progresso)
    const missionBtn=e.target.closest("[data-mission]");
    if (missionBtn){
      const id=missionBtn.getAttribute("data-mission");
      const ms=MOCK_CLAN.missions.find(m=>m.id===id);
      if(!ms) return;
      if (ms.completed) return; // já concluída
      const reached=(ms.progress?.current??0)>=(ms.progress?.total??0);
      if(!reached) return alert("A missão ainda não está concluída.");
      ms.completed=true;
      const pts=ms.reward?.contrib||0;
      if (pts>0){
        PLAYER.wallet.contributionPoints+=pts;
        MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} finalizou "${ms.title}" (+${pts} PC)`, when: "agora" });
      } else {
        MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} finalizou "${ms.title}"`, when: "agora" });
      }
      renderMissions(MOCK_CLAN);
      alert("Missão concluída!");
    }

    // Ações de membro (promote/demote/remove/makeLeader)
    const memberBtn=e.target.closest("[data-act]");
    if(memberBtn) handleMemberAction(memberBtn.getAttribute("data-act"), memberBtn.getAttribute("data-id"));

    // LOJA: compra (usa nova função purchaseItem)
    const buyBtn=e.target.closest("[data-buy]");
    if (buyBtn) purchaseItem(buyBtn.getAttribute("data-buy"));

    // Pedidos: aprovar/negar
    const approveBtn=e.target.closest("[data-approve]"); if(approveBtn) approveRequest(approveBtn.getAttribute("data-approve"));
    const denyBtn=e.target.closest("[data-deny]");       if(denyBtn)    denyRequest(denyBtn.getAttribute("data-deny"));

    // BROWSE: entrar direto (open) ou solicitar entrada (invite)
    const joinBtn=e.target.closest("[data-join]");
    if (joinBtn){
      const id=joinBtn.getAttribute("data-join");
      const c=CLAN_DIRECTORY.find(x=>x.id===id); if(!c) return;
      if (c.members>=c.capacity) return alert("Clã lotado.");
      if (c.settings?.recruitment!=="open") return alert("Este clã não aceita entrada direta.");
      // "Entrar" troca mock atual e adiciona jogador
      MOCK_CLAN.id=c.id; MOCK_CLAN.name=c.name; MOCK_CLAN.tag=c.tag; MOCK_CLAN.emblem=c.emblem;
      MOCK_CLAN.level=c.level; MOCK_CLAN.capacity=c.capacity; MOCK_CLAN.members=[]; MOCK_CLAN.settings=c.settings;
      PLAYER.inClan=true; PLAYER.role="member";
      if (!MOCK_CLAN.members.find(m=>m.id===PLAYER.id)){
        MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
      }
      syncMissionsFromCatalog(MOCK_CLAN);
      updateNavVisibility();
      renderHero(MOCK_CLAN); renderOverview(MOCK_CLAN); renderMembers(MOCK_CLAN); renderMissions(MOCK_CLAN);
      setTab("overview"); alert(`Você entrou no clã ${c.name}.`);
    }

    const reqBtn=e.target.closest("[data-request]");
    if (reqBtn){
      const id=reqBtn.getAttribute("data-request");
      const c=CLAN_DIRECTORY.find(x=>x.id===id); if(!c) return;
      alert(`Pedido de entrada enviado para ${c.name}.`);
    }
  });

  // MOTD (editar/salvar/cancelar)
  $("btn-motd-edit")?.addEventListener("click",()=>{
    setVisible($("motd-edit-wrap"), true);
    setVisible($("clan-motd"), false);
    $("motd-textarea").value = MOCK_CLAN.motd || "";
  });
  $("btn-motd-cancel")?.addEventListener("click",()=>{
    setVisible($("motd-edit-wrap"), false);
    setVisible($("clan-motd"), true);
  });
  $("btn-motd-save")?.addEventListener("click",()=>{
    const val=$("motd-textarea").value.trim();
    if (!val) return alert("O anúncio não pode ficar vazio.");
    if (val.length>240) return alert("Máx. 240 caracteres.");
    MOCK_CLAN.motd=val;
    MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} atualizou o anúncio`, when: "agora" });
    renderOverview(MOCK_CLAN);
    alert("Anúncio atualizado!");
  });

  // Resgatar meta semanal (apenas líder)
  $("btn-weekly-claim")?.addEventListener("click",()=>{
    if (PLAYER.role!=="leader") return;
    const totalContrib=MOCK_CLAN.members.reduce((s,m)=>s+(m.contribWeek||0),0);
    const membersCount=Math.max(1,MOCK_CLAN.members.length);
    const metaTotal=MOCK_CLAN.weekly.target*membersCount;
    if (totalContrib<metaTotal) return alert("Meta não atingida.");
    if (MOCK_CLAN.weekly.claimed) return alert("Já resgatada.");
    MOCK_CLAN.weekly.claimed=true;
    MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} resgatou recompensa semanal`, when: "agora" });
    renderOverview(MOCK_CLAN);
    alert("Recompensa semanal resgatada!");
  });

  // Chat: enviar mensagem
  $("chat-send")?.addEventListener("click", sendChatMessage);
  $("chat-text")?.addEventListener("keydown", e=>{ if(e.key==="Enter") sendChatMessage(); });

  // 1ª carga de missões conforme nível do clã
  syncMissionsFromCatalog(MOCK_CLAN);

  // LOJA: garante estoque e vitrine antes do primeiro render da loja
  resetShopWeekly();
  refreshShopDaily();

  // Renders iniciais
  renderHero(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  renderMissions(MOCK_CLAN);

  // Decide aba inicial com base em estar em clã ou não
  updateNavVisibility();
  if (!PLAYER.inClan) {
    setTab("browse");
    renderClanBrowser();
    $("clan-hero")?.classList.add("hidden"); // garante banner oculto sem clã
  } else {
    setTab("overview");
    $("clan-hero")?.classList.remove("hidden");
  }

  if (window.feather) feather.replace();
});

/* =========================
   9) CONFIGURAÇÕES (render/save)
   ========================= */

function renderSettings(c){
  c.settings = c.settings || { minJoinLevel:1, recruitment:"invite", requireApproval:true, region:"", notes:"" };

  // Carrega valores atuais
  $("set-weekly-target") && ($("set-weekly-target").value = c.weekly?.target ?? 5000);
  $("set-min-level") && ($("set-min-level").value = c.settings.minJoinLevel ?? 1);

  const recruitment=c.settings.recruitment||"invite";
  document.querySelectorAll('input[name="recruitment"]').forEach(r=>{ r.checked=(r.value===recruitment); });

  $("set-require-approval") && ($("set-require-approval").checked = !!c.settings.requireApproval);
  $("set-region") && ($("set-region").value = c.settings.region || "");
  $("set-notes") && ($("set-notes").value = c.settings.notes || "");

  if (window.feather) feather.replace();
}

function saveSettings(){
  // Apenas líder/oficiais podem salvar
  if (PLAYER.role!=="leader" && PLAYER.role!=="officer") return alert("Apenas Líder ou Oficiais podem alterar configurações.");

  // Lê campos
  const weeklyTarget=parseInt(($("set-weekly-target")||{}).value,10);
  const minLv=parseInt(($("set-min-level")||{}).value,10);
  const recRadio=document.querySelector('input[name="recruitment"]:checked');
  const recruitment=recRadio?recRadio.value:"invite";
  const requireApproval=!!(($("set-require-approval")||{}).checked);
  const region=(($("set-region")||{}).value||"").trim();
  const notes=(($("set-notes")||{}).value||"").trim();

  // Validações simples
  if(!Number.isFinite(weeklyTarget)||weeklyTarget<1) return alert("Informe uma meta semanal válida (>= 1).");
  if(!Number.isFinite(minLv)||minLv<1) return alert("Informe um nível mínimo válido (>= 1).");

  // Persiste no mock
  MOCK_CLAN.weekly.target=weeklyTarget;
  MOCK_CLAN.settings.minJoinLevel=minLv;
  MOCK_CLAN.settings.recruitment=recruitment;
  MOCK_CLAN.settings.requireApproval=requireApproval;
  MOCK_CLAN.settings.region=region;
  MOCK_CLAN.settings.notes=notes;

  MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} atualizou as configurações do clã`, when: "agora" });
  renderOverview(MOCK_CLAN);
  alert("Configurações salvas com sucesso!");
}

// Botões salvar/cancelar (fora do DOMContentLoaded para compatibilidade)
$("btn-settings-save")?.addEventListener("click", saveSettings);
$("btn-settings-cancel")?.addEventListener("click", ()=>renderSettings(MOCK_CLAN));

/* =========================
   10) DOAÇÕES RÁPIDAS (se usar a aba/doações no banner)
   ========================= */
function donate(kind){
  if(!PLAYER.inClan) return alert("Você precisa estar em um clã para doar.");
  let text="", points=0;
  if (kind==="bits-100"){ text="+100 Bits"; points=100; }
  else if (kind==="bits-500"){ text="+500 Bits"; points=500; }
  else if (kind==="crystal-5"){ text="+5 Cristais"; points=250; }

  MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: text, when: "agora" });

  const me=MOCK_CLAN.members.find(m=>m.id===PLAYER.id);
  if (me) me.contribWeek=(me.contribWeek||0)+points;

  renderOverview(MOCK_CLAN);
  alert("Obrigado pela doação!");
}
