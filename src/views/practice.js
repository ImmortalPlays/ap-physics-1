/* Practice — MCQ (instant feedback + score) and FRQ (rubric reveals).
   Data comes from renderVals()'s mcqList/frqList (derived from the practice
   bank). Text is escaped for HTML; KaTeX delimiters (\(…\), $$…$$) pass through
   untouched and are typeset by the controller's _math() pass. */
import { click, hover, esc } from './dom.js';

const backBtn = (rc, v) => `
        <button ${click(rc, v.goHome)} style="display:inline-flex; align-items:center; gap:8px; margin:30px 0 16px; background:#ffffff; border:1px solid rgba(56,189,248,.3); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; color:#475569; padding:10px 18px;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7; background:#e6eef9;')}"><span style="font-size:14px;">←</span> ALL UNITS &amp; INDEX</button>`;

function mcq(rc, v) {
  return `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:14px; margin:14px 2px 18px;">
            <p style="font-size:13.5px; color:#64748b; margin:0;">Pick an answer to check it instantly. ${esc(v.mcqCount)} questions across all units.</p>
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:#0d9488;">SCORE ${esc(v.mcqScore)}/${esc(v.mcqAnswered)}</span>
              <button ${click(rc, v.resetMcq)} style="font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.04em; color:#64748b; background:none; border:1px solid rgba(56,189,248,.2); border-radius:7px; padding:6px 12px; cursor:pointer;" class="${hover(rc, 'border-color:#e11d48; color:#e11d48;')}">RESET</button>
            </div>
          </div>
          ${v.mcqList.map((q) => `
            <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:13px; padding:22px 24px; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <span style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:#e11d48; border:1px solid rgba(251,113,133,.35); border-radius:5px; padding:3px 8px;">Q${esc(q.num)}</span>
                <span style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:#64748b;">UNIT ${esc(q.unit)} · ${esc(q.topic)}</span>
              </div>
              <div style="font-size:15px; color:#0f172a; line-height:1.55; margin-bottom:16px;" class="prac-q">${esc(q.stem)}</div>
              <div style="display:flex; flex-direction:column; gap:9px;">
                ${q.options.map((opt) => `
                  <button ${click(rc, opt.pick)} style="display:flex; align-items:flex-start; gap:12px; width:100%; text-align:left; cursor:pointer; padding:13px 16px; border-radius:9px; border:1px solid ${opt.border}; background:${opt.bg}; font-family:'IBM Plex Sans',sans-serif;" class="${hover(rc, 'border-color:rgba(56,189,248,.4);')}">
                    <span style="flex:none; width:24px; height:24px; border-radius:6px; border:1px solid ${opt.tagBorder}; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; color:${opt.tagColor};">${esc(opt.letter)}</span>
                    <span style="flex:1; font-size:14px; color:#334155; line-height:1.5; padding-top:2px;" class="prac-opt">${esc(opt.text)}</span>
                    <span style="flex:none; font-size:15px; color:${opt.markColor}; padding-top:1px;">${esc(opt.mark)}</span>
                  </button>
                `).join('')}
              </div>
              ${q.answered ? `
                <div style="margin-top:14px; padding:14px 16px; background:#f3f6fb; border:1px solid ${q.explBorder}; border-left:3px solid ${q.explAccent}; border-radius:9px;">
                  <div style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:${q.explAccent}; margin-bottom:6px;">${esc(q.verdict)}</div>
                  <div style="font-size:13.5px; color:#475569; line-height:1.6;" class="prac-expl">${esc(q.explanation)}</div>
                </div>
              ` : ''}
            </div>
          `).join('')}`;
}

function frq(rc, v) {
  return `
          <p style="font-size:13.5px; color:#64748b; margin:14px 2px 18px;">Work each part on paper first, then reveal the scoring guidelines — written like the real AP rubric, point by point.</p>
          ${v.frqList.map((f) => `
            <div style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:13px; padding:24px 26px; margin-bottom:16px;">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                <span style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:#e11d48; border:1px solid rgba(251,113,133,.35); border-radius:5px; padding:3px 8px;">FRQ ${esc(f.num)}</span>
                <span style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.06em; color:#64748b;">${esc(f.kind)} · UNIT ${esc(f.unit)} · ${esc(f.points)} PTS</span>
              </div>
              <div style="font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:17px; color:#0f172a; margin-bottom:8px;">${esc(f.title)}</div>
              <div style="font-size:14px; color:#334155; line-height:1.6; margin-bottom:16px;" class="prac-q">${esc(f.scenario)}</div>
              ${f.parts.map((p) => `
                <details style="background:#f3f6fb; border:1px solid rgba(56,189,248,.14); border-radius:10px; margin-bottom:10px; padding:2px 18px;">
                  <summary style="cursor:pointer; padding:13px 0; display:flex; gap:11px; align-items:flex-start;">
                    <span class="sol-caret" style="color:#e11d48; font-size:11px; margin-top:4px;">▶</span>
                    <span style="flex:1;"><span style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:13px; color:#e11d48;">(${esc(p.label)})</span> <span style="font-size:14px; color:#0f172a;" class="prac-q">${esc(p.prompt)}</span></span>
                    <span style="font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:#64748b; flex:none; padding-top:2px;">${esc(p.pts)} pt</span>
                  </summary>
                  <div style="padding:2px 0 14px 22px;">
                    <div style="font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.08em; color:#0d9488; margin-bottom:10px;">SCORING GUIDELINES</div>
                    <div style="display:flex; flex-direction:column; gap:9px;">
                      ${p.lines.map((ln) => `
                        <div style="display:flex; gap:11px; align-items:flex-start;">
                          <span style="flex:none; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; color:#059669; background:rgba(52,211,153,.12); border:1px solid rgba(52,211,153,.3); border-radius:5px; padding:3px 7px; margin-top:1px;">${esc(ln.pts)}</span>
                          <span style="flex:1; font-size:13.5px; color:#334155; line-height:1.6;" class="prac-sol">${esc(ln.text)}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </details>
              `).join('')}
            </div>
          `).join('')}`;
}

export function practice(rc, v) {
  return `${backBtn(rc, v)}
        <header style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-left:4px solid #fb7185; border-radius:14px; padding:26px 32px; margin-bottom:18px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#e11d48; letter-spacing:.06em;">EXAM PREP</div>
          <h1 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; line-height:1.1; margin:8px 0 0; color:#0f172a;">Practice Problems</h1>
          <p style="font-size:14.5px; color:#475569; margin:12px 0 0; max-width:560px;">Exam-style questions written to match the AP Physics 1 format. Multiple choice with instant feedback, and free-response with full scoring guidelines.</p>
        </header>

        <div style="display:inline-flex; gap:4px; background:#ffffff; border:1px solid rgba(56,189,248,.2); border-radius:11px; padding:5px; margin-bottom:8px;">
          <button ${click(rc, v.setMcq)} style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; padding:9px 20px; border-radius:8px; border:none; cursor:pointer; background:${v.mcqTabBg}; color:${v.mcqTabColor};">MULTIPLE CHOICE</button>
          <button ${click(rc, v.setFrq)} style="font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; padding:9px 20px; border-radius:8px; border:none; cursor:pointer; background:${v.frqTabBg}; color:${v.frqTabColor};">FREE RESPONSE</button>
        </div>
${v.showMcq ? mcq(rc, v) : ''}${v.showFrq ? frq(rc, v) : ''}`;
}
