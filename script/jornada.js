// Helper rápido (caso não esteja importado de outro lugar)
const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  // Botão voltar → volta no histórico
  document.getElementById("btn-back")?.addEventListener("click", () => {
    window.location.href = "home.html";
  });

  // Abre a tela de Adventure Road
  document.querySelectorAll("[data-mode='adventure-road']").forEach(el => {
    el.addEventListener("click", () => {
      window.location.href = "adventure-road.html";
    });
  });
  //Abre a tela de Expedicoes
  document.querySelectorAll("[data-mode='expeditions']").forEach(el => {
    el.addEventListener("click", () => {
      window.location.href = "expeditions.html";
    });
  });
});
