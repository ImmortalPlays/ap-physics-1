/* App shell: collapsible sidebar (logo, search, unit nav, resources) + the main
   content column. `content` is the active screen's HTML, injected into
   #phys-content. Markup mirrors the original design 1:1. */
import { click, input, keydown, hover, focus, esc } from './dom.js';

export function shell(rc, v, content) {
  return `
<div style="display:flex; align-items:flex-start; min-height:100vh; background:#eef2f7; color:#334155; font-family:'IBM Plex Sans',sans-serif; line-height:1.6; background-image:linear-gradient(rgba(56,189,248,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,.09) 1px,transparent 1px); background-size:28px 28px;">

  <button ${click(rc, v.toggleNav)} aria-label="Toggle menu" style="display:${v.navBtnDisplay}; position:fixed; top:14px; left:14px; z-index:60; width:42px; height:42px; border-radius:9px; background:#ffffff; border:1px solid rgba(56,189,248,.3); color:#0284c7; font-size:18px; line-height:1; cursor:pointer; box-shadow:0 4px 12px -6px rgba(15,23,42,.18);">☰</button>
  <div ${click(rc, v.toggleNav)} style="position:fixed; inset:0; z-index:40; background:rgba(4,9,14,.55); display:${v.navBackdrop};"></div>

  <aside style="position:fixed; top:0; left:0; z-index:50; width:264px; height:100vh; overflow-y:auto; background:#ffffff; border-right:1px solid rgba(56,189,248,.18); padding:20px 14px 30px; box-sizing:border-box; transform:${v.navT}; transition:transform .25s ease; box-shadow:3px 0 18px -14px rgba(15,23,42,.16);">
    <button ${click(rc, v.goHome)} style="display:flex; align-items:center; gap:11px; width:100%; background:none; border:none; cursor:pointer; padding:6px 8px; margin-bottom:18px;">
      <span style="width:34px; height:34px; border:1.5px solid #38bdf8; border-radius:7px; color:#0284c7; display:flex; align-items:center; justify-content:center; font-weight:600; font-size:14px; font-family:'IBM Plex Mono',monospace; box-shadow:none;">P1</span>
      <span style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.15;">
        <span style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:14px; letter-spacing:.06em; color:#0f172a;">AP PHYSICS 1</span>
        <span style="font-size:10.5px; color:#64748b; font-weight:500; letter-spacing:.04em;">Simulated study guide</span>
      </span>
    </button>

    <div style="position:relative; margin-bottom:8px;">
      <input data-focus-key="search" value="${esc(v.query)}" ${input(rc, v.onSearch)} ${keydown(rc, v.onSearchKey)} placeholder="Search concepts &amp; sims…" class="${focus(rc, 'border-color:#0284c7; box-shadow:0 0 0 3px rgba(56,189,248,.3);')}" style="width:100%; box-sizing:border-box; padding:9px 28px 9px 30px; border:1px solid rgba(56,189,248,.2); border-radius:8px; background:#f3f6fb; font-family:'IBM Plex Sans',sans-serif; font-size:12.5px; font-weight:500; color:#334155; outline:none;">
      <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#64748b; font-size:13px; pointer-events:none;">⌕</span>
      ${v.searching ? `
        <button ${click(rc, v.clearSearch)} style="position:absolute; right:6px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#64748b; font-size:12px; padding:3px; line-height:1;" class="${hover(rc, 'color:#334155;')}">✕</button>
      ` : ''}
    </div>

    ${v.searching ? `
      <div style="margin-bottom:14px; background:#f3f6fb; border:1px solid rgba(56,189,248,.2); border-radius:9px; overflow:hidden;">
        ${v.results.map((r) => `
          <button ${click(rc, r.go)} style="display:flex; align-items:center; gap:10px; width:100%; text-align:left; border:none; border-bottom:1px solid rgba(56,189,248,.1); cursor:pointer; padding:9px 11px; background:none; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.07);')}">
            <span style="width:7px; height:7px; border-radius:50%; flex:none; background:${r.dot};"></span>
            <span style="flex:1; min-width:0;">
              <span style="display:block; font-size:12.5px; font-weight:600; color:#1e293b; line-height:1.25;">${esc(r.label)}</span>
              <span style="font-family:'IBM Plex Mono',monospace; font-size:10px; color:#64748b;">${esc(r.tag)}</span>
            </span>
          </button>
        `).join('')}
        ${v.noResults ? `
          <div style="padding:13px 12px; font-size:12px; color:#64748b; text-align:center; line-height:1.4;">No matches. Try <em>projectile</em>, <em>free fall</em>, or <em>graph</em>.</div>
        ` : ''}
      </div>
    ` : ''}

    <div style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:600; letter-spacing:.16em; color:#64748b; padding:8px 10px 8px;">UNITS</div>
    <div style="display:flex; flex-direction:column; gap:1px;">
      ${v.navUnits.map((u) => `
        <button ${click(rc, u.go)} style="display:flex; align-items:center; gap:11px; width:100%; text-align:left; border:none; cursor:pointer; padding:8px 10px; border-radius:8px; background:${u.abg}; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.07);')}">
          <span style="width:22px; flex:none; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12px; color:${u.color};">${esc(u.label)}</span>
          <span style="font-size:12.5px; font-weight:500; color:#334155; line-height:1.2;">${esc(u.title)}</span>
        </button>
      `).join('')}
    </div>

    <div style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; font-weight:600; letter-spacing:.16em; color:#64748b; padding:18px 10px 8px;">RESOURCES</div>
    <div style="display:flex; flex-direction:column; gap:1px;">
      <a href="mock-exam.html" style="display:flex; align-items:center; gap:11px; width:100%; text-align:left; text-decoration:none; cursor:pointer; padding:8px 10px; border-radius:8px; background:rgba(56,189,248,.08); border:1px solid rgba(56,189,248,.22); margin-bottom:3px; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.14);')}">
        <span style="width:11px; height:11px; border-radius:3px; flex:none; background:#38bdf8;"></span>
        <span style="flex:1; font-size:12.5px; font-weight:600; color:#1e293b;">Mock Exam</span>
        <span style="font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:.08em; color:#0a1118; background:#5eead4; padding:2px 5px; border-radius:4px;">NEW</span>
      </a>
      <button ${click(rc, v.goPractice)} style="display:flex; align-items:center; gap:11px; width:100%; text-align:left; border:none; cursor:pointer; padding:8px 10px; border-radius:8px; background:${v.practiceBg}; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.07);')}">
        <span style="width:11px; height:11px; border-radius:3px; flex:none; background:#fb7185;"></span>
        <span style="font-size:12.5px; font-weight:500; color:#334155;">Practice</span>
      </button>
      <button ${click(rc, v.goSimLab)} style="display:flex; align-items:center; gap:11px; width:100%; text-align:left; border:none; cursor:pointer; padding:8px 10px; border-radius:8px; background:${v.simBg}; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.07);')}">
        <span style="width:11px; height:11px; border-radius:3px; flex:none; background:#5eead4;"></span>
        <span style="font-size:12.5px; font-weight:500; color:#334155;">Sim Lab</span>
      </button>
      <button ${click(rc, v.goCheat)} style="display:flex; align-items:center; gap:11px; width:100%; text-align:left; border:none; cursor:pointer; padding:8px 10px; border-radius:8px; background:${v.cheatBg}; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.07);')}">
        <span style="width:11px; height:11px; border-radius:3px; flex:none; background:#fbbf24;"></span>
        <span style="font-size:12.5px; font-weight:500; color:#334155;">Cheat Sheet</span>
      </button>
      <button ${click(rc, v.goFaq)} style="display:flex; align-items:center; gap:11px; width:100%; text-align:left; border:none; cursor:pointer; padding:8px 10px; border-radius:8px; background:${v.faqBg}; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'background:rgba(56,189,248,.07);')}">
        <span style="width:11px; height:11px; border-radius:3px; flex:none; background:#a78bfa;"></span>
        <span style="font-size:12.5px; font-weight:500; color:#334155;">FAQ</span>
      </button>
    </div>

    <div style="margin-top:22px; padding:13px; background:#f3f6fb; border:1px solid rgba(56,189,248,.16); border-radius:10px;">
      <div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.1em; color:#64748b; margin-bottom:5px;">EXAM · MAY</div>
      <div style="font-size:12px; color:#64748b; line-height:1.5;">~3 hrs · 40 MC + 4 free-response, each worth half. <span style="color:#0d9488;">Calculator allowed throughout.</span></div>
    </div>
  </aside>

  <div style="flex:1; min-width:0;">
    <div id="phys-content" style="max-width:920px; margin:0 auto; padding:60px 36px 100px;">
${content}
    </div>
  </div>
</div>`;
}
