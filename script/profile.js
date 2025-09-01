// Dados do jogador (mockado para teste, mas futuramente pode vir de API)
const playerData = {
    nome: "Rafael",
    nivel: 12,
    experiencia: { atual: 650, total: 1000 },
    avatar: "./images/digimons/rookies/renamon.jpg",
    moedas: {
      bits: 1250,
      cristais: 80
    },
    estatisticas: {
      vitorias: 45,
      derrotas: 12,
      digimons: 18,
      tempoJogo: "12h 30min"
    },
    digimons: [
      { nome: "Bearmon", nivel: 8, imagem: "./images/digimons/rookies/bearmon.jpg" },
      { nome: "Agumon", nivel: 12, imagem: "./images/digimons/rookies/agumon.jpg" },
      { nome: "Gabumon", nivel: 5, imagem: "./images/digimons/rookies/gabumon.jpg" },
      { nome: "Monmon", nivel: 78, imagem: "./images/digimons/rookies/monmon.jpg" },
      { nome: "Impmon", nivel: 36, imagem: "./images/digimons/rookies/impmon.jpg" }
    ],
    activeDigimon: "Gabumon" // <- Digimon atualmente ativo/logado
  };
  
  // Renderização dinâmica do perfil
  function renderProfile() {
    const container = document.getElementById("profile-container");
  
    container.innerHTML = `
      <!-- Avatar e Nome -->
      <img src="${playerData.avatar}" alt="Avatar Jogador" class="w-24 h-24 rounded-full border-4 border-yellow-400 mb-4">
      <h2 class="text-2xl font-bold">${playerData.nome}</h2>
      <p class="text-gray-400">Nível ${playerData.nivel}</p>
  
      <!-- Barra de XP -->
      <div class="w-full max-w-md mt-4">
        <p class="mb-1">Experiência</p>
        <div class="w-full bg-gray-700 rounded-full h-4 relative">
          <div class="bg-green-500 h-4 rounded-full" style="width: ${(playerData.experiencia.atual / playerData.experiencia.total) * 100}%;"></div>
          <span class="absolute inset-0 text-xs text-center text-white leading-4">
            ${playerData.experiencia.atual}/${playerData.experiencia.total}
          </span>
        </div>
      </div>
  
      <!-- Moedas -->
      <div class="flex justify-around w-full max-w-md mt-6">
        <div class="text-center">
          <p class="text-lg font-bold text-yellow-400">${playerData.moedas.bits}</p>
          <p class="text-sm text-gray-400">Bits</p>
        </div>
        <div class="text-center">
          <p class="text-lg font-bold text-blue-400">${playerData.moedas.cristais}</p>
          <p class="text-sm text-gray-400">Cristais</p>
        </div>
      </div>
  
      <!-- Estatísticas -->
      <div class="w-full max-w-md mt-6 bg-gray-800 p-4 rounded-lg shadow">
        <h3 class="text-lg font-bold mb-2">Estatísticas</h3>
        <p>Vitórias: <span class="text-green-400 font-bold">${playerData.estatisticas.vitorias}</span></p>
        <p>Derrotas: <span class="text-red-400 font-bold">${playerData.estatisticas.derrotas}</span></p>
        <p>Digimons Coletados: <span class="text-yellow-400 font-bold">${playerData.estatisticas.digimons}</span></p>
        <p>Tempo de Jogo: <span class="text-blue-400 font-bold">${playerData.estatisticas.tempoJogo}</span></p>
      </div>
  
      <!-- Digimons Favoritos -->
      <div class="w-full max-w-md mt-6">
        <h3 class="text-lg font-bold mb-2">Meus Digimons</h3>
        <div class="grid grid-cols-3 gap-4">
          ${playerData.digimons.map(d => `
            <div class="text-center">
              <img src="${d.imagem}" 
                   class="w-20 h-20 rounded-lg mx-auto ${d.nome === playerData.activeDigimon ? 'border-4 border-cyan-400 shadow-lg' : ''}">
              <p class="text-sm mt-1">${d.nome} Lv. ${d.nivel}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  
  // Inicializar tela
  document.addEventListener("DOMContentLoaded", renderProfile);
  