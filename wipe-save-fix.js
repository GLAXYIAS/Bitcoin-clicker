// Hard wipe: clear localStorage + Cache API + block beforeunload resave
(function () {
  if (window.__wipeSaveFixLoaded) return;
  window.__wipeSaveFixLoaded = true;

  var SAVE_KEYS = [
    'btcMinerySaveData',
    'btcMinerySave',
    'bitcoinClickerSave',
    'btc_minery_save',
    'bitcoin-clicker-save'
  ];
  var WIPE_FLAG = 'btcMineryWiping';

  function isWiping() {
    try {
      return sessionStorage.getItem(WIPE_FLAG) === '1' || window.__wipingSave === true;
    } catch (e) {
      return window.__wipingSave === true;
    }
  }

  function setWiping(on) {
    window.__wipingSave = !!on;
    try {
      if (on) sessionStorage.setItem(WIPE_FLAG, '1');
      else sessionStorage.removeItem(WIPE_FLAG);
    } catch (e) {}
  }

  function clearAllLocalSaves() {
    SAVE_KEYS.forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) {}
    });
    try {
      var remove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) continue;
        var low = key.toLowerCase();
        if (low.indexOf('btc') !== -1 || low.indexOf('bitcoin') !== -1 || low.indexOf('minery') !== -1) {
          remove.push(key);
        }
      }
      remove.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }

  function clearSiteCaches() {
    var jobs = [];
    try {
      if (window.caches && typeof caches.keys === 'function') {
        jobs.push(
          caches.keys().then(function (names) {
            return Promise.all(names.map(function (n) { return caches.delete(n); }));
          }).catch(function () {})
        );
      }
    } catch (e) {}
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        jobs.push(
          navigator.serviceWorker.getRegistrations().then(function (regs) {
            return Promise.all(regs.map(function (r) { return r.unregister(); }));
          }).catch(function () {})
        );
      }
    } catch (e) {}
    return Promise.all(jobs).catch(function () {});
  }

  function patchSaveGame() {
    var prev = window.saveGame;
    window.saveGame = function () {
      if (isWiping()) return;
      if (typeof prev === 'function') return prev.apply(this, arguments);
    };
  }

  function patchLoadGame() {
    var prev = window.loadGame;
    if (typeof prev !== 'function') return;
    window.loadGame = function () {
      if (isWiping()) {
        clearAllLocalSaves();
        setTimeout(function () { setWiping(false); }, 1500);
        return;
      }
      return prev.apply(this, arguments);
    };
  }

  window.resetGame = function () {
    var ok = window.confirm(
      'WARNING: Erase ALL progress for this site?\n\n' +
      'This clears your save data and this site\'s cache, then reloads a fresh game.'
    );
    if (!ok) return;

    setWiping(true);
    clearAllLocalSaves();
    patchSaveGame();

    clearSiteCaches().then(function () {
      window.location.replace(window.location.pathname + '?wiped=' + Date.now());
    });

    setTimeout(function () {
      window.location.replace(window.location.pathname + '?wiped=' + Date.now());
    }, 800);
  };

  function onBoot() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('wiped') || isWiping()) {
      setWiping(true);
      clearAllLocalSaves();
      patchSaveGame();
      setTimeout(function () {
        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (e) {}
        setWiping(false);
      }, 2000);
    }
    patchSaveGame();
    patchLoadGame();

    window.addEventListener('beforeunload', function () {
      if (isWiping()) clearAllLocalSaves();
    }, true);

    document.addEventListener('visibilitychange', function () {
      if (isWiping() && document.visibilityState === 'hidden') clearAllLocalSaves();
    }, true);
  }

  function ensureWipeButtons() {
    var statsBtns = document.querySelector('#stats-modal .modal-btns');
    if (statsBtns && !document.getElementById('wipe-save-btn')) {
      var b = document.createElement('button');
      b.id = 'wipe-save-btn';
      b.type = 'button';
      b.textContent = 'WIPE SAVE DATA';
      b.style.background = '#ff4d4d';
      b.onclick = function () { window.resetGame(); };
      var closeBtn = statsBtns.querySelector('button:last-child');
      if (closeBtn) statsBtns.insertBefore(b, closeBtn);
      else statsBtns.appendChild(b);
    }

    var body = document.querySelector('.center-tab-body');
    if (body && !document.getElementById('opt-wipe-save')) {
      if (body.querySelector('#opt-sound') || body.querySelector('.opt-row')) {
        var row = document.createElement('div');
        row.className = 'opt-row';
        row.style.marginTop = '20px';
        row.innerHTML =
          '<span style="color:#ff6666;">Wipe save & site cache</span>' +
          '<button type="button" id="opt-wipe-save" class="opt-toggle" style="border-color:#ff4d4d;color:#ff4d4d;">WIPE</button>';
        body.appendChild(row);
        document.getElementById('opt-wipe-save').onclick = function () { window.resetGame(); };
      }
    }
  }

  function boot() {
    onBoot();
    ensureWipeButtons();
    setInterval(ensureWipeButtons, 1500);
    setTimeout(function () { patchSaveGame(); patchLoadGame(); }, 400);
    setTimeout(function () { patchSaveGame(); patchLoadGame(); }, 1200);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 100); });
  else setTimeout(boot, 100);
})();
