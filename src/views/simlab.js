/* Sim Lab — browsable library of all 21 sims, and a full-size player with live
   controls. Player controls are read straight from the sim definition so the
   sliders can update labParams live (no re-render), exactly like the unit
   panels; readouts (#labro-*) are filled by the frame loop. */
import { click, hover, slider, esc } from './dom.js';

const backBtn = (rc, v) => `
        <button ${click(rc, v.goHome)} style="display:inline-flex; align-items:center; gap:8px; margin:30px 0 16px; background:#ffffff; border:1px solid rgba(56,189,248,.3); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; color:#475569; padding:10px 18px;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7; background:#e6eef9;')}"><span style="font-size:14px;">←</span> ALL UNITS &amp; INDEX</button>`;

const header = `
        <header style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-left:4px solid #5eead4; border-radius:14px; padding:26px 32px; margin-bottom:8px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#0d9488; letter-spacing:.06em;">RESOURCE</div>
          <h1 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; line-height:1.1; margin:8px 0 0; color:#0f172a;">Sim Lab</h1>
        </header>`;

function library(rc, v) {
  return `
        <p style="font-size:14.5px; color:#64748b; margin:14px 2px 24px;">A library of <strong style="color:#1e293b;">21 playable simulations</strong> across all eight units. Pick one to open it full-size with live controls — no need to dig through a lesson.</p>
        ${v.labGroups.map((g) => `
          <div style="margin-bottom:26px;">
            <div style="display:flex; align-items:center; gap:10px; margin:0 2px 12px;">
              <span style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:${g.color};">UNIT ${esc(g.label)}</span>
              <span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; color:#1e293b;">${esc(g.title)}</span>
              <span style="flex:1; height:1px; background:rgba(56,189,248,.14);"></span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:13px;">
              ${g.sims.map((s) => `
                <button ${click(rc, s.go)} style="position:relative; display:flex; flex-direction:column; align-items:flex-start; gap:7px; text-align:left; cursor:pointer; padding:18px; background:#ffffff; border:1px solid rgba(56,189,248,.16); border-top:3px solid ${s.color}; border-radius:12px; min-height:128px;" class="${hover(rc, 'border-color:rgba(56,189,248,.4); transform:translateY(-3px);')}">
                  <span style="display:flex; align-items:center; gap:8px; font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.05em; color:#0d9488;"><span style="width:6px; height:6px; border-radius:50%; background:#5eead4; box-shadow:none;"></span>LIVE SIM</span>
                  <span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:16px; color:#0f172a; line-height:1.22;">${esc(s.title)}</span>
                  <span style="font-size:12.5px; color:#64748b; line-height:1.45;">${esc(s.desc)}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}`;
}

function player(rc, v, ctrl) {
  const cur = ctrl._findSim(ctrl.state.simSel);
  const lp = ctrl.state.labParams || {};
  const controls = cur.controls.map((c) => {
    const val = (lp[c.k] != null ? lp[c.k] : c.def);
    const labelId = 'labctl-' + c.k;
    return `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;"><span style="color:#475569;">${esc(c.label)}</span><span id="${labelId}" style="font-family:'IBM Plex Mono',monospace; color:#0284c7;">${esc(val + c.sfx)}</span></div>
                  ${slider(rc, { min: c.min, max: c.max, step: c.step, val, labelId, fmt: (n) => n + c.sfx, apply: (n) => { ctrl.state.labParams[c.k] = n; } })}
                </div>`;
  }).join('');
  const readouts = cur.readouts.map((r) => `
                <div style="flex:1; min-width:120px; background:#f3f6fb; border:1px solid rgba(56,189,248,.14); border-radius:8px; padding:10px 12px;">
                  <div style="font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.08em; color:#64748b;">${esc(r.label)}</div>
                  <div id="labro-${r.k}" style="font-family:'IBM Plex Mono',monospace; font-size:16px; color:${r.color};">—</div>
                </div>`).join('');
  return `
        <button ${click(rc, v.labBack)} style="display:inline-flex; align-items:center; gap:8px; margin:6px 0 18px; background:#ffffff; border:1px solid rgba(94,234,212,.4); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; color:#0d9488; padding:10px 18px;" class="${hover(rc, 'border-color:#0d9488; background:#e9f6f1;')}"><span style="font-size:14px;">←</span> BACK TO SIM LIBRARY</button>
        <div style="display:flex; align-items:baseline; gap:12px; margin:0 2px 4px;">
          <span style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:${v.labColor};">UNIT ${esc(v.labUnitLabel)}</span>
          <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:24px; color:#0f172a; margin:0;">${esc(v.labTitle)}</h2>
        </div>
        <p style="font-size:14px; color:#64748b; margin:0 2px 18px; max-width:640px;">${esc(v.labDesc)}</p>
        <div style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:13px; padding:16px 18px; box-shadow:0 10px 26px -18px rgba(15,23,42,.22);">
          <div style="display:flex; justify-content:space-between; align-items:center; font-family:'IBM Plex Mono',monospace; font-size:11px; color:#64748b; letter-spacing:.05em; margin-bottom:10px;"><span>SIMULATION</span><span style="display:flex; align-items:center; gap:6px; color:#0d9488;"><span style="width:7px; height:7px; border-radius:50%; background:#5eead4; box-shadow:none; animation:pulseDot 1.6s ease-in-out infinite;"></span>LIVE</span></div>
          <canvas id="lab-canvas" style="display:block; width:100%; height:360px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
          <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px 24px; margin-top:16px;">
${controls}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:16px;">
${readouts}
          </div>
        </div>`;
}

export function simlab(rc, v, ctrl) {
  return `${backBtn(rc, v)}${header}${v.labActive ? player(rc, v, ctrl) : library(rc, v)}`;
}
