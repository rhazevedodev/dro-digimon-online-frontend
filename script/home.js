document.addEventListener("DOMContentLoaded", () => {
  const btnEvo = document.getElementById("btn-evo");

  // Mock do Digimon atual (exemplo)
  const digimonAtual = {
    nome: "Agumon",
    nivel: 25,
    fragmentos: { "Greymon": 4, "MetalGreymon": 1 },
    stats: { atk: 55, def: 40, hp: 180 },
  };

  // Mock das possíveis evoluções (pode futuramente vir do backend)
  const evolucoesPossiveis = [
    {
      nome: "Greymon",
      requisitos: {
        nivel: 15,
        fragmentos: 3,
        stats: { atk: 40, def: 25, hp: 150 },
      },
    },
    {
      nome: "MetalGreymon",
      requisitos: {
        nivel: 30,
        fragmentos: 5,
        stats: { atk: 65, def: 45, hp: 200 },
      },
    },
  ];

  // Função para verificar se há alguma evolução possível
  function verificarEvolucaoDisponivel() {
    return evolucoesPossiveis.some(ev => {
      const req = ev.requisitos;

      const nivelOk = digimonAtual.nivel >= req.nivel;
      const fragOk = (digimonAtual.fragmentos[ev.nome] || 0) >= req.fragmentos;
      const statsOk =
        digimonAtual.stats.atk >= req.stats.atk &&
        digimonAtual.stats.def >= req.stats.def &&
        digimonAtual.stats.hp >= req.stats.hp;

      return nivelOk && fragOk && statsOk;
    });
  }

  // Aplica destaque se houver evolução
  if (verificarEvolucaoDisponivel()) {
    btnEvo.classList.add(
      "animate-pulse",
      "text-blue-400",
      "shadow-blue-500/30"
    );
  } else {
    btnEvo.classList.remove(
      "animate-pulse",
      "text-blue-400",
      "shadow-blue-500/30"
    );
  }

  btnEvo?.addEventListener("click", () => {
    window.location.href = "digievolucao.html";
  });

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
    btn.addEventListener("click", e => e.target.blur());
    alert("📘 Detalhes do jogador:\n\nNível: 12\nPoder Total: 1420\nDigimon: Agumon\nTempo de Jogo: 3h 22m");
  });

  //+ Digievolucao
  document.getElementById("btn-evo")?.addEventListener("click", () => {
    window.location.href = "digievolucao.html";
  });


  // Ativar ícones feather
  feather.replace();
});
