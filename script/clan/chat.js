import { $, escapeHtml, timeNow } from "./utils.js";
import { PLAYER, MOCK_CLAN } from "./state.js";

let chatPageSize=15, chatLoadedCount=0;

export function seedChatHistory(){
  const base=[{userId:"u2",user:"Agus",text:"Bora raid sábado?",when:"19:02"},{userId:"u1",user:"Rafael",text:"Confirmado! 20h 🕗",when:"19:05"}];
  const users=[{id:"u1",name:"Rafael"},{id:"u2",name:"Agus"},{id:"u3",name:"Gabu"},{id:"u4",name:"Mon"}];
  const samples=["Bom dia, tamers!","Alguém ajuda no boss mundial?","Consegui um drop raro ontem 😎","Treino às 18h?","Dica: a fase 3 tá dando muito XP.","Faltam 2 para raid! Quem topa?"];
  const old=[];
  for(let i=0;i<40;i++){ const u=users[i%users.length], text=samples[i%samples.length]; old.push({userId:u.id,user:u.name,text,when:"18:"+String(10+i).padStart(2,"0")}); }
  MOCK_CLAN.chatHistory = old.concat(base);
}

export function renderChat(c,{preserveScroll}={}){
  const list=$("chat-list"), participants=$("chat-participants"); if(!list||!participants) return;
  const online=c.members.filter(m=>m.online).length; participants.textContent=`${online} online / ${c.members.length} membros`;
  const history=c.chatHistory; const start=Math.max(0,history.length - chatLoadedCount); const slice=history.slice(start);
  const prevH=list.scrollHeight, prevTop=list.scrollTop;
  list.innerHTML=""; slice.forEach(m=>{ const me=(m.userId===PLAYER.id||m.user===PLAYER.name); const el=document.createElement("div"); el.className=`msg ${me?"you":"them"}`; el.innerHTML=`<div class="meta">${m.user} • ${m.when}</div><div>${escapeHtml(m.text)}</div>`; list.appendChild(el); });
  if(preserveScroll){ const newH=list.scrollHeight; list.scrollTop=newH-(prevH-prevTop); } else { list.scrollTop=list.scrollHeight; }
}
export function initChatScroll(){
  const list=$("chat-list"); if(!list) return;
  list.addEventListener("scroll",()=>{ if(list.scrollTop<=0 && chatLoadedCount<MOCK_CLAN.chatHistory.length){ chatLoadedCount=Math.min(chatLoadedCount+chatPageSize,MOCK_CLAN.chatHistory.length); renderChat(MOCK_CLAN,{preserveScroll:true}); } });
}
export function openChatTab(){ if(chatLoadedCount===0){ chatLoadedCount=Math.min(chatPageSize,MOCK_CLAN.chatHistory.length); } renderChat(MOCK_CLAN); }
export function sendChatMessage(){
  const input=$("chat-text"); const text=(input?.value||"").trim(); if(!text) return;
  MOCK_CLAN.chatHistory.push({userId:PLAYER.id,user:PLAYER.name,text,when:timeNow()});
  chatLoadedCount=Math.min(MOCK_CLAN.chatHistory.length, chatLoadedCount+1); input.value=""; renderChat(MOCK_CLAN);
}
