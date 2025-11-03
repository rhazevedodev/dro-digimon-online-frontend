document.addEventListener("DOMContentLoaded", () => {
  // Simulação de resposta do backend (mock interno)
  const digimon = {
    nome: "Agumon",
    nivel: 5,
    tier: "Rookie",
    imagem: "./images/digimons/rookies/agumon.jpg",
    hp: {
      atual: 320,
      total: 400
    },
    energia: {
      atual: 180,
      total: 300
    },
    xp: { atual: 400, total: 500 }, // <<< NOVO: XP do DIGIMON
    atributos: {
      atk: 120,
      def: 90,
      spd: 75,
      int: 60,
      criticalRate: "12%",       // <<< novo
      criticalDamage: "150%",    // <<< novo
      accuracy: "92%"            // <<< novo
    },
    informacoesExtras: {
      personalidade: "Fighter",
      atributo: "Vaccine",
      elementoBuff: "Fire",
      fraquezas: ["Water", "Ice"],
      habilidades: ["Pepper Breath", "Spitfire Blast"]
    }
  };

  // Preenche os dados no HTML
  document.getElementById("digimon-img").src = digimon.imagem;
  document.getElementById("digimon-nome").textContent = digimon.nome;
  document.getElementById("digimon-nivel").textContent = `Nível: ${digimon.nivel}`;
  document.getElementById("digimon-tier").textContent = `Tier: ${digimon.tier}`;

  // Barras de status
  const hpPercent = (digimon.hp.atual / digimon.hp.total) * 100;
  const energiaPercent = (digimon.energia.atual / digimon.energia.total) * 100;

  document.getElementById("hp-bar").style.width = `${hpPercent}%`;
  document.getElementById("hp-text").textContent = `${digimon.hp.atual}/${digimon.hp.total}`;


  document.getElementById("energia-bar").style.width = `${energiaPercent}%`;
  document.getElementById("energia-text").textContent = `${digimon.energia.atual}/${digimon.energia.total}`;


  // Barras: Experiência (DIGIMON)
  const xpPercent = (digimon.xp.atual / digimon.xp.total) * 100;
  document.getElementById("xp-bar").style.width = `${xpPercent}%`;
  document.getElementById("xp-text").textContent = `${digimon.xp.atual}/${digimon.xp.total}`;

  // Atributos
  document.getElementById("atk").textContent = digimon.atributos.atk;
  document.getElementById("def").textContent = digimon.atributos.def;
  document.getElementById("spd").textContent = digimon.atributos.spd;
  document.getElementById("int").textContent = digimon.atributos.int;
  document.getElementById("crate").textContent = digimon.atributos.criticalRate;       // <<< novo
  document.getElementById("cdamage").textContent = digimon.atributos.criticalDamage; // <<< novo
  document.getElementById("acc").textContent = digimon.atributos.accuracy;               // <<< novo

  // Informações Gerais
  document.getElementById("personalidade").textContent = digimon.informacoesExtras.personalidade;
  document.getElementById("tipo").textContent = digimon.informacoesExtras.atributo;
  document.getElementById("elemento").textContent = digimon.informacoesExtras.elementoBuff;


  //+ Informações
  document.getElementById("btn-info")?.addEventListener("click", () => {
    alert("📘 Detalhes do jogador:\n\nNível: 12\nPoder Total: 1420\nDigimon: Agumon\nTempo de Jogo: 3h 22m");
  });

  // Ativar ícones feather
  feather.replace();
});
