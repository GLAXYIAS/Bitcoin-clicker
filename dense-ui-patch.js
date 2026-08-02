// Dense UI patch — runs after center-panel.js
(function () {
  function inject() {
    if (document.getElementById('dense-ui-css')) return;
    var s = document.createElement('style');
    s.id = 'dense-ui-css';
    s.textContent = [
      '.center-tab{font-size:0.55em!important;padding:10px 4px!important;}',
      '.center-tab-body{overflow:hidden!important;padding:8px 10px!important;}',
      '.ach-grid{grid-template-columns:repeat(auto-fill,minmax(88px,1fr))!important;gap:4px!important;overflow:hidden!important;}',
      '.ach-card{padding:4px 5px!important;min-height:0!important;border-width:1px!important;}',
      '.ach-card .ach-icon,.ach-card .ach-icon svg{width:16px!important;height:16px!important;}',
      '.ach-card .ach-title{font-size:0.32em!important;}',
      '.ach-card .ach-desc{display:none!important;}',
      '.ach-card .ach-status{font-size:0.28em!important;}',
      '.floating-text{color:#1a6b3a!important;text-shadow:0 0 3px #0a2e18,0 1px 2px #000!important;font-size:0.95em!important;font-weight:bold!important;}',
      '.dev-console{max-height:110px!important;font-size:0.42em!important;}'
    ].join('');
    document.head.appendChild(s);
  }

  // Upgrade Dev tab into a real console with command line + browser console hook
  function enhanceDevConsole() {
    if (window.__denseConsole) return;
    window.__denseConsole = true;

    if (!window.__consoleHooked) {
      window.__consoleHooked = true;
      ['log','info','warn','error'].forEach(function (m) {
        var orig = console[m].bind(console);
        console[m] = function () {
          try {
            var args = Array.prototype.slice.call(arguments).map(function (a) {
              try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch (e) { return String(a); }
            });
            if (typeof window.devLog === 'function') window.devLog(args.join(' '), m === 'warn' ? 'warn' : m === 'error' ? 'error' : 'info');
          } catch (e) {}
          return orig.apply(console, arguments);
        };
      });
    }

    var obs = new MutationObserver(function () {
      var body = document.getElementById('center-tab-body');
      if (!body || document.getElementById('dev-console-input')) return;
      if (!document.getElementById('dev-console-log')) return;
      // Inject command row under console if missing
      if (!document.getElementById('dev-cmd-row')) {
        var row = document.createElement('div');
        row.id = 'dev-cmd-row';
        row.style.cssText = 'display:flex;gap:4px;margin:4px 0;';
        row.innerHTML = '<input id="dev-console-input" type="text" placeholder="help | checks | bps | bal | clear" style="flex:1;background:#000;border:1px solid #444;color:#00ff9d;font-family:monospace;font-size:0.45em;padding:6px;"/><button type="button" id="dev-console-run" style="font-family:inherit;font-size:0.4em;padding:6px 8px;background:#252538;color:#00ff9d;border:1px solid #00ff9d;cursor:pointer;">RUN</button>';
        var log = document.getElementById('dev-console-log');
        if (log && log.parentNode) log.parentNode.insertBefore(row, log.nextSibling);
        var run = function () {
          var input = document.getElementById('dev-console-input');
          if (!input) return;
          var cmd = input.value.trim();
          input.value = '';
          if (!cmd) return;
          if (typeof window.devLog === 'function') window.devLog('> ' + cmd, 'info');
          try {
            if (cmd === 'help') window.devLog('help | checks | clear | bps | bal | miners | upgrades | save', 'ok');
            else if (cmd === 'clear') { var el = document.getElementById('dev-console-log'); if (el) el.innerHTML = ''; }
            else if (cmd === 'checks' || cmd === 'check') {
              [['gameData',!!window.gameData],['miners',!!(window.miners&&window.miners.length)],['upgrades',!!(window.upgrades&&window.upgrades.length)],['casino',typeof window.openCasinoMode==='function']].forEach(function(c){ window.devLog(c[0]+': '+(c[1]?'OK':'MISSING'), c[1]?'ok':'error'); });
              if (window.miners) window.devLog('miner count = ' + window.miners.length, 'info');
            }
            else if (cmd === 'bps') window.devLog('BPS = ' + (typeof calculateCurrentBPS==='function'?calculateCurrentBPS():'?'), 'ok');
            else if (cmd === 'bal' || cmd === 'balance') window.devLog('BTC = ' + (window.gameData?window.gameData.bitcoin:'?'), 'ok');
            else if (cmd === 'miners') window.devLog('miners: ' + ((window.miners&&window.miners.length)||0), 'ok');
            else if (cmd === 'upgrades') window.devLog('upgrades: ' + ((window.upgrades&&window.upgrades.length)||0), 'ok');
            else if (cmd === 'save') { if (typeof saveGame==='function'){ saveGame(); window.devLog('Saved.','ok'); } }
            else window.devLog(String((0,eval)(cmd)), 'ok');
          } catch (err) { window.devLog(String(err.message||err), 'error'); }
        };
        var btn = document.getElementById('dev-console-run');
        var inp = document.getElementById('dev-console-input');
        if (btn) btn.onclick = run;
        if (inp) inp.onkeydown = function (e) { if (e.key === 'Enter') run(); };
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  inject();
  enhanceDevConsole();
  // Also load after short delay in case center-panel mounts later
  setTimeout(inject, 500);
  setTimeout(enhanceDevConsole, 500);
})();
