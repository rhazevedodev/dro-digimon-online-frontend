// Simulação de chamada ao backend
function fetchConta() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          pontosDigitais: 1250,
          slots: [
            {
              status: "ocupado",
              digimon: {
                id: 100,
                nome: "Agumon",
                nivel: 25,
                img: "https://digimon.shadowsmith.com/img/agumon.jpg"
              }
            },
            {
              status: "disponivel",
              digimon: null
            },
            {
              status: "bloqueado",
              digimon: null
            },
            {
              status: "bloqueado",
              digimon: null
            },
            {
              status: "bloqueado",
              digimon: null
            },
            {
              status: "bloqueado",
              digimon: null
            },
            {
              status: "bloqueado",
              digimon: null
            },
            {
              status: "bloqueado",
              digimon: null
            }
          ]
        });
      }, 800); // simula delay do backend
    });
  }
  
  // Renderização dos slots
  function renderSlots(slots) {
    const container = document.getElementById("slots-container");
    container.innerHTML = "";
  
    slots.forEach((slot) => {
      let html = "";
  
      if (slot.status === "ocupado" && slot.digimon) {
        // Slot ocupado
        html = `
          <div class="flex flex-col items-center justify-between bg-gray-800 rounded-2xl p-4 h-56 w-44">
            <img src="${slot.digimon.img}" alt="${slot.digimon.nome}" class="h-24 w-24 object-contain mb-2">
            <div class="text-center">
              <p class="font-bold text-yellow-300">${slot.digimon.nome}</p>
              <p class="text-sm text-gray-300 mb-2">Lv. ${slot.digimon.nivel}</p>
            </div>
            <button onclick="selecionarDigimon('${slot.digimon.id}')" 
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-3 rounded-lg transition">
              Selecionar
            </button>
          </div>
        `;
      } else if (slot.status === "disponivel") {
        // Slot disponível (sem Digimon)
        html = `
          <div onclick="abrirSelecao()" 
            class="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-2xl p-10 h-56 w-44 hover:bg-blue-800/30 transition cursor-pointer">
            <i data-feather="plus" class="w-12 h-12 text-blue-400 mb-3"></i>
            <span class="text-blue-300 font-semibold text-lg">Disponível</span>
          </div>
        `;
      } else {
        // Slot bloqueado
        html = `
          <div class="flex flex-col items-center justify-center bg-gray-800/70 rounded-2xl p-10 h-56 w-44 cursor-not-allowed">
            <i data-feather="lock" class="w-10 h-10 text-gray-500 mb-2"></i>
            <span class="text-gray-500 font-semibold text-lg">Bloqueado</span>
          </div>
        `;
      }
  
      container.innerHTML += html;
    });
  
    // Atualiza ícones
    feather.replace();
  }
  
  // Ações simuladas
  function selecionarDigimon(id) {
    alert(`Você selecionou digimon de id ${id}`);
  }
  
  function abrirSelecao() {
    alert("Você abriu o menu de seleção de Digimon!");
    window.location.href = "escolherDigitama.html";
  }
  
  // Logout
  document.getElementById("logout-btn").addEventListener("click", () => {
    alert("Você saiu da conta!");
  });
  
  // Inicialização da tela
  async function init() {
    const conta = await fetchConta();
    document.getElementById("valor-pontos").textContent = conta.pontosDigitais;
    renderSlots(conta.slots);
  }
  
  // Executa ao carregar
  init();
  