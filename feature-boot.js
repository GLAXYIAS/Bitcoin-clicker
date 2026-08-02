// Feature boot: center panel, achievement upgrades, casino, unlock patch
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
    load('casino.js', 'data-casino');
    patchUnlock();
    if (!document.getElementById('click-color-css')) {
      var s = document.createElement('style');
      s.id = 'click-color-css';
      s.textContent = '.floating-text{color:#1a6b3a!important;text-shadow:0 0 3px #0a2e18,0 1px 2px #000!important;font-size:0.95em!important;font-weight:bold!important;}';
      document.head.appendChild(s);
    }
    setTimeout(function () {
      if (typeof window.renderUpgrades === 'function') try { window.renderUpgrades(); } catch (e) {}
      if (typeof window.renderMiners === 'function') try { window.renderMiners(); } catch (e) {}
    }, 700);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 250); });
  else setTimeout(boot, 250);
})();
