// ====== Mock "backend" (defaults) ======
const DEFAULT_SETTINGS = {
    account: { name: "Rafael", email: "rafael@exemplo.com", passwordHash: "hash_demo" },
    general: { lang: "pt-BR", theme: "dark" },
    notifications: { push: true, email: false },
    privacy: { publicProfile: true }
  };
  
  function loadSettings() {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  }
  function saveSettings(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
  }
  function $(id) { return document.getElementById(id); }
  
  // ====== Helpers de validação ======
  const NAME_REGEX = /^[A-Za-z0-9_-]{2,20}$/;
  function isValidName(name) { return NAME_REGEX.test(name.trim()); }
  function isValidEmail(email) {
    // validação simples
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
  function markValidity(inputEl, isValid) {
    inputEl.classList.toggle("error", !isValid);
  }
  
  // ====== Render ======
  function render(settings) {
    // Conta (editáveis)
    $("acc-name").value = settings.account.name;
    $("acc-email").value = settings.account.email;
  
    // Geral
    $("lang").value = settings.general.lang;
    $("theme").value = settings.general.theme;
  
    // Notificações & Privacidade
    $("notify-push").checked = settings.notifications.push;
    $("notify-email").checked = settings.notifications.email;
    $("public-profile").checked = settings.privacy.publicProfile;
  
    // Limpa campos de senha
    $("pwd-current").value = "";
    $("pwd-new").value = "";
    $("pwd-confirm").value = "";
  
    // limpa estados de erro
    markValidity($("acc-name"), true);
    markValidity($("acc-email"), true);
  }
  
  // ====== Coleta campos (inclui nome e e-mail) ======
  function collect(settings) {
    const name = $("acc-name").value.trim();
    const email = $("acc-email").value.trim();
  
    return {
      account: {
        name,
        email,
        passwordHash: settings.account.passwordHash
      },
      general: {
        lang: $("lang").value,
        theme: $("theme").value
      },
      notifications: {
        push: $("notify-push").checked,
        email: $("notify-email").checked
      },
      privacy: {
        publicProfile: $("public-profile").checked
      }
    };
  }
  
  // ====== Validação e persistência de nome/e-mail ======
  function validateAccountFields() {
    const name = $("acc-name").value;
    const email = $("acc-email").value;
  
    const okName = isValidName(name);
    const okEmail = isValidEmail(email);
  
    markValidity($("acc-name"), okName);
    markValidity($("acc-email"), okEmail);
  
    if (!okName && !okEmail) {
      alert("Verifique o apelido (2–20, letras/números/_/-) e o e-mail válido.");
    } else if (!okName) {
      alert("Apelido inválido. Use 2–20 caracteres: letras, números, _ ou -.");
    } else if (!okEmail) {
      alert("E-mail inválido. Verifique o formato (ex.: nome@exemplo.com).");
    }
    return okName && okEmail;
  }
  
  // ====== Troca de senha (simples) ======
  function validateAndChangePassword(settings) {
    const current = $("pwd-current").value;
    const pwdNew = $("pwd-new").value;
    const pwdConfirm = $("pwd-confirm").value;
  
    const MOCK_HASH = settings.account.passwordHash;
    const MOCK_CURRENT_VALID = current === "123456" || MOCK_HASH === "hash_demo";
  
    if (!current || !pwdNew || !pwdConfirm) {
      alert("Preencha todos os campos de senha.");
      return false;
    }
    if (!MOCK_CURRENT_VALID) {
      alert("Senha atual incorreta.");
      return false;
    }
    if (pwdNew.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (pwdNew !== pwdConfirm) {
      alert("A confirmação da senha não confere.");
      return false;
    }
  
    settings.account.passwordHash = "hash_" + btoa(pwdNew).slice(0, 12);
    alert("Senha alterada com sucesso!");
    return true;
  }
  
  // ====== Eventos ======
  document.addEventListener("DOMContentLoaded", () => {
    const settings = loadSettings();
    render(settings);
  
    // Live validation (opcional: valida ao sair do campo)
    $("acc-name").addEventListener("blur", () => markValidity($("acc-name"), isValidName($("acc-name").value)));
    $("acc-email").addEventListener("blur", () => markValidity($("acc-email"), isValidEmail($("acc-email").value)));
  
    $("btn-save").addEventListener("click", () => {
      if (!validateAccountFields()) return;
      const updated = collect(settings);
      saveSettings(updated);
      alert("Dados da conta e preferências salvos com sucesso!");
    });
  
    $("btn-reset").addEventListener("click", () => {
      if (confirm("Restaurar configurações para o padrão?")) {
        saveSettings(DEFAULT_SETTINGS);
        render(DEFAULT_SETTINGS);
      }
    });
  
    $("btn-cancel").addEventListener("click", () => {
      render(loadSettings());
      alert("Alterações canceladas.");
    });
  
    $("btn-back").addEventListener("click", () => {
      window.location.href = "home.html";
    });
  
    $("btn-logout").addEventListener("click", () => {
      alert("Você saiu da conta!");
      // Ex.: localStorage.clear(); window.location.href = "login.html";
    });
  
    $("btn-change-password").addEventListener("click", () => {
      const ok = validateAndChangePassword(settings);
      if (ok) {
        saveSettings(settings);
        $("pwd-current").value = "";
        $("pwd-new").value = "";
        $("pwd-confirm").value = "";
      }
    });
  });
  