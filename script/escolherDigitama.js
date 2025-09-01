document.addEventListener("DOMContentLoaded", () => {
    const digitamas = [
      {
        id: 1,
        nome: "Digitama Verde",
        imagem: "images/digimons/digitamas/digitama1.jpg",
        possiveis: ["Agumon", "Tentomon"]
      },
      {
        id: 2,
        nome: "Digitama Azul",
        imagem: "images/digimons/digitamas/digitama2.jpeg",
        possiveis: ["Gabumon", "Gomamon"]
      },
      {
        id: 3,
        nome: "Digitama Vermelha",
        imagem: "images/digimons/digitamas/digitama3.jpeg",
        possiveis: ["Piyomon", "Palmon"]
      },
      {
        id: 4,
        nome: "Digitama Vermelha",
        imagem: "images/digimons/digitamas/digitama4.jpeg",
        possiveis: ["Piyomon", "Palmon"]
      }
    ];
  
    const container = document.getElementById("digitamas-container");
  
    digitamas.forEach(d => {
      const card = document.createElement("div");
      card.className = "bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition transform cursor-pointer";
      card.innerHTML = `
        <img src="${d.imagem}" alt="${d.nome}" class="w-32 h-32 mx-auto mb-4">
        <h2 class="text-lg font-semibold text-center">${d.nome}</h2>
      `;
      
      card.addEventListener("click", () => {
        // Salva no localStorage para a próxima tela
        localStorage.setItem("digitamaEscolhida", JSON.stringify(d));
        window.location.href = "chocarDigitama.html";
      });
  
      container.appendChild(card);
    });
  });
  