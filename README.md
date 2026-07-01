# AP Physics 1 — Simulated

An interactive AP Physics 1 study site. Dark "blueprint/lab" aesthetic, runs entirely in the browser with **no build step** — just plain ES modules.

**Live site:** https://immortalplays.github.io/ap-physics-1/ (enable GitHub Pages in repo Settings → Pages → Branch: `main`)

## What's inside
- **8 units** (College Board 2024–25 framework) — concept cards + worked examples with KaTeX math
- **21 interactive canvas simulations** — hand-rolled 2D physics, browsable in the Sim Lab
- **Practice** — 12 MCQ with instant scoring + 3 multi-part FRQ with rubrics
- **Cheat Sheet, FAQ, and sidebar search**
- **Shareable deep links** — every unit / sim / section has its own URL (see below)

## Running it
It uses ES modules and `fetch`, so it needs to be served over HTTP (opening the
file directly with `file://` won't work). Any static server does:

```bash
python -m http.server 8000      # then open http://localhost:8000
```

On GitHub Pages it just works — push to `main` and the site is live, no build.

## URLs (deep links, back/forward, refresh-to-position)
Navigation uses the URL hash, so links are shareable and the browser's
back/forward buttons work:

| URL | Screen |
| --- | --- |
| `#/` | Home |
| `#/unit/3` | Unit 3 |
| `#/sim/pendulum` | Sim Lab, Pendulum open |
| `#/sims` | Sim Lab library |
| `#/practice` · `#/cheat` · `#/faq` | Practice · Cheat Sheet · FAQ |

## Architecture
A small hand-rolled SPA — no framework, no bundler.

```
index.html            Thin shell: fonts, KaTeX, styles.css, <div id="app">, main.js
src/
  main.js             Bootstraps the Controller into #app
  app.js              Controller: state, render cycle, navigation, hash router
  core.js             Render core: HTML->DOM mount, event wiring, :hover/:focus CSS
  rendervals.js       View-model — derives every binding + handler from state
  styles.css          Global styles (theme + responsive)
  sims/
    canvas.js         Canvas engine: all draw routines + the 60fps frame loop
  content/
    sims.js           The 21-sim registry (id, controls, readouts, draw) — data
    practice.js       Practice bank (MCQ + FRQ) — data
  views/
    shell.js          Sidebar + layout
    home.js unit.js simlab.js practice.js cheat.js faq.js   One per screen
    dom.js            View helpers (events, hover, decoupled sliders)
lessons.html          Unit concept/example HTML + cheat-sheet cards (editable content)
lessons-loader.js     Injects lessons.html into the .lesson placeholders + typesets math
mock-exam.html        Standalone full mock exam (uses questions.js)
```

The simulations keep running across navigation (they're driven by a single
shared animation loop that reads live state), and sim/search controls update
without re-rendering the whole page, so dragging a slider stays smooth.

Concept/example prose and the cheat sheet live in `lessons.html` as plain HTML
keyed by `data-lesson`, so they can be edited without touching the app code.

See [`HANDOFF.md`](HANDOFF.md) for the original design notes.
