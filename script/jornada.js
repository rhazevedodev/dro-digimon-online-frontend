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
  //Abre a tela de torre digital
  document.querySelectorAll("[data-mode='digital-tower']").forEach(el => {
    el.addEventListener("click", () => {
      window.location.href = "digital-tower.html";
    });
  });
  //Abre a tela de daily challenges
  document.querySelectorAll("[data-mode='daily-challenges']").forEach(el => {
    el.addEventListener("click", () => {
      window.location.href = "daily-challenges.html";
    });
  });
});
