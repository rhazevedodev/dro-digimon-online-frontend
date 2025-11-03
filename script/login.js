// Função real de autenticação no backend
async function autenticar(username, password) {
  const url = "http://localhost:8080/auth/login";
  const body = { username, password };

  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      throw new Error(erro || "Falha na autenticação");
    }

    const data = await resposta.json();

    // Salva o token e o nome do usuário localmente
    localStorage.setItem("jwtToken", data.token);
    localStorage.setItem("username", data.username);

    return data;
  } catch (erro) {
    console.error("Erro na autenticação:", erro);
    throw erro.message || "Erro ao conectar ao servidor";
  }
}

// Função para buscar os dados do jogador logado
async function buscarJogadorLogado() {
  const url = "http://localhost:8080/jogador/me";
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("Token não encontrado. Faça login novamente.");
  }

  try {
    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.log(erro);
      throw new Error(erro || `Falha ao buscar dados do jogador (${resposta.status})`);
    }

    const jogador = await resposta.json();
    console.log("🎮 Dados do jogador:", jogador);

    // Salva o ID do jogador no localStorage
    localStorage.setItem("jogadorId", jogador.id);

    return jogador;
  } catch (erro) {
    console.error("Erro ao buscar jogador logado:", erro);
    alert("❌ Não foi possível carregar os dados do jogador. Verifique sua conexão ou o login.");
    throw erro;
  }
}

// Listener do formulário de login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const resposta = await autenticar(username, password);
    alert(`✅ Bem-vindo, ${resposta.username}!`);

    // Busca os dados do jogador logado
    const jogador = await buscarJogadorLogado();
    console.log(jogador);

    if (jogador.primeiroAcesso) {
      window.location.href = "escolherDigitama.html";
      console.log("escolherDigitama.html");
    } else {
      window.location.href = "continuarJornada.html";
      console.log("continuarJornada.html");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    alert(`❌ ${err.message || err}`);
  }
});
