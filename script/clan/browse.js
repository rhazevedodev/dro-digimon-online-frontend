import { $, refreshIcons } from "./utils.js";
import { CLAN_DIRECTORY, MOCK_CLAN, PLAYER } from "./state.js";
import { renderHero, renderOverview } from "./overview.js";
import { renderMembers } from "./members.js";
import { syncMissionsFromCatalog, renderMissions } from "./missions.js";

export function renderClanBrowser(){
  const list=$("browse-list"), empty=$("browse-empty"); if(!list||!empty) return;
  list.className="space-y-3"; list.innerHTML="";
  const items=CLAN_DIRECTORY.slice(); if(!items.length){ empty.classList.remove("hidden"); return; } empty.classList.add("hidden");

  items.forEach(c=>{
    const full=c.members>=c.capacity; const minLv=c.settings?.minJoinLevel??1; const rec=c.settings?.recruitment??"invite";
    let actionHtml="";
    if (rec==="closed"){ actionHtml=`<button class="btn btn-ghost opacity-60 cursor-not-allowed w-full sm:w-auto" disabled>Fechado</button>`; }
    else if (rec==="open" && !full){
      actionHtml=`<button class="btn btn-primary w-full sm:w-auto" data-join="${c.id}"><i data-feather="log-in"></i><span>Entrar</span></button>`;
    } else {
      const dis=full?"disabled":""; const cls=full?"btn btn-ghost opacity-60 cursor-not-allowed":"btn btn-outline"; const label=full?"Lotado":"Solicitar Entrada"; const dataAttr=full?"":`data-request="${c.id}"`;
      actionHtml=`<button class="${cls} w-full sm:w-auto" ${dataAttr} ${dis}><i data-feather="mail"></i><span>${label}</span></button>`;
    }
    const li=document.createElement("div");
    li.className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded bg-gray-800 w-full";
    li.innerHTML=`
      <div class="flex items-center gap-3 min-w-0">
        <img src="${c.emblem}" class="w-12 h-12 rounded object-cover" alt="${c.name}">
        <div class="min-w-0">
          <p class="font-semibold truncate">${c.name} <span class="text-xs text-gray-300">${c.tag}</span></p>
          <p class="text-sm text-gray-400 truncate">Nível ${c.level} • ${c.members}/${c.capacity} membros</p>
          <p class="text-xs text-gray-400 truncate">Requisitos: Nível mín. ${minLv} • Recrutamento: ${rec}</p>
          ${c.blurb?`<p class="text-xs text-gray-500 truncate">${c.blurb}</p>`:""}
        </div>
      </div>
      <div class="sm:ml-auto flex gap-2 w-full sm:w-auto">${actionHtml}</div>`;
    list.appendChild(li);
  });
  refreshIcons();
}

export function quickJoinClan(clanId){
  const c=CLAN_DIRECTORY.find(x=>x.id===clanId); if(!c) return;
  if (c.members>=c.capacity) return alert("Clã lotado.");
  if (c.settings?.recruitment!=="open") return alert("Este clã não aceita entrada direta.");
  // troca mock atual
  Object.assign(MOCK_CLAN, { id:c.id, name:c.name, tag:c.tag, emblem:c.emblem, level:c.level, capacity:c.capacity, settings:c.settings });
  MOCK_CLAN.members=[]; PLAYER.inClan=true; PLAYER.role="member";
  MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
  syncMissionsFromCatalog(MOCK_CLAN);
  renderHero(MOCK_CLAN); renderOverview(MOCK_CLAN); renderMembers(MOCK_CLAN); renderMissions(MOCK_CLAN);
  return c.name;
}
