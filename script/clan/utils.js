// Helpers genéricos
export const $ = (id) => document.getElementById(id);
export const pct = (p) => Math.min(100, Math.round((p.current / p.total) * 100));
export const setVisible = (el, visible) => el && el.classList.toggle("hidden", !visible);
export const timeNow = () => {
  const d = new Date(); return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
export const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
export const refreshIcons = () => { if (window.feather) window.feather.replace(); };
