/* View-model: derives every binding + event handler the views consume from
   current state. Extracted verbatim from the prototype's renderVals(); assigned
   onto the Controller prototype in app.js. Uses `this` and `self = this`. */
export function renderVals() {
    var self = this;
    var titles = ['Kinematics', 'Force & Translational Dynamics', 'Work, Energy & Power', 'Linear Momentum', 'Torque & Rotational Dynamics', 'Energy & Momentum of Rotating Systems', 'Oscillations', 'Fluids'];
    var shorts = ['Motion in 1D & 2D', 'Forces, friction & circular motion', 'Conservation of energy', 'Collisions & impulse', 'Rotational kinematics & torque', 'Angular momentum & orbits', 'Simple harmonic motion', 'Pressure, buoyancy & flow'];
    var weights = ['10\u201315%', '18\u201323%', '18\u201323%', '10\u201315%', '10\u201315%', '5\u20138%', '5\u20138%', '10\u201315%'];
    var sims = ['Projectile, graphs & relative motion', 'Inclined plane, Atwood & circular motion', 'Energy skate park & spring launcher', 'Collisions & explosions', 'Torque balance & spin-up', 'Angular momentum, rolling & orbits', 'Pendulum & mass-spring', 'Buoyancy, pressure & flow'];
    var COL = ['#0284c7', '#0d9488', '#059669', '#d97706', '#db2777', '#7c3aed', '#0d9488', '#2563eb'];

    var screen = this.state.screen, idx = this.state.unitIdx;
    var navUnits = titles.map(function (t, i) {
      var n = i + 1, active = (screen === 'unit' && idx === n);
      return {
        n: n, label: (n < 10 ? '0' + n : '' + n), title: t, short: shorts[i], weight: weights[i], sim: sims[i],
        color: COL[i], abg: active ? 'rgba(56,189,248,.1)' : 'transparent',
        go: function () { self.go('unit', n); }
      };
    });
    var au = navUnits[idx - 1] || navUnits[0];

    var simTiles = titles.map(function (t, i) {
      var n = i + 1, live = true;
      return {
        n: n, label: (n < 10 ? '0' + n : '' + n), title: t, sim: sims[i], desc: shorts[i], color: COL[i],
        status: live ? 'LIVE' : 'SOON',
        badgeBg: live ? 'rgba(94,234,212,.16)' : 'rgba(95,115,133,.16)',
        badgeColor: live ? '#5eead4' : '#7c91a0',
        go: function () { self.go('unit', n); }
      };
    });

    // search index
    var INDEX = [];
    titles.forEach(function (t, i) { INDEX.push({ label: 'Unit ' + (i + 1) + ': ' + t, tag: 'UNIT \u00b7 ' + weights[i], dot: COL[i], screen: 'unit', unitN: i + 1, target: null, kw: (t + ' ' + shorts[i]).toLowerCase() }); });
    var concepts = [['c1', 'What kinematics describes', 'position displacement distance vector'], ['c2', 'Velocity & speed', 'velocity speed average instantaneous slope'], ['c3', 'Acceleration', 'acceleration change velocity'], ['c4', 'The kinematic equations', 'kinematic equations constant acceleration suvat'], ['c5', 'Motion graphs', 'graph slope area position velocity time'], ['c6', 'Free fall', 'free fall gravity 9.8 g drop'], ['c7', 'Projectile motion', 'projectile range angle horizontal vertical components'], ['c8', 'Vectors in two dimensions', 'vector scalar components magnitude direction'], ['c9', 'Reference frames & relative motion', 'relative motion reference frame river boat train']];
    concepts.forEach(function (c) { INDEX.push({ label: c[1], tag: 'Unit 1 \u00b7 Concept', dot: '#38bdf8', screen: 'unit', unitN: 1, target: c[0], kw: c[2] }); });
    var examples = [['x1', 'Constant acceleration from rest', 'car accelerate distance velocity'], ['x2', 'Free fall thrown up', 'free fall max height thrown up'], ['x3', 'Projectile range & height', 'projectile range angle launch'], ['x4', 'Displacement from a v-t graph', 'area graph displacement'], ['x5', 'Stopping distance', 'braking stopping distance deceleration']];
    examples.forEach(function (e) { INDEX.push({ label: 'Example: ' + e[1], tag: 'Unit 1 \u00b7 Worked', dot: '#fbbf24', screen: 'unit', unitN: 1, target: e[0], kw: e[2] }); });
    this._simDefs().forEach(function (s) { INDEX.push({ label: s.title, tag: 'Sim \u00b7 Unit ' + s.unit, dot: '#5eead4', screen: 'simlab', unitN: s.unit, target: null, simId: s.id, kw: (s.title + ' ' + s.desc + ' simulation').toLowerCase() }); });
    INDEX.push({ label: 'Sim Lab', tag: 'Resource', dot: '#5eead4', screen: 'simlab', unitN: 1, target: null, kw: 'sim lab simulations playground' });
    INDEX.push({ label: 'Cheat Sheet', tag: 'Resource', dot: '#fbbf24', screen: 'cheat', unitN: 1, target: null, kw: 'cheat sheet formulas equations reference' });
    INDEX.push({ label: 'FAQ', tag: 'Resource', dot: '#a78bfa', screen: 'faq', unitN: 1, target: null, kw: 'faq score exam structure calculator' });
    INDEX.push({ label: 'Practice Problems', tag: 'Resource', dot: '#fb7185', screen: 'practice', unitN: 1, target: null, kw: 'practice problems mcq frq multiple choice free response test quiz exam questions' });

    var q = (this.state.query || '').trim().toLowerCase();
    var searching = q.length > 0, results = [];
    if (searching) results = INDEX.filter(function (r) { return r.label.toLowerCase().indexOf(q) > -1 || r.kw.indexOf(q) > -1; }).slice(0, 8);
    this._lastResults = results;
    var viewResults = results.map(function (r) { return { label: r.label, tag: r.tag, dot: r.dot, go: function () { if (r.simId) self.selectSim(r.simId); else self.jump(r.screen, r.unitN, r.target); } }; });

    // ----- Sim Lab library -----
    var sims = this._simDefs();
    var cur = this.state.simSel ? this._findSim(this.state.simSel) : null;
    var lp = this.state.labParams || {};
    var labGroups = titles.map(function (tt, i) {
      var n = i + 1;
      var us = sims.filter(function (s) { return s.unit === n; }).map(function (s) {
        return { title: s.title, desc: s.desc, color: s.color, go: function () { self.selectSim(s.id); } };
      });
      return { label: (n < 10 ? '0' + n : '' + n), title: tt, color: COL[i], sims: us };
    });
    var labControls = cur ? cur.controls.map(function (c) {
      var v = (lp[c.k] != null ? lp[c.k] : c.def);
      return {
        label: c.label, min: c.min, max: c.max, step: c.step, val: v, valTxt: v + c.sfx,
        on: function (e) { var np = Object.assign({}, self.state.labParams); np[c.k] = +e.target.value; self.setState({ labParams: np }); }
      };
    }) : [];
    var labReadouts = cur ? cur.readouts.map(function (r) { return { k: r.k, label: r.label, color: r.color }; }) : [];

    // ----- Practice -----
    var prac = this._practiceData(), pmode = this.state.practiceMode, picks = this.state.mcqPicks || {};
    var LETTERS = ['A', 'B', 'C', 'D'];
    var mcqAnswered = 0, mcqScore = 0;
    var mcqList = prac.mcq.map(function (q, qi) {
      var picked = picks[q.id]; var done = (picked != null);
      if (done) { mcqAnswered++; if (picked === q.correct) mcqScore++; }
      var options = q.options.map(function (txt, oi) {
        var isPicked = picked === oi, isCorrect = oi === q.correct;
        var border = 'rgba(56,189,248,.16)', bg = '#091019', tagBorder = 'rgba(56,189,248,.3)', tagColor = '#7c91a0', mark = '', markColor = 'transparent';
        if (done) {
          if (isCorrect) { border = 'rgba(52,211,153,.6)'; bg = 'rgba(52,211,153,.08)'; tagBorder = '#34d399'; tagColor = '#34d399'; mark = '✓'; markColor = '#34d399'; }
          else if (isPicked) { border = 'rgba(251,113,133,.6)'; bg = 'rgba(251,113,133,.08)'; tagBorder = '#fb7185'; tagColor = '#fb7185'; mark = '✕'; markColor = '#fb7185'; }
        }
        return { letter: LETTERS[oi], text: txt, border: border, bg: bg, tagBorder: tagBorder, tagColor: tagColor, mark: mark, markColor: markColor,
          pick: function () { if (picks[q.id] != null) return; var np = Object.assign({}, self.state.mcqPicks); np[q.id] = oi; self.setState({ mcqPicks: np }); } };
      });
      var right = done && picked === q.correct;
      return { num: qi + 1, unit: q.unit, topic: q.topic, stem: q.stem, options: options, answered: done,
        verdict: right ? 'CORRECT' : 'NOT QUITE — ANSWER: ' + LETTERS[q.correct], explanation: q.expl,
        explAccent: right ? '#34d399' : '#fb7185', explBorder: right ? 'rgba(52,211,153,.3)' : 'rgba(251,113,133,.3)' };
    });
    var frqList = prac.frq.map(function (f) {
      return { num: f.num, kind: f.kind, unit: f.unit, points: f.points, title: f.title, scenario: f.scenario,
        parts: f.parts.map(function (p) { return { label: p.label, pts: p.pts, prompt: p.prompt, lines: p.lines }; }) };
    });

    return {
      navUnits: navUnits, simTiles: simTiles,
      showMcq: pmode === 'mcq', showFrq: pmode === 'frq',
      mcqTabBg: pmode === 'mcq' ? '#fb7185' : 'transparent', mcqTabColor: pmode === 'mcq' ? '#1a0e12' : '#9fb3c2',
      frqTabBg: pmode === 'frq' ? '#fb7185' : 'transparent', frqTabColor: pmode === 'frq' ? '#1a0e12' : '#9fb3c2',
      setMcq: function () { self.setState({ practiceMode: 'mcq' }); }, setFrq: function () { self.setState({ practiceMode: 'frq' }); },
      mcqList: mcqList, frqList: frqList, mcqCount: prac.mcq.length, mcqScore: mcqScore, mcqAnswered: mcqAnswered,
      resetMcq: function () { self.setState({ mcqPicks: {} }); },
      labGroups: labGroups, labList: !cur, labActive: !!cur,
      labTitle: cur ? cur.title : '', labDesc: cur ? cur.desc : '', labColor: cur ? cur.color : '#5eead4',
      labUnitLabel: cur ? (cur.unit < 10 ? '0' + cur.unit : '' + cur.unit) : '',
      labControls: labControls, labReadouts: labReadouts,
      labBack: function () { self.setState({ simSel: null }); self._toTop(); },
      openProjectile: function () { self.selectSim('projectile'); },
      openPendulum: function () { self.selectSim('pendulum'); },
      openCollision: function () { self.selectSim('collision'); },
      toggleNav: function () { self.setState({ navOpen: !self.state.navOpen }); },
      navT: self.state.navOpen ? 'translateX(0)' : 'translateX(-100%)',
      navBackdrop: self.state.navOpen ? 'block' : 'none',
      navBtnDisplay: self.state.navOpen ? 'none' : 'block',
      isHome: screen === 'home', isUnit: screen === 'unit', isSimLab: screen === 'simlab', isCheat: screen === 'cheat', isFaq: screen === 'faq', isPractice: screen === 'practice',
      isUnit1: screen === 'unit' && idx === 1,
      isUnit2: screen === 'unit' && idx === 2, isUnit3: screen === 'unit' && idx === 3,
      isUnit4: screen === 'unit' && idx === 4, isUnit5: screen === 'unit' && idx === 5,
      isUnit6: screen === 'unit' && idx === 6, isUnit7: screen === 'unit' && idx === 7,
      isUnit8: screen === 'unit' && idx === 8, isOtherUnit: false,
      hasPrev: idx > 1, hasNext: idx < 8,
      prevNum: (idx - 1 < 10 ? '0' + (idx - 1) : '' + (idx - 1)),
      nextNum: (idx + 1 < 10 ? '0' + (idx + 1) : '' + (idx + 1)),
      nextTitle: titles[idx] || '',
      goPrev: function () { self.go('unit', idx - 1); },
      goNext: function () { self.go('unit', idx + 1); },
      simBg: screen === 'simlab' ? 'rgba(94,234,212,.1)' : 'transparent',
      cheatBg: screen === 'cheat' ? 'rgba(251,191,36,.1)' : 'transparent',
      faqBg: screen === 'faq' ? 'rgba(167,139,250,.1)' : 'transparent',
      practiceBg: screen === 'practice' ? 'rgba(251,113,133,.12)' : 'transparent',
      activeColor: au.color, activeNum: au.label, activeTitle: au.title, activeWeight: au.weight, activeSim: au.sim,
      showWeights: this.props.showWeights !== false,
      pv0: this.state.pv0, pang: this.state.pang, mv0: this.state.mv0, ma: this.state.ma,
      onPv0: function (e) { self.setState({ pv0: +e.target.value }); },
      onPang: function (e) { self.setState({ pang: +e.target.value }); },
      onMv0: function (e) { self.setState({ mv0: +e.target.value }); },
      onMa: function (e) { self.setState({ ma: +e.target.value }); },
      inAngle: this.state.inAngle, inMass: this.state.inMass, inMu: this.state.inMu,
      onInA: function (e) { self.setState({ inAngle: +e.target.value }); },
      onInM: function (e) { self.setState({ inMass: +e.target.value }); },
      onInU: function (e) { self.setState({ inMu: +e.target.value }); },
      enH: this.state.enH, enF: this.state.enF,
      onEnH: function (e) { self.setState({ enH: +e.target.value }); },
      onEnF: function (e) { self.setState({ enF: +e.target.value }); },
      coM1: this.state.coM1, coM2: this.state.coM2, coV1: this.state.coV1, coE: this.state.coE,
      onCoM1: function (e) { self.setState({ coM1: +e.target.value }); },
      onCoM2: function (e) { self.setState({ coM2: +e.target.value }); },
      onCoV1: function (e) { self.setState({ coV1: +e.target.value }); },
      onCoE: function (e) { self.setState({ coE: +e.target.value }); },
      tqM1: this.state.tqM1, tqD1: this.state.tqD1, tqM2: this.state.tqM2, tqD2: this.state.tqD2,
      onTqM1: function (e) { self.setState({ tqM1: +e.target.value }); },
      onTqD1: function (e) { self.setState({ tqD1: +e.target.value }); },
      onTqM2: function (e) { self.setState({ tqM2: +e.target.value }); },
      onTqD2: function (e) { self.setState({ tqD2: +e.target.value }); },
      agR: this.state.agR,
      onAgR: function (e) { self.setState({ agR: +e.target.value }); },
      peL: this.state.peL, peA: this.state.peA,
      onPeL: function (e) { self.setState({ peL: +e.target.value }); },
      onPeA: function (e) { self.setState({ peA: +e.target.value }); },
      buB: this.state.buB, buF: this.state.buF,
      onBuB: function (e) { self.setState({ buB: +e.target.value }); },
      onBuF: function (e) { self.setState({ buF: +e.target.value }); },
      goHome: function () { self.go('home'); },
      goUnit1: function () { self.go('unit', 1); },
      goUnit2: function () { self.go('unit', 2); },
      goSimLab: function () { self.setState({ simSel: null }); self.go('simlab'); },
      goCheat: function () { self.go('cheat'); },
      goFaq: function () { self.go('faq'); },
      goPractice: function () { self.go('practice'); },
      query: this.state.query || '', searching: searching, results: viewResults, noResults: searching && viewResults.length === 0,
      onSearch: function (e) { self.setState({ query: e.target.value }); },
      onSearchKey: function (e) {
        if (e.key === 'Enter' && self._lastResults && self._lastResults.length) { var r = self._lastResults[0]; if (r.simId) self.selectSim(r.simId); else self.jump(r.screen, r.unitN, r.target); }
        else if (e.key === 'Escape') self.setState({ query: '' });
      },
      clearSearch: function () { self.setState({ query: '' }); }
    };
}
