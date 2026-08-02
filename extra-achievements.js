(function () {
  if (typeof ACHIEVEMENTS === 'undefined' || window.__extraAchLoaded) return;
  window.__extraAchLoaded = true;
  var I = typeof ICONS !== 'undefined' ? ICONS : {};
  var extra = [
    { id: 'click_10', title: 'Warm-Up Clicks', desc: 'Click the Bitcoin 10 times.', icon: I.click || I.cursor, check: function (s) { return s.totalClicks >= 10; } },
    { id: 'click_500', title: 'Finger Workout', desc: 'Click the Bitcoin 500 times.', icon: I.cursor, check: function (s) { return s.totalClicks >= 500; } },
    { id: 'click_5k', title: 'Click Marathon', desc: 'Click the Bitcoin 5,000 times.', icon: I.cursor, check: function (s) { return s.totalClicks >= 5000; } },
    { id: 'click_25k', title: 'Click Legend', desc: 'Click the Bitcoin 25,000 times.', icon: I.cursor, check: function (s) { return s.totalClicks >= 25000; } },
    { id: 'btc_10', title: 'Pocket Change', desc: 'Hold 10 BTC at once.', icon: I.wealth, check: function (s) { return s.bitcoin >= 10; } },
    { id: 'btc_100', title: 'Three Digits', desc: 'Hold 100 BTC at once.', icon: I.wealth, check: function (s) { return s.bitcoin >= 100; } },
    { id: 'btc_10k', title: 'Ten Thousand', desc: 'Hold 10,000 BTC at once.', icon: I.wealth, check: function (s) { return s.bitcoin >= 10000; } },
    { id: 'btc_1m', title: 'Millionaire Protocol', desc: 'Hold 1,000,000 BTC at once.', icon: I.wealth, check: function (s) { return s.bitcoin >= 1e6; } },
    { id: 'btc_1b', title: 'Billionaire Node', desc: 'Hold 1,000,000,000 BTC at once.', icon: I.wealth, check: function (s) { return s.bitcoin >= 1e9; } },
    { id: 'mined_1k', title: 'First Thousand Mined', desc: 'Mine a total of 1,000 BTC (lifetime).', icon: I.wealth, check: function (s) { return s.totalMined >= 1000; } },
    { id: 'mined_1m', title: 'Million Mined', desc: 'Mine a total of 1,000,000 BTC (lifetime).', icon: I.wealth, check: function (s) { return s.totalMined >= 1e6; } },
    { id: 'mined_1q', title: 'Quintillion Career', desc: 'Mine a total of 1e18 BTC (lifetime).', icon: I.crown, check: function (s) { return s.totalMined >= 1e18; } },
    { id: 'hard_5', title: 'Small Farm', desc: 'Own 5 total hardware units.', icon: I.hardware, check: function (s) { return getTotalMiners(s) >= 5; } },
    { id: 'hard_25', title: 'Server Closet', desc: 'Own 25 total hardware units.', icon: I.hardware, check: function (s) { return getTotalMiners(s) >= 25; } },
    { id: 'hard_100', title: 'Data Center', desc: 'Own 100 total hardware units.', icon: I.hardware, check: function (s) { return getTotalMiners(s) >= 100; } },
    { id: 'hard_500', title: 'Hash Empire', desc: 'Own 500 total hardware units.', icon: I.hardware, check: function (s) { return getTotalMiners(s) >= 500; } },
    { id: 'upg_5', title: 'Five Upgrades', desc: 'Buy 5 one-time upgrades.', icon: I.upgrade, check: function (s) { return getTotalUpgrades(s) >= 5; } },
    { id: 'upg_25', title: 'Upgrade Collector', desc: 'Buy 25 one-time upgrades.', icon: I.upgrade, check: function (s) { return getTotalUpgrades(s) >= 25; } },
    { id: 'upg_50', title: 'Upgrade Hoarder', desc: 'Buy 50 one-time upgrades.', icon: I.upgrade, check: function (s) { return getTotalUpgrades(s) >= 50; } },
    { id: 'rebirth_3', title: 'Third Timeline', desc: 'Rebirth 3 times.', icon: I.rebirth, check: function (s) { return (s.rebirths || 0) >= 3; } },
    { id: 'rebirth_5', title: 'Five Timelines', desc: 'Rebirth 5 times.', icon: I.rebirth, check: function (s) { return (s.rebirths || 0) >= 5; } },
    { id: 'rebirth_10', title: 'Decade of Resets', desc: 'Rebirth 10 times.', icon: I.rebirth, check: function (s) { return (s.rebirths || 0) >= 10; } },
    { id: 'skill_1', title: 'First Skill Node', desc: 'Unlock any skill tree node.', icon: I.skill, check: function (s) {
      var levels = s.skillTreeLevels || {};
      return Object.keys(levels).some(function (k) { return (levels[k] || 0) > 0; });
    }},
    { id: 'skill_5', title: 'Skill Path', desc: 'Have 5 total skill levels invested.', icon: I.skill, check: function (s) {
      var levels = s.skillTreeLevels || {};
      var n = 0;
      Object.keys(levels).forEach(function (k) { n += levels[k] || 0; });
      return n >= 5;
    }}
  ];
  extra.forEach(function (a) {
    if (!ACHIEVEMENTS.some(function (x) { return x.id === a.id; })) ACHIEVEMENTS.push(a);
  });
})();
