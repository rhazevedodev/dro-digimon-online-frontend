/* ===========================
   CLAN — Digimon Revolution
   JS consolidado (banner só com clã)
   =========================== */

/* ---------- Catálogo fixo de missões por nível ---------- */
const MISSION_CATALOG = [
  { id: "mL1",  reqLevel: 1,  title: "Boas-vindas ao Clã",    desc: "Apresente-se no chat do clã.",                progress: { current: 0, total: 1 },    reward: { contrib: 100 } },
  { id: "mL2",  reqLevel: 2,  title: "Coleta Inicial",        desc: "Coletar 50 Dados Beta.",                      progress: { current: 0, total: 50 },   reward: { contrib: 150 } },
  { id: "mL3",  reqLevel: 3,  title: "Treino em Equipe",      desc: "Vencer 5 batalhas em grupo.",                 progress: { current: 0, total: 5 },    reward: { contrib: 250 } },
  { id: "mL4",  reqLevel: 4,  title: "Sentinela das Raids",   desc: "Participar de 1 raid semanal.",               progress: { current: 0, total: 1 },    reward: { contrib: 350 } },
  { id: "mL5",  reqLevel: 5,  title: "Expansão do Clã",       desc: "Convidar 2 novos membros (aprovados).",       progress: { current: 0, total: 2 },    reward: { contrib: 500 } },
  { id: "mL6",  reqLevel: 6,  title: "Aprimorar Estratégias", desc: "Compartilhar 3 dicas úteis no chat.",         progress: { current: 0, total: 3 },    reward: { contrib: 300 } },
  { id: "mL7",  reqLevel: 7,  title: "Forja de Recursos",     desc: "Doar 2.000 pontos de contribuição ao total.", progress: { current: 0, total: 2000 }, reward: { contrib: 700 } },
  { id: "mL8",  reqLevel: 8,  title: "Coordenação Avançada",  desc: "Completar 3 missões épicas em grupo.",        progress: { current: 0, total: 3 },    reward: { contrib: 900 } },
  { id: "mL9",  reqLevel: 9,  title: "Domínio de Campo",      desc: "Vencer 10 partidas PVP como clã.",            progress: { current: 0, total: 10 },   reward: { contrib: 1200 } },
  { id: "mL10", reqLevel: 10, title: "Elite do Servidor",     desc: "Ficar no Top 3 do ranking semanal.",          progress: { current: 0, total: 1 },    reward: { contrib: 1500 } },
];

/* ---------- Diretório de clãs (explorar quando não está em clã) ---------- */
const CLAN_DIRECTORY = [
  {
    id: "CLN-001", name: "Digital Tamers", tag: "#DTM",
    emblem: "./images/emblems/emblem1.png",
    level: 7, members: 24, capacity: 30,
    settings: { minJoinLevel: 10, recruitment: "invite", requireApproval: true },
    blurb: "Coop, raids e evolução."
  },
  {
    id: "CLN-002", name: "Royal Knights", tag: "#RKN",
    emblem: "./images/emblems/emblem2.png",
    level: 5, members: 30, capacity: 30,
    settings: { minJoinLevel: 1, recruitment: "closed", requireApproval: true },
    blurb: "Hardcore, competitivo."
  },
  {
    id: "CLN-003", name: "Data Breakers", tag: "#DTB",
    emblem: "./images/emblems/emblem3.png",
    level: 3, members: 12, capacity: 25,
    settings: { minJoinLevel: 5, recruitment: "open", requireApproval: false },
    blurb: "Casual e acolhedor."
  }
];

/* ---------- Mock do clã ---------- */
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
    { id: "u1", name: "Rafael", role: "leader", level: 32, avatar: "./images/digimons/rookies/renamon.jpg", online: true,  contribWeek: 850 },
    { id: "u2", name: "Agus",   role: "officer",level: 28, avatar: "./images/digimons/rookies/agumon.jpg",  online: false, contribWeek: 420 },
    { id: "u3", name: "Gabu",   role: "member", level: 21, avatar: "./images/digimons/rookies/gabumon.jpg", online: true,  contribWeek: 1200 },
    { id: "u4", name: "Mon",    role: "member", level: 18, avatar: "./images/digimons/rookies/monmon.jpg",  online: false, contribWeek: 20000 },
  ],
  capacity: 30,
  settings: {
    minJoinLevel: 10,
    recruitment: "invite", // open | invite | closed
    requireApproval: true,
    region: "BR",
    notes: ""
  },
  weekly: { current: 0, target: 5000, resetAt: "Dom 23:59", claimed: false },
  perks: ["+5% XP em batalhas","+3% chance de drop","Desconto 5% na loja do clã"],
  activities: [],
  donations: [],
  missions: [],           // ← será preenchido a partir do catálogo
  ranking: [],
  chatHistory: [],
  shop: [
    { id: "s1", name: "Ticket de Raid", img: "./images/items/ticket_raid.png", desc: "Acesso a raid semanal.", price: { contrib: 500 } },
    { id: "s2", name: "Cápsula de Energia", img: "./images/items/caps_energy.png", desc: "+50 de energia imediata.", price: { contrib: 200 } },
    { id: "s3", name: "Booster Épico", img: "./images/items/booster_epic.png", desc: "Aumenta drop por 2h.", price: { contrib: 800 } },
  ],
  joinRequests: [
    { id: "rq_101", name: "Kaori", level: 16, avatar: "./images/digimons/rookies/patamon.jpg",   note: "Jogo todo dia à noite. Curto raids e coop.", when: "há 10 min" },
    { id: "rq_102", name: "Dante", level: 9,  avatar: "./images/digimons/rookies/terriermon.jpg", note: "Voltei agora pro jogo, procuro clã friendly.", when: "há 27 min" },
    { id: "rq_103", name: "Maya",  level: 22, avatar: "./images/digimons/rookies/labramon.jpg",  note: "Tenho experiência em PVP. Posso ajudar no ranking.", when: "há 1h" },
    { id: "rq_104", name: "Theo",  level: 5,  avatar: "./images/digimons/rookies/palmon.jpg",    note: "Sou novo, quero aprender e contribuir.", when: "há 2h" },
    { id: "rq_105", name: "Aria",  level: 13, avatar: "./images/digimons/rookies/gatomon.jpg",   note: "Faço doações semanais e jogo finais de semana.", when: "ontem" }
  ]
};

/* ---------- Estado do jogador ---------- */
let PLAYER = {
  id: "u_player",
  name: "Você",
  inClan: false,
  role: "leader",
  wallet: { contributionPoints: 1800 }
};

/* ========================
   Helpers
   ======================== */
function $(id) { return document.getElementById(id); }
function pct(p) { return Math.min(100, Math.round((p.current / p.total) * 100)); }
function setVisible(el, visible) { if (el) el.classList.toggle("hidden", !visible); }
function timeNow(){ const d=new Date();return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

/* ========================
   Navegação (visibilidade das abas)
   ======================== */
function updateNavVisibility() {
  const inClan = !!PLAYER.inClan;

  // Botão/Aba "Procurar Clãs" aparece só quando NÃO está em clã
  const browseBtn = $("tabbtn-browse");
  if (browseBtn) browseBtn.classList.toggle("hidden", inClan);

  // Demais abas só quando está em um clã
  const protectedTabs = ["overview","members","missions","chat","shop","ranking","settings","donations","requests"];
  protectedTabs.forEach(t => {
    const btn = document.querySelector(`.tab[data-tab="${t}"]`);
    if (btn) btn.classList.toggle("hidden", !inClan);
  });

  // Painéis: sem clã → só browse visível
  if (!inClan) {
    protectedTabs.forEach(id => {
      const sec = $("tab-" + id);
      if (sec) sec.classList.add("hidden");
    });
    const browseSec = $("tab-browse");
    if (browseSec) browseSec.classList.remove("hidden");
  }
}

/* ========================
   Chat (seed + render)
   ======================== */
function seedChatHistory(){ const base=[{userId:"u2",user:"Agus",text:"Bora raid sábado?",when:"19:02"},{userId:"u1",user:"Rafael",text:"Confirmado! 20h 🕗",when:"19:05"}]; const old=[]; const users=[{id:"u1",name:"Rafael"},{id:"u2",name:"Agus"},{id:"u3",name:"Gabu"},{id:"u4",name:"Mon"}]; const samples=["Bom dia, tamers!","Alguém ajuda no boss mundial?","Consegui um drop raro ontem 😎","Treino às 18h?","Dica: a fase 3 tá dando muito XP.","Faltam 2 para raid! Quem topa?"]; for(let i=0;i<40;i++){const u=users[i%users.length]; const text=samples[i%samples.length]; old.push({userId:u.id,user:u.name,text,when:"18:"+String(10+i).padStart(2,"0")})} MOCK_CLAN.chatHistory=old.concat(base)}
let chatPageSize=15, chatLoadedCount=0;
function renderChat(c,opts={}){const list=$("chat-list"); const participants=$("chat-participants"); const online=c.members.filter(m=>m.online).length; participants.textContent=`${online} online / ${c.members.length} membros`; const history=c.chatHistory; const start=Math.max(0,history.length-chatLoadedCount); const slice=history.slice(start); const prevScrollHeight=list.scrollHeight; const prevTop=list.scrollTop; list.innerHTML=""; slice.forEach(m=>{const me=m.userId===PLAYER.id||m.user===PLAYER.name; const wrap=document.createElement("div"); wrap.className=`msg ${me?"you":"them"}`; wrap.innerHTML=`<div class="meta">${m.user} • ${m.when}</div><div>${escapeHtml(m.text)}</div>`; list.appendChild(wrap) }); if(opts.preserveScroll){const newHeight=list.scrollHeight; list.scrollTop=newHeight-(prevScrollHeight-prevTop)} else {list.scrollTop=list.scrollHeight}}
function initChatScroll(){const list=$("chat-list"); if(!list) return; list.addEventListener("scroll",()=>{if(list.scrollTop<=0&&chatLoadedCount<MOCK_CLAN.chatHistory.length){chatLoadedCount=Math.min(chatLoadedCount+chatPageSize,MOCK_CLAN.chatHistory.length); renderChat(MOCK_CLAN,{preserveScroll:true})}})}
function openChatTab(){ if(chatLoadedCount===0){ chatLoadedCount=Math.min(chatPageSize,MOCK_CLAN.chatHistory.length) } renderChat(MOCK_CLAN) }
function sendChatMessage(){ const input=$("chat-text"); const text=input.value.trim(); if(!text) return; MOCK_CLAN.chatHistory.push({userId:PLAYER.id,user:PLAYER.name,text,when:timeNow()}); chatLoadedCount=Math.min(MOCK_CLAN.chatHistory.length,chatLoadedCount+1); input.value=""; renderChat(MOCK_CLAN) }

/* ========================
   Render: Hero (BANNER)
   ======================== */
function renderHero(c){
  const heroWrap = $("clan-hero");

  // Atualiza visibilidade das abas SEMPRE
  updateNavVisibility();

  // Banner: só aparece se estiver em um clã
  if (heroWrap) heroWrap.classList.toggle("hidden", !PLAYER.inClan);

  if (!PLAYER.inClan) return; // sem clã → não preenche hero

  $("clan-emblem").src = c.emblem;
  $("clan-name").textContent = c.name;
  $("clan-tag").textContent = c.tag;
  $("clan-desc").textContent = c.description;
  $("clan-level").textContent = c.level;
  $("clan-members").textContent = `${c.members.length}/${c.capacity}`;
  $("clan-online").textContent = c.members.filter(m=>m.online).length;

  const xpP=pct(c.xp); $("clan-xp-bar").style.width=xpP+"%"; $("clan-xp-text").textContent=`${c.xp.current}/${c.xp.total} (${xpP}%)`;

  const inClan = !!PLAYER.inClan;
  const selfMember = c.members.find(x=>x.id===PLAYER.id);
  const myRole = selfMember ? selfMember.role : PLAYER.role;

  // Botões principais do banner
  const btnJoin=$("btn-join"); if (btnJoin){ btnJoin.classList.toggle("hidden",inClan); btnJoin.disabled=inClan; }
  const btnLeave=$("btn-leave"); if (btnLeave){ btnLeave.classList.toggle("hidden",!inClan);
    const hasOtherMembers = c.members.some(m=>m.id!==PLAYER.id);
    const mustTransfer = inClan && myRole==="leader" && hasOtherMembers;
    btnLeave.disabled=!!mustTransfer;
    btnLeave.title = mustTransfer ? "Transfira a liderança para sair do clã" : "";
  }
  const btnInvite=$("btn-invite"); if (btnInvite){ const canInvite=inClan&&(myRole==="leader"||myRole==="officer"); btnInvite.classList.toggle("hidden",!canInvite); btnInvite.disabled=!canInvite; }
  const btnDonate=$("btn-donate"); if (btnDonate){ const hasDonTab=!!$("tab-donations"); const canDonate=inClan&&hasDonTab; btnDonate.classList.toggle("hidden",!canDonate); btnDonate.disabled=!canDonate; }
}

/* ========================
   Render: Overview
   ======================== */
function renderOverview(c){
  const elMotd = $("clan-motd");
  if (elMotd) elMotd.textContent=c.motd;
  setVisible($("motd-edit-wrap"), false);
  setVisible($("clan-motd"), true);

  const canEditMotd = (PLAYER.role==="leader");
  setVisible($("btn-motd-edit"), canEditMotd);

  const perks=$("clan-perks"); if (perks){perks.innerHTML=""; (c.perks||[]).forEach(p=>{const li=document.createElement("li"); li.textContent=p; perks.appendChild(li)})}

  // Progresso semanal agregado
  const totalContrib=(c.members||[]).reduce((s,m)=>s+(m.contribWeek||0),0);
  const membersCount=Math.max(1,(c.members||[]).length);
  const weeklyTarget=Math.max(1,c.weekly?.target||0);
  const metaTotal=weeklyTarget*membersCount;
  const wP=Math.min(100,Math.round((totalContrib/metaTotal)*100));
  $("weekly-bar").style.width=wP+"%";
  $("weekly-text").textContent=`${totalContrib}/${metaTotal} (${wP}%)`;
  $("weekly-reset").textContent=`Reseta: ${c.weekly?.resetAt||"-"}`;

  // Botão de resgate (apenas líder)
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

  const feed=$("activity-feed"); if (feed){ feed.innerHTML=""; (c.activities||[]).forEach(a=>{const li=document.createElement("li"); li.textContent=`${a.text} — ${a.when}`; feed.appendChild(li)})}
}

/* ========================
   Render: Members
   ======================== */
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
    actions+=`<button class="btn btn-outline" data-act="promote" data-id="${m.id}"><i data-feather="arrow-up"></i><span>Promover</span></button>`;
    actions+=`<button class="btn btn-danger" data-act="remove" data-id="${m.id}"><i data-feather="user-x"></i><span>Remover</span></button>`;
  }
  if (isLeader && !isSelf){
    if (targetIsMember){
      actions+=`<button class="btn btn-outline" data-act="promote" data-id="${m.id}"><i data-feather="arrow-up"></i><span>Promover</span></button>`;
    }
    if (targetIsOfficer){
      actions+=`<button class="btn btn-outline" data-act="demote" data-id="${m.id}"><i data-feather="arrow-down"></i><span>Rebaixar</span></button>`;
    }
    if (!targetIsLeader){
      actions+=`<button class="btn btn-danger" data-act="remove" data-id="${m.id}"><i data-feather="user-x"></i><span>Remover</span></button>`;
    }
  }
  if (isLeader && !targetIsLeader && !isSelf){
    actions+=`<button class="btn btn-primary" data-act="makeLeader" data-id="${m.id}"><i data-feather="star"></i><span>Tornar Líder</span></button>`;
  }
  return actions;
}
function renderMembers(c){
  const list=$("members-list"), empty=$("members-empty");
  const q=(($("member-search")||{}).value||"").trim().toLowerCase();
  const role=(($("member-role")||{}).value)||"all";
  let data=c.members.slice();
  if(q) data=data.filter(m=>m.name.toLowerCase().includes(q));
  if(role!=="all") data=data.filter(m=>m.role===role);

  list.innerHTML="";
  if(!data.length){ setVisible(empty,true); return }
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
    card.querySelector(".member-actions").innerHTML=actionButtonsForMember(m);
    list.appendChild(card);
  });
  if (window.feather) feather.replace();
}

/* ========================
   Missões (sincroniza do catálogo + render)
   ======================== */
function syncMissionsFromCatalog(c){
  if (!Array.isArray(c.missions)) c.missions = [];
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
  next.sort((a,b)=>{ const ac=a.completed?1:0, bc=b.completed?1:0; if(ac!==bc) return ac-bc; const ar=a.reqLevel??1, br=b.reqLevel??1; if(ar!==br) return ar-br; return a.title.localeCompare(b.title) });
  c.missions = next;
}

function renderMissions(c){
  const list=$("missions-list"), empty=$("missions-empty");
  list.innerHTML=""; if(!c.missions.length){ setVisible(empty,true); return } setVisible(empty,false);

  c.missions.forEach(ms=>{
    const p=pct(ms.progress);
    const isCompleted=!!ms.completed;
    const reached=(ms.progress?.current??0)>=(ms.progress?.total??0);

    // Estado do botão
    const baseBtn="btn w-full mt-3";
    const clsDone="opacity-80 cursor-not-allowed bg-green-600 hover:bg-green-600 border-green-600";
    const clsReady="btn-primary";
    const clsWip="opacity-50 cursor-not-allowed";
    let btnClass=baseBtn, btnDisabledAttr="", btnLabel="Finalizar", btnIcon="flag";
    if(isCompleted){ btnClass+=` ${clsDone}`; btnDisabledAttr="disabled"; btnLabel="Concluída"; btnIcon="check"; }
    else if(reached){ btnClass+=` ${clsReady}`; /* habilitado */ }
    else { btnClass+=` ${clsWip}`; btnDisabledAttr="disabled"; btnLabel="Em progresso"; btnIcon="loader"; }

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
        <button class="${btnClass}" data-mission="${ms.id}" ${btnDisabledAttr}>
          <i data-feather="${btnIcon}"></i><span>${btnLabel}</span>
        </button>
      </div>`;
    list.appendChild(el);
  });
  if (window.feather) feather.replace();
}

/* ========================
   Shop
   ======================== */
function renderShop(c){
  $("bal-contrib").textContent=`Contribuição: ${PLAYER.wallet.contributionPoints}`;
  const list=$("shop-list"), empty=$("shop-empty"); list.innerHTML=""; if(!c.shop.length){ setVisible(empty,true); return } setVisible(empty,false);
  c.shop.forEach(it=>{
    const cost=it.price.contrib||0;
    const card=document.createElement("div");
    card.className="shop-card";
    card.innerHTML=`
      <img src="${it.img}" alt="${it.name}">
      <div class="min-w-0">
        <p class="shop-title truncate">${it.name}</p>
        <p class="shop-meta">${it.desc}</p>
        <p class="shop-meta mt-1">Custo: <span class="price text-yellow-300">${cost} Pontos de Contribuição</span></p>
      </div>
      <button class="btn btn-primary" data-buy="${it.id}">
        <i data-feather="shopping-cart"></i><span>Comprar</span>
      </button>`;
    list.appendChild(card);
  });
  if (window.feather) feather.replace();
}
function buyItem(itemId){
  const it=MOCK_CLAN.shop.find(i=>i.id===itemId); if(!it) return;
  const cost=it.price.contrib||0;
  if (PLAYER.wallet.contributionPoints<cost) return alert("Pontos de contribuição insuficientes.");
  PLAYER.wallet.contributionPoints-=cost; MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: `-${cost} Pontos (Loja)`, when: "agora" });
  renderShop(MOCK_CLAN); alert(`Você comprou: ${it.name}`);
}

/* ========================
   Doações (simples)
   ======================== */
function donate(kind){
  if(!PLAYER.inClan) return alert("Você precisa estar em um clã para doar.");
  let text="", points=0;
  if (kind==="bits-100"){ text="+100 Bits"; points=100 }
  else if (kind==="bits-500"){ text="+500 Bits"; points=500 }
  else if (kind==="crystal-5"){ text="+5 Cristais"; points=250 }
  MOCK_CLAN.donations.unshift({ who: PLAYER.name, what: text, when: "agora" });
  const me=MOCK_CLAN.members.find(m=>m.id===PLAYER.id); if (me) me.contribWeek=(me.contribWeek||0)+points;
  renderOverview(MOCK_CLAN); alert("Obrigado pela doação!");
}

/* ========================
   Ações de membros
   ======================== */
function handleMemberAction(act,id){
  const idx=MOCK_CLAN.members.findIndex(m=>m.id===id); if(idx===-1) return;
  const m=MOCK_CLAN.members[idx];
  if (act==="promote"&&m.role==="member"){ m.role="officer"; alert(`${m.name} foi promovido a Oficial.`) }
  if (act==="demote"&&m.role==="officer"){ m.role="member"; alert(`${m.name} foi rebaixado a Membro.`) }
  if (act==="remove"){
    if (m.role==="leader") return alert("Você não pode remover o líder do clã.");
    if (confirm(`Remover ${m.name} do clã?`)){ MOCK_CLAN.members.splice(idx,1); alert(`${m.name} removido.`) }
  }
  if (act==="makeLeader"){
    if (PLAYER.role!=="leader") return alert("Apenas o líder atual pode transferir a liderança.");
    if (m.id===PLAYER.id) return alert("Você já é o líder.");
    const ok=confirm(`Confirmar transferência de liderança?\n\nVocê está prestes a tornar ${m.name} o novo Líder do clã.\nApós isso, seu papel passará a ser Membro.`);
    if(!ok) return;
    const currentLeader=MOCK_CLAN.members.find(x=>x.role==="leader");
    if (currentLeader && currentLeader.id!==m.id){ currentLeader.role="member" }
    m.role="leader";
    if (PLAYER.id===(currentLeader&&currentLeader.id)) PLAYER.role="member";
    if (PLAYER.id===m.id) PLAYER.role="leader";
    alert(`${m.name} agora é o líder do clã.`);
    renderHero(MOCK_CLAN); renderMembers(MOCK_CLAN); return;
  }
  renderHero(MOCK_CLAN); renderMembers(MOCK_CLAN);
}

/* ========================
   Join / Leave
   ======================== */
function joinClan(){
  if(PLAYER.inClan) return;
  PLAYER.inClan=true; PLAYER.role="member";
  MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
  updateNavVisibility();
  renderHero(MOCK_CLAN);
  setTab("overview");
  alert("Você entrou no clã!");
}
function leaveClan(){
  if(!PLAYER.inClan) return;
  const hasOtherMembers=MOCK_CLAN.members.some(m=>m.id!==PLAYER.id);
  if (PLAYER.role==="leader"&&hasOtherMembers) return alert("Você é o líder. Transfira a liderança antes de sair.");
  if (!confirm("Tem certeza que deseja sair do clã?")) return;
  PLAYER.inClan=false;
  const idx=MOCK_CLAN.members.findIndex(m=>m.id===PLAYER.id); if(idx!==-1) MOCK_CLAN.members.splice(idx,1);
  updateNavVisibility();
  const heroWrap = $("clan-hero"); if (heroWrap) heroWrap.classList.add("hidden");
  setTab("browse");
  alert("Você saiu do clã.");
}

/* ========================
   Requests (Pedidos de entrada)
   ======================== */
function renderRequests(c){
  const list=$("requests-list"), empty=$("requests-empty");
  if(!list||!empty) return;
  const items=c.joinRequests||[]; list.innerHTML="";
  if(!items.length){ empty.classList.remove("hidden"); } else { empty.classList.add("hidden"); }
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
  const badge=$("badge-requests"); if(badge){ const n=items.length; badge.textContent=String(n); badge.classList.toggle("hidden", n===0); }
  if (window.feather) feather.replace();
}
function approveRequest(reqId){
  const myMember=MOCK_CLAN.members.find(x=>x.id===PLAYER.id); const myRole=myMember?myMember.role:PLAYER.role;
  if(!(PLAYER.inClan&&(myRole==="leader"||myRole==="officer"))) return alert("Apenas Líder ou Oficial podem aprovar pedidos.");
  const idx=(MOCK_CLAN.joinRequests||[]).findIndex(r=>r.id===reqId); if(idx===-1) return;
  const req=MOCK_CLAN.joinRequests[idx];
  const minLv=MOCK_CLAN.settings?.minJoinLevel??1; if(req.level<minLv) return alert(`Nível mínimo para entrar é ${minLv}.`);
  if(MOCK_CLAN.members.length>=MOCK_CLAN.capacity) return alert("Capacidade do clã atingida.");
  MOCK_CLAN.members.push({ id:`m_${Date.now()}`, name:req.name, role:"member", level:req.level, avatar:req.avatar, online:false, contribWeek:0 });
  MOCK_CLAN.joinRequests.splice(idx,1);
  MOCK_CLAN.activities.unshift({ text: `${req.name} entrou no clã (aprovado)`, when: "agora" });
  renderHero(MOCK_CLAN); renderMembers(MOCK_CLAN); renderRequests(MOCK_CLAN); alert(`${req.name} foi aprovado(a).`);
}
function denyRequest(reqId){
  const myMember=MOCK_CLAN.members.find(x=>x.id===PLAYER.id); const myRole=myMember?myMember.role:PLAYER.role;
  if(!(PLAYER.inClan&&(myRole==="leader"||myRole==="officer"))) return alert("Apenas Líder ou Oficial podem negar pedidos.");
  const idx=(MOCK_CLAN.joinRequests||[]).findIndex(r=>r.id===reqId); if(idx===-1) return;
  const req=MOCK_CLAN.joinRequests[idx];
  MOCK_CLAN.joinRequests.splice(idx,1);
  MOCK_CLAN.activities.unshift({ text: `Pedido de ${req.name} foi negado`, when: "agora" });
  renderRequests(MOCK_CLAN); renderOverview(MOCK_CLAN);
}

/* ========================
   Navegar/Procurar Clãs (quando não está em clã)
   ======================== */
function renderClanBrowser() {
  const list = $("browse-list");
  const empty = $("browse-empty");
  if (!list || !empty) return;

  // Limita a largura do painel e centraliza (modo lista)
  const browseSection = $("tab-browse");
  if (browseSection) {
    browseSection.classList.add("max-w-3xl", "mx-auto", "w-full", "px-3", "sm:px-4");
  }

  // Lista vertical
  list.className = "flex flex-col gap-3 w-full";

  const items = CLAN_DIRECTORY.slice();
  list.innerHTML = "";

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

/* ========================
   Tabs
   ======================== */
function setTab(tab){
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===tab));
  ["overview","members","missions","chat","shop","donations","ranking","settings","requests","browse"]
    .forEach(id=>{ const el=$("tab-"+id); if(el) el.classList.toggle("hidden", tab!==id); });
}

/* ========================
   Wire / Boot
   ======================== */
document.addEventListener("DOMContentLoaded",()=>{
  seedChatHistory();

  // Botões do header
  const back=$("btn-back"); if (back) back.addEventListener("click",()=>window.location.href="home.html");
  const invite=$("btn-invite"); if (invite) invite.addEventListener("click",()=>alert("Convite enviado (simulação)."));
  const donateBtn=$("btn-donate"); if (donateBtn) donateBtn.addEventListener("click",()=>{ if($("tab-donations")) setTab("donations"); else alert("A seção de doações está indisponível no momento."); });
  const leave=$("btn-leave"); if (leave) leave.addEventListener("click", leaveClan);
  const join=$("btn-join"); if (join) join.addEventListener("click", joinClan);

  // Tabs
  document.querySelectorAll(".tab").forEach(t=>{
    t.addEventListener("click",()=>{
      const tab=t.dataset.tab;
      setTab(tab);

      // Banner: só aparece quando em clã e não está na aba 'browse'
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

  // Filtros membros
  const ms=$("member-search"); if (ms) ms.addEventListener("input",()=>renderMembers(MOCK_CLAN));
  const mr=$("member-role");   if (mr) mr.addEventListener("change",()=>renderMembers(MOCK_CLAN));

  // Delegação global de cliques
  document.addEventListener("click", e=>{
    const d=e.target.closest("[data-donate]"); if(d) donate(d.getAttribute("data-donate"));

    // Finalizar missão: apenas no clique (não no 100%)
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
        MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} finalizou "${ms.title}" (+${pts} Pontos de Contribuição)`, when: "agora" });
      } else {
        MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} finalizou "${ms.title}"`, when: "agora" });
      }
      renderMissions(MOCK_CLAN);
      alert("Missão concluída!");
    }

    const memberBtn=e.target.closest("[data-act]"); if(memberBtn) handleMemberAction(memberBtn.getAttribute("data-act"), memberBtn.getAttribute("data-id"));
    const buyBtn=e.target.closest("[data-buy]"); if(buyBtn) buyItem(buyBtn.getAttribute("data-buy"));

    const approveBtn=e.target.closest("[data-approve]"); if(approveBtn) approveRequest(approveBtn.getAttribute("data-approve"));
    const denyBtn=e.target.closest("[data-deny]"); if(denyBtn) denyRequest(denyBtn.getAttribute("data-deny"));

    // Procurar Clãs
    const joinBtn=e.target.closest("[data-join]");
    if (joinBtn){
      const id=joinBtn.getAttribute("data-join");
      const c=CLAN_DIRECTORY.find(x=>x.id===id); if(!c) return;
      const minLv=c.settings?.minJoinLevel??1;
      // if ((PLAYER.level??1)<minLv) return alert(`Precisa de nível mínimo ${minLv}.`);
      if (c.members>=c.capacity) return alert("Clã lotado.");
      if (c.settings?.recruitment!=="open") return alert("Este clã não aceita entrada direta.");
      // Simulação: trocar mock e entrar
      MOCK_CLAN.id=c.id; MOCK_CLAN.name=c.name; MOCK_CLAN.tag=c.tag; MOCK_CLAN.emblem=c.emblem; MOCK_CLAN.level=c.level; MOCK_CLAN.capacity=c.capacity; MOCK_CLAN.members=[]; MOCK_CLAN.settings=c.settings;
      PLAYER.inClan=true; PLAYER.role="member";
      const me=MOCK_CLAN.members.find(m=>m.id===PLAYER.id); if(!me) MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
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

  // MOTD
  const motdEdit=$("btn-motd-edit"); if (motdEdit) motdEdit.addEventListener("click",()=>{ setVisible($("motd-edit-wrap"), true); setVisible($("clan-motd"), false); $("motd-textarea").value=MOCK_CLAN.motd||""; });
  const motdCancel=$("btn-motd-cancel"); if (motdCancel) motdCancel.addEventListener("click",()=>{ setVisible($("motd-edit-wrap"), false); setVisible($("clan-motd"), true); });
  const motdSave=$("btn-motd-save"); if (motdSave) motdSave.addEventListener("click",()=>{ const val=$("motd-textarea").value.trim(); if(!val) return alert("O anúncio não pode ficar vazio."); if(val.length>240) return alert("Máx. 240 caracteres."); MOCK_CLAN.motd=val; MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} atualizou o anúncio`, when: "agora" }); renderOverview(MOCK_CLAN); alert("Anúncio atualizado!"); });

  // Weekly claim
  const weeklyBtn=$("btn-weekly-claim"); if (weeklyBtn) weeklyBtn.addEventListener("click",()=>{
    if (PLAYER.role!=="leader") return;
    const totalContrib=MOCK_CLAN.members.reduce((s,m)=>s+(m.contribWeek||0),0);
    const membersCount=Math.max(1,MOCK_CLAN.members.length);
    const metaTotal=MOCK_CLAN.weekly.target*membersCount;
    if (totalContrib<metaTotal) return alert("Meta não atingida.");
    if (MOCK_CLAN.weekly.claimed) return alert("Já resgatada.");
    MOCK_CLAN.weekly.claimed=true;
    MOCK_CLAN.activities.unshift({ text: `${PLAYER.name} resgatou recompensa semanal`, when: "agora" });
    renderOverview(MOCK_CLAN); alert("Recompensa semanal resgatada!");
  });

  // Chat
  const chatSend=$("chat-send"); if (chatSend) chatSend.addEventListener("click", sendChatMessage);
  const chatText=$("chat-text"); if (chatText) chatText.addEventListener("keydown", e=>{ if(e.key==="Enter") sendChatMessage() });
  initChatScroll();

  // Sincroniza missões por nível
  syncMissionsFromCatalog(MOCK_CLAN);

  // Primeiros renders
  renderHero(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  renderMissions(MOCK_CLAN);

  // Atualiza navegação e abre a aba correta
  updateNavVisibility();
  if (!PLAYER.inClan) {
    setTab("browse");
    renderClanBrowser();
    const heroWrap = $("clan-hero");
    if (heroWrap) heroWrap.classList.add("hidden"); // garante banner oculto sem clã
  } else {
    setTab("overview");
    const heroWrap = $("clan-hero");
    if (heroWrap) heroWrap.classList.remove("hidden");
  }

  if (window.feather) feather.replace();
});

/* ========================
   Settings (render/save)
   ======================== */
function renderSettings(c){
  c.settings = c.settings || { minJoinLevel:1, recruitment:"invite", requireApproval:true, region:"", notes:"" };
  const targetEl=$("set-weekly-target"); if (targetEl) targetEl.value = c.weekly?.target ?? 5000;
  const minEl=$("set-min-level"); if (minEl) minEl.value = c.settings.minJoinLevel ?? 1;
  const recruitment=c.settings.recruitment||"invite";
  document.querySelectorAll('input[name="recruitment"]').forEach(r=>{ r.checked=(r.value===recruitment) });
  const reqAp=$("set-require-approval"); if (reqAp) reqAp.checked=!!c.settings.requireApproval;
  const regEl=$("set-region"); if (regEl) regEl.value=c.settings.region||"";
  const notesEl=$("set-notes"); if (notesEl) notesEl.value=c.settings.notes||"";
  if (window.feather) feather.replace();
}
function saveSettings(){
  if (PLAYER.role!=="leader" && PLAYER.role!=="officer") return alert("Apenas Líder ou Oficiais podem alterar configurações.");
  const weeklyTarget=parseInt(($("set-weekly-target")||{}).value,10);
  const minLv=parseInt(($("set-min-level")||{}).value,10);
  const recRadio=document.querySelector('input[name="recruitment"]:checked');
  const recruitment=recRadio?recRadio.value:"invite";
  const requireApproval=!!(($("set-require-approval")||{}).checked);
  const region=(($("set-region")||{}).value||"").trim();
  const notes=(($("set-notes")||{}).value||"").trim();
  if(!Number.isFinite(weeklyTarget)||weeklyTarget<1) return alert("Informe uma meta semanal válida (>= 1).");
  if(!Number.isFinite(minLv)||minLv<1) return alert("Informe um nível mínimo válido (>= 1).");
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
const saveBtn=$("btn-settings-save"); if (saveBtn) saveBtn.addEventListener("click", saveSettings);
const cancelBtn=$("btn-settings-cancel"); if (cancelBtn) cancelBtn.addEventListener("click", ()=>renderSettings(MOCK_CLAN));
