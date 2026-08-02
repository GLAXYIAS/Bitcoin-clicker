// Runtime: 32 miners + Cookie Clicker one-time upgrades. Load after game-data.js.
(function () {
  function go(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(fn, 80); });
    else setTimeout(fn, 80);
  }
  function ensure() {
    if (!window.gameData) return;
    if (!window.gameData.boughtUpgrades) window.gameData.boughtUpgrades = {};
  }
  window.totalMinersOwned = function () {
    var n = 0;
    (window.miners || []).forEach(function (m) { n += (window.gameData.ownedMiners[m.id] || 0); });
    return n;
  };
  window.isUpgradeBought = function (u) {
    return !!(window.gameData.boughtUpgrades && window.gameData.boughtUpgrades[u.id]);
  };
  window.isUpgradeUnlocked = function (u) {
    if (window.isUpgradeBought(u)) return false;
    if (u.requireTotal) return window.totalMinersOwned() >= (u.requireCount || 0);
    if (u.requireMiner) return (window.gameData.ownedMiners[u.requireMiner] || 0) >= (u.requireCount || 0);
    return true;
  };
  window.getMinerProductionMult = function (minerId) {
    var mult = 1;
    (window.upgrades || []).forEach(function (u) {
      if (!window.isUpgradeBought(u)) return;
      if (u.effect === 'double_miner' && u.minerId === minerId) mult *= (u.mult || 2);
    });
    return mult;
  };
  window.getGlobalUpgradeMult = function (kind) {
    var mult = 1;
    (window.upgrades || []).forEach(function (u) {
      if (!window.isUpgradeBought(u)) return;
      if (u.effect === kind) mult *= (u.mult || 1);
    });
    return mult;
  };
  var EXTRA_SVGS = {
    chip: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h12v2h2v12h-2v2H6v-2H4V6h2V4zm2 4v8h8V8H8z"/></svg>',
    server: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 3h16v6H4V3zm0 8h16v6H4v-6zm2 1.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-8a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM4 19h16v2H4v-2z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 2L4 14h6l-1 8 9-14h-6l1-6z"/></svg>',
    storage: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M2 6c0-1.7 4.5-3 10-3s10 1.3 10 3-4.5 3-10 3S2 7.7 2 6zm0 4c0 1.7 4.5 3 10 3s10-1.3 10-3v4c0 1.7-4.5 3-10 3S2 15.7 2 14v-4zm0 6c0 1.7 4.5 3 10 3s10-1.3 10-3v2c0 1.7-4.5 3-10 3S2 19.7 2 18v-2z"/></svg>',
    satellite: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 7l2 2 5-5-2-2-5 5zm-1 1L5 13l2 2 5-5-2-2z"/></svg>',
    atom: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 2c2.5 3.5 6.5 5.5 10 5.5-1.5 4-1.5 8 0 12-3.5 0-7.5 2-10 5.5C9.5 21.5 5.5 19.5 2 19.5c1.5-4 1.5-8 0-12C5.5 7.5 9.5 5.5 12 2z"/></svg>',
    hardware: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H5v-2h14v2zm-2-7H7v2h10V6zm2 12H5v-2h14v2z"/></svg>',
    network: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
    processor: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h12v16H6V4zm2 2v12h8V6H8z"/></svg>',
    quantum: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>',
    boost: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L1 21h22L12 2z"/></svg>'
  };
  function icon(key) { return EXTRA_SVGS[key] || EXTRA_SVGS.hardware; }
  function fmt(n) { return typeof formatNum === 'function' ? formatNum(n) : String(n); }
  function discount() {
    if (typeof SKILL_TREE !== 'undefined' && SKILL_TREE.node_discount)
      return SKILL_TREE.node_discount.getEffect(window.gameData.skillTreeLevels['node_discount'] || 0);
    return 1;
  }
  window.renderMiners = function () {
    var list = document.getElementById('miners-list');
    if (!list || !window.miners) return;
    list.innerHTML = '';
    window.miners.forEach(function (m) {
      var owned = window.gameData.ownedMiners[m.id] || 0;
      var cost = Math.floor(m.baseCost * Math.pow(1.42, owned) * discount());
      var can = window.gameData.bitcoin >= cost;
      var div = document.createElement('div');
      div.id = 'el-' + m.id;
      div.className = 'item' + (can ? '' : ' locked');
      div.innerHTML = '<div class="item-icon-frame">' + icon(m.svgType) + '</div><div class="item-details"><div class="item-name">' + m.name + '</div><div class="item-cost ' + (can ? 'can-afford' : 'cannot-afford') + '">' + fmt(cost) + ' BTC</div></div><div class="item-owned">' + owned + '</div>';
      div.onclick = function () {
        var o = window.gameData.ownedMiners[m.id] || 0;
        var c = Math.floor(m.baseCost * Math.pow(1.42, o) * discount());
        if (window.gameData.bitcoin >= c) {
          window.gameData.bitcoin -= c;
          window.gameData.ownedMiners[m.id] = o + 1;
          window.renderMiners();
          window.renderUpgrades();
          if (typeof updateDisplay === 'function') updateDisplay();
          if (typeof saveGame === 'function') saveGame();
        }
      };
      list.appendChild(div);
    });
  };
  window.renderUpgrades = function () {
    var grid = document.getElementById('upgrades-grid');
    if (!grid || !window.upgrades) return;
    ensure();
    grid.innerHTML = '';
    var visible = window.upgrades.filter(function (u) { return window.isUpgradeUnlocked(u); });
    visible.sort(function (a, b) { return a.baseCost - b.baseCost; });
    visible = visible.slice(0, 40);
    if (!visible.length) {
      var e = document.createElement('div');
      e.style.cssText = 'grid-column:1/-1;font-size:0.4em;color:#666;padding:8px;text-align:center;';
      e.textContent = 'No upgrades available. Buy more hardware to unlock them.';
      grid.appendChild(e);
      return;
    }
    visible.forEach(function (u) {
      var cost = Math.floor(u.baseCost * discount());
      var can = window.gameData.bitcoin >= cost;
      var div = document.createElement('div');
      div.className = 'upgrade-item' + (can ? '' : ' upgrade-locked');
      div.innerHTML = icon(u.svg) + '<div class="upgrade-level">1x</div>';
      div.title = u.name + ' — ' + u.desc + ' Cost: ' + cost;
      div.onclick = function () {
        var c = Math.floor(u.baseCost * discount());
        if (window.gameData.bitcoin >= c && window.isUpgradeUnlocked(u)) {
          window.gameData.bitcoin -= c;
          window.gameData.boughtUpgrades[u.id] = true;
          window.renderUpgrades();
          if (typeof updateDisplay === 'function') updateDisplay();
          if (typeof saveGame === 'function') saveGame();
        }
      };
      grid.appendChild(div);
    });
  };
  window.calculateCurrentBPS = function () {
    var total = 0;
    (window.miners || []).forEach(function (m) {
      var c = window.gameData.ownedMiners[m.id] || 0;
      if (c > 0) total += c * m.production * window.getMinerProductionMult(m.id);
    });
    total *= window.getGlobalUpgradeMult('global_bps');
    var idle = 1;
    if (typeof SKILL_TREE !== 'undefined') {
      if (SKILL_TREE.node_idle_boost) idle *= SKILL_TREE.node_idle_boost.getEffect(window.gameData.skillTreeLevels['node_idle_boost'] || 0);
      if (SKILL_TREE.node_idle_deep) idle *= SKILL_TREE.node_idle_deep.getEffect(window.gameData.skillTreeLevels['node_idle_deep'] || 0);
      if (SKILL_TREE.node_hybrid) idle *= SKILL_TREE.node_hybrid.getEffect(window.gameData.skillTreeLevels['node_hybrid'] || 0);
      if (SKILL_TREE.node_prestige_power) {
        var per = SKILL_TREE.node_prestige_power.getEffect(window.gameData.skillTreeLevels['node_prestige_power'] || 0);
        idle *= (1 + per * (window.gameData.rebirths || 0));
      }
    }
    total *= idle;
    if (typeof window.eventMultiplier === 'number') total *= window.eventMultiplier;
    return total;
  };
  go(function () {
    ensure();
    var btn = document.querySelector('.gamble-btn');
    if (btn) btn.textContent = 'GAMBLE BTC';
    if (!document.getElementById('cc-css')) {
      var s = document.createElement('style');
      s.id = 'cc-css';
      s.textContent = '.upgrade-item.upgrade-locked{opacity:.45}.upgrade-grid{max-height:140px;overflow-y:auto;grid-template-columns:repeat(8,1fr)!important}.item-icon-frame svg{width:100%;height:100%;fill:#00ff9d}.upgrade-item svg{width:22px;height:22px;fill:#ffd700}';
      document.head.appendChild(s);
    }
    if (window.miners) window.renderMiners();
    if (window.upgrades) window.renderUpgrades();
    if (typeof updateDisplay === 'function') updateDisplay();
  });
})();
