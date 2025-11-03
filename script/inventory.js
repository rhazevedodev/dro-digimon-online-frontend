// MOCK DE INVENTÁRIO
const playerInventory = {
    resources: [
      { name: "Bits", icon: "💰", quantity: 12450, rarity: "common", description: "Moeda básica do mundo digital." },
      { name: "Energia Digital", icon: "⚡", quantity: 12, rarity: "rare", description: "Usada para energizar dispositivos e Digimons." }
    ],
    fragments: [
      { name: "Fragmento Baby II", icon: "🔹", quantity: 20, rarity: "common", description: "Usado para evoluir Digimons estágio Baby II." },
      { name: "Fragmento Rookie", icon: "🔸", quantity: 8, rarity: "rare", description: "Usado para evoluir Digimons estágio Rookie." },
      { name: "Fragmento Champion", icon: "🔶", quantity: 3, rarity: "epic", description: "Essência para evolução Champion." }
    ],
    equipments: [
      { name: "Espada Digital", icon: "🗡️", rarity: "rare", description: "Aumenta o ataque em +15.",
        actionLabel: "Equipar", actionType: "equip", actionMessage: "⚙️ Você equipou a Espada Digital!" },
      { name: "Armadura Lendária", icon: "🛡️", rarity: "legendary", description: "Aumenta a defesa em +30.",
        actionLabel: "Equipar", actionType: "equip", actionMessage: "🛡️ A Armadura Lendária foi equipada com sucesso!" }
    ],
    others: [
      { name: "Ticket de Batalha", icon: "🎟️", quantity: 5, rarity: "rare", description: "Permite entrar em batalhas especiais.",
        actionLabel: "Usar Ticket", actionType: "use", actionMessage: "🎟️ Ticket usado! Você entrou em uma batalha especial." },
      { name: "Ovo Misterioso", icon: "🥚", rarity: "epic", description: "Um ovo misterioso que pode chocar um Digimon raro.",
        actionLabel: "Chocar Ovo", actionType: "hatch", actionMessage: "🐣 O ovo começou a brilhar e vai chocar em breve!" },
      { name: "Baú de Recompensas", icon: "🗃️", rarity: "epic", description: "Contém itens aleatórios.",
        actionLabel: "Abrir Baú", actionType: "open", actionMessage: "🗃️ Você abriu o baú e encontrou recompensas incríveis!" }
    ]
  };
  
  const rarityClassMap = {
    common: "raridade-comum",
    rare: "raridade-rara",
    epic: "raridade-epica",
    legendary: "raridade-lendaria"
  };
  
  let currentCategory = "resources";
  
  /* ================= RENDERIZAÇÃO DO INVENTÁRIO ================= */
  function renderInventory() {
    const grid = document.getElementById("inventory-grid");
    grid.innerHTML = "";
  
    const items = playerInventory[currentCategory] || [];
    if (items.length === 0) {
      grid.innerHTML = `<p class="col-span-3 text-center text-gray-400 mt-6">Nenhum item nesta categoria.</p>`;
      return;
    }
  
    items.forEach(item => {
      const rarityClass = rarityClassMap[item.rarity] || "raridade-comum";
      const div = document.createElement("div");
      div.className = `item-card ${rarityClass}`;
      div.innerHTML = `
        <div class="text-3xl mb-1">${item.icon || "❔"}</div>
        <p class="font-semibold text-xs sm:text-sm truncate w-full px-1">${item.name}</p>
        ${item.quantity ? `<p class="text-[10px] sm:text-xs text-gray-400">x${item.quantity}</p>` : ""}
      `;
      div.onclick = () => showItemModal(item, rarityClass);
      grid.appendChild(div);
    });
  }
  
  /* ================= MODAL DO ITEM ================= */
  function showItemModal(item, rarityClass) {
    document.getElementById("modal-icon").textContent = item.icon || "❔";
    document.getElementById("modal-name").textContent = item.name;
    document.getElementById("modal-description").textContent = item.description || "Sem descrição disponível.";
    document.getElementById("modal-extra").textContent = item.quantity ? `Quantidade: ${item.quantity}` : "";
  
    const modalBox = document.querySelector("#item-modal > div");
    modalBox.classList.remove("raridade-comum","raridade-rara","raridade-epica","raridade-lendaria");
    modalBox.classList.add(rarityClass);
  
    const btn = document.getElementById("modal-action");
    if (item.actionLabel) {
      btn.textContent = item.actionLabel;
      btn.classList.remove("hidden");
      btn.onclick = () => handleItemAction(item);
    } else {
      btn.classList.add("hidden");
    }
  
    document.getElementById("item-modal").classList.remove("hidden");
  }
  
  /* ================= EXECUÇÃO DE AÇÃO DO ITEM ================= */
  function handleItemAction(item) {
    // mensagem parametrizada ou fallback padrão
    const message = item.actionMessage || "Você utilizou o item.";
    alert(message);
    closeModal();
  }
  
  /* ================= CONTROLE DO MODAL ================= */
  function closeModal() {
    document.getElementById("item-modal").classList.add("hidden");
  }
  
  /* ================= EVENTOS GERAIS ================= */
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-back")?.addEventListener("click", () => {
      window.location.href = "home.html";
    });
    document.getElementById("close-modal")?.addEventListener("click", closeModal);
    document.getElementById("item-modal")?.addEventListener("click", e => {
      if (e.target.id === "item-modal") closeModal();
    });
  
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        document.querySelectorAll(".tab-btn").forEach(b => {
          b.classList.remove("bg-blue-700");
          b.classList.add("bg-gray-700");
        });
        e.currentTarget.classList.remove("bg-gray-700");
        e.currentTarget.classList.add("bg-blue-700");
        currentCategory = e.currentTarget.dataset.category;
        renderInventory();
      });
    });
  
    renderInventory();
  });
  