import { $, setVisible } from "./utils.js";
import { PLAYER, MOCK_CLAN } from "./state.js";
import { renderHero } from "./overview.js";

function actionButtonsForMember(m){
  const isLeader=(PLAYER.role==="leader");
  const isOfficer=(PLAYER.role==="officer");
  const isSelf=(m.id===PLAYER.id);
  if(!PLAYER.inClan) return "";
  let actions="";
  const targetIsLeader=m.role==="leader", targetIsOfficer=m.role==="officer", targetIsMember=m.role==="member";
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

export function renderMembers(c){
  const list=$("members-list"), empty=$("members-empty");
  if(!list||!empty) return;
  const q=(($("member-search")||{}).value||"").trim().toLowerCase();
  const role=(($("member-role")||{}).value)||"all";
  let data=c.members.slice();
  if(q) data=data.filter(m=>m.name.toLowerCase().includes(q));
  if(role!=="all") data=data.filter(m=>m.role===role);

  list.innerHTML=""; if(!data.length){ setVisible(empty,true); return; } setVisible(empty,false);

  data.forEach(m=>{
    const weeklyTarget=Math.max(1, c.weekly?.target||1);
    const pct=Math.min(100,Math.round((m.contribWeek/weeklyTarget)*100));
    const card=document.createElement("div");
    card.className="member-card";
    card.innerHTML=`
      <img class="avatar" src="${m.avatar}" alt="${m.name}">
      <div class="min-w-0">
        <p class="member-name truncate">${m.name} <span class="badge">${m.role}</span></p>
        <p class="member-meta">Nível ${m.level} • Contrib. Semanal: ${m.contribWeek}</p>
        <div class="progress member-contrib mt-2"><div class="progress-fill green" style="width:${pct}%"></div><div class="progress-text">+${m.contribWeek} / ${weeklyTarget} (${pct}%)</div></div>
      </div>
      <div class="member-actions">${actionButtonsForMember(m)}</div>
    `;
    list.appendChild(card);
  });
}

export function handleMemberAction(act,id){
  const idx=MOCK_CLAN.members.findIndex(m=>m.id===id); if(idx===-1) return;
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
    const ok=confirm(`Confirmar transferência de liderança para ${m.name}?`);
    if(!ok) return;
    const currentLeader=MOCK_CLAN.members.find(x=>x.role==="leader");
    if (currentLeader && currentLeader.id!==m.id){ currentLeader.role="member"; }
    m.role="leader";
    if (PLAYER.id===(currentLeader&&currentLeader.id)) PLAYER.role="member";
    if (PLAYER.id===m.id) PLAYER.role="leader";
    alert(`${m.name} agora é o líder do clã.`);
    renderHero(MOCK_CLAN);
    renderMembers(MOCK_CLAN);
    return;
  }

  renderHero(MOCK_CLAN);
  renderMembers(MOCK_CLAN);
}

export function joinClan(){
  if(PLAYER.inClan) return;
  PLAYER.inClan=true; PLAYER.role="member";
  MOCK_CLAN.members.push({ id: PLAYER.id, name: PLAYER.name, role: "member", level: 10, avatar: "./images/digimons/rookies/bearmon.jpg", online: true, contribWeek: 0 });
  alert("Você entrou no clã!");
}

export function leaveClan(){
  if(!PLAYER.inClan) return;
  const hasOther=MOCK_CLAN.members.some(m=>m.id!==PLAYER.id);
  if (PLAYER.role==="leader"&&hasOther) return alert("Você é o líder. Transfira a liderança antes de sair.");
  if (!confirm("Tem certeza que deseja sair do clã?")) return;
  PLAYER.inClan=false;
  const idx=MOCK_CLAN.members.findIndex(m=>m.id===PLAYER.id);
  if(idx!==-1) MOCK_CLAN.members.splice(idx,1);
  alert("Você saiu do clã.");
}
