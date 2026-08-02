// Apply click_mult upgrades and miner_speed to production/clicks
(function () {
  function patchMinerMult() {
    var prev = window.getMinerProductionMult;
    window.getMinerProductionMult = function (minerId) {
      var mult = typeof prev === 'function' ? prev(minerId) : 1;
      (window.upgrades || []).forEach(function (u) {
        if (!(window.isUpgradeBought && window.isUpgradeBought(u))) return;
        if (u.effect === 'miner_speed' && u.minerId === minerId) mult *= (u.mult || 1.1);
      });
      return mult;
    };
  }
  function patchClick() {
    window.getClickValue = function () {
      var base = (window.gameData && window.gameData.clickValue) || 1;
      var skillMult = 1;
      if (typeof SKILL_TREE !== 'undefined' && SKILL_TREE.node_click_mult && window.gameData) {
        skillMult = SKILL_TREE.node_click_mult.getEffect(window.gameData.skillTreeLevels['node_click_mult'] || 0);
      }
      var upMult = typeof window.getGlobalUpgradeMult === 'function' ? window.getGlobalUpgradeMult('click_mult') : 1;
      var eventMult = (typeof window.clickEventMultiplier === 'number' && window.clickEventMultiplier > 0) ? window.clickEventMultiplier : 1;
      return base * skillMult * upMult * eventMult;
    };
  }
  function boot() {
    patchMinerMult();
    patchClick();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 500); });
  else setTimeout(boot, 500);
  setTimeout(boot, 1200);
})();
