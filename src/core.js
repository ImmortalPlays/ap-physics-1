/* ============================================================================
   Tiny render core — replaces the prototype's dc-runtime.
   ----------------------------------------------------------------------------
   Views are plain functions that return an HTML string built with the `rc()`
   render context. The context lets a view:
     - register event handlers        rc.on(fn)      -> "0" (data-attr index)
     - turn style-hover / style-focus  rc.hover(css) -> generated class name
       into real CSS rules             rc.focus(css)  (matches dc-runtime exactly)
     - escape interpolated text        esc(value)
   After a view string is built, `mount()` sets it as innerHTML and wires every
   registered handler / cleans up the temporary data-attributes.
   ========================================================================== */

// --- pseudo-class stylesheet (verbatim behaviour of dc-runtime's createPseudoSheet) ---
let _sheetEl = null;
const _pseudoCache = new Map();
let _pseudoN = 0;
export function pseudo(name, css) {
  const k = name + '|' + css;
  const hit = _pseudoCache.get(k);
  if (hit) return hit;
  if (!_sheetEl) { _sheetEl = document.createElement('style'); document.head.appendChild(_sheetEl); }
  const cls = 'scp' + (_pseudoN++).toString(36);
  const sel = (name === 'before' || name === 'after') ? '.' + cls + '::' + name : '.' + cls + ':' + name;
  _sheetEl.sheet.insertRule(sel + '{' + css + '}', _sheetEl.sheet.cssRules.length);
  _pseudoCache.set(k, cls);
  return cls;
}

// --- HTML escaping for interpolated dynamic text ---
export function esc(v) {
  if (v == null) return '';
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- per-render context ---
export function renderContext() {
  const handlers = [];
  return {
    handlers,
    // register an event handler, return its index as a string
    on(fn) { handlers.push(fn); return String(handlers.length - 1); },
    // real CSS :hover / :focus, returned as a class token to drop into class=""
    hover(css) { return pseudo('hover', css); },
    focus(css) { return pseudo('focus', css); },
  };
}

/* Render a view into `rootEl`, wiring handlers registered on `rc`.
   Event attributes emitted by views (see views/dom.js helpers):
     data-onclick / data-oninput / data-onchange / data-onkeydown = handler index
   Elements may carry data-focus-key so focus can be restored after re-render. */
const EVENTS = ['click', 'input', 'change', 'keydown'];
export function mount(rootEl, htmlString, rc) {
  // preserve which control had focus + caret, so a full re-render doesn't
  // steal focus mid-typing (search box).
  const active = document.activeElement;
  const focusKey = active && active.getAttribute && active.getAttribute('data-focus-key');
  const selStart = active && 'selectionStart' in active ? active.selectionStart : null;
  const selEnd = active && 'selectionEnd' in active ? active.selectionEnd : null;

  rootEl.innerHTML = htmlString;

  for (const ev of EVENTS) {
    const attr = 'data-on' + ev;
    rootEl.querySelectorAll('[' + attr + ']').forEach((el) => {
      const idx = +el.getAttribute(attr);
      const fn = rc.handlers[idx];
      el.removeAttribute(attr);
      if (typeof fn === 'function') el.addEventListener(ev, fn);
    });
  }

  if (focusKey) {
    const next = rootEl.querySelector('[data-focus-key="' + focusKey + '"]');
    if (next) {
      next.focus();
      if (selStart != null && 'setSelectionRange' in next) {
        try { next.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }
  }
}
