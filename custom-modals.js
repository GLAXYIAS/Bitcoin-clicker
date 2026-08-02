// Custom modals: minery name, miner buy/info, upgrade buy/info
(function () {
  if (window.__customModalsLoaded) return;
  window.__customModalsLoaded = true;

  function fmt(n) {
    return typeof formatNum === 'function' ? formatNum(n) : String(n);
  }
  function discount() {
    if (typeof SKILL_TREE !== 'undefined' && SKILL_TREE.node_discount && window.gameData) {
      return SKILL_TREE.node_discount.getEffect(window.gameData.skillTreeLevels['node_discount'] || 0);
    }
    return 1;
  }
  function minerProd(m) {
    var base = m.production || 0;
    var mult = typeof window.getMinerProductionMult === 'function' ? window.getMinerProductionMult(m.id) : 1;
    return base * mult;
  }
  function minerCost(m) {
    var owned = (window.gameData && window.gameData.ownedMiners[m.id]) || 0;
    return Math.floor(m.baseCost * Math.pow(1.42, owned) * discount());
  }
  function upgradeCost(u) {
    return Math.floor(u.baseCost * discount());
  }

  function injectCss() {
    if (document.getElementById('custom-modals-css')) return;
    var s = document.createElement('style');
    s.id = 'custom-modals-css';
    s.textContent = [
      '#cm-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:7000;display:none;align-items:center;justify-content:center;padding:16px;}',
      '#cm-backdrop.open{display:flex;}',
      '#cm-modal{position:relative;width:min(420px,94vw);background:#14141f;border:3px solid #ffd700;border-radius:10px;padding:22px 22px 18px;box-shadow:0 18px 40px rgba(0,0,0,0.9);font-family:inherit;color:#eee;}',
      '#cm-modal.cm-miner{border-color:#00ff9d;}',
      '#cm-modal.cm-upgrade{border-color:#bc34fa;}',
      '#cm-modal.cm-name{border-color:#ffd700;}',
      '#cm-x{position:absolute;top:10px;right:12px;width:32px;height:32px;border:2px solid #000;background:#fff;color:#000;font-size:18px;font-weight:900;font-family:monospace;cursor:pointer;line-height:1;display:inline-flex;align-items:center;justify-content:center;}',
      '#cm-x:hover{background:#000;color:#fff;}',
      '#cm-modal .cm-title{font-size:0.7em;color:#ffd700;margin:0 28px 12px 0;letter-spacing:0.5px;line-height:1.3;}',
      '#cm-modal.cm-miner .cm-title{color:#00ff9d;}',
      '#cm-modal.cm-upgrade .cm-title{color:#d466ff;}',
      '#cm-modal .cm-row{display:flex;justify-content:space-between;gap:12px;margin:8px 0;font-size:0.48em;border-bottom:1px solid #2a2a38;padding-bottom:6px;}',
      '#cm-modal .cm-row span:last-child{color:#00ff9d;font-family:monospace;text-align:right;}',
      '#cm-modal .cm-desc{font-size:0.42em;color:#bbb;line-height:1.45;margin:10px 0 14px;}',
      '#cm-modal label.cm-label{display:block;font-size:0.4em;color:#888;margin:12px 0 6px;}',
      '#cm-modal input.cm-input{width:100%;box-sizing:border-box;background:#000;border:2px solid #444;color:#fff;font-family:inherit;font-size:0.5em;padding:10px 12px;}',
      '#cm-modal input.cm-input:focus{border-color:#ffd700;outline:none;}',
      '#cm-modal .cm-actions{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}',
      '#cm-modal .cm-actions button{flex:1;min-width:110px;padding:12px 10px;font-family:inherit;font-size:0.45em;cursor:pointer;border:2px solid #333;font-weight:bold;}',
      '#cm-modal .cm-btn-buy{background:#00ff9d;color:#000;border-color:#00ff9d;}',
      '#cm-modal .cm-btn-buy:disabled{opacity:0.35;cursor:not-allowed;}',
      '#cm-modal .cm-btn-save{background:#ffd700;color:#000;border-color:#ffd700;}',
      '#cm-modal .cm-btn-cancel{background:#222;color:#ccc;border-color:#555;}'
    ].join('');
    document.head.appendChild(s);
  }

  function ensureShell() {
    injectCss();
    if (document.getElementById('cm-backdrop')) return;
    var bd = document.createElement('div');
    bd.id = 'cm-backdrop';
    bd.innerHTML =
      '<div id="cm-modal" role="dialog" aria-modal="true">' +
      '<button type="button" id="cm-x" aria-label="Close">X</button>' +
      '<div class="cm-title" id="cm-title"></div>' +
      '<div id="cm-body"></div>' +
      '<div class="cm-actions" id="cm-actions"></div></div>';
    document.body.appendChild(bd);
    bd.addEventListener('click', function (e) { if (e.target === bd) closeModal(); });
    document.getElementById('cm-x').onclick = closeModal;
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && bd.classList.contains('open')) closeModal();
    });
  }

  function closeModal() {
    var bd = document.getElementById('cm-backdrop');
    if (bd) bd.classList.remove('open');
  }

  function openModal(kind, title, bodyHtml, actions) {
    ensureShell();
    var modal = document.getElementById('cm-modal');
    modal.className = '';
    if (kind) modal.classList.add(kind);
    document.getElementById('cm-title').textContent = title;
    document.getElementById('cm-body').innerHTML = bodyHtml;
    var act = document.getElementById('cm-actions');
    act.innerHTML = '';
    (actions || []).forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = a.className || 'cm-btn-cancel';
      b.textContent = a.label;
      if (a.disabled) b.disabled = true;
      b.onclick = a.onClick;
      act.appendChild(b);
    });
    document.getElementById('cm-backdrop').classList.add('open');
  }

  window.editMineryName = function () {
    if (!window.gameData) return;
    var current = window.gameData.mineryName || "Bitcoin's Minery";
    openModal(
      'cm-name',
      'NAME YOUR MINERY',
      '<label class="cm-label">Minery name</label>' +
        '<input class="cm-input" id="cm-name-input" type="text" maxlength="40" value="' +
        String(current).replace(/"/g, '"') + '" />',
      [
        { label: 'CANCEL', className: 'cm-btn-cancel', onClick: closeModal },
        {
          label: 'SAVE NAME',
          className: 'cm-btn-save',
          onClick: function () {
            var input = document.getElementById('cm-name-input');
            var val = (input && input.value || '').trim();
            if (!val) return;
            window.gameData.mineryName = val;
            var title = document.getElementById('minery-title');
            if (title) title.innerText = val.toUpperCase();
            if (val.toLowerCase() === 'haxforbitcoinplz' && typeof evaluateDevTriggerVisibility === 'function') {
              window.gameData.devMenuUnlocked = true;
              evaluateDevTriggerVisibility();
            }
            if (typeof saveGame === 'function') saveGame();
            closeModal();
          }
        }
      ]
    );
    setTimeout(function () {
      var input = document.getElementById('cm-name-input');
      if (input) { input.focus(); input.select(); }
    }, 30);
  };

  window.openMinerModal = function (minerId) {
    if (!window.gameData || !window.miners) return;
    var m = null;
    for (var i = 0; i < window.miners.length; i++) {
      if (window.miners[i].id === minerId) { m = window.miners[i]; break; }
    }
    if (!m) return;
    var owned = window.gameData.ownedMiners[m.id] || 0;
    var cost = minerCost(m);
    var prod = minerProd(m);
    var can = window.gameData.bitcoin >= cost;
    var minery = window.gameData.mineryName || "Bitcoin's Minery";

    openModal(
      'cm-miner',
      m.name,
      '<div class="cm-row"><span>Owned</span><span>' + owned + '</span></div>' +
        '<div class="cm-row"><span>Cost</span><span>' + fmt(cost) + ' BTC</span></div>' +
        '<div class="cm-row"><span>Produces</span><span>' + fmt(prod) + ' BTC/s each</span></div>' +
        '<div class="cm-row"><span>Your total from these</span><span>' + fmt(prod * owned) + ' BTC/s</span></div>' +
        '<label class="cm-label">Minery name</label>' +
        '<input class="cm-input" id="cm-miner-name-input" type="text" maxlength="40" value="' +
        String(minery).replace(/"/g, '"') + '" />',
      [
        {
          label: 'CLOSE',
          className: 'cm-btn-cancel',
          onClick: function () {
            var input = document.getElementById('cm-miner-name-input');
            var val = (input && input.value || '').trim();
            if (val && window.gameData) {
              window.gameData.mineryName = val;
              var title = document.getElementById('minery-title');
              if (title) title.innerText = val.toUpperCase();
              if (typeof saveGame === 'function') saveGame();
            }
            closeModal();
          }
        },
        {
          label: can ? 'BUY 1' : "CAN'T AFFORD",
          className: 'cm-btn-buy',
          disabled: !can,
          onClick: function () {
            var input = document.getElementById('cm-miner-name-input');
            var val = (input && input.value || '').trim();
            if (val) {
              window.gameData.mineryName = val;
              var title = document.getElementById('minery-title');
              if (title) title.innerText = val.toUpperCase();
            }
            var c = minerCost(m);
            if (window.gameData.bitcoin >= c) {
              window.gameData.bitcoin -= c;
              window.gameData.ownedMiners[m.id] = (window.gameData.ownedMiners[m.id] || 0) + 1;
              if (typeof window.renderMiners === 'function') window.renderMiners();
              if (typeof window.renderUpgrades === 'function') window.renderUpgrades();
              if (typeof updateDisplay === 'function') updateDisplay();
              if (typeof saveGame === 'function') saveGame();
              window.openMinerModal(minerId);
            }
          }
        }
      ]
    );
  };

  window.openUpgradeModal = function (upgradeId) {
    if (!window.gameData || !window.upgrades) return;
    var u = null;
    for (var i = 0; i < window.upgrades.length; i++) {
      if (window.upgrades[i].id === upgradeId) { u = window.upgrades[i]; break; }
    }
    if (!u) return;
    var cost = upgradeCost(u);
    var can = window.gameData.bitcoin >= cost && (!window.isUpgradeUnlocked || window.isUpgradeUnlocked(u));

    openModal(
      'cm-upgrade',
      u.name,
      '<div class="cm-desc">' + (u.desc || '') + '</div>' +
        '<div class="cm-row"><span>Cost</span><span>' + fmt(cost) + ' BTC</span></div>' +
        (u.effect ? '<div class="cm-row"><span>Effect</span><span>' + u.effect + (u.mult ? ' ×' + u.mult : '') + '</span></div>' : ''),
      [
        { label: 'CLOSE', className: 'cm-btn-cancel', onClick: closeModal },
        {
          label: can ? 'BUY' : "CAN'T AFFORD",
          className: 'cm-btn-buy',
          disabled: !can,
          onClick: function () {
            var c = upgradeCost(u);
            if (window.gameData.bitcoin >= c && window.isUpgradeUnlocked(u)) {
              window.gameData.bitcoin -= c;
              if (!window.gameData.boughtUpgrades) window.gameData.boughtUpgrades = {};
              window.gameData.boughtUpgrades[u.id] = true;
              if (typeof window.renderUpgrades === 'function') window.renderUpgrades();
              if (typeof updateDisplay === 'function') updateDisplay();
              if (typeof saveGame === 'function') saveGame();
              closeModal();
            }
          }
        }
      ]
    );
  };

  function patchRenders() {
    if (window.__modalsRenderPatched) return;
    if (typeof window.renderMiners !== 'function' || typeof window.renderUpgrades !== 'function') return;
    window.__modalsRenderPatched = true;

    var origMiners = window.renderMiners;
    window.renderMiners = function () {
      origMiners.apply(this, arguments);
      var list = document.getElementById('miners-list');
      if (!list || !window.miners) return;
      list.querySelectorAll('.item').forEach(function (div) {
        var id = div.id && div.id.indexOf('el-') === 0 ? div.id.slice(3) : null;
        if (!id) {
          var nameEl = div.querySelector('.item-name');
          var name = nameEl ? nameEl.textContent : '';
          for (var i = 0; i < window.miners.length; i++) {
            if (window.miners[i].name === name) { id = window.miners[i].id; break; }
          }
        }
        if (!id) return;
        div.onclick = function (e) {
          e.preventDefault();
          window.openMinerModal(id);
        };
      });
    };

    var origUpgrades = window.renderUpgrades;
    window.renderUpgrades = function () {
      origUpgrades.apply(this, arguments);
      var grid = document.getElementById('upgrades-grid');
      if (!grid || !window.upgrades) return;
      var visible = window.upgrades.filter(function (u) {
        return window.isUpgradeUnlocked ? window.isUpgradeUnlocked(u) : true;
      });
      visible.sort(function (a, b) { return a.baseCost - b.baseCost; });
      visible = visible.slice(0, 40);
      var items = grid.querySelectorAll('.upgrade-item');
      items.forEach(function (div, idx) {
        var u = visible[idx];
        if (!u) return;
        div.removeAttribute('title');
        div.onclick = function (e) {
          e.preventDefault();
          window.openUpgradeModal(u.id);
        };
      });
    };

    try { window.renderMiners(); } catch (e) {}
    try { window.renderUpgrades(); } catch (e) {}
  }

  function boot() {
    ensureShell();
    patchRenders();
    setTimeout(patchRenders, 500);
    setTimeout(patchRenders, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 350); });
  else setTimeout(boot, 350);
})();
