import { $, refreshIcons } from "./utils.js";
import { PLAYER, MOCK_CLAN, SHOP_CATALOG } from "./state.js";

export function resetShopWeekly(){
  const unlocked=SHOP_CATALOG.filter(it=>(MOCK_CLAN.level>=(it.minClanLevel||1))&&(MOCK_CLAN.shopLevel>=(it.minShopLevel||1)));
  unlocked.forEach(it=>{ const wk=it.stock?.weekly; if(wk){ MOCK_CLAN.shopActive.weekly[it.id]={stockLeft:wk}; } });
  Object.values(MOCK_CLAN.shopCounters).forEach(perUser=>{ Object.values(perUser).forEach(cnt=>{ cnt.weekly=0; }); });
}
export function refreshShopDaily(){
  const today=new Date().toISOString().slice(0,10);
  if(MOCK_CLAN.shopLastRefresh===today) return;
  const pool=SHOP_CATALOG.filter(it=>(MOCK_CLAN.level>=(it.minClanLevel||1))&&(MOCK_CLAN.shopLevel>=(it.minShopLevel||1)));
  const shuffled=[...pool].sort(()=>Math.random()-0.5);
  MOCK_CLAN.shopActive.daily=shuffled.slice(0,4).map(x=>x.id);
  MOCK_CLAN.shopLastRefresh=today;
  Object.values(MOCK_CLAN.shopCounters).forEach(perUser=>{ Object.values(perUser).forEach(cnt=>{ cnt.daily=0; }); });
}
export function canBuyItem(userId,item){
  if(MOCK_CLAN.level<(item.minClanLevel||1)) return {ok:false,reason:"Nível do clã insuficiente."};
  if(MOCK_CLAN.shopLevel<(item.minShopLevel||1)) return {ok:false,reason:"Nível da loja insuficiente."};
  const wk=MOCK_CLAN.shopActive.weekly[item.id];
  if(item.stock?.weekly && (!wk || wk.stockLeft<=0)) return {ok:false,reason:"Sem estoque."};
  const counters=(MOCK_CLAN.shopCounters[userId] ||= {}); const c=(counters[item.id] ||= {daily:0,weekly:0,seasonal:0});
  const perM=item.perMember||{};
  if(perM.daily && c.daily>=perM.daily) return {ok:false,reason:"Limite diário atingido."};
  if(perM.weekly && c.weekly>=perM.weekly) return {ok:false,reason:"Limite semanal atingido."};
  const cost=item.price?.contrib||0; if(PLAYER.wallet.contributionPoints<cost) return {ok:false,reason:"Pontos de contribuição insuficientes."};
  return {ok:true};
}
export function applyItemEffect(item){
  if(item.type==="personal") return;
  if(item.type==="key"){ PLAYER.keys=PLAYER.keys||{}; PLAYER.keys.raid=(PLAYER.keys.raid||0)+1; return; }
  if(item.type==="clan-buff"){ const now=Date.now(); const ms=(item.durationHours||24)*3600*1000; MOCK_CLAN.activeBuffs.push({id:"buff_"+item.id+"_"+now,itemId:item.id,name:item.name,expiresAt:now+ms}); return; }
  if(item.type==="clan-cosmetic"){ /* ex: MOCK_CLAN.emblem=item.img; */ return; }
}
export function purchaseItem(itemId){
  const item=SHOP_CATALOG.find(i=>i.id===itemId); if(!item) return alert("Item inválido.");
  const chk=canBuyItem(PLAYER.id,item); if(!chk.ok) return alert(chk.reason);
  const cost=item.price?.contrib||0; PLAYER.wallet.contributionPoints-=cost;
  const counters=(MOCK_CLAN.shopCounters[PLAYER.id] ||= {}); const c=(counters[item.id] ||= {daily:0,weekly:0,seasonal:0}); c.daily++; c.weekly++;
  if(item.stock?.weekly){ const wk=MOCK_CLAN.shopActive.weekly[item.id]; if(wk) wk.stockLeft=Math.max(0,(wk.stockLeft||0)-1); }
  applyItemEffect(item);
  MOCK_CLAN.activities.unshift({text:`${PLAYER.name} comprou ${item.name}`,when:"agora"});
  renderShop(MOCK_CLAN); alert(`Você comprou: ${item.name}`);
}

export function renderShop(c){
  const bal=$("bal-contrib"); bal && (bal.textContent=`Contribuição: ${PLAYER.wallet.contributionPoints}`);
  const list=$("shop-list"), empty=$("shop-empty"); if(!list||!empty) return;
  if(Object.keys(MOCK_CLAN.shopActive.weekly).length===0) resetShopWeekly();
  refreshShopDaily();

  const dailyIds=new Set(MOCK_CLAN.shopActive.daily||[]);
  let items=SHOP_CATALOG.filter(it=>(c.level>=(it.minClanLevel||1))&&(c.shopLevel>=(it.minShopLevel||1)));
  const dailyList=items.filter(i=>dailyIds.has(i.id)); if(dailyList.length) items=dailyList;

  list.innerHTML=""; if(!items.length){ empty.classList.remove("hidden"); return; } empty.classList.add("hidden");

  const counters=(MOCK_CLAN.shopCounters[PLAYER.id] ||= {});
  items.forEach(it=>{
    const cost=it.price?.contrib||0;
    const wk=MOCK_CLAN.shopActive.weekly[it.id];
    const stockText=it.stock?.weekly?`Estoque: ${wk?wk.stockLeft:0}/${it.stock.weekly}`:"Estoque: —";
    const cnt=(counters[it.id] ||= {daily:0,weekly:0,seasonal:0}); const perM=it.perMember||{};
    const limits=[ perM.daily?`Você hoje: ${cnt.daily}/${perM.daily}`:"", perM.weekly?`Você semana: ${cnt.weekly}/${perM.weekly}`:"" ].filter(Boolean).join(" • ");
    const check=canBuyItem(PLAYER.id,it); const dis=check.ok?"": "disabled"; const title=check.ok?"":`title="${check.reason}"`;

    const card=document.createElement("div");
    card.className="shop-card";
    card.innerHTML=`
      <img src="${it.img}" alt="${it.name}">
      <div class="min-w-0">
        <p class="shop-title truncate">${it.name}</p>
        <p class="shop-meta">${it.desc}</p>
        <p class="shop-meta mt-1">Custo: <span class="price text-yellow-300">${cost} PC</span></p>
        <p class="shop-meta mt-1">${stockText}</p>
        ${limits?`<p class="shop-meta mt-1">${limits}</p>`:""}
      </div>
      <button class="btn btn-primary" data-buy="${it.id}" ${dis} ${title}><i data-feather="shopping-cart"></i><span>Comprar</span></button>
    `;
    list.appendChild(card);
  });
  refreshIcons();
}

// (Opcional) doações rápidas
export function donate(kind){
  if(!PLAYER.inClan) return alert("Você precisa estar em um clã para doar.");
  let text="",points=0;
  if(kind==="bits-100"){ text="+100 Bits"; points=100; }
  else if(kind==="bits-500"){ text="+500 Bits"; points=500; }
  else if(kind==="crystal-5"){ text="+5 Cristais"; points=250; }
  MOCK_CLAN.donations.unshift({who:PLAYER.name,what:text,when:"agora"});
  const me=MOCK_CLAN.members.find(m=>m.id===PLAYER.id); if(me) me.contribWeek=(me.contribWeek||0)+points;
  alert("Obrigado pela doação!");
}
