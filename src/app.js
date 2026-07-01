/* ============================================================================
   Controller — the app's brain. Reuses the prototype's original logic verbatim:
     - renderVals()  (view-model)        from ./rendervals.js
     - canvasMixin   (sims + frame loop) from ./sims/canvas.js
     - simDefs / practiceData (content)  from ./content/*
   and replaces the old dc-runtime with a small render()/mount() cycle plus a
   hash router (deep links, back/forward, refresh-to-position) — all GitHub
   Pages-friendly (no server config needed).
   ========================================================================== */
import { renderContext, mount } from './core.js';
import { canvasMixin } from './sims/canvas.js';
import { renderVals } from './rendervals.js';
import { simDefs } from './content/sims.js';
import { practiceData } from './content/practice.js';
import { shell } from './views/shell.js';
import { home } from './views/home.js';
import { unit } from './views/unit.js';
import { simlab } from './views/simlab.js';
import { practice } from './views/practice.js';
import { cheat } from './views/cheat.js';
import { faq } from './views/faq.js';

export class Controller {
  constructor(root) {
    this.root = root;
    // design props (were editable knobs in the prototype; fixed to defaults)
    this.props = { accentSim: '#38bdf8', simSpeed: 'Normal', showWeights: true };
    this.state = {
      screen: 'home', navOpen: false, unitIdx: 1, query: '',
      pv0: 24, pang: 50, mv0: 4, ma: 2,
      inAngle: 25, inMass: 3, inMu: 0.3,
      enH: 4, enF: 0,
      coM1: 2, coM2: 1, coV1: 3, coE: 1,
      tqM1: 3, tqD1: 2, tqM2: 2, tqD2: 2,
      agR: 1.4,
      peL: 2, peA: 25,
      buB: 600, buF: 1000,
      simSel: null, labParams: {},
      practiceMode: 'mcq', mcqPicks: {}
    };
  }

  // ---- content accessors (cached) ----
  _simDefs() { return this._simCache || (this._simCache = simDefs()); }
  _practiceData() { return this._pracCache || (this._pracCache = practiceData()); }

  // ---- render cycle (replaces dc-runtime) ----
  render() {
    const rc = renderContext();
    const v = this.renderVals();
    const s = this.state.screen;
    let content = '';
    if (s === 'unit') content = unit(rc, v, this);
    else if (s === 'simlab') content = simlab(rc, v, this);
    else if (s === 'practice') content = practice(rc, v);
    else if (s === 'cheat') content = cheat(rc, v);
    else if (s === 'faq') content = faq(rc, v);
    else content = home(rc, v);
    mount(this.root, shell(rc, v, content), rc);
  }

  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
    this._afterRender();
  }

  // was componentDidUpdate(): typeset math, honour a pending jump, sync the URL
  _afterRender() { this._math(); this._handleJump(); this._syncHash(); }

  // ---- navigation (verbatim from the prototype) ----
  _scroller() {
    var anchor = document.getElementById('phys-content') || document.querySelector('aside');
    if (!anchor) return null;
    var n = anchor; while (n && n.parentElement) n = n.parentElement; return n;
  }
  _toTop() { var sc = this._scroller(); if (sc) sc.scrollTop = 0; }
  go(screen, n) { this.setState({ screen: screen, navOpen: false, unitIdx: n || this.state.unitIdx, query: '' }); this._toTop(); }
  selectSim(id) { var d = this._findSim(id); var p = {}; if (d) d.controls.forEach(function (c) { p[c.k] = c.def; }); this._labT = 0; this.setState({ screen: 'simlab', navOpen: false, simSel: id, labParams: p }); this._toTop(); }
  jump(screen, n, target) {
    this._pendingTarget = target || null;
    this.setState({ screen: screen, navOpen: false, unitIdx: n || this.state.unitIdx, query: '' });
    if (!target) this._toTop();
  }

  _handleJump() {
    var t = this._pendingTarget; if (!t) return; this._pendingTarget = null;
    var el = document.getElementById(t); if (!el) return;
    var det = el.tagName === 'DETAILS' ? el : el.closest('details'); if (det) det.open = true;
    this._math();
    var sc = this._scroller(); if (sc) sc.scrollTop = el.getBoundingClientRect().top + sc.scrollTop - 80;
  }

  _math() {
    var el = document.getElementById('phys-content');
    if (window.renderMathInElement && el) {
      try {
        renderMathInElement(el, {
          delimiters: [{ left: '$$', right: '$$', display: true }, { left: '\\(', right: '\\)', display: false }],
          throwOnError: false
        });
      } catch (e) {}
    } else { this._mc = (this._mc || 0) + 1; if (this._mc < 60) { var s = this; setTimeout(function () { s._math(); }, 150); } }
  }

  // ---- hash router (deep links + browser back/forward) ----
  _hashForState() {
    var s = this.state;
    if (s.screen === 'unit') return '#/unit/' + s.unitIdx;
    if (s.screen === 'simlab') return s.simSel ? '#/sim/' + s.simSel : '#/sims';
    if (s.screen === 'practice') return '#/practice';
    if (s.screen === 'cheat') return '#/cheat';
    if (s.screen === 'faq') return '#/faq';
    return '#/';
  }
  _syncHash() {
    var target = this._hashForState();
    var cur = location.hash || '';
    if (cur === target) return;
    if (this._initialRoute) { try { history.replaceState(null, '', target); } catch (e) {} }
    else { this._suppress = true; location.hash = target; }
  }
  _routeTo(hash) {
    var h = (hash || '').replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);
    if (!p.length) return this.go('home');
    switch (p[0]) {
      case 'unit': return this.go('unit', Math.min(8, Math.max(1, +p[1] || 1)));
      case 'sim': { var id = p[1]; if (id && this._findSim(id)) return this.selectSim(id); this.state.simSel = null; return this.go('simlab'); }
      case 'sims': this.state.simSel = null; return this.go('simlab');
      case 'practice': return this.go('practice');
      case 'cheat': return this.go('cheat');
      case 'faq': return this.go('faq');
      default: return this.go('home');
    }
  }
  _onHash() {
    if (this._suppress) { this._suppress = false; return; }
    this._routeTo(location.hash);
  }

  // ---- boot (was componentDidMount) ----
  mount() {
    var self = this;
    this._t = 0;
    window.addEventListener('hashchange', function () { self._onHash(); });
    this._initialRoute = true;
    this._routeTo(location.hash);   // sets state + first render + URL sync
    this._initialRoute = false;
    this._math();
    setTimeout(function () { self._loop(); }, 80);
  }
}

// mix in the original view-model + the canvas/sim engine (both use `this`)
Controller.prototype.renderVals = renderVals;
Object.assign(Controller.prototype, canvasMixin);
