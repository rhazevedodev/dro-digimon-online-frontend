// /scripts/clan/overview.js
import { $, pct } from "./utils.js";
import { PLAYER } from "./state.js";

// NÃO importe updateNavVisibility de si mesmo!
// import { updateNavVisibility } from "./overview.js";  ← REMOVIDO

// Controla visibilidade das abas conforme estar (ou não) em um clã
export function updateNavVisibility() {
  const inClan = !!PLAYER.inClan;

  // Botão "Procurar Clãs" só fora de clã
  const browseBtn = $("tabbtn-browse");
  if (browseBtn) browseBtn.classList.toggle("hidden", inClan);

  // Demais abas só quando estiver em clã
  const protectedTabs = ["overview","members","missions","chat","shop","ranking","settings","donations","requests"];
  protectedTabs.forEach(t => {
    const btn = document.querySelector(`.tab[data-tab="${t}"]`);
    if (btn) btn.classList.toggle("hidden", !inClan);
  });

  // Painéis: fora de clã → mostra apenas "browse"
  if (!inClan) {
    protectedTabs.forEach(id => {
      const el = $("tab-" + id);
      if (el) el.classList.add("hidden");
    });
    const br = $("tab-browse");
    if (br) br.classList.remove("hidden");
  }
}

// Banner (hero) do clã — só aparece quando em clã
export function renderHero(c) {
  updateNavVisibility();

  const heroWrap = $("clan-hero");
  if (heroWrap) heroWrap.classList.toggle("hidden", !PLAYER.inClan);
  if (!PLAYER.inClan) return;

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

  // Botões no banner
  const selfMember = c.members.find(x => x.id === PLAYER.id);
  const myRole = selfMember ? selfMember.role : PLAYER.role;
  const inClan = !!PLAYER.inClan;

  const btnJoin = $("btn-join");
  if (btnJoin) { btnJoin.classList.toggle("hidden", inClan); btnJoin.disabled = inClan; }

  const btnLeave = $("btn-leave");
  if (btnLeave) {
    btnLeave.classList.toggle("hidden", !inClan);
    const hasOthers = c.members.some(m => m.id !== PLAYER.id);
    const mustTransfer = inClan && myRole === "leader" && hasOthers;
    btnLeave.disabled = !!mustTransfer;
    btnLeave.title = mustTransfer ? "Transfira a liderança para sair do clã" : "";
  }

  const btnInvite = $("btn-invite");
  if (btnInvite) {
    const canInvite = inClan && (myRole === "leader" || myRole === "officer");
    btnInvite.classList.toggle("hidden", !canInvite);
    btnInvite.disabled = !canInvite;
  }

  const btnDonate = $("btn-donate");
  if (btnDonate) {
    const hasDonTab = !!$("tab-donations");
    const canDonate = inClan && hasDonTab;
    btnDonate.classList.toggle("hidden", !canDonate);
    btnDonate.disabled = !canDonate;
  }
}

// Mantém a visão geral como antes (sem mudanças)
export function renderOverview(c) {
  const motd = $("clan-motd");
  if (motd) motd.textContent = c.motd;
  const editWrap = $("motd-edit-wrap");
  if (editWrap) editWrap.classList.add("hidden");
  if (motd) motd.classList.remove("hidden");

  const canEdit = (PLAYER.role === "leader");
  const btnEdit = $("btn-motd-edit");
  if (btnEdit) btnEdit.classList.toggle("hidden", !canEdit);

  const perks = $("clan-perks");
  if (perks) {
    perks.innerHTML = "";
    (c.perks || []).forEach(p => {
      const li = document.createElement("li");
      li.textContent = p;
      perks.appendChild(li);
    });
  }

  const total = (c.members || []).reduce((s, m) => s + (m.contribWeek || 0), 0);
  const members = Math.max(1, (c.members || []).length);
  const target = Math.max(1, c.weekly?.target || 0);
  const metaTotal = target * members;
  const wP = Math.min(100, Math.round((total / metaTotal) * 100));
  $("weekly-bar").style.width = wP + "%";
  $("weekly-text").textContent = `${total}/${metaTotal} (${wP}%)`;
  $("weekly-reset").textContent = `Reseta: ${c.weekly?.resetAt || "-"}`;

  const btn = $("btn-weekly-claim");
  if (btn) {
    const isLeader = (PLAYER.role === "leader");
    const reached = total >= metaTotal;
    const claimed = !!c.weekly?.claimed;
    btn.classList.toggle("hidden", !isLeader);
    if (isLeader) {
      if (claimed) {
        btn.disabled = true;
        btn.innerHTML = `<i data-feather="check"></i><span>Recompensa resgatada</span>`;
      } else if (reached) {
        btn.disabled = false;
        btn.innerHTML = `<i data-feather="gift"></i><span>Resgatar Recompensa Semanal</span>`;
      } else {
        btn.disabled = true;
        btn.innerHTML = `<i data-feather="gift"></i><span>Meta não atingida</span>`;
      }
      if (window.feather) window.feather.replace();
    }
  }

  const feed = $("activity-feed");
  if (feed) {
    feed.innerHTML = "";
    (c.activities || []).forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a.text} — ${a.when}`;
      feed.appendChild(li);
    });
  }
}
