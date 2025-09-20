// Ponto de entrada: wire de eventos + renders iniciais
import { $, refreshIcons } from "./utils.js";
import { PLAYER, MOCK_CLAN } from "./state.js";
import { renderHero, renderOverview, updateNavVisibility } from "./overview.js";
import { renderMembers, handleMemberAction, joinClan, leaveClan } from "./members.js";
import { seedChatHistory, renderChat, initChatScroll, openChatTab, sendChatMessage } from "./chat.js";
import { syncMissionsFromCatalog, renderMissions, finalizeMission } from "./missions.js";
import { renderShop, purchaseItem, resetShopWeekly, refreshShopDaily, donate } from "./shop.js";
import { renderRequests, approveRequest, denyRequest } from "./requests.js";
import { renderClanBrowser, quickJoinClan } from "./browse.js";
import { renderSettings, saveSettings } from "./settings.js";

function setTab(tab){
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab===tab));
  ["overview","members","missions","chat","shop","donations","ranking","settings","requests","browse"].forEach(id=>{
    const el=$("tab-"+id); el && el.classList.toggle("hidden", tab!==id);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Seed chat e scroll
  seedChatHistory(); initChatScroll();

  // Header/hero
  $("btn-back")?.addEventListener("click",()=>window.history.back());
  $("btn-invite")?.addEventListener("click",()=>alert("Convite enviado (simulação)."));
  $("btn-donate")?.addEventListener("click",()=>{ if($("tab-donations")) setTab("donations"); else alert("A seção de doações está indisponível."); });
  $("btn-leave")?.addEventListener("click", leaveClan);
  $("btn-join")?.addEventListener("click", joinClan);

  // Tabs
  document.querySelectorAll(".tab").forEach(t=>{
    t.addEventListener("click",()=>{
      const tab=t.dataset.tab; setTab(tab);
      const hero=$("clan-hero"); hero && hero.classList.toggle("hidden", !(PLAYER.inClan && tab!=="browse"));
      if(tab==="chat") { if(document.getElementById("chat-list") && document.getElementById("chat-participants")) { if(!document.getElementById("chat-list").children.length) openChatTab(); } }
      if(tab==="shop") renderShop(MOCK_CLAN);
      if(tab==="settings") renderSettings(MOCK_CLAN);
      if(tab==="requests") renderRequests(MOCK_CLAN);
      if(tab==="browse") renderClanBrowser();
      refreshIcons();
    });
  });

  // Filtros membros
  $("member-search")?.addEventListener("input",()=>renderMembers(MOCK_CLAN));
  $("member-role")?.addEventListener("change",()=>renderMembers(MOCK_CLAN));

  // Delegação global de cliques
  document.addEventListener("click", (e)=>{
    const d=e.target.closest("[data-donate]"); if(d) donate(d.getAttribute("data-donate"));
    const m=e.target.closest("[data-mission]"); if(m){ finalizeMission(m.getAttribute("data-mission")); renderMissions(MOCK_CLAN); alert("Missão concluída!"); }
    const member=e.target.closest("[data-act]"); if(member) handleMemberAction(member.getAttribute("data-act"), member.getAttribute("data-id"));
    const buy=e.target.closest("[data-buy]"); if(buy) purchaseItem(buy.getAttribute("data-buy"));
    const approve=e.target.closest("[data-approve]"); if(approve) approveRequest(approve.getAttribute("data-approve"));
    const deny=e.target.closest("[data-deny]"); if(deny) denyRequest(deny.getAttribute("data-deny"));
    const join=e.target.closest("[data-join]"); if(join){ const name=quickJoinClan(join.getAttribute("data-join")); if(name){ updateNavVisibility(); renderHero(MOCK_CLAN); renderOverview(MOCK_CLAN); renderMembers(MOCK_CLAN); renderMissions(MOCK_CLAN); setTab("overview"); alert(`Você entrou no clã ${name}.`); } }
    const req=e.target.closest("[data-request]"); if(req){ const id=req.getAttribute("data-request"); const cName="(clã)"; alert(`Pedido de entrada enviado para ${cName}.`); }
  });

  // Motd
  $("btn-motd-edit")?.addEventListener("click",()=>{ $("motd-edit-wrap")?.classList.remove("hidden"); $("clan-motd")?.classList.add("hidden"); $("motd-textarea").value=MOCK_CLAN.motd||""; });
  $("btn-motd-cancel")?.addEventListener("click",()=>{ $("motd-edit-wrap")?.classList.add("hidden"); $("clan-motd")?.classList.remove("hidden"); });
  $("btn-motd-save")?.addEventListener("click",()=>{ const val=$("motd-textarea").value.trim(); if(!val) return alert("O anúncio não pode ficar vazio."); if(val.length>240) return alert("Máx. 240 caracteres."); MOCK_CLAN.motd=val; MOCK_CLAN.activities.unshift({text:`${PLAYER.name} atualizou o anúncio`,when:"agora"}); renderOverview(MOCK_CLAN); alert("Anúncio atualizado!"); });

  // Weekly claim
  $("btn-weekly-claim")?.addEventListener("click",()=>{
    if(PLAYER.role!=="leader") return;
    const total=MOCK_CLAN.members.reduce((s,m)=>s+(m.contribWeek||0),0);
    const metaTotal=(MOCK_CLAN.weekly.target||1)*Math.max(1,MOCK_CLAN.members.length);
    if(total<metaTotal) return alert("Meta não atingida.");
    if(MOCK_CLAN.weekly.claimed) return alert("Já resgatada.");
    MOCK_CLAN.weekly.claimed=true; MOCK_CLAN.activities.unshift({text:`${PLAYER.name} resgatou recompensa semanal`,when:"agora"}); renderOverview(MOCK_CLAN); alert("Recompensa semanal resgatada!");
  });

  // Chat
  $("chat-send")?.addEventListener("click", sendChatMessage);
  $("chat-text")?.addEventListener("keydown", e=>{ if(e.key==="Enter") sendChatMessage(); });

  // Missões
  syncMissionsFromCatalog(MOCK_CLAN);

  // Loja: preparar rotação
  resetShopWeekly(); refreshShopDaily();

  // Renders iniciais
  renderHero(MOCK_CLAN);
  renderOverview(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
  renderMissions(MOCK_CLAN);

  updateNavVisibility();
  if (!PLAYER.inClan){ setTab("browse"); $("clan-hero")?.classList.add("hidden"); }
  else { setTab("overview"); $("clan-hero")?.classList.remove("hidden"); }

  refreshIcons();
});
