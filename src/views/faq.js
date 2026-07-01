/* FAQ — plain-text Q&A (no math), kept inline. */
import { click, hover } from './dom.js';

const item = (q, a) => `
        <details style="background:#ffffff; border:1px solid rgba(56,189,248,.16); border-radius:11px; margin-bottom:11px; padding:2px 22px;">
          <summary style="cursor:pointer; font-weight:600; font-size:15px; color:#0f172a; padding:14px 0; display:flex; gap:11px; align-items:flex-start;"><span class="sol-caret" style="color:#7c3aed; font-size:11px; margin-top:4px;">▶</span><span>${q}</span></summary>
          <p style="margin:4px 0 14px; font-size:14.5px; color:#475569;">${a}</p>
        </details>`;

export function faq(rc, v) {
  return `
        <button ${click(rc, v.goHome)} style="display:inline-flex; align-items:center; gap:8px; margin:30px 0 16px; background:#ffffff; border:1px solid rgba(56,189,248,.3); border-radius:9px; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-weight:600; font-size:12.5px; letter-spacing:.04em; color:#475569; padding:10px 18px;" class="${hover(rc, 'border-color:#0284c7; color:#0284c7; background:#e6eef9;')}"><span style="font-size:14px;">←</span> ALL UNITS &amp; INDEX</button>
        <header style="background:#ffffff; border:1px solid rgba(56,189,248,.2); border-left:4px solid #a78bfa; border-radius:14px; padding:26px 32px; margin-bottom:8px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#7c3aed; letter-spacing:.06em;">RESOURCE</div>
          <h1 style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:30px; line-height:1.1; margin:8px 0 0; color:#0f172a;">FAQ</h1>
        </header>
        <p style="font-size:14.5px; color:#64748b; margin:14px 2px 22px;">Common questions about the AP Physics 1 exam.</p>
${item('What score do I need?', 'The exam is scored <strong style="color:#1e293b;">1–5</strong>. A <strong>3</strong> is "qualified" and generally passing; many colleges grant credit for a <strong>4</strong> or <strong>5</strong>. Always check the policy of the college you\'re aiming for.')}
${item('How is the exam structured?', 'Two sections, each worth <strong>50%</strong>: 40 multiple-choice questions (80 min) and 4 free-response questions (100 min). A calculator and a formula sheet are provided for both sections.')}
${item('Is it algebra-based or calculus-based?', '<strong>Algebra-based.</strong> You won\'t need calculus — just algebra, trigonometry, and clear reasoning. The calculus-based courses are AP Physics C (Mechanics and E&amp;M).')}
${item('Do I need to memorize formulas?', 'A formula sheet is provided, so raw memorization matters less than in some courses. What matters is knowing <strong>which</strong> equation applies and <strong>why</strong> — exactly what the simulations are built to teach.')}
${item('What\'s the hardest part for most students?', 'The free-response and the <strong>experimental-design / reasoning</strong> questions — they ask you to explain physics in words and design experiments, not just compute. Practice writing clear, step-by-step justifications.')}`;
}
