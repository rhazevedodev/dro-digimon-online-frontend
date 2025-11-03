document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("digitamas-container");
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
    return;
  }

  try {
    // 🔹 1️⃣ — Verifica estado do jogador
    const estadoResp = await fetch("http://localhost:8080/estado", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!estadoResp.ok) throw new Error("Erro ao verificar estado do jogador.");
    const estado = await estadoResp.json();

    // 🔹 Redirecionamentos automáticos baseados no estado
    if (estado.digitamaSelecionada && !estado.digitamaChocada) {
      // Já escolheu uma digitama, mas ainda não chocou
      window.location.href = "chocarDigitama.html";
      return;
    }

    if (estado.digitamaChocada) {
      // Digitama já chocada → deve ir pra jornada
      window.location.href = "continuarJornada.html";
      return;
    }

    // 🔹 2️⃣ — Busca Digitamas do backend
    const response = await fetch("http://localhost:8080/digitamas", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Falha ao carregar Digitamas do servidor");
    const digitamas = await response.json();

    // 🔹 3️⃣ — Renderiza os Digitamas retornados
    container.innerHTML = "";
    digitamas.forEach(d => {
      const card = document.createElement("div");
      card.className =
        "bg-gray-800 p-4 rounded-xl shadow-md hover:scale-105 transition transform cursor-pointer";
      card.innerHTML = `
        <img src="${d.imagem}" alt="${d.nome}" class="w-32 h-32 mx-auto mb-4">
        <h2 class="text-lg font-semibold text-center">${d.nome}</h2>
      `;

      // 🔹 Clique → salva no backend e redireciona
      card.addEventListener("click", async () => {
        try {
          const resposta = await fetch("http://localhost:8080/digitamas/selecionar", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ digitamaId: d.id })
          });

          if (!resposta.ok) throw new Error("Falha ao registrar seleção da Digitama");

          localStorage.setItem("digitamaEscolhida", JSON.stringify(d));
          window.location.href = "chocarDigitama.html";
        } catch (erro) {
          console.error("Erro ao selecionar Digitama:", erro);
          alert("❌ Não foi possível selecionar a Digitama. Tente novamente.");
        }
      });

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro geral:", error);
    container.innerHTML =
      '<p class="text-red-400 text-center mt-4">Erro ao carregar Digitamas.</p>';
  }
});
