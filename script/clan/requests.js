import { $, refreshIcons, setVisible } from "./utils.js";
import { PLAYER, MOCK_CLAN } from "./state.js";
import { renderHero } from "./overview.js";
import { renderMembers } from "./members.js";

export function renderRequests(c){
  const list=$("requests-list"), empty=$("requests-empty"); if(!list||!empty) return;
  const items=c.joinRequests||[]; list.innerHTML=""; setVisible(empty, items.length===0);

  items.forEach(req=>{
    const card=document.createElement("div");
    card.className="request-card flex flex-col sm:flex-row sm:items-center items-stretch gap-3 p-3 rounded bg-gray-800";
    card.innerHTML=`
      <div class="flex items-center gap-3">
        <img src="${req.avatar}" alt="${req.name}" class="w-12 h-12 rounded object-cover">
        <div class="min-w-0">
          <p class="font-semibold truncate">${req.name} <span class="text-xs text-gray-300">nível ${req.level}</span></p>
          <p class="text-sm text-gray-400 truncate">${req.note||""}</p>
          <p class="text-xs text-gray-500">${req.when||"-"}</p>
        </div>
      </div>
      <div class="actions grid grid-cols-2 sm:flex sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
        <button class="btn btn-ghost w-full sm:w-auto" data-profile="${req.id}"><i data-feather="user"></i><span>Perfil</span></button>
        <button class="btn btn-primary w-full sm:w-auto" data-approve="${req.id}"><i data-feather="check"></i><span>Aprovar</span></button>
        <button class="btn btn-danger col-span-2 sm:col-span-1 w-full sm:w-auto" data-deny="${req.id}"><i data-feather="x"></i><span>Negar</span></button>
      </div>`;
    list.appendChild(card);
  });

  const badge=$("badge-requests"); if(badge){ const n=items.length; badge.textContent=String(n); badge.classList.toggle("hidden", n===0); }
  refreshIcons();
}

export function approveRequest(reqId){
  const myMember=MOCK_CLAN.members.find(x=>x.id===PLAYER.id);
  const myRole=myMember?myMember.role:PLAYER.role;
  if(!(PLAYER.inClan && (myRole==="leader"||myRole==="officer"))) return alert("Apenas Líder/Oficial podem aprovar.");

  const idx=(MOCK_CLAN.joinRequests||[]).findIndex(r=>r.id===reqId); if(idx===-1) return;
  const req=MOCK_CLAN.joinRequests[idx];
  const minLv=MOCK_CLAN.settings?.minJoinLevel??1; if(req.level<minLv) return alert(`Nível mínimo para entrar é ${minLv}.`);
  if(MOCK_CLAN.members.length>=MOCK_CLAN.capacity) return alert("Capacidade do clã atingida.");

  MOCK_CLAN.members.push({ id:`m_${Date.now()}`, name:req.name, role:"member", level:req.level, avatar:req.avatar, online:false, contribWeek:0 });
  MOCK_CLAN.joinRequests.splice(idx,1);
  MOCK_CLAN.activities.unshift({ text:`${req.name} entrou no clã (aprovado)`, when:"agora" });
  renderHero(MOCK_CLAN); renderMembers(MOCK_CLAN); renderRequests(MOCK_CLAN);
  alert(`${req.name} foi aprovado(a).`);
}

export function denyRequest(reqId){
  const myMember=MOCK_CLAN.members.find(x=>x.id===PLAYER.id);
  const myRole=myMember?myMember.role:PLAYER.role;
  if(!(PLAYER.inClan && (myRole==="leader"||myRole==="officer"))) return alert("Apenas Líder/Oficial podem negar.");
  const idx=(MOCK_CLAN.joinRequests||[]).findIndex(r=>r.id===reqId); if(idx===-1) return;
  const req=MOCK_CLAN.joinRequests[idx];
  MOCK_CLAN.joinRequests.splice(idx,1);
  MOCK_CLAN.activities.unshift({ text:`Pedido de ${req.name} foi negado`, when:"agora" });
  renderRequests(MOCK_CLAN);
}
