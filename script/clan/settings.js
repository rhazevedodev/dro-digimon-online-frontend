import { $ } from "./utils.js";
import { PLAYER, MOCK_CLAN } from "./state.js";

export function renderSettings(c){
  c.settings=c.settings||{minJoinLevel:1,recruitment:"invite",requireApproval:true,region:"",notes:""};
  $("set-weekly-target") && ($("set-weekly-target").value = c.weekly?.target ?? 5000);
  $("set-min-level") && ($("set-min-level").value = c.settings.minJoinLevel ?? 1);
  const rec=c.settings.recruitment||"invite";
  document.querySelectorAll('input[name="recruitment"]').forEach(r=>{ r.checked=(r.value===rec); });
  $("set-require-approval") && ($("set-require-approval").checked = !!c.settings.requireApproval);
  $("set-region") && ($("set-region").value = c.settings.region || "");
  $("set-notes") && ($("set-notes").value = c.settings.notes || "");
}
export function saveSettings(){
  if (PLAYER.role!=="leader" && PLAYER.role!=="officer") return alert("Apenas Líder/Oficiais podem alterar.");
  const weeklyTarget=parseInt(($("set-weekly-target")||{}).value,10);
  const minLv=parseInt(($("set-min-level")||{}).value,10);
  const recRadio=document.querySelector('input[name="recruitment"]:checked'); const recruitment=recRadio?recRadio.value:"invite";
  const requireApproval=!!(($("set-require-approval")||{}).checked);
  const region=(($("set-region")||{}).value||"").trim();
  const notes=(($("set-notes")||{}).value||"").trim();
  if(!Number.isFinite(weeklyTarget)||weeklyTarget<1) return alert("Meta semanal inválida.");
  if(!Number.isFinite(minLv)||minLv<1) return alert("Nível mínimo inválido.");
  MOCK_CLAN.weekly.target=weeklyTarget;
  Object.assign(MOCK_CLAN.settings, {minJoinLevel:minLv,recruitment,requireApproval,region,notes});
  MOCK_CLAN.activities.unshift({ text:`${PLAYER.name} atualizou as configurações do clã`, when:"agora" });
  alert("Configurações salvas!");
}
