// Late bootstrap: wipe fix + scaling rebirth + crate rate + store rewire
(function () {
  if (!window.__wipePatched) {
    window.__wipePatched = true;
    window.__wipingSave = false;
    var _save = window.saveGame;
    if (typeof _save === 'function') {
      window.saveGame = function () {
        if (window.__wipingSave) return;
        return _save.apply(this, arguments);
      };
    }
    window.resetGame = function () {
      if (confirm('WARNING: Are you sure you want to completely erase all of your progress and start fresh?')) {
        window.__wipingSave = true;
        try {
          localStorage.removeItem('btcMinerySaveData');
          localStorage.removeItem('btcMinerySave');
          localStorage.removeItem('bitcoinClickerSave');
        } catch (e) {}
        window.location.href = window.location.pathname + window.location.search + '?wiped=' + Date.now();
      }
    };
  }

  if (typeof window.getRebirthRequirement !== 'function') {
    window.getRebirthRequirement = function () {
      var base = 1e18;
      var r = (window.gameData && window.gameData.rebirths) ? window.gameData.rebirths : 0;
      return base * Math.pow(10, r);
    };
  }

  var _ud = window.updateDisplay;
  if (typeof _ud === 'function' && !window.__rebirthCostPatched) {
    window.__rebirthCostPatched = true;
    window.updateDisplay = function () {
      _ud.apply(this, arguments);
      try {
        var need = window.getRebirthRequirement();
        var prog = document.getElementById('rebirth-progress');
        var btn = document.getElementById('rebirth-btn-action');
        if (prog && window.gameData) {
          prog.innerText = (Math.min((window.gameData.bitcoin / need) * 100, 100)).toFixed(4) + '%';
        }
        if (btn && window.gameData) btn.disabled = window.gameData.bitcoin < need;
      } catch (e) {}
    };
  }

  if (!window.__crateRatePatched) {
    window.__crateRatePatched = true;
    var CHANCE = 0.45972;
    var lastCrate = 0;
    var origSpawn = window.spawnAirdrop;
    if (typeof origSpawn === 'function') {
      window.spawnAirdrop = function () {
        var now = Date.now();
        if (now - lastCrate < 9 * 60 * 1000) return;
        lastCrate = now;
        return origSpawn.apply(this, arguments);
      };
    }
    setInterval(function () {
      if (typeof window.spawnAirdrop === 'function' && Math.random() < CHANCE) {
        lastCrate = 0;
        window.spawnAirdrop();
      }
    }, 600000);
  }

  function rewireStore() {
    if (!window.miners || !window.miners.length) return;
    if (typeof window.renderMiners === 'function') try { window.renderMiners(); } catch (e) {}
    if (typeof window.renderUpgrades === 'function') try { window.renderUpgrades(); } catch (e) {}
  }
  setTimeout(rewireStore, 300);
  setTimeout(rewireStore, 1200);
  setTimeout(rewireStore, 3000);
})();
