document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken");
  const digitama = JSON.parse(localStorage.getItem("digitamaEscolhida"));
  const img = document.getElementById("digitama-img");
  const status = document.getElementById("cliques-restantes");
  const btnContinuar = document.getElementById("continuar-btn");

  if (!token) {
    alert("Sessão expirada! Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  // 🔹 1️⃣ Verifica o estado atual do jogador
  try {
    const respEstado = await fetch("http://localhost:8080/estado", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const estado = await respEstado.json();

    // Redirecionamentos automáticos baseados no estado
    if (!estado.digitamaSelecionada) {
      // Ainda não escolheu uma Digitama → volta pra escolha
      window.location.href = "escolherDigitama.html";
      return;
    }

    if (estado.digitamaChocada) {
      // Já chocou → vai pra jornada
      window.location.href = "continuarJornada.html";
      return;
    }
  } catch (erro) {
    console.error("Erro ao verificar estado:", erro);
    alert("Falha ao carregar o estado do jogador.");
    return;
  }

  // 🔹 2️⃣ Renderiza o Digitama e começa o fluxo de cliques
  let cliquesNecessarios = 3;
  img.src = digitama.imagem;
  status.textContent = `Clique ${cliquesNecessarios} vezes para chocar!`;

  img.addEventListener("click", async () => {
    if (cliquesNecessarios > 0) {
      cliquesNecessarios--;

      // Animação de balançar
      img.classList.add("balancar");
      setTimeout(() => img.classList.remove("balancar"), 600);

      if (cliquesNecessarios > 0) {
        status.textContent = `Faltam ${cliquesNecessarios} cliques...`;
      } else {
        // 🔹 Mostra feedback visual enquanto "choca"
        status.textContent = `Chocando o Digitama... 🔥`;

        try {
          const resposta = await fetch("http://localhost:8080/digitamas/chocar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ digitamaId: digitama.id })
          });

          if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(erroTexto || `Erro ao chocar Digitama (${resposta.status})`);
          }

          const data = await resposta.json();

          // 🔹 Atualiza imagem e status com o resultado do backend
          img.src = data.imagem;
          status.textContent = `Seu Digimon é: ${data.nome}! 🎉`;

          // 🔹 Salva o Digimon retornado localmente
          localStorage.setItem("digimonChocado", JSON.stringify(data));

          // 🔹 Mostra o botão de continuar
          btnContinuar.classList.remove("hidden");

        } catch (erro) {
          console.error("Erro ao chocar Digitama:", erro);
          alert("❌ Erro ao se comunicar com o servidor. Tente novamente.");
          status.textContent = "Falha ao chocar o Digitama.";
        }
      }
    }
  });

  // 🔹 3️⃣ Botão continuar
  btnContinuar.addEventListener("click", () => {
    window.location.href = "continuarJornada.html";
  });
});
