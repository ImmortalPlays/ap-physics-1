/* Small helpers views use to emit event/hover attributes into HTML strings.
   These keep the view templates close to the original inline-styled markup. */
import { esc } from '../core.js';

// event attribute emitters: `${click(rc, v.goHome)}` -> data-onclick="3"
export const click    = (rc, fn) => `data-onclick="${rc.on(fn)}"`;
export const input    = (rc, fn) => `data-oninput="${rc.on(fn)}"`;
export const change   = (rc, fn) => `data-onchange="${rc.on(fn)}"`;
export const keydown  = (rc, fn) => `data-onkeydown="${rc.on(fn)}"`;

// style-hover / style-focus -> real CSS classes (returns a class token)
export const hover = (rc, css) => rc.hover(css);
export const focus = (rc, css) => rc.focus(css);

export { esc };

/* A slider that updates state + its readout label WITHOUT triggering a
   re-render, so the element being dragged is never torn down and the canvas
   (which reads state every frame) updates live. `apply(value)` mutates the
   controller state; `label` is the DOM id of the value span; `fmt(value)` is
   its text. Mirrors the prototype's uncontrolled `defaultvalue` inputs. */
export function slider(rc, { min, max, step, val, labelId, fmt, apply }) {
  const on = (e) => {
    const nv = +e.target.value;
    apply(nv);
    const el = document.getElementById(labelId);
    if (el) el.textContent = fmt(nv);
  };
  return `<input type="range" min="${min}" max="${max}" step="${step}" value="${val}" ${input(rc, on)} style="width:100%;">`;
}
