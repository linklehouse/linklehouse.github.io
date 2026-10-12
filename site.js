document.querySelectorAll('[data-tabs]').forEach(function (root) {
  var btns = root.querySelectorAll('[role="tab"]');
  function show(i) {
    btns.forEach(function (b, j) {
      var on = i === j;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).classList.toggle('on', on);
    });
  }
  btns.forEach(function (b, i) {
    b.addEventListener('click', function () { show(i); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, n = btns.length;
      if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); show((i + 1) % n); btns[(i + 1) % n].focus(); }
      if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); show((i + n - 1) % n); btns[(i + n - 1) % n].focus(); }
    });
  });
});
