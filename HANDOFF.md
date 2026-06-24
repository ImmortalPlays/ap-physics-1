# AP Physics 1 — Simulated · Developer Handoff

## What this is
A single-file interactive AP Physics 1 study site, built as a Design Component
(`AP Physics 1.dc.html`). Dark "blueprint/lab" aesthetic. Contents:
- 8 units (CB 2024–25 framework) — concept cards + worked examples (KaTeX math)
- 21 interactive canvas simulations (a shared registry: `_simDefs()`)
- Sim Lab (browsable library + full-screen player)
- Practice (12 MCQ with instant feedback + scoring, 3 multi-part FRQ with rubrics)
- Cheat Sheet, FAQ, sidebar search

It runs entirely client-side with in-memory "routing" (a `screen` state field).
No backend, no build step, no URLs.

## Fonts / libraries
- Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (data) — Google Fonts
- KaTeX 0.16.9 (auto-render) for math
- Hand-rolled canvas 2D for every simulation (no physics library)

## Goal of the productionization
Turn this into a real, deployable web app **without losing** what makes it good:
instant navigation and continuously-running simulations. Target: a proper SPA,
NOT a multi-page-reload site.

## Recommended stack
- **Vite + React + TypeScript**
- **React Router** (or TanStack Router) for real URLs:
  `/unit/3`, `/sim/pendulum`, `/practice`, `/cheat-sheet`, `/faq`
- Keep client-side navigation (no full reloads) so canvas sims keep running
- Optional: **Next.js** instead, IF SEO/SSR for the concept content matters
  (it probably does for a public student-facing site)

## Concrete work items
1. **Decompose** the one DC into components:
   - `AppShell` (sidebar + search), `UnitPage`, `SimLab` (library + `SimPlayer`),
     `Practice` (MCQ + FRQ), `CheatSheet`, `Faq`, `Home`
2. **Extract the simulation registry** (`_simDefs()` in the DC) into a typed module,
   one file per sim or a `/sims` folder. Each sim = `{ id, unit, controls, readouts, draw }`.
   Drive them with a single shared `requestAnimationFrame` loop (pause off-screen sims).
3. **Content as data**: move unit concept cards, worked examples, and the practice
   bank (`_practiceData()`) into MDX or JSON so non-developers can edit them.
4. **Real routing + deep links**: every unit/sim/practice question gets a URL.
   Wire browser back/forward, refresh-to-position, and shareable links.
5. **Persistence**: save MCQ progress/score and last-visited spot to localStorage
   (and later, a user account if you go that far).
6. **Accessibility**: keyboard nav for the sidebar and sim controls, `prefers-reduced-motion`
   to pause animations, ARIA on the MCQ option buttons, focus management on route change.
7. **Responsive/mobile**: the current layout is desktop-first (fixed 264px sidebar).
   Add a collapsible drawer + reflow the 2-col sim panels for small screens.
8. **Performance**: code-split per route so all 21 sims don't load up front.
9. **Testing**: unit-test the physics formulas in each sim's `draw` (they return the
   readout values — easy to assert), plus the MCQ scoring logic.
10. **Deploy**: static host (Vercel/Netlify/Cloudflare Pages). Add analytics + meta tags.

## Things to preserve exactly
- The visual system: colors (#0a1118 bg, #38bdf8 primary, the per-unit accent colors),
  the blueprint grid background, IBM Plex Mono labels, the FIG-numbered sim panels.
- Simulations must keep running across navigation (do NOT remount on route change).
- KaTeX rendering of all math.

## Known simplifications in the prototype (fair game to improve)
- Sims are visually-driven approximations, not a rigorous physics engine. Formulas in
  the readouts are correct; some motion is eased/looped for looks. A dev may want to
  make a few fully time-integrated.
- No variable-force-work sim, no Bernoulli pressure-drop sim, no SHM x(t)/v(t)/a(t)
  graph trio — candidates if you want fuller coverage.
- Everything is in one 2,100-line file by design (it's a design artifact).
