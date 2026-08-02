// Achievement-gated one-time upgrades (load after game-data.js)
(function () {
  if (!window.upgrades) window.upgrades = [];
  if (window.__achUpgradesLoaded) return;
  window.__achUpgradesLoaded = true;
  var list = [
    { id: 'ach_u_click1', name: 'Genesis Actuator', desc: 'Clicks +25%. Unlocks with Genesis Block achievement.', cost: 500, ach: 'click_1', effect: 'click_mult', mult: 1.25, svg: 'boost' },
    { id: 'ach_u_click100', name: 'Carpal Compensator', desc: 'Clicks +50%. Unlocks at 100 clicks achievement.', cost: 25000, ach: 'click_100', effect: 'click_mult', mult: 1.5, svg: 'boost' },
    { id: 'ach_u_click1k', name: 'Matrix Interface', desc: 'Clicks +100%. Unlocks at 1,000 clicks achievement.', cost: 5e6, ach: 'click_1000', effect: 'click_mult', mult: 2, svg: 'bolt' },
    { id: 'ach_u_btc1k', name: 'Stack Dividend', desc: 'All production +15%. Unlocks at 1,000 total BTC mined.', cost: 15000, ach: 'btc_1k', effect: 'global_bps', mult: 1.15, svg: 'server' },
    { id: 'ach_u_btc1m', name: 'Whale Share', desc: 'All production +30%. Unlocks at 1M total BTC mined.', cost: 2e8, ach: 'btc_1m', effect: 'global_bps', mult: 1.3, svg: 'network' },
    { id: 'ach_u_hard1', name: 'First Boot Bonus', desc: 'All production +10%. Unlocks after buying first miner.', cost: 2000, ach: 'hard_1', effect: 'global_bps', mult: 1.1, svg: 'hardware' },
    { id: 'ach_u_hard50', name: 'Farm Synergy', desc: 'All production +25%. Unlocks at 50 total miners.', cost: 5e7, ach: 'hard_50', effect: 'global_bps', mult: 1.25, svg: 'server' },
    { id: 'ach_u_rebirth1', name: 'Timeline Echo', desc: 'Clicks +75%. Unlocks after first rebirth.', cost: 1e9, ach: 'rebirth_1', effect: 'click_mult', mult: 1.75, svg: 'quantum' },
    { id: 'ach_u_skill1', name: 'Neural Boost', desc: 'All production +20%. Unlocks with first skill node.', cost: 5e8, ach: 'skill_1', effect: 'global_bps', mult: 1.2, svg: 'chip' }
  ];
  list.forEach(function (g) {
    if (window.upgrades.some(function (u) { return u.id === g.id; })) return;
    window.upgrades.push({
      id: g.id, name: g.name, desc: g.desc, baseCost: g.cost, svg: g.svg,
      requireAchievement: g.ach, effect: g.effect, mult: g.mult
    });
  });
})();
