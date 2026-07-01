/* Simulation registry — the 21 interactive canvas sims as data.
   Extracted verbatim from the prototype's _simDefs(). Each entry:
     { id, unit, color, title, desc, controls[], readouts[], draw(ctx,w,h,P,t,ac) }
   Every draw() runs with `this` bound to the Controller, so it can call the
   shared canvas helpers (this._arrow, this._grid). */
export function simDefs() {
    var G = 9.8;
    function fix(n, d) { return n.toFixed(d == null ? 1 : d); }
    var defs = [
      // ===== UNIT 1 =====
      { id: 'projectile', unit: 1, color: '#38bdf8', title: 'Projectile Launcher', desc: 'Launch at any speed and angle; trace the parabola and read range, height and time.',
        controls: [{ k: 'v0', label: 'Launch speed v\u2080', min: 5, max: 45, step: 1, def: 24, sfx: ' m/s' }, { k: 'ang', label: 'Launch angle \u03b8', min: 10, max: 80, step: 1, def: 50, sfx: '\u00b0' }],
        readouts: [{ k: 'range', label: 'RANGE', color: '#5eead4' }, { k: 'apex', label: 'MAX HEIGHT', color: '#5eead4' }, { k: 'time', label: 'FLIGHT TIME', color: '#5eead4' }, { k: 'speed', label: 'CURRENT SPEED', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var v0 = P.v0, ang = P.ang * Math.PI / 180, vx = v0 * Math.cos(ang), vy = v0 * Math.sin(ang);
          var T = 2 * vy / G; if (T < 0.1) T = 0.1; var range = vx * T, apex = vy * vy / (2 * G);
          var ph = (t % (T + 0.8)) / T; if (ph > 1) ph = 1; var tt = ph * T;
          var ox = 30, gy = h - 22, pad = 26, s = Math.min((w - ox - pad) / Math.max(range, 1), (gy - pad) / Math.max(apex, 1));
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
          ctx.strokeStyle = 'rgba(56,189,212,0.2)'; ctx.lineWidth = 1.5; ctx.beginPath();
          for (var u = 0; u <= 1.0001; u += 0.02) { var X = ox + vx * u * T * s, Y = gy - (vy * u * T - 0.5 * G * (u * T) * (u * T)) * s; if (u === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); } ctx.stroke();
          ctx.strokeStyle = ac; ctx.lineWidth = 2.5; ctx.shadowColor = ac; ctx.shadowBlur = 10; ctx.beginPath();
          for (var u2 = 0; u2 <= ph + 1e-6; u2 += 0.01) { var X2 = ox + vx * u2 * T * s, Y2 = gy - (vy * u2 * T - 0.5 * G * (u2 * T) * (u2 * T)) * s; if (u2 === 0) ctx.moveTo(X2, Y2); else ctx.lineTo(X2, Y2); } ctx.stroke(); ctx.shadowBlur = 0;
          var bx = ox + vx * tt * s, by = gy - (vy * tt - 0.5 * G * tt * tt) * s, cvy = vy - G * tt;
          this._arrow(ctx, bx, by, bx + vx * 1.0, by - cvy * 1.0, '#fbbf24', 2);
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(bx, by, 5.5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          return { range: fix(range) + ' m', apex: fix(apex) + ' m', time: fix(T, 2) + ' s', speed: fix(Math.sqrt(vx * vx + cvy * cvy)) + ' m/s' };
        } },
      { id: 'freefall', unit: 1, color: '#38bdf8', title: 'Free Fall Drop', desc: 'Drop or toss a ball straight up — every object accelerates at g regardless of mass.',
        controls: [{ k: 'h', label: 'Start height', min: 10, max: 80, step: 5, def: 40, sfx: ' m' }, { k: 'v0', label: 'Initial up-speed', min: 0, max: 25, step: 1, def: 0, sfx: ' m/s' }],
        readouts: [{ k: 'time', label: 'TIME ALOFT', color: '#5eead4' }, { k: 'vimp', label: 'IMPACT SPEED', color: '#fbbf24' }, { k: 'cur', label: 'HEIGHT NOW', color: '#5eead4' }],
        draw: function (ctx, w, h, P, t, ac) {
          var H = P.h, v0 = P.v0;
          var tLand = (v0 + Math.sqrt(v0 * v0 + 2 * G * H)) / G;
          var ph = (t % (tLand + 0.7)); if (ph > tLand) ph = tLand;
          var y = H + v0 * ph - 0.5 * G * ph * ph; if (y < 0) y = 0;
          var top = 20, gy = h - 22, s = (gy - top) / H;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
          var bx = w * 0.5, by = gy - y * s, cv = v0 - G * ph;
          // ruler
          ctx.strokeStyle = 'rgba(56,189,248,0.25)'; ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace';
          for (var m = 0; m <= H; m += Math.max(10, Math.round(H / 6 / 10) * 10)) { var yy = gy - m * s; ctx.beginPath(); ctx.moveTo(w * 0.18, yy); ctx.lineTo(w * 0.18 - 6, yy); ctx.stroke(); ctx.fillText(m + 'm', w * 0.18 - 34, yy + 3); }
          this._arrow(ctx, bx + 22, by, bx + 22, by - cv * 2.2, cv >= 0 ? '#5eead4' : '#f472b6', 2);
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(bx, by, 12, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          return { time: fix(tLand, 2) + ' s', vimp: fix(Math.sqrt(v0 * v0 + 2 * G * H)) + ' m/s', cur: fix(y) + ' m' };
        } },
      { id: 'relative', unit: 1, color: '#38bdf8', title: 'Relative Motion: River Crossing', desc: 'A boat aims straight across, but the current carries it downstream. The ground-frame velocity is the vector sum \u2014 see the resulting path and drift.',
        controls: [{ k: 'vb', label: 'Boat speed', min: 1, max: 6, step: 0.5, def: 3, sfx: ' m/s' }, { k: 'vc', label: 'Current speed', min: 0, max: 5, step: 0.5, def: 2, sfx: ' m/s' }],
        readouts: [{ k: 'vg', label: 'GROUND SPEED', color: '#5eead4' }, { k: 'ang', label: 'DRIFT ANGLE', color: '#fbbf24' }, { k: 'drift', label: 'DOWNSTREAM DRIFT', color: '#38bdf8' }],
        draw: function (ctx, w, h, P, t, ac) {
          var vb = P.vb, vc = P.vc, vg = Math.sqrt(vb * vb + vc * vc), ang = Math.atan2(vc, vb) * 180 / Math.PI;
          var topY = 30, botY = h - 30, riverH = botY - topY, drift = vc * (riverH / vb) / (riverH) * (botY - topY); // px drift over crossing
          var per = 3.2, cyc = (t % per) / per;
          var startX = w * 0.2, by = botY - cyc * riverH, bx = startX + cyc * (vc / vb) * riverH;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          // river banks
          ctx.fillStyle = 'rgba(56,189,248,0.10)'; ctx.fillRect(0, topY, w, riverH);
          ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, topY); ctx.lineTo(w, topY); ctx.moveTo(0, botY); ctx.lineTo(w, botY); ctx.stroke();
          ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.fillText('far bank', 10, topY - 8); ctx.fillText('start \u2192 current flows right', 10, botY + 18);
          // current arrows
          ctx.strokeStyle = 'rgba(96,165,250,0.4)';
          for (var yy = topY + 18; yy < botY; yy += 26) { this._arrow(ctx, w * 0.55, yy, w * 0.55 + vc * 8, yy, 'rgba(96,165,250,0.5)', 1.5); }
          // ideal straight path
          ctx.strokeStyle = 'rgba(120,140,160,0.35)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(startX, botY); ctx.lineTo(startX, topY); ctx.stroke(); ctx.setLineDash([]);
          // actual path
          ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(startX, botY); ctx.lineTo(bx, by); ctx.stroke();
          // boat + velocity vectors
          this._arrow(ctx, bx, by, bx, by - 30, '#5eead4', 2);
          this._arrow(ctx, bx, by, bx + vc * 10, by, '#60a5fa', 2);
          this._arrow(ctx, bx, by, bx + vc * 10, by - 30, '#fbbf24', 2.5);
          ctx.fillStyle = '#f472b6'; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(bx, by, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          return { vg: fix(vg) + ' m/s', ang: fix(ang, 0) + '\u00b0', drift: fix((vc / vb) * 1, 2) + ' \u00d7 width' };
        } },
      // ===== UNIT 2 =====
      { id: 'incline', unit: 2, color: '#5eead4', title: 'Inclined Plane', desc: 'Tilt the ramp, change mass and friction, and see whether the block slides.',
        controls: [{ k: 'ang', label: 'Angle \u03b8', min: 0, max: 60, step: 1, def: 25, sfx: '\u00b0' }, { k: 'm', label: 'Mass m', min: 1, max: 10, step: 0.5, def: 3, sfx: ' kg' }, { k: 'mu', label: 'Friction \u03bc', min: 0, max: 1, step: 0.05, def: 0.3, sfx: '' }],
        readouts: [{ k: 'net', label: 'NET FORCE', color: '#5eead4' }, { k: 'acc', label: 'ACCELERATION', color: '#5eead4' }, { k: 'state', label: 'STATE', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var ang = P.ang * Math.PI / 180, m = P.m, mu = P.mu;
          var along = m * G * Math.sin(ang), normal = m * G * Math.cos(ang), moving = along > mu * normal + 1e-9;
          var net = moving ? along - mu * normal : 0, acc = net / m;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          var pad = 30, baseY = h - 26, bx0 = pad, bx1 = w - pad, apexY = baseY - (bx1 - bx0) * Math.tan(ang);
          if (apexY < 22) { apexY = 22; bx1 = bx0 + (baseY - apexY) / Math.max(Math.tan(ang), 0.001); }
          ctx.fillStyle = 'rgba(56,189,248,0.07)'; ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(bx0, baseY); ctx.lineTo(bx1, baseY); ctx.lineTo(bx1, apexY); ctx.closePath(); ctx.fill(); ctx.stroke();
          var sp = moving ? ((t * acc * 0.04) % 0.76) : 0;
          var tpx = bx1, tpy = apexY, bpx = bx0, bpy = baseY, ux = bpx - tpx, uy = bpy - tpy, L = Math.hypot(ux, uy); ux /= L; uy /= L;
          var nx = uy, ny = -ux; if (ny > 0) { nx = -nx; ny = -ny; }
          var cx = tpx + (bpx - tpx) * (0.12 + sp), cy = tpy + (bpy - tpy) * (0.12 + sp), bs = 15, ox = cx + nx * bs, oy = cy + ny * bs;
          ctx.save(); ctx.translate(ox, oy); ctx.rotate(Math.atan2(uy, ux));
          ctx.fillStyle = 'rgba(94,234,212,0.18)'; ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.shadowColor = ac; ctx.shadowBlur = 9;
          ctx.beginPath(); ctx.rect(-bs, -bs, bs * 2, bs * 2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.restore();
          var sc = 4.5 / Math.max(m, 1);
          this._arrow(ctx, ox, oy, ox, oy + m * G * sc, '#f472b6', 2);
          this._arrow(ctx, ox, oy, ox + nx * normal * sc, oy + ny * normal * sc, '#5eead4', 2);
          if (mu > 0) { var fr = moving ? mu * normal : along; this._arrow(ctx, ox, oy, ox - ux * fr * sc, oy - uy * fr * sc, '#fbbf24', 2); }
          return { net: fix(net) + ' N', acc: fix(acc, 2) + ' m/s\u00b2', state: moving ? 'SLIDING' : 'STATIC' };
        } },
      { id: 'atwood', unit: 2, color: '#5eead4', title: 'Atwood Machine', desc: 'Two masses over a pulley — the heavier side falls. Find the acceleration and rope tension.',
        controls: [{ k: 'm1', label: 'Left mass', min: 1, max: 10, step: 0.5, def: 3, sfx: ' kg' }, { k: 'm2', label: 'Right mass', min: 1, max: 10, step: 0.5, def: 5, sfx: ' kg' }],
        readouts: [{ k: 'acc', label: 'ACCELERATION', color: '#5eead4' }, { k: 'ten', label: 'ROPE TENSION', color: '#5eead4' }, { k: 'dir', label: 'HEAVIER SIDE', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var m1 = P.m1, m2 = P.m2, a = (m2 - m1) * G / (m1 + m2), T = 2 * m1 * m2 * G / (m1 + m2);
          var cx = w / 2, py = 30, r = 16, span = h * 0.4, lx = cx - 70, rx = cx + 70;
          var osc = Math.sin(t * Math.min(Math.abs(a), 4) * 0.5) * span * 0.32 * (a === 0 ? 0 : Math.sign(a));
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.fillStyle = 'rgba(56,189,248,0.12)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(cx, py, r, 0, 7); ctx.fill(); ctx.stroke();
          var y1 = py + span * 0.5 - osc, y2 = py + span * 0.5 + osc;
          ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.beginPath(); ctx.moveTo(lx, py); ctx.lineTo(lx, y1); ctx.moveTo(rx, py); ctx.lineTo(rx, y2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx - r, py); ctx.lineTo(lx, py); ctx.moveTo(cx + r, py); ctx.lineTo(rx, py); ctx.stroke();
          function box(x, y, mm, col) { var s = 14 + mm * 2.4; ctx.fillStyle = 'rgba(94,234,212,0.16)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); ctx.rect(x - s / 2, y, s, s); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.font = '11px "IBM Plex Mono",monospace'; ctx.textAlign = 'center'; ctx.fillText(mm + 'kg', x, y + s / 2 + 4); ctx.textAlign = 'left'; }
          box(lx, y1, m1, '#38bdf8'); box(rx, y2, m2, '#f472b6');
          return { acc: fix(Math.abs(a), 2) + ' m/s\u00b2', ten: fix(T) + ' N', dir: m1 === m2 ? 'BALANCED' : (m2 > m1 ? 'RIGHT' : 'LEFT') };
        } },
      { id: 'modatwood', unit: 2, color: '#5eead4', title: 'Modified Atwood Machine', desc: 'A cart on a table is pulled by a hanging mass over a pulley. Only the hanging weight drives the system, but BOTH masses must accelerate \u2014 add table friction to slow it down.',
        controls: [{ k: 'mt', label: 'Cart on table m\u2081', min: 1, max: 10, step: 0.5, def: 4, sfx: ' kg' }, { k: 'mh', label: 'Hanging mass m\u2082', min: 1, max: 10, step: 0.5, def: 3, sfx: ' kg' }, { k: 'mu', label: 'Table friction \u03bc', min: 0, max: 0.6, step: 0.05, def: 0, sfx: '' }],
        readouts: [{ k: 'acc', label: 'ACCELERATION', color: '#5eead4' }, { k: 'ten', label: 'ROPE TENSION', color: '#38bdf8' }, { k: 'state', label: 'STATE', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var mt = P.mt, mh = P.mh, mu = P.mu;
          var drive = mh * G, fric = mu * mt * G, moving = drive > fric + 1e-9;
          var a = moving ? (drive - fric) / (mt + mh) : 0;
          var T = moving ? mt * a + fric : drive;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          var tableY = h * 0.40, tableLeft = 20, pulleyX = w * 0.66, pulleyY = tableY;
          ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tableLeft, tableY); ctx.lineTo(pulleyX, tableY); ctx.stroke();
          ctx.strokeStyle = 'rgba(56,189,248,0.25)'; ctx.lineWidth = 1;
          for (var hx = tableLeft; hx < pulleyX; hx += 16) { ctx.beginPath(); ctx.moveTo(hx, tableY); ctx.lineTo(hx - 7, tableY + 9); ctx.stroke(); }
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tableLeft + 30, tableY); ctx.lineTo(tableLeft + 30, h - 14); ctx.stroke();
          var off = moving ? ((t * a * 8) % 60) : 0;
          var cartX = tableLeft + 60 + off, cartW = 52, cartH = 30;
          ctx.fillStyle = 'rgba(56,189,248,0.15)'; ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(pulleyX, pulleyY, 12, 0, 7); ctx.fill(); ctx.stroke();
          var hangTop = pulleyY + 12, hangY = hangTop + 46 + off, ropeY = tableY - cartH / 2;
          ctx.strokeStyle = 'rgba(94,234,212,0.6)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cartX + cartW, ropeY); ctx.lineTo(pulleyX, ropeY); ctx.lineTo(pulleyX + 12, hangTop); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(pulleyX + 12, hangTop); ctx.lineTo(pulleyX + 12, hangY); ctx.stroke();
          ctx.fillStyle = 'rgba(94,234,212,0.16)'; ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.shadowColor = '#5eead4'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.rect(cartX, tableY - cartH, cartW, cartH); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = '#5eead4'; ctx.font = '11px "IBM Plex Mono",monospace'; ctx.textAlign = 'center'; ctx.fillText('m\u2081', cartX + cartW / 2, tableY - cartH / 2 + 4);
          ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.beginPath(); ctx.arc(cartX + 12, tableY, 4, 0, 7); ctx.arc(cartX + cartW - 12, tableY, 4, 0, 7); ctx.fill();
          var hs = 30; ctx.fillStyle = 'rgba(244,114,182,0.18)'; ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 2; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 8;
          ctx.beginPath(); ctx.rect(pulleyX + 12 - hs / 2, hangY, hs, hs); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = '#f472b6'; ctx.fillText('m\u2082', pulleyX + 12, hangY + hs / 2 + 4); ctx.textAlign = 'left';
          this._arrow(ctx, cartX + cartW / 2, tableY - cartH - 4, cartX + cartW / 2 + T * 1.6, tableY - cartH - 4, '#38bdf8', 2);
          if (mu > 0 && moving) this._arrow(ctx, cartX + cartW / 2, tableY - cartH - 4, cartX + cartW / 2 - fric * 1.6, tableY - cartH - 4, '#fbbf24', 2);
          this._arrow(ctx, pulleyX + 12 + hs / 2 + 6, hangY + hs / 2, pulleyX + 12 + hs / 2 + 6, hangY + hs / 2 + mh * G * 0.5, '#f472b6', 2);
          return { acc: fix(a, 2) + ' m/s\u00b2', ten: fix(T) + ' N', state: moving ? 'ACCELERATING' : 'FRICTION HOLDS' };
        } },
      { id: 'circular', unit: 2, color: '#5eead4', title: 'Uniform Circular Motion', desc: 'Swing a mass in a circle. The centripetal force always points to the center \u2014 cut it and the object flies off along the tangent.',
        controls: [{ k: 'r', label: 'Radius r', min: 0.5, max: 2.5, step: 0.1, def: 1.5, sfx: ' m' }, { k: 'v', label: 'Speed v', min: 2, max: 12, step: 0.5, def: 6, sfx: ' m/s' }, { k: 'm', label: 'Mass m', min: 0.5, max: 4, step: 0.5, def: 1, sfx: ' kg' }],
        readouts: [{ k: 'fc', label: 'CENTRIPETAL FORCE', color: '#5eead4' }, { k: 'ac', label: 'CENTRIPETAL ACCEL', color: '#fbbf24' }, { k: 'T', label: 'PERIOD', color: '#38bdf8' }],
        draw: function (ctx, w, h, P, t, ac) {
          var r = P.r, v = P.v, m = P.m, Fc = m * v * v / r, acc = v * v / r, T = 2 * Math.PI * r / v, om = v / r;
          var cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.32 * (r / 2.5) + 30;
          var th = t * om * 0.5;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.25)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fill();
          var bx = cx + Math.cos(th) * R, by = cy + Math.sin(th) * R;
          // string
          ctx.strokeStyle = 'rgba(94,234,212,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();
          // centripetal force arrow (toward center)
          this._arrow(ctx, bx, by, bx + (cx - bx) * 0.32, by + (cy - by) * 0.32, '#5eead4', 2.5);
          // velocity (tangent)
          var tx = -Math.sin(th), ty = Math.cos(th);
          this._arrow(ctx, bx, by, bx + tx * 42, by + ty * 42, '#fbbf24', 2);
          ctx.fillStyle = '#f472b6'; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(bx, by, 9 + m, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.fillText('F\u1d04 \u2192 center', 12, h - 22); ctx.fillStyle = '#fbbf24'; ctx.fillText('v \u22a5 tangent', 12, h - 8);
          return { fc: fix(Fc) + ' N', ac: fix(acc) + ' m/s\u00b2', T: fix(T, 2) + ' s' };
        } },
      // ===== UNIT 3 =====
      { id: 'skatepark', unit: 3, color: '#34d399', title: 'Energy Skate Park', desc: 'Watch kinetic and potential energy trade off as a ball rolls in a valley. Add friction to drain it.',
        controls: [{ k: 'h', label: 'Drop height', min: 1, max: 6, step: 0.5, def: 4, sfx: ' m' }, { k: 'fr', label: 'Friction', min: 0, max: 1, step: 0.1, def: 0, sfx: '' }],
        readouts: [{ k: 'v', label: 'SPEED', color: '#fbbf24' }, { k: 'ke', label: 'KINETIC', color: '#5eead4' }, { k: 'pe', label: 'POTENTIAL', color: '#38bdf8' }],
        draw: function (ctx, w, h, P, t, ac) {
          var Hm = 6, floorY = h - 24, topY = 24, Hpx = floorY - topY, cxw = w / 2, halfW = w * 0.4;
          var umax = Math.sqrt(Math.min(P.h, Hm) / Hm) * Math.exp(-P.fr * 0.12 * (t % 14));
          var u = umax * Math.cos(t * 1.9);
          function TY(uu) { return floorY - Hpx * uu * uu; } function TX(uu) { return cxw + uu * halfW; }
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(52,211,153,0.6)'; ctx.lineWidth = 2.5; ctx.beginPath();
          for (var i = -100; i <= 100; i++) { var uu = i / 100; if (i === -100) ctx.moveTo(TX(uu), TY(uu)); else ctx.lineTo(TX(uu), TY(uu)); } ctx.stroke();
          var totalE = G * Hm * umax * umax, pe = G * Hm * u * u, ke = Math.max(totalE - pe, 0), v = Math.sqrt(2 * ke);
          var bx = TX(u), by = TY(u); ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(bx, by - 9, 9, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          var maxE = G * Hm; function bar(x, f, col, lb) { ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x, topY, 16, Hpx); var hh = Hpx * Math.min(f, 1); ctx.fillStyle = col; ctx.fillRect(x, floorY - hh, 16, hh); ctx.fillStyle = '#5f7385'; ctx.font = '9px "IBM Plex Mono",monospace'; ctx.fillText(lb, x - 1, topY - 5); }
          bar(14, ke / maxE, '#5eead4', 'KE'); bar(36, pe / maxE, '#38bdf8', 'PE'); bar(58, totalE / maxE, 'rgba(244,114,182,0.8)', 'TOT');
          return { v: fix(v) + ' m/s', ke: fix(ke) + ' J', pe: fix(pe) + ' J' };
        } },
      { id: 'springlauncher', unit: 3, color: '#34d399', title: 'Vertical Spring Launcher', desc: 'Compress a spring to store energy, then launch a ball straight up. Gravity steadily slows it to a peak, where all the energy is potential again \u2014 PE\u209b \u2192 KE \u2192 PE_g.',
        controls: [{ k: 'x', label: 'Compression x', min: 0.1, max: 0.5, step: 0.05, def: 0.3, sfx: ' m' }, { k: 'k', label: 'Spring constant k', min: 100, max: 1200, step: 50, def: 500, sfx: ' N/m' }],
        readouts: [{ k: 'pe', label: 'STORED PE\u209b', color: '#38bdf8' }, { k: 'v', label: 'LAUNCH SPEED', color: '#5eead4' }, { k: 'hmax', label: 'MAX HEIGHT', color: '#fbbf24' }, { k: 'cur', label: 'CURRENT SPEED', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var x = P.x, k = P.k, m = 0.5, pe = 0.5 * k * x * x, v = Math.sqrt(2 * pe / m), Hmax = v * v / (2 * G);
          var tFlight = 2 * v / G, compDur = 0.7, hold = 0.15, per = compDur + hold + tFlight, cyc = t % per;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          var groundY = h - 22, topY = 22, avail = groundY - topY;
          var scale = avail / Math.max(Hmax, 2.5) * 0.9;
          var colX = w * 0.34, baseW = 64, Lr = 46; // relaxed spring length px
          // launch tube guide + height ruler
          ctx.strokeStyle = 'rgba(56,189,248,0.22)'; ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.lineWidth = 1;
          var springTopRest = groundY - Lr;
          var step = Hmax <= 4 ? 1 : (Hmax <= 12 ? 2 : 5);
          for (var mh = 0; mh <= Hmax * 1.02; mh += step) { var yy = springTopRest - mh * scale; if (yy < topY) break; ctx.beginPath(); ctx.moveTo(colX + 44, yy); ctx.lineTo(colX + 52, yy); ctx.stroke(); ctx.fillText(mh + 'm', colX + 56, yy + 3); }
          // phase -> compression (m) and flight height (m)
          var compression = 0, ballH = 0, curV = 0, flying = false;
          if (cyc < compDur) { var f = cyc / compDur; compression = x * Math.sin(f * Math.PI / 2); curV = 0; }
          else if (cyc < compDur + hold) { compression = x; curV = 0; }
          else { flying = true; var tf = cyc - compDur - hold; ballH = v * tf - 0.5 * G * tf * tf; if (ballH < 0) ballH = 0; curV = v - G * tf; }
          var compPx = (compression / 0.5) * 30;
          var springLen = Lr - compPx;
          // base platform
          ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.fillRect(colX - baseW / 2, groundY, baseW, 8);
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, groundY + 8); ctx.lineTo(w, groundY + 8); ctx.stroke();
          // ball bottom position
          var ballR = 13, ballBottom = flying ? (groundY - Lr - ballH * scale) : (groundY - springLen);
          var ballCy = ballBottom - ballR;
          // spring zigzag (vertical) from ground up to springLen (relaxed when flying)
          var topOfSpring = flying ? (groundY - Lr) : (groundY - springLen);
          var coils = 9, segH = (groundY - topOfSpring) / coils;
          ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.5; ctx.shadowColor = '#34d399'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.moveTo(colX, groundY);
          for (var i = 1; i < coils; i++) { ctx.lineTo(colX + (i % 2 ? 12 : -12), groundY - segH * i); } ctx.lineTo(colX, topOfSpring); ctx.stroke(); ctx.shadowBlur = 0;
          // trajectory ghost (apex marker)
          var apexY = groundY - Lr - Hmax * scale;
          ctx.strokeStyle = 'rgba(251,191,36,0.35)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(colX - 30, apexY - ballR); ctx.lineTo(colX + 30, apexY - ballR); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(251,191,36,0.6)'; ctx.fillText('apex', colX - 60, apexY - ballR + 3);
          // ball
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(colX, ballCy, ballR, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          // velocity arrow (shrinks as gravity slows it)
          if (flying && Math.abs(curV) > 0.3) { var av = (curV / Math.max(v, 0.1)) * 56; this._arrow(ctx, colX + 26, ballCy, colX + 26, ballCy - av, curV >= 0 ? '#5eead4' : '#f472b6', 2); }
          return { pe: fix(pe) + ' J', v: fix(v) + ' m/s', hmax: fix(Hmax) + ' m', cur: fix(Math.abs(curV)) + ' m/s' };
        } },
      // ===== UNIT 4 =====
      { id: 'collision', unit: 4, color: '#fbbf24', title: 'Collision Lab', desc: 'Crash two carts. Total momentum stays fixed while kinetic energy changes with bounciness.',
        controls: [{ k: 'm1', label: 'Mass A', min: 1, max: 6, step: 0.5, def: 2, sfx: ' kg' }, { k: 'm2', label: 'Mass B', min: 1, max: 6, step: 0.5, def: 1, sfx: ' kg' }, { k: 'v1', label: 'Speed of A', min: 1, max: 6, step: 0.5, def: 3, sfx: ' m/s' }, { k: 'e', label: 'Bounciness e', min: 0, max: 1, step: 0.1, def: 1, sfx: '' }],
        readouts: [{ k: 'p', label: 'TOTAL MOMENTUM', color: '#5eead4' }, { k: 'ke', label: 'KINETIC ENERGY', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var m1 = P.m1, m2 = P.m2, u1 = P.v1, e = P.e;
          var w1 = (m1 * u1 - m2 * e * u1) / (m1 + m2), w2 = (m1 * u1 + m1 * e * u1) / (m1 + m2);
          function sz(mm) { return 16 + mm * 5; } var s1 = sz(m1), s2 = sz(m2);
          var x10 = w * 0.16, x20 = w * 0.6, sc = 26, tc = (x20 - s2 - (x10 + s1)) / (u1 * sc);
          var per = tc + 2.6, cyc = t % per, x1, x2;
          if (cyc < tc) { x1 = x10 + u1 * sc * cyc; x2 = x20; } else { var dt = cyc - tc; x1 = x10 + u1 * sc * tc + w1 * sc * dt; x2 = x20 + w2 * sc * dt; }
          var trackY = h * 0.6;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, trackY + 20); ctx.lineTo(w, trackY + 20); ctx.stroke();
          function cart(x, sH, col, lb) { ctx.fillStyle = 'rgba(56,189,248,0.16)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); ctx.rect(x - sH, trackY + 20 - sH * 2, sH * 2, sH * 2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.font = 'bold 13px "IBM Plex Mono",monospace'; ctx.textAlign = 'center'; ctx.fillText(lb, x, trackY + 20 - sH); ctx.textAlign = 'left'; }
          cart(x1, s1, '#38bdf8', 'A'); cart(x2, s2, '#f472b6', 'B');
          var cv1 = cyc < tc ? u1 : w1, cv2 = cyc < tc ? 0 : w2;
          this._arrow(ctx, x1, trackY - s1, x1 + cv1 * 12, trackY - s1, '#fbbf24', 2);
          if (Math.abs(cv2) > 0.05) this._arrow(ctx, x2, trackY - s2, x2 + cv2 * 12, trackY - s2, '#fbbf24', 2);
          return { p: fix(m1 * cv1 + m2 * cv2) + ' kg\u00b7m/s', ke: fix(0.5 * m1 * cv1 * cv1 + 0.5 * m2 * cv2 * cv2) + ' J' };
        } },
      { id: 'explosion', unit: 4, color: '#fbbf24', title: 'Explosion / Recoil', desc: 'A charge between two carts fires them apart. Total momentum stays zero — lighter cart goes faster.',
        controls: [{ k: 'm1', label: 'Mass A', min: 1, max: 6, step: 0.5, def: 2, sfx: ' kg' }, { k: 'm2', label: 'Mass B', min: 1, max: 6, step: 0.5, def: 3, sfx: ' kg' }],
        readouts: [{ k: 'va', label: 'SPEED A', color: '#38bdf8' }, { k: 'vb', label: 'SPEED B', color: '#f472b6' }, { k: 'p', label: 'TOTAL MOMENTUM', color: '#5eead4' }],
        draw: function (ctx, w, h, P, t, ac) {
          var m1 = P.m1, m2 = P.m2, J = 6, v1 = J / m1, v2 = J / m2;
          var cyc = t % 3.2, cx = w / 2, sc = 24, trackY = h * 0.6;
          var x1 = cx - 10 - v1 * sc * cyc, x2 = cx + 10 + v2 * sc * cyc;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, trackY + 20); ctx.lineTo(w, trackY + 20); ctx.stroke();
          if (cyc < 0.25) { ctx.fillStyle = 'rgba(251,191,36,' + (0.6 - cyc * 2) + ')'; ctx.beginPath(); ctx.arc(cx, trackY, 30 * (1 + cyc * 4), 0, 7); ctx.fill(); }
          function cart(x, mm, col, lb) { var s = 16 + mm * 5; ctx.fillStyle = 'rgba(56,189,248,0.16)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); ctx.rect(x - s, trackY + 20 - s * 2, s * 2, s * 2); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; ctx.fillStyle = col; ctx.font = 'bold 13px "IBM Plex Mono",monospace'; ctx.textAlign = 'center'; ctx.fillText(lb, x, trackY + 20 - s); ctx.textAlign = 'left'; }
          cart(x1, m1, '#38bdf8', 'A'); cart(x2, m2, '#f472b6', 'B');
          return { va: fix(v1) + ' m/s', vb: fix(v2) + ' m/s', p: '0 kg\u00b7m/s' };
        } },
      // ===== UNIT 5 =====
      { id: 'torque', unit: 5, color: '#f472b6', title: 'Torque Balance', desc: 'Slide masses in and out along a see-saw and balance the torques on each side.',
        controls: [{ k: 'm1', label: 'Left mass', min: 1, max: 8, step: 0.5, def: 3, sfx: ' kg' }, { k: 'd1', label: 'Left distance', min: 0.5, max: 3, step: 0.25, def: 2, sfx: ' m' }, { k: 'm2', label: 'Right mass', min: 1, max: 8, step: 0.5, def: 2, sfx: ' kg' }, { k: 'd2', label: 'Right distance', min: 0.5, max: 3, step: 0.25, def: 2, sfx: ' m' }],
        readouts: [{ k: 'l', label: 'LEFT TORQUE', color: '#38bdf8' }, { k: 'r', label: 'RIGHT TORQUE', color: '#f472b6' }, { k: 'state', label: 'STATE', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var tL = P.m1 * G * P.d1, tR = P.m2 * G * P.d2, net = tR - tL;
          var ang = Math.max(-0.5, Math.min(0.5, net * 0.012)); if (Math.abs(net) < 0.5) ang = 0;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          var px = w / 2, py = h * 0.56, bh = w * 0.38;
          ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 18, py + 40); ctx.lineTo(px + 18, py + 40); ctx.closePath(); ctx.fill();
          ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
          ctx.strokeStyle = ac; ctx.lineWidth = 5; ctx.shadowColor = ac; ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(-bh, 0); ctx.lineTo(bh, 0); ctx.stroke(); ctx.shadowBlur = 0;
          function box(x, mm, col) { var s = 10 + mm * 3.2; ctx.fillStyle = 'rgba(56,189,248,0.18)'; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(x - s / 2, -s, s, s); ctx.fill(); ctx.stroke(); }
          box(-bh * (P.d1 / 3), P.m1, '#38bdf8'); box(bh * (P.d2 / 3), P.m2, '#f472b6'); ctx.restore();
          return { l: fix(tL, 0) + ' N\u00b7m', r: fix(tR, 0) + ' N\u00b7m', state: Math.abs(net) < 0.5 ? 'BALANCED' : (net > 0 ? 'TIPS RIGHT' : 'TIPS LEFT') };
        } },
      { id: 'spinup', unit: 5, color: '#f472b6', title: 'Angular Spin-Up', desc: 'Apply a constant torque to a wheel and watch angular velocity build: \u03c4 = I\u03b1.',
        controls: [{ k: 'tau', label: 'Torque \u03c4', min: 1, max: 10, step: 1, def: 4, sfx: ' N\u00b7m' }, { k: 'I', label: 'Inertia I', min: 1, max: 8, step: 0.5, def: 2, sfx: ' kg\u00b7m\u00b2' }],
        readouts: [{ k: 'al', label: 'ANG. ACCEL \u03b1', color: '#5eead4' }, { k: 'om', label: 'ANG. VELOCITY \u03c9', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var al = P.tau / P.I, per = 5, cyc = t % per, om = al * cyc, th = 0.5 * al * cyc * cyc;
          var cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.32;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
          ctx.fillStyle = 'rgba(56,189,248,0.12)'; ctx.beginPath(); ctx.arc(cx, cy, 12, 0, 7); ctx.fill();
          for (var k = 0; k < 4; k++) { var a = th + k * Math.PI / 2; ctx.strokeStyle = k === 0 ? ac : 'rgba(56,189,248,0.5)'; ctx.lineWidth = k === 0 ? 4 : 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); }
          var ma = th; ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(cx + Math.cos(ma) * R, cy + Math.sin(ma) * R, 8, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          return { al: fix(al, 2) + ' rad/s\u00b2', om: fix(om, 1) + ' rad/s' };
        } },
      // ===== UNIT 6 =====
      { id: 'angular', unit: 6, color: '#a78bfa', title: 'Angular Momentum', desc: 'Pull the masses toward the axis. L stays fixed, so the spin rate jumps — the skater effect.',
        controls: [{ k: 'r', label: 'Mass radius r', min: 0.4, max: 2, step: 0.1, def: 1.4, sfx: ' m' }],
        readouts: [{ k: 'I', label: 'INERTIA I', color: '#38bdf8' }, { k: 'om', label: 'SPIN \u03c9', color: '#fbbf24' }, { k: 'L', label: 'MOMENTUM L', color: '#5eead4' }, { k: 'ke', label: 'ENERGY KE', color: '#f472b6' }],
        draw: function (ctx, w, h, P, t, ac) {
          var r = P.r, I = 0.5 * 2 * 0.09 + 2 * 1 * r * r, L0 = 8, om = L0 / I, ke = 0.5 * I * om * om;
          var th = t * om * 0.5, cx = w / 2, cy = h / 2, rpx = (h * 0.40) * (r / 2);
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.fillStyle = 'rgba(167,139,250,0.15)'; ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 7); ctx.fill(); ctx.stroke();
          for (var k = 0; k < 2; k++) { var a = th + k * Math.PI, ex = cx + Math.cos(a) * rpx, ey = cy + Math.sin(a) * rpx; ctx.strokeStyle = 'rgba(167,139,250,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.fillStyle = '#f472b6'; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(ex, ey, 11, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
          return { I: fix(I, 1), om: fix(om, 2) + ' rad/s', L: fix(L0, 1), ke: fix(ke, 1) + ' J' };
        } },
      { id: 'rollrace', unit: 6, color: '#a78bfa', title: 'Rolling Race', desc: 'A disk and a hoop roll down the same ramp. The disk wins — less of its mass is far from the axis.',
        controls: [{ k: 'ang', label: 'Ramp angle', min: 5, max: 35, step: 1, def: 20, sfx: '\u00b0' }],
        readouts: [{ k: 'ad', label: 'DISK ACCEL', color: '#5eead4' }, { k: 'ah', label: 'HOOP ACCEL', color: '#fbbf24' }, { k: 'win', label: 'WINNER', color: '#a78bfa' }],
        draw: function (ctx, w, h, P, t, ac) {
          var ang = P.ang * Math.PI / 180, aD = (2 / 3) * G * Math.sin(ang), aH = 0.5 * G * Math.sin(ang);
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          var pad = 26, topY = 28, baseY = h - 24, bx1 = w - pad, bx0 = pad;
          var apexY = baseY - (bx1 - bx0) * Math.tan(ang); if (apexY < topY) { apexY = topY; bx0 = bx1 - (baseY - apexY) / Math.max(Math.tan(ang), 0.001); }
          ctx.fillStyle = 'rgba(56,189,248,0.06)'; ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(bx0, apexY); ctx.lineTo(bx0, baseY); ctx.lineTo(bx1, baseY); ctx.closePath(); ctx.fill(); ctx.stroke();
          var L = Math.hypot(bx1 - bx0, baseY - apexY), ux = (bx1 - bx0) / L, uy = (baseY - apexY) / L, nx = -uy, ny = ux;
          var Lm = 8, per = Math.sqrt(2 * Lm / aD) + 1.4, cyc = t % per;
          function roller(a, off, col) { var d = Math.min(0.5 * a * cyc * cyc, Lm), f = d / Lm, px = bx0 + ux * f * L + nx * (14 + off), py = apexY + uy * f * L + ny * (14 + off); ctx.strokeStyle = col; ctx.fillStyle = 'rgba(167,139,250,0.12)'; ctx.lineWidth = 2.5; ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(px, py, 13, 0, 7); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; var sa = d / 13; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(sa) * 13, py + Math.sin(sa) * 13); ctx.stroke(); }
          roller(aH, 16, '#fbbf24'); roller(aD, -16, '#5eead4');
          ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.fillText('disk', bx0 + 4, apexY + 14); ctx.fillText('hoop', bx0 + 4, apexY + 40);
          return { ad: fix(aD, 2) + ' m/s\u00b2', ah: fix(aH, 2) + ' m/s\u00b2', win: 'DISK' };
        } },
      { id: 'orbit', unit: 6, color: '#a78bfa', title: 'Orbiting Satellite', desc: 'Gravity provides the centripetal force that keeps a satellite in orbit. Raise the altitude and the orbit slows \u2014 higher orbits take longer.',
        controls: [{ k: 'r', label: 'Orbit radius', min: 1.2, max: 4, step: 0.1, def: 2, sfx: ' R\u209a' }],
        readouts: [{ k: 'v', label: 'ORBITAL SPEED', color: '#5eead4' }, { k: 'T', label: 'PERIOD', color: '#fbbf24' }, { k: 'g', label: 'GRAVITY HERE', color: '#38bdf8' }],
        draw: function (ctx, w, h, P, t, ac) {
          var r = P.r, vrel = 1 / Math.sqrt(r), Trel = Math.pow(r, 1.5), grel = 1 / (r * r);
          var cx = w / 2, cy = h / 2, planetR = 26, Rpx = planetR + (Math.min(w, h) * 0.36) * ((r - 1) / 3);
          var th = t * (1 / Math.pow(r, 1.5)) * 1.1;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(167,139,250,0.25)'; ctx.setLineDash([4, 5]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, 7); ctx.stroke(); ctx.setLineDash([]);
          // planet
          var g = ctx.createRadialGradient(cx, cy, 4, cx, cy, planetR + 10); g.addColorStop(0, 'rgba(56,189,248,0.7)'); g.addColorStop(1, 'rgba(56,189,248,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, planetR + 10, 0, 7); ctx.fill();
          ctx.fillStyle = 'rgba(56,189,248,0.25)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, planetR, 0, 7); ctx.fill(); ctx.stroke();
          var sx = cx + Math.cos(th) * Rpx, sy = cy + Math.sin(th) * Rpx;
          // gravity arrow toward planet
          this._arrow(ctx, sx, sy, sx + (cx - sx) * 0.3, sy + (cy - sy) * 0.3, '#5eead4', 2);
          // velocity tangent
          this._arrow(ctx, sx, sy, sx - Math.sin(th) * 34, sy + Math.cos(th) * 34, '#fbbf24', 2);
          ctx.fillStyle = '#f472b6'; ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(sx, sy, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          return { v: fix(vrel, 2) + ' v\u2080', T: fix(Trel, 2) + ' T\u2080', g: fix(grel, 2) + ' g\u2080' };
        } },
      // ===== UNIT 7 =====
      { id: 'pendulum', unit: 7, color: '#2dd4bf', title: 'Pendulum', desc: 'Lengthen the pendulum and the period grows; change amplitude and notice it barely matters.',
        controls: [{ k: 'L', label: 'Length L', min: 0.5, max: 4, step: 0.25, def: 2, sfx: ' m' }, { k: 'A', label: 'Amplitude \u03b8\u2080', min: 5, max: 45, step: 1, def: 25, sfx: '\u00b0' }],
        readouts: [{ k: 'T', label: 'PERIOD T', color: '#5eead4' }, { k: 'ang', label: 'CURRENT ANGLE', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var L = P.L, A = P.A * Math.PI / 180, om = Math.sqrt(G / L), T = 2 * Math.PI / om, th = A * Math.cos(om * t);
          var px = w / 2, py = 24, Lpx = Math.min((h - 60) * (L / 4), h - 56), bx = px + Math.sin(th) * Lpx, by = py + Math.cos(th) * Lpx;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.2)'; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(px, py, Lpx, Math.PI / 2 - A, Math.PI / 2 + A); ctx.stroke(); ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 24, py); ctx.lineTo(px + 24, py); ctx.stroke();
          ctx.strokeStyle = ac; ctx.lineWidth = 2.5; ctx.shadowColor = ac; ctx.shadowBlur = 6; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(bx, by, 14, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          return { T: fix(T, 2) + ' s', ang: fix(th * 180 / Math.PI, 0) + '\u00b0' };
        } },
      { id: 'massspring', unit: 7, color: '#2dd4bf', title: 'Mass\u2013Spring Oscillator', desc: 'A mass on a horizontal spring in simple harmonic motion. Heavier mass or softer spring = slower.',
        controls: [{ k: 'm', label: 'Mass m', min: 0.2, max: 3, step: 0.1, def: 1, sfx: ' kg' }, { k: 'k', label: 'Spring constant k', min: 50, max: 500, step: 25, def: 200, sfx: ' N/m' }],
        readouts: [{ k: 'T', label: 'PERIOD T', color: '#5eead4' }, { k: 'vmax', label: 'MAX SPEED', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var m = P.m, k = P.k, om = Math.sqrt(k / m), T = 2 * Math.PI / om, A = 0.25, baseY = h / 2, wallX = 30;
          var rest = w * 0.55, amp = w * 0.16, mx = rest + amp * Math.sin(om * t);
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.strokeStyle = 'rgba(56,189,248,0.3)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();
          ctx.strokeStyle = ac; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wallX, baseY - 30); ctx.lineTo(wallX, baseY + 30); ctx.stroke();
          var coils = 13; ctx.strokeStyle = '#2dd4bf'; ctx.lineWidth = 2; ctx.shadowColor = '#2dd4bf'; ctx.shadowBlur = 6; ctx.beginPath(); ctx.moveTo(wallX, baseY);
          for (var i = 1; i < coils; i++) { var fx = wallX + (mx - 18 - wallX) * i / coils; ctx.lineTo(fx, baseY + (i % 2 ? -12 : 12)); } ctx.lineTo(mx - 18, baseY); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(45,212,191,0.18)'; ctx.strokeStyle = '#2dd4bf'; ctx.lineWidth = 2; ctx.shadowColor = '#2dd4bf'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.rect(mx - 18, baseY - 18, 36, 36); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(95,115,133,0.4)'; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(rest, baseY - 36); ctx.lineTo(rest, baseY + 36); ctx.stroke(); ctx.setLineDash([]);
          return { T: fix(T, 2) + ' s', vmax: fix(A * om, 2) + ' m/s' };
        } },
      // ===== UNIT 8 =====
      { id: 'buoyancy', unit: 8, color: '#60a5fa', title: 'Buoyancy Tank', desc: 'Tune block and fluid densities; see the fraction below the waterline, or whether it sinks.',
        controls: [{ k: 'bd', label: 'Block density', min: 200, max: 1400, step: 50, def: 600, sfx: ' kg/m\u00b3' }, { k: 'fd', label: 'Fluid density', min: 600, max: 1300, step: 50, def: 1000, sfx: ' kg/m\u00b3' }],
        readouts: [{ k: 'sub', label: 'SUBMERGED', color: '#38bdf8' }, { k: 'wt', label: 'WEIGHT', color: '#fbbf24' }, { k: 'state', label: 'STATE', color: '#5eead4' }],
        draw: function (ctx, w, h, P, t, ac) {
          var bd = P.bd, fd = P.fd, V = 0.002, floats = bd < fd, frac = floats ? bd / fd : 1, bob = Math.sin(t * 2) * 3;
          var waterY = h * 0.32, tankBot = h - 12;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.fillStyle = 'rgba(96,165,250,0.14)'; ctx.fillRect(0, waterY, w, tankBot - waterY);
          ctx.strokeStyle = 'rgba(96,165,250,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, waterY); ctx.lineTo(w, waterY); ctx.stroke();
          ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.fillText('waterline', 8, waterY - 6);
          var bw = 84, bh = 84, cx = w / 2, topY = floats ? (waterY - bh * (1 - frac) + bob) : (tankBot - bh);
          ctx.fillStyle = 'rgba(251,191,36,0.18)'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.rect(cx - bw / 2, topY, bw, bh); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          var weight = bd * V * G, Fb = (floats ? frac : 1) * fd * V * G, midY = topY + bh / 2;
          this._arrow(ctx, cx - 24, midY, cx - 24, midY + weight * 0.9, '#f472b6', 2);
          this._arrow(ctx, cx + 24, midY, cx + 24, midY - Fb * 0.9, '#5eead4', 2);
          return { sub: Math.round(frac * 100) + ' %', wt: fix(weight) + ' N', state: floats ? 'FLOATS' : 'SINKS' };
        } },
      { id: 'pressure', unit: 8, color: '#60a5fa', title: 'Pressure vs Depth', desc: 'Lower a sensor into a fluid. Pressure rises linearly with depth: P = P\u2080 + \u03c1gh.',
        controls: [{ k: 'd', label: 'Depth', min: 0, max: 20, step: 1, def: 10, sfx: ' m' }, { k: 'fd', label: 'Fluid density', min: 800, max: 1200, step: 50, def: 1000, sfx: ' kg/m\u00b3' }],
        readouts: [{ k: 'gauge', label: 'GAUGE \u03c1gh', color: '#5eead4' }, { k: 'abs', label: 'ABSOLUTE P', color: '#fbbf24' }],
        draw: function (ctx, w, h, P, t, ac) {
          var d = P.d, fd = P.fd, maxD = 20, surfY = 26, botY = h - 16, s = (botY - surfY) / maxD, sensorY = surfY + d * s;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          ctx.fillStyle = 'rgba(96,165,250,0.14)'; ctx.fillRect(w * 0.16, surfY, w * 0.5, botY - surfY);
          ctx.strokeStyle = 'rgba(96,165,250,0.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(w * 0.16, surfY); ctx.lineTo(w * 0.66, surfY); ctx.stroke();
          ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace';
          for (var m = 0; m <= maxD; m += 5) { var yy = surfY + m * s; ctx.fillText(m + 'm', w * 0.16 - 30, yy + 3); ctx.strokeStyle = 'rgba(96,165,250,0.25)'; ctx.beginPath(); ctx.moveTo(w * 0.16, yy); ctx.lineTo(w * 0.16 - 5, yy); ctx.stroke(); }
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(w * 0.41, sensorY, 8, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          // pressure bar
          var gauge = fd * G * d, maxG = 1200 * G * maxD, barX = w * 0.76, barTop = surfY, barH = botY - surfY;
          ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(barX, barTop, 26, barH);
          var hh = barH * (gauge / maxG); ctx.fillStyle = ac; ctx.fillRect(barX, botY - hh, 26, hh);
          ctx.fillStyle = '#5f7385'; ctx.fillText('P', barX + 6, barTop - 6);
          return { gauge: (gauge / 1000).toFixed(1) + ' kPa', abs: ((gauge + 101325) / 1000).toFixed(1) + ' kPa' };
        } },
      { id: 'continuity', unit: 8, color: '#60a5fa', title: 'Pipe Flow & Continuity', desc: 'Incompressible fluid speeds up through a narrow section: A\u2081v\u2081 = A\u2082v\u2082. Squeeze the pipe and the same flow must move faster.',
        controls: [{ k: 'a2', label: 'Narrow width A\u2082', min: 0.2, max: 1, step: 0.05, def: 0.4, sfx: '\u00d7 A\u2081' }, { k: 'v1', label: 'Inlet speed v\u2081', min: 1, max: 5, step: 0.5, def: 2, sfx: ' m/s' }],
        readouts: [{ k: 'v2', label: 'NARROW SPEED v\u2082', color: '#fbbf24' }, { k: 'q', label: 'FLOW RATE', color: '#5eead4' }, { k: 'ratio', label: 'SPEED-UP', color: '#38bdf8' }],
        draw: function (ctx, w, h, P, t, ac) {
          var a2 = P.a2, v1 = P.v1, v2 = v1 / a2, cy = h / 2;
          var wide = h * 0.32, narrow = wide * a2;
          var x0 = 20, x1 = w * 0.34, x2 = w * 0.66, x3 = w - 20;
          ctx.clearRect(0, 0, w, h); this._grid(ctx, w, h);
          // build pipe outline
          function H(x) { if (x <= x1) return wide; if (x >= x2) return wide; var f = (x - x1) / (x2 - x1); return wide + (narrow - wide) * Math.sin(f * Math.PI); }
          ctx.fillStyle = 'rgba(96,165,250,0.12)'; ctx.beginPath();
          ctx.moveTo(x0, cy - wide);
          for (var x = x0; x <= x3; x += 4) ctx.lineTo(x, cy - H(x));
          for (var x = x3; x >= x0; x -= 4) ctx.lineTo(x, cy + H(x));
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(96,165,250,0.6)'; ctx.lineWidth = 2;
          ctx.beginPath(); for (var x = x0; x <= x3; x += 4) { if (x === x0) ctx.moveTo(x, cy - H(x)); else ctx.lineTo(x, cy - H(x)); } ctx.stroke();
          ctx.beginPath(); for (var x = x0; x <= x3; x += 4) { if (x === x0) ctx.moveTo(x, cy + H(x)); else ctx.lineTo(x, cy + H(x)); } ctx.stroke();
          // particles: speed varies with local cross-section (v ~ 1/H)
          if (!this._contParts) { this._contParts = []; for (var i = 0; i < 22; i++) this._contParts.push({ x: x0 + Math.random() * (x3 - x0), y: (Math.random() * 2 - 1) }); }
          ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 6;
          this._contParts.forEach(function (p) {
            var localV = v1 * (wide / H(p.x));
            p.x += localV * 0.7; if (p.x > x3) { p.x = x0; p.y = (Math.random() * 2 - 1); }
            var yy = cy + p.y * (H(p.x) - 5);
            ctx.beginPath(); ctx.arc(p.x, yy, 3, 0, 7); ctx.fill();
          });
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#5f7385'; ctx.font = '10px "IBM Plex Mono",monospace'; ctx.fillText('A\u2081, v\u2081', x0 + 6, cy - wide - 6); ctx.fillText('A\u2082, v\u2082', (x1 + x2) / 2 - 14, cy - narrow - 6);
          return { v2: fix(v2) + ' m/s', q: fix(v1 * 1) + ' (A\u2081v\u2081)', ratio: fix(1 / a2, 1) + '\u00d7' };
        } }
    ];
  return defs;
}
