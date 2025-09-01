// ===== Mock "backend" =====
const ME = { code: "RAFA-7KX3", name: "Rafael" };
const MOCK_FRIENDS = [
  { id: "u1", name: "Agus", level: 18, avatar: "./images/digimons/rookies/agumon.jpg", online: true },
  { id: "u2", name: "Gabu", level: 12, avatar: "./images/digimons/rookies/gabumon.jpg", online: false },
  { id: "u3", name: "Ren",  level: 27, avatar: "./images/digimons/rookies/renamon.jpg", online: true },
];
const MOCK_REQUESTS = [
  { id: "r1", from: { name: "Imp", avatar: "./images/digimons/rookies/impmon.jpg" }, msg: "Bora clã?" },
  { id: "r2", from: { name: "Mon", avatar: "./images/digimons/rookies/monmon.jpg" }, msg: "Vamos treinar!" },
];
const MOCK_DISCOVER = [
  { id: "d1", name: "Goma", level: 9, avatar: "./images/digimons/rookies/gomamon.jpg" },
  { id: "d2", name: "Pal", level: 14, avatar: "./images/digimons/rookies/palmon.jpg" },
  { id: "d3", name: "Piyo", level: 7, avatar: "./images/digimons/rookies/piyomon.jpg" },
  { id: "d4", name: "Tent", level: 11, avatar: "./images/digimons/rookies/tentomon.jpg" },
];

// ===== State =====
let state = {
  tab: "friends",
  friends: JSON.parse(localStorage.getItem("friends") || "null") || MOCK_FRIENDS.slice(),
  requests: JSON.parse(localStorage.getItem("requests") || "null") || MOCK_REQUESTS.slice(),
  discover: MOCK_DISCOVER.slice(),
  myCode: localStorage.getItem("myCode") || ME.code,
  search: ""
};

// ===== Utils =====
function $(id) { return document.getElementById(id); }
function save() {
  localStorage.setItem("friends", JSON.stringify(state.friends));
  localStorage.setItem("requests", JSON.stringify(state.requests));
  localStorage.setItem("myCode", state.myCode);
}
function avatarOrFallback(src) { return src || "https://via.placeholder.com/64?text=?"; }

// ===== Render =====
function renderHeader() { $("my-code").textContent = state.myCode; }

function setActiveTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  $("discover-controls").classList.toggle("hidden", tab !== "discover");
  renderList();
}

function renderList() {
  const list = $("list-container"), empty = $("empty-state");
  list.innerHTML = "";

  let data = [];
  if (state.tab === "friends") data = state.friends;
  if (state.tab === "requests") data = state.requests;
  if (state.tab === "discover") {
    const q = state.search.trim().toLowerCase();
    data = !q ? state.discover : state.discover.filter(d => d.name.toLowerCase().includes(q));
  }

  if (!data.length) { empty.classList.remove("hidden"); if (window.feather) feather.replace(); return; }
  empty.classList.add("hidden");

  const frag = document.createDocumentFragment();

  if (state.tab === "friends") {
    data.forEach(u => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img class="avatar" src="${avatarOrFallback(u.avatar)}" alt="${u.name}">

        <div class="hdr min-w-0">
          <p class="title truncate">${u.name}</p>
          <div class="status-row">
            <span class="status-dot ${u.online ? "status-online" : "status-offline"}"></span>
            <span class="badge ${u.online ? "online" : "offline"}">${u.online ? "Online" : "Offline"}</span>
          </div>
        </div>

        <div class="meta-wrap">
          <p class="meta">Nível ${u.level}</p>
        </div>

        <div class="card-actions">
          <button class="btn btn-outline" data-action="profile" data-id="${u.id}">
            <i data-feather="user"></i> <span class="btn-label">Perfil</span>
          </button>
          <button class="btn btn-ghost" data-action="message" data-id="${u.id}">
            <i data-feather="message-circle"></i> <span class="btn-label">Mensagem</span>
          </button>
          <button class="btn btn-danger" data-action="remove" data-id="${u.id}">
            <i data-feather="user-x"></i> <span class="btn-label">Remover</span>
          </button>
        </div>
      `;
      frag.appendChild(card);
    });
  }

  if (state.tab === "requests") {
    data.forEach(r => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img class="avatar" src="${avatarOrFallback(r.from.avatar)}" alt="${r.from.name}">
        <div class="min-w-0">
          <p class="title truncate">${r.from.name}</p>
          <p class="meta">${r.msg || "Solicitação de amizade"}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" data-action="accept" data-id="${r.id}">
            <i data-feather="check"></i> <span class="btn-label">Aceitar</span>
          </button>
          <button class="btn btn-outline" data-action="reject" data-id="${r.id}">
            <i data-feather="x"></i> <span class="btn-label">Recusar</span>
          </button>
        </div>
      `;
      frag.appendChild(card);
    });
  }

  if (state.tab === "discover") {
    data.forEach(u => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img class="avatar" src="${avatarOrFallback(u.avatar)}" alt="${u.name}">
        <div class="min-w-0">
          <p class="title truncate">${u.name}</p>
          <p class="meta">Nível ${u.level}</p>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary" data-action="add" data-id="${u.id}">
            <i data-feather="user-plus"></i> <span class="btn-label">Adicionar</span>
          </button>
        </div>
      `;
      frag.appendChild(card);
    });
  }

  list.appendChild(frag);
  if (window.feather) feather.replace();

  // wire actions
  list.querySelectorAll("[data-action]").forEach(btn => {
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    btn.addEventListener("click", () => handleAction(action, id));
  });
}

// ===== Actions =====
function handleAction(action, id) {
  if (state.tab === "friends") {
    const idx = state.friends.findIndex(f => f.id === id);
    if (idx === -1) return;

    if (action === "profile") {
      alert(`Abrir perfil de ${state.friends[idx].name}`);
      // window.location.href = `profile.html?u=${id}`;
    }
    if (action === "message") {
      alert(`Abrir chat com ${state.friends[idx].name} (em breve)`);
    }
    if (action === "remove") {
      if (confirm(`Remover ${state.friends[idx].name} da sua lista?`)) {
        state.friends.splice(idx, 1);
        save(); renderList();
      }
    }
  }

  if (state.tab === "requests") {
    const idx = state.requests.findIndex(r => r.id === id);
    if (idx === -1) return;
    const req = state.requests[idx];
    if (action === "accept") {
      state.friends.push({
        id: "f_" + req.id,
        name: req.from.name,
        level: 1 + Math.floor(Math.random() * 20),
        avatar: req.from.avatar,
        online: Math.random() > 0.5
      });
      state.requests.splice(idx, 1);
      save(); renderList();
      alert(`Você e ${req.from.name} agora são amigos!`);
    }
    if (action === "reject") {
      state.requests.splice(idx, 1);
      save(); renderList();
    }
  }

  if (state.tab === "discover") {
    if (action === "add") {
      const u = state.discover.find(x => x.id === id);
      if (!u) return;
      alert(`Solicitação enviada para ${u.name}!`);
    }
  }
}

function addFriendFromInput() {
  const value = $("add-input").value.trim();
  if (!value) { alert("Digite um apelido ou código."); return; }

  const isCode = /[-]/.test(value) || value.length >= 8;
  if (isCode) {
    if (value.toUpperCase() === state.myCode.toUpperCase()) {
      alert("Você não pode adicionar seu próprio código!");
      return;
    }
    alert(`Solicitação enviada para o código: ${value}`);
    $("add-input").value = "";
    return;
  }

  const found = state.discover.find(u => u.name.toLowerCase() === value.toLowerCase());
  if (found) {
    alert(`Solicitação enviada para ${found.name}!`);
  } else {
    alert(`Não encontramos "${value}".`);
  }
  $("add-input").value = "";
}

function copyMyCode() {
  const code = state.myCode;
  navigator.clipboard?.writeText(code).then(() => {
    alert("Código copiado!");
  }).catch(() => {
    const area = document.createElement("textarea");
    area.value = code; document.body.appendChild(area);
    area.select(); document.execCommand("copy"); document.body.removeChild(area);
    alert("Código copiado!");
  });
}

// ===== Wire =====
document.addEventListener("DOMContentLoaded", () => {
  $("btn-back").addEventListener("click", () => window.location.href = "home.html");
  $("btn-copy").addEventListener("click", copyMyCode);
  $("btn-add").addEventListener("click", addFriendFromInput);

  document.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => setActiveTab(t.dataset.tab));
  });

  $("search-input").addEventListener("input", e => {
    state.search = e.target.value;
    renderList();
  });

  renderHeader();
  setActiveTab("friends");
});
