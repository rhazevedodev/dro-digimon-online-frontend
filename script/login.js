// Simulação de login
function autenticar(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "teste" && password === "123") {
          resolve({ sucesso: true, usuario: { nome: "Jogador Teste", pontos: 1250 } });
        } else {
          reject("Usuário ou senha inválidos!");
        }
      }, 600); // simula delay do backend
    });
  }
  
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const resposta = await autenticar(username, password);
      alert(`Bem-vindo ${resposta.usuario.nome}! Pontos Digitais: ${resposta.usuario.pontos}`);
      // Aqui poderia redirecionar para a tela principal
      // window.location.href = "home.html";
    } catch (err) {
      alert(err);
    }
  });
  