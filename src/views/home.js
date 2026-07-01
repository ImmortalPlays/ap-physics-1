/* Home screen — hero, sim shortcuts, "how to use", exam overview, 8-unit grid. */
import { click, hover, esc } from './dom.js';

export function home(rc, v) {
  return `
        <header style="margin:0 0 0; background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:18px; overflow:hidden; box-shadow:0 14px 34px -20px rgba(15,23,42,.22); background-image:linear-gradient(rgba(56,189,248,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.09) 1px,transparent 1px); background-size:26px 26px;">
          <div style="display:grid; grid-template-columns:1.05fr .95fr;">
            <div style="padding:42px 38px;">
              <div style="font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.16em; color:#0284c7; margin-bottom:16px;">// ALGEBRA-BASED · 2024 CED · 8 UNITS</div>
              <h1 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:44px; line-height:1.02; margin:0; color:#0f172a;">The whole course,<br>drawn to scale.</h1>
              <div style="width:130px; height:2px; background:#38bdf8; box-shadow:none; margin:18px 0 20px;"></div>
              <p style="font-size:16.5px; color:#475569; max-width:400px; margin:0 0 28px;">Concepts, step-by-step worked solutions, and a <strong style="color:#1e293b;">live simulation for every topic</strong> — laid out like a lab manual you'd actually want to read.</p>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <button ${click(rc, v.goUnit1)} style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.05em; color:#0a1118; background:#38bdf8; border:none; padding:13px 24px; border-radius:8px; cursor:pointer; box-shadow:0 2px 8px -2px rgba(15,23,42,.14);" class="${hover(rc, 'background:#5fcbfb;')}">▶ OPEN UNIT 01</button>
                <a href="mock-exam.html" style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.05em; text-decoration:none; color:#0a1118; background:#5eead4; padding:13px 22px; border-radius:8px; box-shadow:0 2px 8px -2px rgba(15,23,42,.14);" class="${hover(rc, 'background:#7ff0dd;')}">📝 MOCK EXAM</a>
                <button ${click(rc, v.goSimLab)} style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.05em; color:#475569; background:transparent; border:1px solid rgba(56,189,248,.3); padding:13px 22px; border-radius:8px; cursor:pointer;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7;')}">SIM LAB</button>
              </div>
              <div style="display:flex; gap:30px; margin-top:30px; padding-top:24px; border-top:1px solid rgba(56,189,248,.14);">
                <div><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:26px; color:#0284c7; line-height:1;">8</div><div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.1em; color:#64748b; margin-top:5px;">UNITS</div></div>
                <div><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:26px; color:#0d9488; line-height:1;">21</div><div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.1em; color:#64748b; margin-top:5px;">LIVE SIMS</div></div>
                <div><div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:26px; color:#d97706; line-height:1;">20+</div><div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.1em; color:#64748b; margin-top:5px;">WORKED EXAMPLES</div></div>
              </div>
            </div>
            <div style="border-left:1px solid rgba(56,189,248,.18); padding:22px; display:flex; flex-direction:column;">
              <div style="display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#64748b; margin-bottom:10px; letter-spacing:.05em;">
                <span>FIG. A — ORBITAL DYNAMICS</span><span style="display:flex; align-items:center; gap:6px; color:#0284c7;"><span style="width:6px; height:6px; border-radius:50%; background:#38bdf8; box-shadow:none; animation:pulseDot 1.6s ease-in-out infinite;"></span>live</span>
              </div>
              <canvas id="hero-scene" style="display:block; width:100%; height:440px;"></canvas>
            </div>
          </div>
        </header>

        <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:23px; color:#0f172a; margin:46px 0 4px; display:flex; align-items:center; gap:11px;">
          <span style="width:12px; height:12px; border-radius:3px; background:#5eead4;"></span>Jump straight into a sim
        </h2>
        <p style="font-size:14.5px; color:#64748b; margin:0 0 16px;">Three favorites — or browse all 21 in the <span style="color:#0284c7; cursor:pointer;" ${click(rc, v.goSimLab)}>Sim Lab</span>.</p>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px;">
          <button ${click(rc, v.openProjectile)} style="display:flex; flex-direction:column; gap:0; text-align:left; cursor:pointer; padding:0; background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:12px; overflow:hidden;" class="${hover(rc, 'border-color:rgba(56,189,248,.45); transform:translateY(-3px);')}">
            <canvas id="home-mini-proj" style="display:block; width:100%; height:120px; background:#0b1220;"></canvas>
            <span style="padding:13px 15px;"><span style="display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#0284c7; margin-bottom:3px;">UNIT 01</span><span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; color:#0f172a;">Projectile Launcher</span></span>
          </button>
          <button ${click(rc, v.openPendulum)} style="display:flex; flex-direction:column; gap:0; text-align:left; cursor:pointer; padding:0; background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:12px; overflow:hidden;" class="${hover(rc, 'border-color:rgba(56,189,248,.45); transform:translateY(-3px);')}">
            <canvas id="home-mini-pend" style="display:block; width:100%; height:120px; background:#0b1220;"></canvas>
            <span style="padding:13px 15px;"><span style="display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#0d9488; margin-bottom:3px;">UNIT 07</span><span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; color:#0f172a;">Pendulum</span></span>
          </button>
          <button ${click(rc, v.openCollision)} style="display:flex; flex-direction:column; gap:0; text-align:left; cursor:pointer; padding:0; background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:12px; overflow:hidden;" class="${hover(rc, 'border-color:rgba(56,189,248,.45); transform:translateY(-3px);')}">
            <canvas id="home-mini-coll" style="display:block; width:100%; height:120px; background:#0b1220;"></canvas>
            <span style="padding:13px 15px;"><span style="display:block; font-family:'IBM Plex Mono',monospace; font-size:10px; color:#d97706; margin-bottom:3px;">UNIT 04</span><span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; color:#0f172a;">Collision Lab</span></span>
          </button>
        </div>

        <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:23px; color:#0f172a; margin:46px 0 14px; display:flex; align-items:center; gap:11px;">
          <span style="width:12px; height:12px; border-radius:3px; background:#38bdf8;"></span>What makes this different
        </h2>
        <p style="font-size:16px; color:#475569; max-width:680px; margin:0 0 14px;">Most study sites show you a static formula and a worked example. Here, every concept comes with an <strong style="color:#1e293b;">interactive simulation</strong> — drag the sliders, change the mass or angle or speed, and watch the physics respond in real time. You build intuition for <em>why</em> the equations behave the way they do, not just how to plug into them.</p>

        <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:23px; color:#0f172a; margin:42px 0 16px; display:flex; align-items:center; gap:11px;">
          <span style="width:12px; height:12px; border-radius:3px; background:#5eead4;"></span>How to use it
        </h2>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:14px;">
          <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:12px; padding:20px;">
            <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#0284c7; margin-bottom:10px;">STEP 01</div>
            <div style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15.5px; margin-bottom:5px; color:#0f172a;">Pick a unit</div>
            <div style="font-size:13.5px; color:#64748b;">Tap the menu (☰, top-left) and pick a unit.</div>
          </div>
          <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:12px; padding:20px;">
            <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#0d9488; margin-bottom:10px;">STEP 02</div>
            <div style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15.5px; margin-bottom:5px; color:#0f172a;">Play the sim</div>
            <div style="font-size:13.5px; color:#64748b;">Adjust variables and watch it run.</div>
          </div>
          <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:12px; padding:20px;">
            <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#d97706; margin-bottom:10px;">STEP 03</div>
            <div style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15.5px; margin-bottom:5px; color:#0f172a;">Work an example</div>
            <div style="font-size:13.5px; color:#64748b;">Follow a solution line by line.</div>
          </div>
        </div>

        <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:23px; color:#0f172a; margin:46px 0 16px; display:flex; align-items:center; gap:11px;">
          <span style="width:12px; height:12px; border-radius:3px; background:#a78bfa;"></span>The exam at a glance
        </h2>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-top:4px solid #38bdf8; border-radius:12px; padding:22px;">
            <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.08em; color:#0284c7;">SECTION I</div>
            <div style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:18px; margin:4px 0 12px; color:#0f172a;">Multiple Choice</div>
            <div style="font-size:14px; color:#475569;">40 questions · 80 min · 50% of score</div>
            <div style="font-size:14px; color:#64748b; margin-top:4px;">Single-select questions across all 8 units.</div>
          </div>
          <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-top:4px solid #a78bfa; border-radius:12px; padding:22px;">
            <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.08em; color:#7c3aed;">SECTION II</div>
            <div style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:18px; margin:4px 0 12px; color:#0f172a;">Free Response</div>
            <div style="font-size:14px; color:#475569;">4 questions · 100 min · 50% of score</div>
            <div style="font-size:14px; color:#64748b; margin-top:4px;">Includes an experimental-design question.</div>
          </div>
        </div>
        <p style="font-size:13.5px; color:#64748b; margin:12px 2px 0;">A graphing calculator is permitted on <strong style="color:#475569;">both</strong> sections, and a formula sheet is provided. Total time ≈ <strong style="color:#475569;">3 hours</strong>, held in early-to-mid May.</p>

        <div style="margin-top:18px; position:relative; overflow:hidden; background:#ffffff; border:1px solid rgba(94,234,212,.32); border-radius:14px; padding:24px 28px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;">
          <div>
            <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.12em; color:#0d9488; margin-bottom:6px;">// PRACTICE THE REAL THING</div>
            <h3 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:21px; color:#0f172a; margin:0 0 5px;">Take a full mock exam</h3>
            <p style="font-size:14px; color:#475569; margin:0; max-width:470px;">40 multiple-choice questions, randomly drawn and weighted to the official College Board blueprint, timed like the real thing — with instant scoring, a calculator, and a formula sheet.</p>
          </div>
          <a href="mock-exam.html" style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.05em; text-decoration:none; color:#0a1118; background:#5eead4; padding:13px 24px; border-radius:8px; box-shadow:0 2px 8px -2px rgba(15,23,42,.14); flex:none;" class="${hover(rc, 'background:#7ff0dd;')}">▶ START MOCK EXAM</a>
        </div>

        <h2 style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:23px; color:#0f172a; margin:48px 0 6px; display:flex; align-items:center; gap:11px;">
          <span style="width:12px; height:12px; border-radius:3px; background:#fbbf24;"></span>The 8 units
        </h2>
        <p style="font-size:14.5px; color:#64748b; margin:0 0 16px;">Percentages are the approximate exam weight — spend your time accordingly.</p>
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:14px;">
          ${v.navUnits.map((u) => `
            <button ${click(rc, u.go)} style="position:relative; display:flex; flex-direction:column; align-items:flex-start; gap:7px; text-align:left; cursor:pointer; padding:18px; background:#ffffff; border:1px solid rgba(56,189,248,.16); border-top:4px solid ${u.color}; border-radius:12px;" class="${hover(rc, 'border-color:rgba(56,189,248,.4); transform:translateY(-3px);')}">
              <span style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.06em; color:${u.color}; white-space:nowrap;">UNIT ${esc(u.label)}</span>
              <span style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15.5px; color:#0f172a; line-height:1.22;">${esc(u.title)}</span>
              <span style="font-size:12px; color:#64748b;">${esc(u.short)}</span>
              ${v.showWeights ? `
                <span style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#64748b; margin-top:2px;">${esc(u.weight)} of exam · sim: ${esc(u.sim)}</span>
              ` : ''}
            </button>
          `).join('')}
        </div>

        <div style="margin-top:48px; position:relative; overflow:hidden; background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:16px; padding:32px 36px; display:flex; align-items:center; justify-content:space-between; gap:24px; background-image:linear-gradient(rgba(56,189,248,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.09) 1px,transparent 1px); background-size:24px 24px;">
          <div>
            <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.14em; color:#0284c7; margin-bottom:8px;">// READY WHEN YOU ARE</div>
            <h3 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:24px; color:#0f172a; margin:0 0 6px;">Start with the basics, or just go play.</h3>
            <p style="font-size:14.5px; color:#475569; margin:0; max-width:440px;">Unit 1 builds the foundation; the Sim Lab lets you tinker with every concept hands-on.</p>
          </div>
          <div style="display:flex; gap:12px; flex:none;">
            <button ${click(rc, v.goUnit1)} style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.05em; color:#0a1118; background:#38bdf8; border:none; padding:13px 22px; border-radius:8px; cursor:pointer; box-shadow:0 2px 8px -2px rgba(15,23,42,.14);" class="${hover(rc, 'background:#5fcbfb;')}">▶ OPEN UNIT 01</button>
            <button ${click(rc, v.goSimLab)} style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; letter-spacing:.05em; color:#475569; background:transparent; border:1px solid rgba(56,189,248,.3); padding:13px 22px; border-radius:8px; cursor:pointer;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7;')}">SIM LAB</button>
          </div>
        </div>`;
}
