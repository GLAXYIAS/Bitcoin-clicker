(function () {
  function load(src, attr) {
    if (document.querySelector('script[' + attr + ']')) return null;
    var s = document.createElement('script');
    s.src = src;
    s.setAttribute(attr, '1');
    document.body.appendChild(s);
    return s;
  }
  function patchUnlock() {
    var prev = window.isUpgradeUnlocked;
    window.isUpgradeUnlocked = function (u) {
      if (window.isUpgradeBought && window.isUpgradeBought(u)) return false;
      if (u.requireAchievement) {
        var list = (window.gameData && window.gameData.unlockedAchievements) || [];
        if (list.indexOf(u.requireAchievement) === -1) return false;
      }
      if (typeof prev === 'function') return prev(u);
      if (u.requireTotal) return (window.totalMinersOwned ? window.totalMinersOwned() : 0) >= (u.requireCount || 0);
      if (u.requireMiner) return ((window.gameData && window.gameData.ownedMiners[u.requireMiner]) || 0) >= (u.requireCount || 0);
      return true;
    };
  }
  function afterData() {
    load('extra-miners.js', 'data-extra-miners');
    load('extra-achievements.js', 'data-extra-ach');
    load('click-power-upgrades.js', 'data-click-power');
    load('achievement-upgrades.js', 'data-ach-upgrades');
    load('game-engine-patch.js', 'data-engine-patch');
    load('click-engine-hook.js', 'data-click-hook');
    load('center-panel.js', 'data-center-panel');
    load('tabs-collapse-patch.js', 'data-tabs-collapse');
    load('dense-ui-patch.js', 'data-dense-ui');
    load('casino.js', 'data-casino');
    load('ui-fix.js', 'data-ui-fix');
    load('custom-modals.js', 'data-custom-modals');
    patchUnlock();
    setTimeout(function () {
      if (typeof window.renderUpgrades === 'function') try { window.renderUpgrades(); } catch (e) {}
      if (typeof window.renderMiners === 'function') try { window.renderMiners(); } catch (e) {}
    }, 900);
  }
  function boot() {
    var gd = load('game-data.js', 'data-game-data');
    if (gd) gd.onload = afterData;
    else afterData();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 250); });
  else setTimeout(boot, 250);
})();
