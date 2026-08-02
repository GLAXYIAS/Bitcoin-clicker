(function () {
  if (!window.upgrades) window.upgrades = [];
  if (window.__achUpgradesLoaded) return;
  window.__achUpgradesLoaded = true;
  var list = [
    { id: 'ach_u_click1', name: 'Genesis Actuator', desc: 'Clicks +25%. Unlocks with Genesis Block.', cost: 500, ach: 'click_1', effect: 'click_mult', mult: 1.25, svg: 'boost' },
    { id: 'ach_u_click100', name: 'Carpal Compensator', desc: 'Clicks +50%. Unlocks at 100 clicks.', cost: 25000, ach: 'click_100', effect: 'click_mult', mult: 1.5, svg: 'boost' },
    { id: 'ach_u_click1k', name: 'Matrix Interface', desc: 'Clicks +100%. Unlocks at 1,000 clicks.', cost: 5e6, ach: 'click_1000', effect: 'click_mult', mult: 2, svg: 'bolt' },
    { id: 'ach_u_btc1k', name: 'Stack Dividend', desc: 'All production +15%.', cost: 15000, ach: 'btc_1k', effect: 'global_bps', mult: 1.15, svg: 'server' },
    { id: 'ach_u_hard1', name: 'First Boot Bonus', desc: 'All production +10%.', cost: 2000, ach: 'hard_1', effect: 'global_bps', mult: 1.1, svg: 'hardware' },
    { id: 'ach_u_rebirth1', name: 'Timeline Echo', desc: 'Clicks +75%.', cost: 1e9, ach: 'rebirth_1', effect: 'click_mult', mult: 1.75, svg: 'quantum' }
  ];
  list.forEach(function (g) {
    if (window.upgrades.some(function (u) { return u.id === g.id; })) return;
    window.upgrades.push({ id: g.id, name: g.name, desc: g.desc, baseCost: g.cost, svg: g.svg, requireAchievement: g.ach, effect: g.effect, mult: g.mult });
  });
})();
