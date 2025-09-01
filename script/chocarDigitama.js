document.addEventListener("DOMContentLoaded", () => {
    const digitama = JSON.parse(localStorage.getItem("digitamaEscolhida"));
    const img = document.getElementById("digitama-img");
    const status = document.getElementById("cliques-restantes");
    const btnContinuar = document.getElementById("continuar-btn");
  
    let cliquesNecessarios = 3;
    img.src = digitama.imagem;
    status.textContent = `Clique ${cliquesNecessarios} vezes para chocar!`;
  
    img.addEventListener("click", () => {
      if (cliquesNecessarios > 0) {
        cliquesNecessarios--;
  
        // animação de balançar
        img.classList.add("balancar");
        setTimeout(() => img.classList.remove("balancar"), 600);
  
        if (cliquesNecessarios > 0) {
          status.textContent = `Faltam ${cliquesNecessarios} cliques...`;
        } else {
          // sorteia apenas 1 digimon
          const sorteado = digitama.possiveis[Math.floor(Math.random() * digitama.possiveis.length)];
          img.src = `images/digimons/rookies/${sorteado.toLowerCase()}.jpg`;
          status.textContent = `Seu Digimon é: ${sorteado}! 🎉`;
  
          // mostra o botão de continuar
          btnContinuar.classList.remove("hidden");
        }
      }
    });
  
    // Botão continuar
    btnContinuar.addEventListener("click", () => {
      window.location.href = "continuarJornada.html";
    });
  });
  