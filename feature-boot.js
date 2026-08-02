// Feature boot: load center panel + achievement upgrades + unlock by achievement
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
  function boot() {
    load('achievement-upgrades.js', 'data-ach-upgrades');
    load('center-panel.js', 'data-center-panel');
    patchUnlock();
    setTimeout(function () {
      if (typeof window.renderUpgrades === 'function') {
        try { window.renderUpgrades(); } catch (e) {}
      }
    }, 600);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 250); });
  else setTimeout(boot, 250);
})();
