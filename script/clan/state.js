// Estado global mock + catálogos
export let PLAYER = { id:"u_player", name:"Você", inClan:true, role:"leader", wallet:{contributionPoints:1800}, keys:{raid:0} };

export const CLAN_DIRECTORY = [
  {id:"CLN-001",name:"Digital Tamers",tag:"#DTM",emblem:"./images/emblems/emblem1.png",level:7,members:24,capacity:30,settings:{minJoinLevel:10,recruitment:"invite",requireApproval:true},blurb:"Coop, raids e evolução."},
  {id:"CLN-002",name:"Royal Knights",tag:"#RKN",emblem:"./images/emblems/emblem2.png",level:5,members:30,capacity:30,settings:{minJoinLevel:1,recruitment:"closed",requireApproval:true},blurb:"Hardcore, competitivo."},
  {id:"CLN-003",name:"Data Breakers",tag:"#DTB",emblem:"./images/emblems/emblem3.png",level:3,members:12,capacity:25,settings:{minJoinLevel:5,recruitment:"open",requireApproval:false},blurb:"Casual e acolhedor."}
];

export const MISSION_CATALOG = [
  {id:"mL1",reqLevel:1,title:"Boas-vindas ao Clã",desc:"Apresente-se no chat do clã.",progress:{current:1,total:1},reward:{contrib:100}},
  {id:"mL2",reqLevel:2,title:"Coleta Inicial",desc:"Coletar 50 Dados Beta.",progress:{current:0,total:50},reward:{contrib:150}},
  {id:"mL3",reqLevel:3,title:"Treino em Equipe",desc:"Vencer 5 batalhas em grupo.",progress:{current:0,total:5},reward:{contrib:250}},
  {id:"mL4",reqLevel:4,title:"Sentinela das Raids",desc:"Participar de 1 raid semanal.",progress:{current:0,total:1},reward:{contrib:350}},
  {id:"mL5",reqLevel:5,title:"Expansão do Clã",desc:"Convidar 2 novos membros (aprovados).",progress:{current:0,total:2},reward:{contrib:500}},
  {id:"mL6",reqLevel:6,title:"Aprimorar Estratégias",desc:"Compartilhar 3 dicas úteis no chat.",progress:{current:0,total:3},reward:{contrib:300}},
  {id:"mL7",reqLevel:7,title:"Forja de Recursos",desc:"Doar 2.000 pontos ao total.",progress:{current:0,total:2000},reward:{contrib:700}},
  {id:"mL8",reqLevel:8,title:"Coordenação Avançada",desc:"Completar 3 missões épicas em grupo.",progress:{current:0,total:3},reward:{contrib:900}},
  {id:"mL9",reqLevel:9,title:"Domínio de Campo",desc:"Vencer 10 partidas PVP como clã.",progress:{current:0,total:10},reward:{contrib:1200}},
  {id:"mL10",reqLevel:10,title:"Elite do Servidor",desc:"Top 3 do ranking semanal.",progress:{current:0,total:1},reward:{contrib:1500}}
];

export const SHOP_CATALOG = [
  {id:"s_ticket_raid",name:"Ticket de Raid",img:"./images/items/ticket_raid.png",desc:"Acesso a raid semanal.",price:{contrib:500},type:"key",minClanLevel:1,minShopLevel:1,stock:{weekly:50},perMember:{weekly:2}},
  {id:"s_buff_xp_5",name:"Buff XP +5% (24h)",img:"./images/items/buff_xp.png",desc:"Buff de XP para todo o clã por 24h.",price:{contrib:1200},type:"clan-buff",durationHours:24,minClanLevel:3,minShopLevel:2,stock:{weekly:10},perClan:{weekly:3}},
  {id:"s_caps_energia",name:"Cápsula de Energia",img:"./images/items/caps_energy.png",desc:"+50 de energia imediata.",price:{contrib:200},type:"personal",minClanLevel:1,minShopLevel:1,stock:{weekly:200},perMember:{daily:3}},
  {id:"s_booster_epic",name:"Booster Épico (2h)",img:"./images/items/booster_epic.png",desc:"Aumenta drop por 2h (pessoal).",price:{contrib:800},type:"personal",minClanLevel:4,minShopLevel:2,stock:{weekly:100},perMember:{weekly:2}},
  {id:"s_skin_emblema",name:"Emblema Dourado (cosmético)",img:"./images/items/emblem_gold.png",desc:"Cosmético para o clã.",price:{contrib:2500},type:"clan-cosmetic",minClanLevel:6,minShopLevel:3,stock:{seasonal:5},perClan:{seasonal:1}}
];


export const MOCK_CLAN = {
  id:"CLN-001",name:"Digital Tamers",tag:"#DTM",emblem:"./images/emblems/emblem1.png",
  description:"Um clã focado em coop, raids e evolução. Respeito acima de tudo!", motd:"Bem-vindos! Raid no sábado 20h. Não faltem!",
  level:7, maxLevel:10, xp:{current:14250,total:20000}, capacity:30,
  members:[
    {id:"u1",name:"Rafael",role:"leader",level:32,avatar:"./images/digimons/rookies/renamon.jpg",online:true,contribWeek:850},
    {id:"u2",name:"Agus",role:"officer",level:28,avatar:"./images/digimons/rookies/agumon.jpg",online:false,contribWeek:420},
    {id:"u3",name:"Gabu",role:"member",level:21,avatar:"./images/digimons/rookies/gabumon.jpg",online:true,contribWeek:1200},
    {id:"u4",name:"Mon",role:"member",level:18,avatar:"./images/digimons/rookies/monmon.jpg",online:false,contribWeek:20000}
  ],
  settings:{minJoinLevel:10,recruitment:"invite",requireApproval:true,region:"BR",notes:""},
  weekly:{current:0,target:5000,resetAt:"Dom 23:59",claimed:false},
  perks:["+5% XP em batalhas","+3% chance de drop","Desconto 5% na loja do clã"],
  activities:[], donations:[], ranking:[], chatHistory:[], missions:[],
  joinRequests:[
    {id:"rq_101",name:"Kaori",level:16,avatar:"./images/digimons/rookies/patamon.jpg",note:"Jogo todo dia à noite. Curto raids e coop.",when:"há 10 min"},
    {id:"rq_102",name:"Dante",level:9,avatar:"./images/digimons/rookies/terriermon.jpg",note:"Voltei agora pro jogo, procuro clã friendly.",when:"há 27 min"},
    {id:"rq_103",name:"Maya",level:22,avatar:"./images/digimons/rookies/labramon.jpg",note:"Tenho experiência em PVP. Posso ajudar no ranking.",when:"há 1h"},
    {id:"rq_104",name:"Theo",level:5,avatar:"./images/digimons/rookies/palmon.jpg",note:"Sou novo, quero aprender e contribuir.",when:"há 2h"},
    {id:"rq_105",name:"Aria",level:13,avatar:"./images/digimons/rookies/gatomon.jpg",note:"Faço doações semanais e jogo finais de semana.",when:"ontem"}
  ],
  // Estado da loja
  shopLevel:1, shopLastRefresh:"", shopActive:{weekly:{},daily:[]}, shopCounters:{}, activeBuffs:[]
};

// Funções auxiliares para mutar PLAYER de outros módulos (evitar import cíclico)
export function setPlayer(p){ PLAYER = p; }
