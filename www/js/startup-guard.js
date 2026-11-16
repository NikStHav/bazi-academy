// Classic (non-module) script loaded first: if the app fails to start, show the error instead of a blank screen.
(function () {
  var errors = [];
  function add(msg) { errors.push(String(msg).slice(0, 300)); }
  window.addEventListener('error', function (e) { add((e.message || 'Error') + (e.filename ? ' @ ' + e.filename.split('/').pop() + ':' + e.lineno : '')); });
  window.addEventListener('unhandledrejection', function (e) { add('Promise: ' + (e.reason && e.reason.message || e.reason)); });
  window.__baziStarted = false;
  setTimeout(function () {
    if (window.__baziStarted) return;
    var v = document.getElementById('view');
    if (!v) return;
    var cap = window.Capacitor ? ('native=' + (window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) + ', registerPlugin=' + typeof window.Capacitor.registerPlugin) : 'no Capacitor';
    v.innerHTML = '<div class="card"><h2 style="margin-top:0">The app could not start</h2>' +
      '<p>Please send a screenshot of this screen to the developer.</p>' +
      '<pre style="white-space:pre-wrap;font-size:12px">' + (errors.join('\n') || 'No error message (module did not load).').replace(/</g, '&lt;') +
      '\n\n' + cap + '\n' + navigator.userAgent.replace(/</g, '&lt;') + '</pre></div>';
  }, 4000);
})();
