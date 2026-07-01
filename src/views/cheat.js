/* Cheat Sheet — the equation-card grid is LaTeX-heavy, so it lives in
   lessons.html (data-lesson="cheat") and is injected + typeset by
   lessons-loader.js. This view supplies the header and the placeholder. */
import { click, hover } from './dom.js';

export function cheat(rc, v) {
  return `
        <button ${click(rc, v.goHome)} style="display:inline-flex; align-items:center; gap:8px; margin:30px 0 16px; background:#ffffff; border:1px solid rgba(56,189,248,.3); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; color:#475569; padding:10px 18px;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7; background:#e6eef9;')}"><span style="font-size:14px;">←</span> ALL UNITS &amp; INDEX</button>
        <header style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-left:4px solid #fbbf24; border-radius:14px; padding:26px 32px; margin-bottom:8px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#d97706; letter-spacing:.06em;">QUICK REFERENCE</div>
          <h1 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; line-height:1.1; margin:8px 0 0; color:#0f172a;">Cheat Sheet</h1>
        </header>
        <p style="font-size:14.5px; color:#64748b; margin:14px 2px 22px;">Every key equation, organized by the eight units of the 2024 CED.</p>
        <div class="lesson" data-lesson="cheat"></div>`;
}
