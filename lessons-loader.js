/* ============================================================================
   Lesson loader
   ----------------------------------------------------------------------------
   The heavy unit lesson content (concept cards + worked examples) lives in a
   separate, easy-to-edit file: lessons.html. This script fetches it once and
   injects each unit's HTML into the placeholders the app renders, then typesets
   the math with KaTeX. It re-runs automatically whenever the reactive runtime
   recreates a placeholder (e.g. when you navigate to a unit).
   ========================================================================== */
(function () {
  var cache = null, fetching = false;

  function typeset(el) {
    if (window.renderMathInElement) {
      try {
        renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  }

  function fill() {
    var nodes = document.querySelectorAll('.lesson[data-lesson]:not([data-filled])');
    if (!nodes.length) return;

    if (!cache) {
      if (!fetching) {
        fetching = true;
        fetch('lessons.html')
          .then(function (r) { return r.text(); })
          .then(function (text) {
            var box = document.createElement('div');
            box.innerHTML = text;
            cache = {};
            box.querySelectorAll('[data-lesson]').forEach(function (el) {
              cache[el.getAttribute('data-lesson')] = el.innerHTML;
            });
            fetching = false;
            fill();
          })
          .catch(function () { fetching = false; });
      }
      return;
    }

    nodes.forEach(function (el) {
      var key = el.getAttribute('data-lesson');
      if (cache[key] != null) {
        el.innerHTML = cache[key];
        el.setAttribute('data-filled', '1');
        typeset(el);
      }
    });
  }

  function start() {
    new MutationObserver(function () { fill(); })
      .observe(document.body, { childList: true, subtree: true });
    fill();
  }

  if (document.readyState !== 'loading') start();
  else document.addEventListener('DOMContentLoaded', start);
})();
