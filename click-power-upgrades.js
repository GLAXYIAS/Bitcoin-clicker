(function () {
  if (!window.upgrades) window.upgrades = [];
  if (window.__clickPowerUpgradesLoaded) return;
  window.__clickPowerUpgradesLoaded = true;
  function add(u) {
    if (window.upgrades.some(function (x) { return x.id === u.id; })) return;
    window.upgrades.push(u);
  }
  var clickLadder = [
    { id: 'clk_a', name: 'Finger Springs', desc: 'Clicks x2.', cost: 250, need: 5, mult: 2 },
    { id: 'clk_b', name: 'Rubber Dome Kit', desc: 'Clicks x2.', cost: 5000, need: 15, mult: 2 },
    { id: 'clk_c', name: 'Macro Pad', desc: 'Clicks x3.', cost: 75000, need: 30, mult: 3 },
    { id: 'clk_d', name: 'Auto-Tap Firmware', desc: 'Clicks x3.', cost: 1e6, need: 50, mult: 3 },
    { id: 'clk_e', name: 'Muscle Memory Chip', desc: 'Clicks x4.', cost: 2.5e7, need: 80, mult: 4 },
    { id: 'clk_f', name: 'Neural Click Link', desc: 'Clicks x5.', cost: 5e8, need: 120, mult: 5 },
    { id: 'clk_g', name: 'Quantum Mouse', desc: 'Clicks x5.', cost: 1e10, need: 160, mult: 5 },
    { id: 'clk_h', name: 'Temporal Tap Buffer', desc: 'Clicks x8.', cost: 2e12, need: 220, mult: 8 },
    { id: 'clk_i', name: 'Causality Trigger', desc: 'Clicks x10.', cost: 5e14, need: 300, mult: 10 },
    { id: 'clk_j', name: 'Click Singularity', desc: 'Clicks x15.', cost: 1e17, need: 400, mult: 15 },
    { id: 'clk_k', name: 'Hash Pulse Actuator', desc: 'Clicks x20.', cost: 5e19, need: 500, mult: 20 },
    { id: 'clk_l', name: 'Omni-Click Array', desc: 'Clicks x25.', cost: 1e22, need: 650, mult: 25 }
  ];
  clickLadder.forEach(function (g) {
    add({
      id: g.id, name: g.name,
      desc: g.desc + ' Unlocks at ' + g.need + ' total hardware owned.',
      baseCost: g.cost, svg: 'boost', requireMiner: null, requireCount: g.need, requireTotal: true,
      effect: 'click_mult', mult: g.mult
    });
  });
  var globalSpeed = [
    { id: 'spd_g1', name: 'Facility Coolant Loop', desc: 'All miners +10% speed.', cost: 2e4, need: 20, mult: 1.1 },
    { id: 'spd_g2', name: 'Overclock Policy', desc: 'All miners +10% speed.', cost: 5e6, need: 60, mult: 1.1 },
    { id: 'spd_g3', name: 'Grid Synergy', desc: 'All miners +15% speed.', cost: 2e9, need: 120, mult: 1.15 },
    { id: 'spd_g4', name: 'Planetary Hash Sync', desc: 'All miners +20% speed.', cost: 1e13, need: 200, mult: 1.2 },
    { id: 'spd_g5', name: 'Reality Compression', desc: 'All miners +25% speed.', cost: 5e17, need: 350, mult: 1.25 }
  ];
  globalSpeed.forEach(function (g) {
    add({
      id: g.id, name: g.name,
      desc: g.desc + ' Unlocks at ' + g.need + ' total hardware.',
      baseCost: g.cost, svg: 'bolt', requireMiner: null, requireCount: g.need, requireTotal: true,
      effect: 'global_bps', mult: g.mult
    });
  });
  (window.miners || []).slice(0, 16).forEach(function (m) {
    var short = m.name.split(' ').slice(-2).join(' ');
    add({
      id: 'spd_' + m.id + '_a', name: short + ' Tune-Up',
      desc: m.name + ' mines 10% faster. Need 3 owned.',
      baseCost: Math.max(100, Math.floor(m.baseCost * 8)), svg: m.svgType || 'chip',
      requireMiner: m.id, requireCount: 3, effect: 'miner_speed', minerId: m.id, mult: 1.1
    });
    add({
      id: 'spd_' + m.id + '_b', name: short + ' Overdrive',
      desc: m.name + ' mines 25% faster. Need 10 owned.',
      baseCost: Math.max(1000, Math.floor(m.baseCost * 40)), svg: m.svgType || 'bolt',
      requireMiner: m.id, requireCount: 10, effect: 'miner_speed', minerId: m.id, mult: 1.25
    });
  });
})();
