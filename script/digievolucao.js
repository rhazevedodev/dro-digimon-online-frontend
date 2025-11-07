document.addEventListener("DOMContentLoaded", () => {
    const digimonAtual = {
      nome: "Agumon",
      estagio: "Rookie",
      nivel: 25,
      fragmentos: { "Greymon": 5, "Tyrannomon": 4, "MetalGreymon": 6 },
      itens: {
        "Fragmento de Fogo": 3,
        "Fragmento Selvagem": 5,
        "Chip de Evolução": 1,
        "Escama Flamejante": 0
      },
      stats: { atk: 55, def: 40, hp: 180, spd: 30 },
      imagem: "images/digimons/rookies/agumon.jpg"
    };
  
    const evolucoes = [
      {
        nome: "Greymon",
        estagio: "Champion",
        imagem: "images/digimons/champions/greymon.jpg",
        requisitos: {
          nivel: 15,
          fragmentos: 3,
          itens: [
            { nome: "Fragmento de Fogo", qtd: 3 },
            { nome: "Chip de Evolução", qtd: 1 }
          ],
          stats: { atk: 40, def: 25, hp: 150 }
        }
      },
      {
        nome: "Tyrannomon",
        estagio: "Champion",
        imagem: "images/digimons/champions/tyrannomon.jpg",
        requisitos: {
          nivel: 18,
          fragmentos: 5,
          itens: [
            { nome: "Fragmento Selvagem", qtd: 10 },
            { nome: "Escama Flamejante", qtd: 1 }
          ],
          stats: { atk: 45, def: 30, hp: 170 }
        }
      }
    ];
  
    // Renderiza Digimon atual
    // document.getElementById("digimon-img").src = digimonAtual.imagem;
    // document.getElementById("digimon-nome").textContent = digimonAtual.nome;
    // document.getElementById("digimon-estagio").textContent = `Estágio: ${digimonAtual.estagio}`;
  
    // Render evoluções
    const lista = document.getElementById("lista-evolucoes");
    lista.innerHTML = "";
    evolucoes.forEach(ev => {
      const card = document.createElement("div");
      card.className =
        "bg-gray-800 border border-gray-700 p-4 rounded-xl shadow hover:bg-gray-700 transition cursor-pointer text-center";
      card.innerHTML = `
        <img src="${ev.imagem}" class="w-28 h-28 mx-auto mb-2 rounded">
        <h3 class="font-semibold">${ev.nome}</h3>
        <p class="text-gray-400 text-sm">${ev.estagio}</p>
      `;
      card.addEventListener("click", () => mostrarRequisitos(ev));
      lista.appendChild(card);
    });
  
    // Render requisitos da evolução
    function mostrarRequisitos(evolucao) {
      const reqBox = document.getElementById("requisitos-evolucao");
      const detalhes = document.getElementById("evolucao-detalhes");
      const nome = document.getElementById("evolucao-nome");
      const btnEvoluir = document.getElementById("btn-evoluir");
  
      nome.textContent = `${evolucao.nome} (${evolucao.estagio})`;
      detalhes.innerHTML = "";
  
      let todosRequisitos = true;
  
      // 🔹 Nível
      const nivelOk = digimonAtual.nivel >= evolucao.requisitos.nivel;
      addRequisito("Nível mínimo", `${digimonAtual.nivel} / ${evolucao.requisitos.nivel}`, nivelOk);
  
      // 🔹 Fragmentos
      const fragmentosPossui = digimonAtual.fragmentos[evolucao.nome] || 0;
      const fragOk = fragmentosPossui >= evolucao.requisitos.fragmentos;
      addRequisito("Fragmentos", `${fragmentosPossui} / ${evolucao.requisitos.fragmentos}`, fragOk);
  
      // 🔹 Itens necessários
      const itensHeader = document.createElement("li");
      itensHeader.innerHTML = `<span class="font-semibold text-gray-300">Itens necessários</span>`;
      detalhes.appendChild(itensHeader);
  
      evolucao.requisitos.itens.forEach(item => {
        const possui = digimonAtual.itens[item.nome] || 0;
        const ok = possui >= item.qtd;
        addRequisito(`- ${item.nome}`, `${possui} / ${item.qtd}`, ok, true);
      });
  
      // 🔹 Atributos mínimos
      const statsHeader = document.createElement("li");
      statsHeader.innerHTML = `<span class="font-semibold text-gray-300 mt-2">Requisitos de status</span>`;
      detalhes.appendChild(statsHeader);
  
      Object.entries(evolucao.requisitos.stats).forEach(([key, val]) => {
        const atual = digimonAtual.stats[key] || 0;
        const ok = atual >= val;
        addRequisito(key.toUpperCase(), `${atual} / ${val}`, ok, true);
      });
  
      function addRequisito(label, valor, ok, indent = false) {
        const li = document.createElement("li");
        li.className = `grid grid-cols-2 text-sm ${indent ? "pl-4" : ""}`;
        li.innerHTML = `
          <span class="${ok ? "text-green-400" : "text-red-400"}">${label}</span>
          <span class="text-right ${ok ? "text-green-300" : "text-red-300"}">${valor}</span>
        `;
        detalhes.appendChild(li);
        if (!ok) todosRequisitos = false;
      }
  
      // Botão “Evoluir Agora”
      if (todosRequisitos) {
        btnEvoluir.className =
          "mt-5 w-full py-2 rounded-lg font-bold bg-green-600 hover:bg-green-500 transition";
        btnEvoluir.classList.remove("hidden");
        btnEvoluir.onclick = () => evoluir(evolucao);
      } else {
        btnEvoluir.classList.add("hidden");
      }
  
      reqBox.classList.remove("hidden");
      reqBox.scrollIntoView({ behavior: "smooth" });
    }
  
    function evoluir(evolucao) {
      alert(`🔥 ${digimonAtual.nome} está evoluindo para ${evolucao.nome}!`);
    }
  
    document.getElementById("btn-back").addEventListener("click", () => window.history.back());
  });
  