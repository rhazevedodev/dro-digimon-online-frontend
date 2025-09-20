import { $, setVisible } from "./utils.js";
import { PLAYER, MOCK_CLAN, MISSION_CATALOG } from "./state.js";

export function syncMissionsFromCatalog(c){
  if (!Array.isArray(c.missions)) c.missions=[];
  const allowed=MISSION_CATALOG.filter(m=>(m.reqLevel??1)<= (c.level??1));
  const prev=new Map(c.missions.map(m=>[m.id,m]));
  const next=allowed.map(src=>{
    const old=prev.get(src.id);
    return { id:src.id, reqLevel:src.reqLevel, title:src.title, desc:src.desc, reward:{...(src.reward||{})},
             progress: old?.progress ? {...old.progress}:{...src.progress}, completed: !!old?.completed };
  });
  next.sort((a,b)=> (a.completed?1:0)-(b.completed?1:0) || (a.reqLevel??1)-(b.reqLevel??1) || a.title.localeCompare(b.title));
  c.missions=next;
}

export function renderMissions(c){
  const list=$("missions-list"), empty=$("missions-empty");
  if (!list||!empty) return;
  list.innerHTML=""; if(!c.missions.length){ setVisible(empty,true); return; } setVisible(empty,false);

  c.missions.forEach(ms=>{
    const p=Math.min(100,Math.round((ms.progress.current/ms.progress.total)*100));
    const reached=(ms.progress.current>=ms.progress.total), done=!!ms.completed;
    const base="btn w-full mt-3", clsDone="opacity-80 cursor-not-allowed bg-green-600 hover:bg-green-600 border-green-600",
          clsReady="btn-primary", clsWip="opacity-50 cursor-not-allowed";
    let cls=base, dis="", label="Finalizar", icon="flag";
    if (done){ cls+=` ${clsDone}`; dis="disabled"; label="Concluída"; icon="check"; }
    else if (reached){ cls+=` ${clsReady}`; }
    else { cls+=` ${clsWip}`; dis="disabled"; label="Em progresso"; icon="loader"; }
    const el=document.createElement("div");
    el.className="mission";
    el.innerHTML=`
      <p class="title">${ms.title}</p>
      <p class="meta">${ms.desc}</p>
      <div class="progress mt-2"><div class="progress-fill" style="width:${p}%"></div><div class="progress-text">${ms.progress.current}/${ms.progress.total} (${p}%)</div></div>
      <div class="mt-3">
        <p class="meta">Recompensa: <span class="font-bold text-yellow-300">${ms.reward?.contrib||0} Pontos de Contribuição</span></p>
        <button class="${cls}" data-mission="${ms.id}" ${dis}><i data-feather="${icon}"></i><span>${label}</span></button>
      </div>`;
    list.appendChild(el);
  });
}

export function finalizeMission(id){
  const ms=MOCK_CLAN.missions.find(m=>m.id===id); if(!ms) return;
  if (ms.completed) return;
  const reached=ms.progress.current>=ms.progress.total; if(!reached) return alert("A missão ainda não está concluída.");
  ms.completed=true;
  const pts=ms.reward?.contrib||0;
  if (pts>0){ PLAYER.wallet.contributionPoints+=pts; MOCK_CLAN.activities.unshift({ text:`${PLAYER.name} finalizou "${ms.title}" (+${pts} PC)`, when:"agora" }); }
  else { MOCK_CLAN.activities.unshift({ text:`${PLAYER.name} finalizou "${ms.title}"`, when:"agora" }); }
}
