/* Canvas rendering engine — all sim draw routines, shared helpers, and the
   60fps frame loop. Extracted verbatim from the prototype and exposed as a
   mixin that is Object.assign'd onto the Controller prototype (so every method
   keeps its original `this`). */
export const canvasMixin = {
  _ac() { return this.props.accentSim || '#38bdf8'; },
  _speed() { return ({ Calm: 0.5, Normal: 1, Fast: 1.8 })[this.props.simSpeed || 'Normal'] || 1; },
  _set(id, txt) { var e = document.getElementById(id); if (e) e.textContent = txt; },
  _loop() { var self = this; this._timer = setInterval(function () { self._frame(); }, 1000 / 60); },
  _findSim(id) { var a = this._simDefs(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; },

  _fit(c) {
    var w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) { c._w = 0; return; }
    if (c._w === w && c._h === h) return;
    var dpr = window.devicePixelRatio || 1;
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    c._w = w; c._h = h;
  },

  _frame() {
    this._t++;
    var ac = this._ac(), sp = this._speed();
    if (this.state.screen === 'home') {
      var hsc = document.getElementById('hero-scene'); if (hsc) { this._fit(hsc); if (hsc._w) this._heroScene(hsc, this._t, ac); }
      this._tsec = (this._tsec || 0) + (1 / 60) * sp;
      var self = this, tsec = this._tsec, minis = [['home-mini-proj', 'projectile', { v0: 24, ang: 52 }], ['home-mini-pend', 'pendulum', { L: 2, A: 32 }], ['home-mini-coll', 'collision', { m1: 2, m2: 1, v1: 3, e: 1 }]];
      minis.forEach(function (mc) { var el = document.getElementById(mc[0]); if (el) { self._fit(el); if (el._w) { var d = self._findSim(mc[1]); if (d) d.draw.call(self, el.getContext('2d'), el._w, el._h, mc[2], tsec, ac); } } });
    }
    var p = document.getElementById('sim-proj'); if (p) { this._fit(p); if (p._w) this._projectile(p, ac, sp); }
    var m = document.getElementById('sim-mograph'); if (m) { this._fit(m); if (m._w) this._motion(m, ac, sp); }
    var d2 = document.getElementById('sim-incline'); if (d2) { this._fit(d2); if (d2._w) this._incline(d2, ac, sp); }
    var d3 = document.getElementById('sim-energy'); if (d3) { this._fit(d3); if (d3._w) this._energy(d3, ac, sp); }
    var d4 = document.getElementById('sim-collide'); if (d4) { this._fit(d4); if (d4._w) this._collide(d4, ac, sp); }
    var d5 = document.getElementById('sim-torque'); if (d5) { this._fit(d5); if (d5._w) this._torque(d5, ac, sp); }
    var d6 = document.getElementById('sim-angular'); if (d6) { this._fit(d6); if (d6._w) this._angular(d6, ac, sp); }
    var d7 = document.getElementById('sim-pendulum'); if (d7) { this._fit(d7); if (d7._w) this._pendulum(d7, ac, sp); }
    var d8 = document.getElementById('sim-buoyancy'); if (d8) { this._fit(d8); if (d8._w) this._buoyancy(d8, ac, sp); }
    if (this.state.screen === 'simlab' && this.state.simSel) {
      this._labT = (this._labT || 0) + (1 / 60) * sp;
      var lc = document.getElementById('lab-canvas');
      if (lc) {
        this._fit(lc);
        if (lc._w) {
          var def = this._findSim(this.state.simSel);
          if (def) {
            var out = def.draw.call(this, lc.getContext('2d'), lc._w, lc._h, this.state.labParams, this._labT, ac);
            if (out) for (var kk in out) this._set('labro-' + kk, out[kk]);
          }
        }
      }
    }
  },

  _arrow(ctx, x0, y0, x1, y1, col, lw) {
    var dx = x1 - x0, dy = y1 - y0, len = Math.sqrt(dx * dx + dy * dy); if (len < 2) return;
    var ux = dx / len, uy = dy / len;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 8 * ux + 4 * uy, y1 - 8 * uy - 4 * ux);
    ctx.lineTo(x1 - 8 * ux - 4 * uy, y1 - 8 * uy + 4 * ux);
    ctx.closePath(); ctx.fill();
  },

  _spring(c, t, ac) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, sp = this._speed();
    ctx.clearRect(0, 0, w, h);
    var baseline = h * 0.5, wallX = w * 0.10, A = w * 0.18, restX = w * 0.55, w0 = 0.045;
    var mx = restX + A * Math.sin(t * w0 * sp);
    ctx.strokeStyle = 'rgba(56,189,248,0.2)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, baseline); ctx.lineTo(w, baseline); ctx.stroke();
    for (var tx = wallX; tx <= w; tx += 24) { ctx.beginPath(); ctx.moveTo(tx, baseline - 3); ctx.lineTo(tx, baseline + 3); ctx.stroke(); }
    ctx.strokeStyle = ac; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(wallX, baseline - 32); ctx.lineTo(wallX, baseline + 32); ctx.stroke();
    ctx.lineWidth = 1;
    for (var hy = -28; hy <= 28; hy += 9) { ctx.beginPath(); ctx.moveTo(wallX, baseline + hy); ctx.lineTo(wallX - 8, baseline + hy + 8); ctx.stroke(); }
    var x1 = wallX, x2 = mx - 16, coils = 13;
    ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.shadowColor = ac; ctx.shadowBlur = 7;
    ctx.beginPath(); ctx.moveTo(x1, baseline);
    for (var i = 1; i < coils; i++) { var fx = x1 + (x2 - x1) * i / coils; var fy = baseline + (i % 2 ? -12 : 12); ctx.lineTo(fx, fy); }
    ctx.lineTo(x2, baseline); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(56,189,248,0.16)'; ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.shadowColor = ac; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.rect(mx - 16, baseline - 16, 32, 32); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    var v = Math.cos(t * w0 * sp) * 42;
    if (Math.abs(v) > 3) {
      var ay = baseline - 30, a0 = mx, a1 = mx + v, dir = v > 0 ? 1 : -1;
      ctx.strokeStyle = '#fbbf24'; ctx.fillStyle = '#fbbf24'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a0, ay); ctx.lineTo(a1, ay); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(a1, ay); ctx.lineTo(a1 - 7 * dir, ay - 4); ctx.lineTo(a1 - 7 * dir, ay + 4); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#5f9fc0'; ctx.font = '11px "IBM Plex Mono",monospace';
    ctx.fillText('x(t) = A sin(\u03c9t)', wallX + 2, h - 8);
  },

  _projectile(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, g = 9.8;
    var v0 = this.state.pv0, ang = this.state.pang * Math.PI / 180;
    var vx = v0 * Math.cos(ang), vy0 = v0 * Math.sin(ang);
    var T = 2 * vy0 / g; if (T < 0.1) T = 0.1;
    var range = vx * T, apex = vy0 * vy0 / (2 * g);
    var key = v0 + '_' + this.state.pang;
    if (this._pkey !== key) { this._pkey = key; this._pghost = this._ppath || null; this._pt = 0; }
    this._pt = (this._pt || 0) + (1 / 60) * speed;
    if (this._pt > T + 0.7) this._pt = 0;
    var tt = Math.min(this._pt, T);

    var originX = 26, groundY = h - 20, pad = 24;
    var s = Math.min((w - originX - pad) / Math.max(range, 1), (groundY - pad) / Math.max(apex, 1));
    function PX(x) { return originX + x * s; } function PY(y) { return groundY - y * s; }

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(56,189,248,0.07)'; ctx.lineWidth = 1;
    for (var gx = 0; gx <= w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
    for (var gy = 0; gy <= h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();

    if (this._pghost && this._pghost.length) {
      ctx.strokeStyle = 'rgba(130,150,170,0.32)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath();
      this._pghost.forEach(function (pt, i) { if (i === 0) ctx.moveTo(pt[0], pt[1]); else ctx.lineTo(pt[0], pt[1]); });
      ctx.stroke(); ctx.setLineDash([]);
    }

    var path = [];
    ctx.strokeStyle = 'rgba(56,189,212,0.18)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (var tau = 0; tau <= T + 1e-6; tau += T / 64) {
      var px = PX(vx * tau), py = PY(vy0 * tau - 0.5 * g * tau * tau);
      path.push([px, py]); if (tau === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke(); this._ppath = path;

    ctx.strokeStyle = ac; ctx.lineWidth = 2.5; ctx.shadowColor = ac; ctx.shadowBlur = 10; ctx.beginPath();
    for (var ta = 0; ta <= tt + 1e-6; ta += T / 96) {
      var qx = PX(vx * ta), qy = PY(vy0 * ta - 0.5 * g * ta * ta);
      if (ta === 0) ctx.moveTo(qx, qy); else ctx.lineTo(qx, qy);
    }
    ctx.stroke(); ctx.shadowBlur = 0;

    var bx = PX(vx * tt), by = PY(vy0 * tt - 0.5 * g * tt * tt);
    var curVy = vy0 - g * tt, curSpeed = Math.sqrt(vx * vx + curVy * curVy);
    this._arrow(ctx, bx, by, bx + vx * 1.1, by - curVy * 1.1, '#fbbf24', 2);
    ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = ac; ctx.beginPath(); ctx.arc(PX(0), PY(0), 3, 0, 7); ctx.fill();

    this._set('ro-range', range.toFixed(1) + ' m');
    this._set('ro-apex', apex.toFixed(1) + ' m');
    this._set('ro-time', T.toFixed(2) + ' s');
    this._set('ro-speed', curSpeed.toFixed(1) + ' m/s');
  },

  _motion(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h;
    var v0 = this.state.mv0, a = this.state.ma, W = 6;
    this._mtt = (this._mtt || 0) + (1 / 60) * speed;
    if (this._mtt > W + 0.6) this._mtt = 0;
    var tt = Math.min(this._mtt, W);
    ctx.clearRect(0, 0, w, h);

    var trackY = h * 0.15, padX = 34;
    var maxX = 0.01, minX = 0;
    for (var k = 0; k <= 60; k++) { var tau = W * k / 60, xx = v0 * tau + 0.5 * a * tau * tau; if (xx > maxX) maxX = xx; if (xx < minX) minX = xx; }
    var spanX = (maxX - minX) || 1;
    function TX(x) { return padX + (x - minX) / spanX * (w - 2 * padX); }
    ctx.strokeStyle = 'rgba(56,189,248,0.28)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(padX, trackY); ctx.lineTo(w - padX, trackY); ctx.stroke();
    ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace';
    ctx.fillText('POSITION', padX, trackY - 10);
    ctx.fillStyle = 'rgba(130,150,170,0.5)'; ctx.beginPath(); ctx.arc(TX(0), trackY, 3, 0, 7); ctx.fill();
    var curX = v0 * tt + 0.5 * a * tt * tt;
    ctx.fillStyle = ac; ctx.shadowColor = ac; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(TX(curX), trackY, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;

    var gTop = h * 0.30, gBot = h - 26, gLeft = 48, gRight = w - 16;
    var v1 = v0, v2 = v0 + a * W, vmax = Math.max(v1, v2, 0) + 1, vmin = Math.min(v1, v2, 0) - 1;
    var spanV = (vmax - vmin) || 1;
    function GX(t) { return gLeft + t / W * (gRight - gLeft); }
    function GY(v) { return gBot - (v - vmin) / spanV * (gBot - gTop); }
    ctx.strokeStyle = 'rgba(56,189,248,0.12)'; ctx.lineWidth = 1;
    for (var gi = 0; gi <= W; gi++) { var gxx = GX(gi); ctx.beginPath(); ctx.moveTo(gxx, gTop); ctx.lineTo(gxx, gBot); ctx.stroke(); }
    var zeroY = GY(0);
    ctx.strokeStyle = 'rgba(56,189,248,0.45)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(gLeft, zeroY); ctx.lineTo(gRight, zeroY); ctx.stroke();
    ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(gLeft, gTop); ctx.lineTo(gLeft, gBot); ctx.stroke();
    ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace';
    ctx.fillText('VELOCITY (m/s)', gLeft, gTop - 8);
    ctx.fillText('t (s)', gRight - 24, gBot + 16);

    ctx.fillStyle = 'rgba(56,189,248,0.16)';
    ctx.beginPath(); ctx.moveTo(GX(0), zeroY);
    for (var ts = 0; ts <= tt + 1e-6; ts += W / 120) { ctx.lineTo(GX(ts), GY(v0 + a * ts)); }
    ctx.lineTo(GX(tt), zeroY); ctx.closePath(); ctx.fill();

    ctx.strokeStyle = 'rgba(56,189,212,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(GX(0), GY(v0)); ctx.lineTo(GX(W), GY(v0 + a * W)); ctx.stroke();
    ctx.strokeStyle = ac; ctx.lineWidth = 2.5; ctx.shadowColor = ac; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(GX(0), GY(v0)); ctx.lineTo(GX(tt), GY(v0 + a * tt)); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(GX(tt), GY(v0 + a * tt), 5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;

    var curV = v0 + a * tt, disp = v0 * tt + 0.5 * a * tt * tt;
    this._set('ro-mt', tt.toFixed(2) + ' s');
    this._set('ro-mv', curV.toFixed(1) + ' m/s');
    this._set('ro-mx', disp.toFixed(1) + ' m');
  },

  _heroScene(c, t, ac) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, cx = w / 2, cy = h / 2;
    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    if (!c._tr) c._tr = [[], [], []];
    var g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 48);
    g.addColorStop(0, 'rgba(56,189,248,0.65)'); g.addColorStop(1, 'rgba(56,189,248,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 48, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(56,189,248,0.2)'; ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 7); ctx.fill(); ctx.stroke();
    var P = [{ rx: w * 0.34, ry: h * 0.30, sp: 0.018, ph: 0, col: '#5eead4' }, { rx: w * 0.23, ry: h * 0.37, sp: 0.029, ph: 2.1, col: '#38bdf8' }, { rx: w * 0.41, ry: h * 0.17, sp: 0.013, ph: 4.1, col: '#a78bfa' }];
    P.forEach(function (p, i) {
      ctx.strokeStyle = 'rgba(56,189,248,0.10)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, cy, p.rx, p.ry, 0, 0, 7); ctx.stroke();
      var a = t * p.sp + p.ph, x = cx + p.rx * Math.cos(a), y = cy + p.ry * Math.sin(a);
      var tr = c._tr[i]; tr.push([x, y]); if (tr.length > 42) tr.shift();
      for (var k = 1; k < tr.length; k++) { ctx.strokeStyle = p.col; ctx.globalAlpha = k / tr.length * 0.6; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tr[k - 1][0], tr[k - 1][1]); ctx.lineTo(tr[k][0], tr[k][1]); ctx.stroke(); }
      ctx.globalAlpha = 1; ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    });
  },

  _grid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(56,189,248,0.06)'; ctx.lineWidth = 1;
    for (var gx = 0; gx <= w; gx += 26) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
    for (var gy = 0; gy <= h; gy += 26) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
  },

  _incline(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, g = 9.8;
    var ang = this.state.inAngle * Math.PI / 180, m = this.state.inMass, mu = this.state.inMu;
    var along = m * g * Math.sin(ang), normal = m * g * Math.cos(ang), maxS = mu * normal;
    var moving = along > maxS + 1e-9;
    var net = moving ? (along - mu * normal) : 0;
    var acc = net / m;
    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);

    var pad = 30, baseY = h - 28, bx0 = pad, bx1 = w - pad;
    var baseLen = bx1 - bx0;
    var apexY = baseY - baseLen * Math.tan(ang);
    if (apexY < 24) { apexY = 24; baseLen = (baseY - apexY) / Math.max(Math.tan(ang), 0.001); bx1 = bx0 + baseLen; }
    // ramp triangle (rises to the right)
    ctx.fillStyle = 'rgba(56,189,248,0.07)'; ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(bx0, baseY); ctx.lineTo(bx1, baseY); ctx.lineTo(bx1, apexY); ctx.closePath(); ctx.fill(); ctx.stroke();
    // angle label
    ctx.fillStyle = '#5f7385'; ctx.font = '11px "IBM Plex Mono",monospace';
    ctx.fillText(this.state.inAngle + '\u00b0', bx0 + 26, baseY - 8);

    // block position along hypotenuse: top(near apex)->bottom(near bx0)
    if (moving) { this._inS = (this._inS || 0) + acc * 0.0009 * speed; if (this._inS > 1) this._inS = 0; } else { this._inS = 0.12; }
    var s = this._inS;
    // top point (apex) and bottom point
    var tpx = bx1, tpy = apexY, bpx = bx0, bpy = baseY;
    var ux = (bpx - tpx), uy = (bpy - tpy), L = Math.sqrt(ux * ux + uy * uy); ux /= L; uy /= L;
    // surface normal (pointing up-left away from ramp)
    var nx = uy, ny = -ux; if (ny > 0) { nx = -nx; ny = -ny; }
    var cx = tpx + (bpx - tpx) * (0.12 + s * 0.72), cy = tpy + (bpy - tpy) * (0.12 + s * 0.72);
    var bs = 16;
    var ox = cx + nx * bs, oy = cy + ny * bs;
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(Math.atan2(uy, ux));
    ctx.fillStyle = 'rgba(56,189,248,0.18)'; ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.shadowColor = ac; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.rect(-bs, -bs, bs * 2, bs * 2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.restore();
    // force vectors from block center
    var sc = 5 / Math.max(m, 1);
    this._arrow(ctx, ox, oy, ox, oy + m * g * sc, '#f472b6', 2); // weight down
    this._arrow(ctx, ox, oy, ox + nx * normal * sc, oy + ny * normal * sc, '#5eead4', 2); // normal
    if (mu > 0) { var fr = moving ? mu * normal : along; this._arrow(ctx, ox, oy, ox - ux * fr * sc, oy - uy * fr * sc, '#fbbf24', 2); }

    this._set('ro-inNet', net.toFixed(1) + ' N');
    this._set('ro-inAcc', acc.toFixed(2) + ' m/s\u00b2');
    var st = document.getElementById('ro-inState'); if (st) { st.textContent = moving ? 'SLIDING' : 'STATIC'; st.style.color = moving ? '#fbbf24' : '#5eead4'; }
  },

  _energy(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, g = 9.8, m = 1;
    var key = this.state.enH + '_' + this.state.enF;
    if (this._enKey !== key) { this._enKey = key; this._enU = 1; this._enTh = 0; }
    var Hm = 6; // wall height in meters mapped across canvas
    var floorY = h - 26, topY = 26, Hpx = floorY - topY;
    var cxw = w / 2, halfW = w * 0.42;
    var umaxTarget = Math.sqrt(Math.min(this.state.enH, Hm) / Hm);
    if (this._enUmax == null || this._enKey2 !== key) { this._enUmax = umaxTarget; this._enKey2 = key; }
    // friction slowly reduces amplitude
    if (this.state.enF > 0) { this._enUmax *= (1 - this.state.enF * 0.0016 * speed); if (this._enUmax < 0.02) this._enUmax = umaxTarget; }
    else { this._enUmax = umaxTarget; }
    this._enTh = (this._enTh || 0) + 0.035 * speed;
    var u = this._enUmax * Math.cos(this._enTh);
    function trackY(uu) { return floorY - Hpx * (uu * uu); }
    function trackX(uu) { return cxw + uu * halfW; }

    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    // track (parabola)
    ctx.strokeStyle = 'rgba(56,189,248,0.55)'; ctx.lineWidth = 2.5; ctx.beginPath();
    for (var i = -100; i <= 100; i++) { var uu = i / 100; var X = trackX(uu), Y = trackY(uu); if (i === -100) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
    ctx.stroke();
    // ball
    var bx = trackX(u), by = trackY(u);
    var totalE = m * g * Hm * this._enUmax * this._enUmax;
    var pe = m * g * Hm * (u * u);
    var ke = Math.max(totalE - pe, 0);
    var v = Math.sqrt(2 * ke / m);
    ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(bx, by - 9, 9, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    // energy bars
    var barX = 16, barW = 18, barBot = floorY, barMax = Hpx;
    function bar(x, frac, col, label) {
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x, topY, barW, barMax);
      var hh = barMax * Math.min(frac, 1);
      ctx.fillStyle = col; ctx.fillRect(x, barBot - hh, barW, hh);
      ctx.fillStyle = '#5f7385'; ctx.font = '9px "IBM Plex Mono",monospace'; ctx.fillText(label, x - 1, topY - 6);
    }
    var maxE = m * g * Hm * 1;
    bar(barX, ke / maxE, '#5eead4', 'KE');
    bar(barX + 26, pe / maxE, '#38bdf8', 'PE');
    bar(barX + 52, totalE / maxE, 'rgba(244,114,182,0.8)', 'TOT');

    this._set('ro-enV', v.toFixed(1) + ' m/s');
    this._set('ro-enKE', ke.toFixed(1) + ' J');
    this._set('ro-enPE', pe.toFixed(1) + ' J');
  },

  _collide(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h;
    var m1 = this.state.coM1, m2 = this.state.coM2, V1 = this.state.coV1, e = this.state.coE;
    var key = m1 + '_' + m2 + '_' + V1 + '_' + e;
    var trackY = h * 0.62;
    function sz(mm) { return 18 + mm * 6; }
    if (this._coKey !== key || this._coX1 == null) {
      this._coKey = key; this._coX1 = w * 0.18; this._coX2 = w * 0.62; this._coV1 = V1; this._coV2 = 0; this._coDone = false;
    }
    var scale = 16 * speed;
    this._coX1 += this._coV1 * scale * 0.06;
    this._coX2 += this._coV2 * scale * 0.06;
    var s1 = sz(m1), s2 = sz(m2);
    // collision
    if (!this._coDone && this._coX1 + s1 >= this._coX2 - s2 && this._coV1 > this._coV2) {
      var u1 = this._coV1, u2 = this._coV2;
      this._coV1 = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / (m1 + m2);
      this._coV2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / (m1 + m2);
      this._coDone = true;
    }
    // reset when off screen
    if (this._coX1 > w + 60 || this._coX2 > w + 80 || this._coX1 < -60) {
      this._coX1 = w * 0.18; this._coX2 = w * 0.62; this._coV1 = V1; this._coV2 = 0; this._coDone = false;
    }

    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, trackY + 22); ctx.lineTo(w, trackY + 22); ctx.stroke();
    // carts
    function cart(x, sH, col, label, vv) {
      ctx.fillStyle = 'rgba(56,189,248,0.16)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.rect(x - sH, trackY + 22 - sH * 2, sH * 2, sH * 2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = col; ctx.font = 'bold 13px "IBM Plex Mono",monospace'; ctx.textAlign = 'center';
      ctx.fillText(label, x, trackY + 22 - sH); ctx.textAlign = 'left';
    }
    cart(this._coX1, s1, '#38bdf8', 'A', this._coV1);
    cart(this._coX2, s2, '#f472b6', 'B', this._coV2);
    // velocity arrows
    this._arrow(ctx, this._coX1, trackY - s1 - 4, this._coX1 + this._coV1 * 12, trackY - s1 - 4, '#fbbf24', 2);
    if (Math.abs(this._coV2) > 0.05) this._arrow(ctx, this._coX2, trackY - s2 - 4, this._coX2 + this._coV2 * 12, trackY - s2 - 4, '#fbbf24', 2);

    var p = m1 * this._coV1 + m2 * this._coV2;
    var ke = 0.5 * m1 * this._coV1 * this._coV1 + 0.5 * m2 * this._coV2 * this._coV2;
    this._set('ro-coP', p.toFixed(1) + ' kg\u00b7m/s');
    this._set('ro-coKE', ke.toFixed(1) + ' J');
  },

  _torque(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, g = 9.8;
    var m1 = this.state.tqM1, d1 = this.state.tqD1, m2 = this.state.tqM2, d2 = this.state.tqD2;
    var tauL = m1 * g * d1, tauR = m2 * g * d2, net = tauR - tauL;
    var target = Math.max(-0.5, Math.min(0.5, net * 0.012));
    if (Math.abs(net) < 0.5) target = 0;
    this._tqA = (this._tqA == null) ? target : this._tqA + (target - this._tqA) * 0.08 * speed;
    var ang = this._tqA;

    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    var px = w / 2, py = h * 0.56, beamHalf = w * 0.38;
    // pivot
    ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 18, py + 40); ctx.lineTo(px + 18, py + 40); ctx.closePath(); ctx.fill();
    // beam
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
    ctx.strokeStyle = ac; ctx.lineWidth = 5; ctx.shadowColor = ac; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(-beamHalf, 0); ctx.lineTo(beamHalf, 0); ctx.stroke(); ctx.shadowBlur = 0;
    // masses
    var lx = -beamHalf * (d1 / 3), rx = beamHalf * (d2 / 3);
    function box(x, mm, col) { var s = 10 + mm * 3.2; ctx.fillStyle = 'rgba(56,189,248,0.18)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(x - s / 2, -s, s, s); ctx.fill(); ctx.stroke(); }
    box(lx, m1, '#38bdf8'); box(rx, m2, '#f472b6');
    ctx.restore();

    this._set('ro-tqL', tauL.toFixed(0) + ' N\u00b7m');
    this._set('ro-tqR', tauR.toFixed(0) + ' N\u00b7m');
    var st = document.getElementById('ro-tqNet'); if (st) {
      if (Math.abs(net) < 0.5) { st.textContent = 'BALANCED'; st.style.color = '#5eead4'; }
      else { st.textContent = (net > 0 ? 'TIPS RIGHT' : 'TIPS LEFT'); st.style.color = '#fbbf24'; }
    }
  },

  _angular(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h;
    var r = this.state.agR, mHub = 2, mArm = 1, rHub = 0.3;
    var I = 0.5 * mHub * rHub * rHub + 2 * mArm * r * r;
    var L0 = 8; // conserved
    var omega = L0 / I;
    var ke = 0.5 * I * omega * omega;
    this._agTh = (this._agTh || 0) + omega * 0.02 * speed;

    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    var cx = w / 2, cy = h / 2, rpx = (h * 0.40) * (r / 2);
    // hub
    ctx.fillStyle = 'rgba(56,189,248,0.15)'; ctx.strokeStyle = ac; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 7); ctx.fill(); ctx.stroke();
    // arms + masses (two opposite)
    for (var k = 0; k < 2; k++) {
      var a = this._agTh + k * Math.PI;
      var ex = cx + Math.cos(a) * rpx, ey = cy + Math.sin(a) * rpx;
      ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = '#f472b6'; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(ex, ey, 11, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    // spin direction hint
    ctx.fillStyle = '#5f7385'; ctx.font = '11px "IBM Plex Mono",monospace';
    ctx.fillText('L is conserved \u2192 smaller r spins faster', 14, h - 12);

    this._set('ro-agI', I.toFixed(1));
    this._set('ro-agW', omega.toFixed(2) + ' rad/s');
    this._set('ro-agL', L0.toFixed(1));
    this._set('ro-agKE', ke.toFixed(1) + ' J');
  },

  _pendulum(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, g = 9.8;
    var L = this.state.peL, A = this.state.peA * Math.PI / 180;
    var omega = Math.sqrt(g / L), T = 2 * Math.PI / omega;
    this._peT = (this._peT || 0) + (1 / 60) * speed;
    var th = A * Math.cos(omega * this._peT);

    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    var px = w / 2, py = 26;
    var Lpx = (h - 70) * (L / 4); if (Lpx > h - 60) Lpx = h - 60;
    var bx = px + Math.sin(th) * Lpx, by = py + Math.cos(th) * Lpx;
    // arc
    ctx.strokeStyle = 'rgba(56,189,248,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.arc(px, py, Lpx, Math.PI / 2 - A, Math.PI / 2 + A); ctx.stroke(); ctx.setLineDash([]);
    // pivot mount
    ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 24, py); ctx.lineTo(px + 24, py); ctx.stroke();
    // rod
    ctx.strokeStyle = ac; ctx.lineWidth = 2.5; ctx.shadowColor = ac; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke(); ctx.shadowBlur = 0;
    // bob
    ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(bx, by, 14, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    // vertical reference
    ctx.strokeStyle = 'rgba(95,115,133,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + Lpx + 12); ctx.stroke(); ctx.setLineDash([]);

    this._set('ro-peT', T.toFixed(2) + ' s');
    this._set('ro-peAng', (th * 180 / Math.PI).toFixed(0) + '\u00b0');
  },

  _buoyancy(c, ac, speed) {
    var ctx = c.getContext('2d'), w = c._w, h = c._h, g = 9.8;
    var bd = this.state.buB, fd = this.state.buF, V = 0.002;
    var floats = bd < fd;
    var frac = floats ? bd / fd : 1;
    this._buBob = (this._buBob || 0) + 0.04 * speed;
    var bob = Math.sin(this._buBob) * 3;

    ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
    var waterY = h * 0.34, tankBot = h - 14;
    // water
    ctx.fillStyle = 'rgba(56,189,248,0.12)'; ctx.fillRect(0, waterY, w, tankBot - waterY);
    ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, waterY); ctx.lineTo(w, waterY); ctx.stroke();
    ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.fillText('waterline', 8, waterY - 6);
    // block
    var bw = 80, bh = 80, cx = w / 2;
    var topY;
    if (floats) { topY = waterY - bh * (1 - frac) + bob; }
    else { topY = tankBot - bh; }
    ctx.fillStyle = 'rgba(251,191,36,0.18)'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.rect(cx - bw / 2, topY, bw, bh); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    // force arrows
    var weight = bd * V * g, Fb = (floats ? frac : 1) * fd * V * g;
    var midY = topY + bh / 2, sc = 0.9;
    this._arrow(ctx, cx - 22, midY, cx - 22, midY + weight * sc, '#f472b6', 2); // weight
    this._arrow(ctx, cx + 22, midY, cx + 22, midY - Fb * sc, '#5eead4', 2); // buoyancy

    this._set('ro-buSub', Math.round(frac * 100) + ' %');
    this._set('ro-buW', weight.toFixed(1) + ' N');
    var st = document.getElementById('ro-buState'); if (st) { st.textContent = floats ? 'FLOATS' : 'SINKS'; st.style.color = floats ? '#5eead4' : '#f472b6'; }
  },
};
