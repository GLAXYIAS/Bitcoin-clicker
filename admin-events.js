// Admin: trigger holidays & events + green affordability glow
(function () {
  if (window.__adminEventsLoaded) return;
  window.__adminEventsLoaded = true;

  var HOLIDAYS = [
    { id: 'halloween', name: 'Halloween' },
    { id: 'thanksgiving', name: 'Thanksgiving' },
    { id: 'christmas', name: 'Christmas' },
    { id: 'newyear', name: 'New Year' },
    { id: 'valentine', name: "Valentine's" },
    { id: 'patrick', name: "St. Patrick's" },
    { id: 'easter', name: 'Easter' },
    { id: 'july4', name: '4th of July' }
  ];

  var HOLIDAY_META = {
    halloween: { name: 'HALLOWEEN', tagline: 'Spooky Hash Season', color: '#ff6b00', airdropClass: 'holiday-halloween',
      news: ['SPOOKY ALERT: Phantom wallets dumping coins.'],
      rewards: [{ type: 'btc', minutes: 8, label: 'TRICK OR TREAT!\n\nA haunted airdrop yields ' }, { type: 'bps', mult: 4, duration: 90, label: 'GHOST PROTOCOL!\n\nMining 4x for 90 seconds!' }] },
    thanksgiving: { name: 'THANKSGIVING', tagline: 'Feast of Coins', color: '#c45c26', airdropClass: 'holiday-thanksgiving',
      news: ['FEAST MODE: Annual block banquet.'],
      rewards: [{ type: 'btc', minutes: 10, label: 'FEAST SECURED!\n\nA generous spread grants ' }, { type: 'bps', mult: 3.5, duration: 120, label: 'HARVEST BOOM!\n\nProduction 3.5x for 2 minutes!' }] },
    christmas: { name: 'CHRISTMAS', tagline: "Santa's Hashrate", color: '#e82525', airdropClass: 'holiday-christmas',
      news: ['HO HO HO: Gift-wrapped UTXOs tonight.'],
      rewards: [{ type: 'btc', minutes: 12, label: 'GIFT UNWRAPPED!\n\nSanta left you ' }, { type: 'bps', mult: 5, duration: 90, label: "SANTA'S BLESSING!\n\nProduction 5x for 90 seconds!" }] },
    newyear: { name: 'NEW YEAR', tagline: 'Resolution Rush', color: '#ffd700', airdropClass: 'holiday-newyear',
      news: ['COUNTDOWN: New cycle begins.'],
      rewards: [{ type: 'btc', minutes: 10, label: 'NEW YEAR BONUS!\n\nFresh year, fresh coins: ' }, { type: 'bps', mult: 4, duration: 100, label: 'RESOLUTION BOOST!\n\nProduction 4x for 100 seconds!' }] },
    valentine: { name: "VALENTINE'S", tagline: 'Love Bytes', color: '#ff4d6d', airdropClass: 'holiday-valentine',
      news: ['LOVE ON-CHAIN: Sweet satoshis.'],
      rewards: [{ type: 'btc', minutes: 6, label: 'SWEET DROP!\n\nA love letter contains ' }, { type: 'click', mult: 5, duration: 60, label: 'CUPID CLICKS!\n\nClicks 5x for 60 seconds!' }] },
    patrick: { name: "ST. PATRICK'S", tagline: 'Lucky Hash', color: '#00c853', airdropClass: 'holiday-patrick',
      news: ['LUCKY BLOCKS: Green candles.'],
      rewards: [{ type: 'btc', minutes: 8, label: 'POT OF GOLD!\n\nYou found ' }, { type: 'bps', mult: 3.5, duration: 80, label: 'LUCKY STREAK!\n\nProduction 3.5x for 80 seconds!' }] },
    easter: { name: 'EASTER', tagline: 'Egg Hunt', color: '#b388ff', airdropClass: 'holiday-easter',
      news: ['EGG HUNT: Colored coin caches.'],
      rewards: [{ type: 'btc', minutes: 7, label: 'GOLDEN EGG!\n\nInside you find ' }, { type: 'bps', mult: 3, duration: 100, label: 'SPRING SURGE!\n\nProduction 3x for 100 seconds!' }] },
    july4: { name: '4TH OF JULY', tagline: 'Freedom Hash', color: '#1565c0', airdropClass: 'holiday-july4',
      news: ['FIREWORKS: Explosive hashrate.'],
      rewards: [{ type: 'btc', minutes: 10, label: 'FIREWORK PAYOUT!\n\nA spectacular yield of ' }, { type: 'bps', mult: 4, duration: 90, label: 'LIBERTY BOOST!\n\nProduction 4x for 90 seconds!' }] }
  };

  function injectCss() {
    if (document.getElementById('admin-events-css')) return;
    var s = document.createElement('style');
    s.id = 'admin-events-css';
    s.textContent = [
      '.item.can-buy{border-color:#00ff9d!important;box-shadow:0 0 10px rgba(0,255,157,0.55),inset 0 0 8px rgba(0,255,157,0.12)!important;}',
      '.item.can-buy:not(.locked){opacity:1!important;}',
      '.item.cannot-buy{border-color:#444!important;box-shadow:none!important;}',
      '.upgrade-item.can-buy{border-color:#00ff9d!important;box-shadow:0 0 10px rgba(0,255,157,0.6),inset 0 0 6px rgba(0,255,157,0.15)!important;}',
      '.upgrade-item.cannot-buy,.upgrade-item.upgrade-locked{border-color:#555!important;box-shadow:none!important;opacity:0.45;}',
      '.item-cost.can-afford{color:#00ff9d!important;}',
      '.item-cost.cannot-afford{color:#ff6666!important;}',
      '#dev-events-section{margin-top:8px;}',
      '#dev-events-section .dev-btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;}',
      '#dev-events-section .dev-btn-grid button{padding:8px 6px;font-family:inherit;font-size:0.38em;background:#1a0a2e;color:#d466ff;border:2px solid #bc34fa;cursor:pointer;text-align:center;}',
      '#dev-events-section .dev-btn-grid button:hover{background:#bc34fa;color:#000;}',
      '#dev-events-section .dev-btn-grid button.active{background:#00ff9d;color:#000;border-color:#00ff9d;}',
      '#dev-forced-holiday-label{font-size:0.38em;color:#00ff9d;margin-top:8px;font-family:monospace;}'
    ].join('');
    document.head.appendChild(s);
  }

  function patchGetActiveHoliday() {
    if (window.__holidayPatched) return;
    if (typeof window.getActiveHoliday !== 'function') return;
    window.__holidayPatched = true;
    var orig = window.getActiveHoliday;
    window.getActiveHoliday = function () {
      if (window.__forcedHolidayId && HOLIDAY_META[window.__forcedHolidayId]) {
        var meta = HOLIDAY_META[window.__forcedHolidayId];
        return Object.assign({ id: window.__forcedHolidayId }, meta);
      }
      return orig.apply(this, arguments);
    };
  }

  window.devForceHoliday = function (id) {
    patchGetActiveHoliday();
    if (id === null || id === '' || id === 'clear') {
      window.__forcedHolidayId = null;
      var banner = document.getElementById('holiday-banner');
      if (banner) banner.remove();
      if (typeof showEventNotification === 'function') showEventNotification('Holiday force cleared.\n\nBack to calendar.', '#888');
    } else {
      window.__forcedHolidayId = id;
      var h = window.getActiveHoliday();
      if (h) {
        var old = document.getElementById('holiday-banner');
        if (old) old.remove();
        if (typeof injectHolidayBanner === 'function') injectHolidayBanner(h);
        if (typeof showEventNotification === 'function') showEventNotification(h.name + ' FORCED\n\n' + h.tagline, h.color);
      }
    }
    if (typeof window.applyHolidayBitcoin === 'function') window.applyHolidayBitcoin();
    updateForcedLabel();
  };

  window.devTriggerAirdrop = function () {
    if (typeof spawnAirdrop === 'function') {
      spawnAirdrop();
      if (typeof showEventNotification === 'function') showEventNotification('Admin: airdrop spawned.', '#bc34fa');
    } else if (typeof showEventNotification === 'function') {
      showEventNotification('spawnAirdrop not loaded yet.', '#ff6666');
    }
  };

  window.devTriggerBoost = function (kind) {
    if (typeof applyReward !== 'function') {
      if (typeof showEventNotification === 'function') showEventNotification('Events not loaded.', '#ff6666');
      return;
    }
    if (kind === 'bps') applyReward({ type: 'bps', mult: 3, duration: 60, label: 'ADMIN BULL MARKET!\n\nProduction 3x for 60 seconds!' }, null);
    else if (kind === 'click') applyReward({ type: 'click', mult: 4, duration: 45, label: 'ADMIN CLICK FRENZY!\n\nClicks 4x for 45 seconds!' }, null);
    else if (kind === 'btc') applyReward({ type: 'btc', minutes: 5, label: 'ADMIN AIRDROP!\n\n+' }, null);
  };

  window.devTriggerHolidayReward = function () {
    var h = typeof getActiveHoliday === 'function' ? getActiveHoliday() : null;
    if (!h && window.__forcedHolidayId) h = Object.assign({ id: window.__forcedHolidayId }, HOLIDAY_META[window.__forcedHolidayId]);
    if (!h || !h.rewards || !h.rewards.length) {
      if (typeof showEventNotification === 'function') showEventNotification('Force a holiday first, then trigger reward.', '#ff6666');
      return;
    }
    if (typeof applyReward === 'function') {
      var reward = h.rewards[Math.floor(Math.random() * h.rewards.length)];
      applyReward(reward, h);
    }
  };

  function updateForcedLabel() {
    var el = document.getElementById('dev-forced-holiday-label');
    if (!el) return;
    el.textContent = window.__forcedHolidayId
      ? 'Forced: ' + (HOLIDAY_META[window.__forcedHolidayId].name || window.__forcedHolidayId)
      : 'Forced: none (calendar)';
  }

  function injectDevSection() {
    var modal = document.getElementById('dev-menu-modal');
    if (!modal || document.getElementById('dev-events-section')) return;
    var section = document.createElement('div');
    section.id = 'dev-events-section';
    section.innerHTML =
      '<div class="dev-section-title">Events & Holidays</div>' +
      '<div class="dev-label" style="margin-bottom:4px;">Force holiday (until cleared):</div>' +
      '<div class="dev-btn-grid" id="dev-holiday-grid"></div>' +
      '<div id="dev-forced-holiday-label">Forced: none (calendar)</div>' +
      '<div class="dev-row" style="margin-top:10px;"><button class="dev-btn" type="button" onclick="devForceHoliday(\'clear\')">CLEAR HOLIDAY</button></div>' +
      '<div class="dev-label" style="margin:10px 0 4px;">Trigger events:</div>' +
      '<div class="dev-btn-grid">' +
      '<button type="button" onclick="devTriggerAirdrop()">SPAWN AIRDROP</button>' +
      '<button type="button" onclick="devTriggerBoost(\'btc\')">BTC REWARD</button>' +
      '<button type="button" onclick="devTriggerBoost(\'bps\')">3x MINING</button>' +
      '<button type="button" onclick="devTriggerBoost(\'click\')">4x CLICKS</button>' +
      '<button type="button" onclick="devTriggerHolidayReward()">HOLIDAY REWARD</button></div>';
    var closeRow = null;
    var rows = modal.querySelectorAll('.dev-section-title');
    for (var i = 0; i < rows.length; i++) {
      if (/System Execution/i.test(rows[i].textContent)) { closeRow = rows[i]; break; }
    }
    if (closeRow) modal.insertBefore(section, closeRow);
    else modal.appendChild(section);
    var grid = document.getElementById('dev-holiday-grid');
    HOLIDAYS.forEach(function (h) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = h.name;
      btn.onclick = function () { window.devForceHoliday(h.id); markActiveHolidayButtons(); };
      btn.setAttribute('data-holiday-id', h.id);
      grid.appendChild(btn);
    });
    updateForcedLabel();
  }

  function markActiveHolidayButtons() {
    var grid = document.getElementById('dev-holiday-grid');
    if (!grid) return;
    grid.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-holiday-id') === window.__forcedHolidayId);
    });
    updateForcedLabel();
  }

  function refreshAffordGlow() {
    if (!window.gameData) return;
    var btc = window.gameData.bitcoin || 0;
    if (window.miners) {
      window.miners.forEach(function (m) {
        var div = document.getElementById('el-' + m.id);
        if (!div) return;
        var owned = window.gameData.ownedMiners[m.id] || 0;
        var disc = 1;
        if (typeof SKILL_TREE !== 'undefined' && SKILL_TREE.node_discount) {
          disc = SKILL_TREE.node_discount.getEffect(window.gameData.skillTreeLevels['node_discount'] || 0);
        }
        var cost = Math.floor(m.baseCost * Math.pow(1.42, owned) * disc);
        var can = btc >= cost;
        div.classList.toggle('can-buy', can);
        div.classList.toggle('cannot-buy', !can);
        div.classList.toggle('locked', !can);
        var costEl = div.querySelector('.item-cost');
        if (costEl) {
          costEl.classList.toggle('can-afford', can);
          costEl.classList.toggle('cannot-afford', !can);
        }
      });
    }
    var grid = document.getElementById('upgrades-grid');
    if (grid && window.upgrades) {
      var disc = 1;
      if (typeof SKILL_TREE !== 'undefined' && SKILL_TREE.node_discount) {
        disc = SKILL_TREE.node_discount.getEffect(window.gameData.skillTreeLevels['node_discount'] || 0);
      }
      var visible = window.upgrades.filter(function (u) {
        return window.isUpgradeUnlocked ? window.isUpgradeUnlocked(u) : true;
      });
      visible.sort(function (a, b) { return a.baseCost - b.baseCost; });
      visible = visible.slice(0, 40);
      grid.querySelectorAll('.upgrade-item').forEach(function (div, idx) {
        var u = visible[idx];
        if (!u) return;
        var cost = Math.floor(u.baseCost * disc);
        var can = btc >= cost;
        div.classList.toggle('can-buy', can);
        div.classList.toggle('cannot-buy', !can);
        div.classList.toggle('upgrade-locked', !can);
      });
    }
  }
  window.refreshAffordGlow = refreshAffordGlow;

  function patchFastColorCheck() {
    var prev = window.fastColorCheck;
    window.fastColorCheck = function () {
      if (typeof prev === 'function') { try { prev(); } catch (e) {} }
      refreshAffordGlow();
    };
  }

  function boot() {
    injectCss();
    patchGetActiveHoliday();
    injectDevSection();
    patchFastColorCheck();
    refreshAffordGlow();
    setInterval(refreshAffordGlow, 250);
    setTimeout(function () { patchGetActiveHoliday(); injectDevSection(); markActiveHolidayButtons(); refreshAffordGlow(); }, 600);
    setTimeout(function () { injectDevSection(); refreshAffordGlow(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 400); });
  else setTimeout(boot, 400);
})();
