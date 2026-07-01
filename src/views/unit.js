/* Unit screen. Concept + worked-example HTML lives in lessons.html (data,
   loaded by lessons-loader.js into the `.lesson[data-lesson]` placeholders);
   this view supplies the header, the interactive sim panel(s) for the unit, and
   the shared prev/next nav. Sim-panel sliders are wired to update state + their
   readout label WITHOUT a re-render (see slider() in dom.js), so a dragged
   control is never torn down and the canvas keeps drawing from live state. */
import { click, hover, slider, esc } from './dom.js';

const backBtn = (rc, v) => `
        <button ${click(rc, v.goHome)} style="display:inline-flex; align-items:center; gap:8px; margin:30px 0 16px; background:#ffffff; border:1px solid rgba(56,189,248,.3); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; color:#475569; padding:10px 18px;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7; background:#e6eef9;')}"><span style="font-size:14px;">←</span> ALL UNITS &amp; INDEX</button>`;

const lesson = (key, v) => `<div class="lesson" data-lesson="${key}" style="--ua:${v.activeColor};"></div>`;

// FIG header used atop every sim panel
const fig = (label) => `
            <div style="display:flex; justify-content:space-between; align-items:center; font-family:'IBM Plex Mono',monospace; font-size:11px; color:#64748b; letter-spacing:.05em; margin-bottom:10px;"><span>${label}</span><span style="display:flex; align-items:center; gap:6px; color:#0d9488;"><span style="width:7px; height:7px; border-radius:50%; background:#5eead4; box-shadow:none; animation:pulseDot 1.6s ease-in-out infinite;"></span>LIVE</span></div>`;

const ctl = (label, valueSpan) => `<div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:5px;"><span style="color:#475569;">${label}</span>${valueSpan}</div>`;
const valSpan = (id, txt) => `<span id="${id}" style="font-family:'IBM Plex Mono',monospace; color:#0284c7;">${txt}</span>`;
const readout = (id, label, color, minw) => `<div style="flex:1; min-width:${minw}px; background:#f3f6fb; border:1px solid rgba(56,189,248,.14); border-radius:8px; padding:10px 12px;"><div style="font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.08em; color:#64748b;">${label}</div><div id="${id}" style="font-family:'IBM Plex Mono',monospace; font-size:16px; color:${color};">—</div></div>`;

const panelWrap = (inner) => `
          <div style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:13px; padding:16px 18px; margin-bottom:18px; box-shadow:0 10px 26px -18px rgba(15,23,42,.22);">${inner}</div>`;

const simsHead = `
          <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:22px; color:#0f172a; margin:42px 0 6px; display:flex; align-items:center; gap:11px;"><span style="width:12px; height:12px; border-radius:3px; background:#5eead4;"></span>Interactive simulation</h2>`;
const simsHeadPlural = `
          <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:22px; color:#0f172a; margin:42px 0 6px; display:flex; align-items:center; gap:11px;"><span style="width:12px; height:12px; border-radius:3px; background:#5eead4;"></span>Interactive simulations</h2>`;
const solHead = `
          <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:22px; color:#0f172a; margin:42px 0 16px; display:flex; align-items:center; gap:11px;"><span style="width:12px; height:12px; border-radius:3px; background:#fbbf24;"></span>Step-by-step solutions</h2>`;

// ---- per-unit interactive panels ----
function panels(rc, v, ctrl, idx) {
  const sld = (o) => slider(rc, o);
  if (idx === 1) return `${simsHeadPlural}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Drag the sliders — the physics recalculates and replays in real time.</p>
${panelWrap(`${fig('FIG. B — PROJECTILE LAUNCHER')}
            <canvas id="sim-proj" style="display:block; width:100%; height:300px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px 26px; margin-top:14px;">
              <div>${ctl('Launch speed v₀', valSpan('lab-pv0', `${v.pv0} m/s`))}${sld({ min: 5, max: 45, step: 1, val: v.pv0, labelId: 'lab-pv0', fmt: n => n + ' m/s', apply: n => ctrl.state.pv0 = n })}</div>
              <div>${ctl('Launch angle θ', valSpan('lab-pang', `${v.pang}°`))}${sld({ min: 10, max: 80, step: 1, val: v.pang, labelId: 'lab-pang', fmt: n => n + '°', apply: n => ctrl.state.pang = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-range', 'RANGE', '#0d9488', 110)}
              ${readout('ro-apex', 'MAX HEIGHT', '#0d9488', 110)}
              ${readout('ro-time', 'FLIGHT TIME', '#0d9488', 110)}
              ${readout('ro-speed', 'CURRENT SPEED', '#d97706', 110)}
            </div>`)}
${panelWrap(`${fig('FIG. C — MOTION GRAPHS · CONSTANT ACCELERATION')}
            <canvas id="sim-mograph" style="display:block; width:100%; height:320px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px 26px; margin-top:14px;">
              <div>${ctl('Initial velocity v₀', valSpan('lab-mv0', `${v.mv0} m/s`))}${sld({ min: -6, max: 10, step: 0.5, val: v.mv0, labelId: 'lab-mv0', fmt: n => n + ' m/s', apply: n => ctrl.state.mv0 = n })}</div>
              <div>${ctl('Acceleration a', valSpan('lab-ma', `${v.ma} m/s²`))}${sld({ min: -4, max: 4, step: 0.5, val: v.ma, labelId: 'lab-ma', fmt: n => n + ' m/s²', apply: n => ctrl.state.ma = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-mt', 'TIME t', '#0d9488', 110)}
              ${readout('ro-mv', 'VELOCITY v', '#0d9488', 110)}
              ${readout('ro-mx', 'DISPLACEMENT Δx', '#d97706', 110)}
            </div>
            <p style="font-size:12.5px; color:#64748b; margin:12px 2px 0;">The shaded region under the <span style="color:#0284c7;">v–t line</span> is the displacement — watch it fill as time advances.</p>`)}`;
  if (idx === 2) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Change the angle, mass, and friction — see whether the block slides and how hard.</p>
${panelWrap(`${fig('FIG. 02 — INCLINED PLANE')}
            <canvas id="sim-incline" style="display:block; width:100%; height:280px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px 22px; margin-top:14px;">
              <div>${ctl('Angle θ', valSpan('lab-inA', `${v.inAngle}°`))}${sld({ min: 0, max: 60, step: 1, val: v.inAngle, labelId: 'lab-inA', fmt: n => n + '°', apply: n => ctrl.state.inAngle = n })}</div>
              <div>${ctl('Mass m', valSpan('lab-inM', `${v.inMass} kg`))}${sld({ min: 1, max: 10, step: 0.5, val: v.inMass, labelId: 'lab-inM', fmt: n => n + ' kg', apply: n => ctrl.state.inMass = n })}</div>
              <div>${ctl('Friction μ', valSpan('lab-inU', `${v.inMu}`))}${sld({ min: 0, max: 1, step: 0.05, val: v.inMu, labelId: 'lab-inU', fmt: n => '' + n, apply: n => ctrl.state.inMu = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-inNet', 'NET FORCE', '#0d9488', 120)}
              ${readout('ro-inAcc', 'ACCELERATION', '#0d9488', 120)}
              ${readout('ro-inState', 'STATE', '#d97706', 120)}
            </div>`)}`;
  if (idx === 3) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Watch kinetic and potential energy trade off as the ball rolls. Add friction to drain the total.</p>
${panelWrap(`${fig('FIG. 03 — ENERGY SKATE PARK')}
            <canvas id="sim-energy" style="display:block; width:100%; height:300px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px 22px; margin-top:14px;">
              <div>${ctl('Drop height h', valSpan('lab-enH', `${v.enH} m`))}${sld({ min: 1, max: 6, step: 0.5, val: v.enH, labelId: 'lab-enH', fmt: n => n + ' m', apply: n => ctrl.state.enH = n })}</div>
              <div>${ctl('Friction', valSpan('lab-enF', `${v.enF}`))}${sld({ min: 0, max: 1, step: 0.1, val: v.enF, labelId: 'lab-enF', fmt: n => '' + n, apply: n => ctrl.state.enF = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-enV', 'SPEED', '#d97706', 110)}
              ${readout('ro-enKE', 'KINETIC', '#0d9488', 110)}
              ${readout('ro-enPE', 'POTENTIAL', '#0284c7', 110)}
            </div>`)}`;
  if (idx === 4) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Collide two carts. Watch total momentum stay fixed while kinetic energy changes with the bounciness.</p>
${panelWrap(`${fig('FIG. 04 — COLLISION LAB')}
            <canvas id="sim-collide" style="display:block; width:100%; height:260px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px 22px; margin-top:14px;">
              <div>${ctl('Mass A', valSpan('lab-coM1', `${v.coM1} kg`))}${sld({ min: 1, max: 6, step: 0.5, val: v.coM1, labelId: 'lab-coM1', fmt: n => n + ' kg', apply: n => ctrl.state.coM1 = n })}</div>
              <div>${ctl('Mass B', valSpan('lab-coM2', `${v.coM2} kg`))}${sld({ min: 1, max: 6, step: 0.5, val: v.coM2, labelId: 'lab-coM2', fmt: n => n + ' kg', apply: n => ctrl.state.coM2 = n })}</div>
              <div>${ctl('Speed of A', valSpan('lab-coV1', `${v.coV1} m/s`))}${sld({ min: 1, max: 6, step: 0.5, val: v.coV1, labelId: 'lab-coV1', fmt: n => n + ' m/s', apply: n => ctrl.state.coV1 = n })}</div>
              <div>${ctl('Bounciness e', valSpan('lab-coE', `${v.coE}`))}${sld({ min: 0, max: 1, step: 0.1, val: v.coE, labelId: 'lab-coE', fmt: n => '' + n, apply: n => ctrl.state.coE = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-coP', 'TOTAL MOMENTUM', '#0d9488', 130)}
              ${readout('ro-coKE', 'KINETIC ENERGY', '#d97706', 130)}
            </div>`)}`;
  if (idx === 5) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Move the masses in and out — balance the see-saw by matching the torques on each side.</p>
${panelWrap(`${fig('FIG. 05 — TORQUE BALANCE')}
            <canvas id="sim-torque" style="display:block; width:100%; height:260px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px 22px; margin-top:14px;">
              <div>${ctl('Left mass', valSpan('lab-tqM1', `${v.tqM1} kg`))}${sld({ min: 1, max: 8, step: 0.5, val: v.tqM1, labelId: 'lab-tqM1', fmt: n => n + ' kg', apply: n => ctrl.state.tqM1 = n })}</div>
              <div>${ctl('Left distance', valSpan('lab-tqD1', `${v.tqD1} m`))}${sld({ min: 0.5, max: 3, step: 0.25, val: v.tqD1, labelId: 'lab-tqD1', fmt: n => n + ' m', apply: n => ctrl.state.tqD1 = n })}</div>
              <div>${ctl('Right mass', valSpan('lab-tqM2', `${v.tqM2} kg`))}${sld({ min: 1, max: 8, step: 0.5, val: v.tqM2, labelId: 'lab-tqM2', fmt: n => n + ' kg', apply: n => ctrl.state.tqM2 = n })}</div>
              <div>${ctl('Right distance', valSpan('lab-tqD2', `${v.tqD2} m`))}${sld({ min: 0.5, max: 3, step: 0.25, val: v.tqD2, labelId: 'lab-tqD2', fmt: n => n + ' m', apply: n => ctrl.state.tqD2 = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-tqL', 'LEFT TORQUE', '#0284c7', 110)}
              ${readout('ro-tqR', 'RIGHT TORQUE', '#0284c7', 110)}
              ${readout('ro-tqNet', 'STATE', '#d97706', 110)}
            </div>`)}`;
  if (idx === 6) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Pull the masses toward the axis. Angular momentum stays fixed — watch the spin rate jump.</p>
${panelWrap(`${fig('FIG. 06 — ANGULAR MOMENTUM')}
            <canvas id="sim-angular" style="display:block; width:100%; height:280px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr; gap:18px 22px; margin-top:14px; max-width:420px;">
              <div>${ctl('Mass radius r', valSpan('lab-agR', `${v.agR} m`))}${sld({ min: 0.4, max: 2, step: 0.1, val: v.agR, labelId: 'lab-agR', fmt: n => n + ' m', apply: n => ctrl.state.agR = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-agI', 'INERTIA I', '#0284c7', 100)}
              ${readout('ro-agW', 'SPIN ω', '#d97706', 100)}
              ${readout('ro-agL', 'MOMENTUM L', '#0d9488', 100)}
              ${readout('ro-agKE', 'ENERGY KE', '#db2777', 100)}
            </div>`)}`;
  if (idx === 7) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Lengthen the pendulum and watch the period grow — change the amplitude and notice it barely matters.</p>
${panelWrap(`${fig('FIG. 07 — PENDULUM')}
            <canvas id="sim-pendulum" style="display:block; width:100%; height:280px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px 22px; margin-top:14px;">
              <div>${ctl('Length L', valSpan('lab-peL', `${v.peL} m`))}${sld({ min: 0.5, max: 4, step: 0.25, val: v.peL, labelId: 'lab-peL', fmt: n => n + ' m', apply: n => ctrl.state.peL = n })}</div>
              <div>${ctl('Amplitude θ₀', valSpan('lab-peA', `${v.peA}°`))}${sld({ min: 5, max: 45, step: 1, val: v.peA, labelId: 'lab-peA', fmt: n => n + '°', apply: n => ctrl.state.peA = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-peT', 'PERIOD T', '#0d9488', 130)}
              ${readout('ro-peAng', 'CURRENT ANGLE', '#d97706', 130)}
            </div>`)}`;
  if (idx === 8) return `${simsHead}
          <p style="font-size:14.5px; color:#64748b; margin:0 0 18px;">Tune the block and fluid densities — see how much sinks below the waterline, or whether it drops to the bottom.</p>
${panelWrap(`${fig('FIG. 08 — BUOYANCY TANK')}
            <canvas id="sim-buoyancy" style="display:block; width:100%; height:280px; background:#0b1220; border:1px solid rgba(56,189,248,.14); border-radius:8px;"></canvas>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:18px 22px; margin-top:14px;">
              <div>${ctl('Block density', valSpan('lab-buB', `${v.buB} kg/m³`))}${sld({ min: 200, max: 1400, step: 50, val: v.buB, labelId: 'lab-buB', fmt: n => n + ' kg/m³', apply: n => ctrl.state.buB = n })}</div>
              <div>${ctl('Fluid density', valSpan('lab-buF', `${v.buF} kg/m³`))}${sld({ min: 600, max: 1300, step: 50, val: v.buF, labelId: 'lab-buF', fmt: n => n + ' kg/m³', apply: n => ctrl.state.buF = n })}</div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:14px;">
              ${readout('ro-buSub', 'SUBMERGED', '#0284c7', 110)}
              ${readout('ro-buW', 'WEIGHT', '#d97706', 110)}
              ${readout('ro-buState', 'STATE', '#0d9488', 110)}
            </div>`)}`;
  return '';
}

export function unit(rc, v, ctrl) {
  const n = ctrl.state.unitIdx;
  return `${backBtn(rc, v)}
        <header style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-left:4px solid ${v.activeColor}; border-radius:14px; padding:26px 32px; margin-bottom:24px; background-image:linear-gradient(rgba(56,189,248,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.09) 1px,transparent 1px); background-size:24px 24px;">
          <div style="display:flex; align-items:center; gap:12px; font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:${v.activeColor}; letter-spacing:.06em;">
            <span>FIG. ${esc(v.activeNum)} — UNIT ${esc(v.activeNum)}</span>
            ${v.showWeights ? `<span style="background:rgba(56,189,248,.14); padding:2px 9px; border-radius:5px; color:#475569;">${esc(v.activeWeight)} of exam</span>` : ''}
          </div>
          <h1 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:32px; line-height:1.08; margin:9px 0 0; color:#0f172a;">${esc(v.activeTitle)}</h1>
        </header>

        ${lesson(n + '-concepts', v)}
${panels(rc, v, ctrl, n)}
${solHead}
        ${lesson(n + '-examples', v)}

        <div style="display:flex; justify-content:space-between; align-items:center; gap:14px; margin-top:28px;">
          <button ${click(rc, v.goHome)} style="display:inline-flex; align-items:center; gap:7px; padding:11px 18px; background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:500; font-size:12.5px; color:#64748b;" class="${hover(rc, 'border-color:#0284c7;')}">← INDEX</button>
          <div style="display:flex; gap:10px;">
            ${v.hasPrev ? `<button ${click(rc, v.goPrev)} style="display:inline-flex; align-items:center; gap:7px; padding:11px 18px; background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:500; font-size:12.5px; color:#64748b;" class="${hover(rc, 'border-color:#0284c7;')}">← UNIT ${esc(v.prevNum)}</button>` : ''}
            ${v.hasNext ? `<button ${click(rc, v.goNext)} style="display:inline-flex; align-items:center; gap:7px; padding:11px 18px; background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:500; font-size:12.5px; color:#0284c7;" class="${hover(rc, 'border-color:#0284c7;')}">UNIT ${esc(v.nextNum)}: ${esc(v.nextTitle)} →</button>` : ''}
          </div>
        </div>`;
}
