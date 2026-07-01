/* Entry point: create the controller, mount it into #app, boot the render +
   frame loop + router. lessons-loader.js (loaded separately) fills the
   .lesson[data-lesson] placeholders and typesets their math. */
import { Controller } from './app.js';

const root = document.getElementById('app');
const app = new Controller(root);
window.__physApp = app; // handy for debugging in the console
app.mount();
