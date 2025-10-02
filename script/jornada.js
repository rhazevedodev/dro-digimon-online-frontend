// Helper rápido (caso não esteja importado de outro lugar)
const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  // Botão voltar → volta no histórico
  $("btn-back")?.addEventListener("click", () => window.history.back());

  // Abre a tela de Adventure Road
  document.querySelectorAll("[data-mode='adventure-road']").forEach(el => {
    el.addEventListener("click", () => {
      window.location.href = "adventure-road.html";
    });
  });
});
