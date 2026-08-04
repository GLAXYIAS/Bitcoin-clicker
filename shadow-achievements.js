// Shadow achievements — nearly impossible goals, listed at bottom of Achievements tab
(function () {
  if (window.__shadowAchLoaded) return;
  window.__shadowAchLoaded = true;

  var I = typeof ICONS !== 'undefined' ? ICONS : {};
  var SHADOW_ICON = I.crown || I.wealth || '';

  if (!window.__sessionStart) window.__sessionStart = Date.now();
  if (typeof window.__crossed1BAt !== 'number') window.__crossed1BAt = 0;
  if (typeof window.__wasBelow1B === 'undefined') window.__wasBelow1B = true;

  function tm(s) {
    return Object.values(s.ownedMiners || {}).reduce(function (a, b) { return a + (b || 0); }, 0);
  }
  function trackBankCross(s) {
    if (!s) return;
    if (s.bitcoin < 1e9) { window.__wasBelow1B = true; return; }
    if (window.__wasBelow1B && s.bitcoin >= 1e9 && !window.__crossed1BAt) {
      window.__crossed1BAt = Date.now();
      window.__wasBelow1B = false;
    }
  }
  function minutesTo1B() {
    if (!window.__crossed1BAt) return Infinity;
    return (window.__crossed1BAt - (window.__sessionStart || window.__crossed1BAt)) / 60000;
  }

  var SHADOWS = [
    { id: 'shadow_1b_15m', title: 'Fifteen Minute Billion', desc: 'Reach 1,000,000,000 BTC in under 15 minutes this session (must cross from below 1B).', icon: SHADOW_ICON, shadow: true,
      check: function (s) { trackBankCross(s); return minutesTo1B() <= 15; } },
    { id: 'shadow_1b_30m', title: 'Half Hour Billion', desc: 'Reach 1,000,000,000 BTC in under 30 minutes this session (must cross from below 1B).', icon: SHADOW_ICON, shadow: true,
      check: function (s) { trackBankCross(s); return minutesTo1B() <= 30; } },
    { id: 'shadow_1b_60m', title: 'Hour Billion', desc: 'Reach 1,000,000,000 BTC in under 60 minutes this session (must cross from below 1B).', icon: SHADOW_ICON, shadow: true,
      check: function (s) { trackBankCross(s); return minutesTo1B() <= 60; } },
    { id: 'shadow_lucky_dust', title: 'Lucky Dust', desc: '0.000000000000000000000000001% chance every 10 minutes. Good luck.', icon: SHADOW_ICON, shadow: true,
      check: function (s) { return !!(s && s._shadowLuckyDust); } },
    { id: 'shadow_doge', title: 'Doge Coin', desc: 'Cheated bitcoins are as bad as dogecoin. Open the admin menu.', icon: SHADOW_ICON, shadow: true,
      check: function (s) { return !!(s && s._shadowOpenedAdmin); } },
    { id: 'shadow_click_billion', title: 'Finger Of The Gods', desc: 'Click the Bitcoin 1,000,000,000 times.', icon: I.cursor || SHADOW_ICON, shadow: true,
      check: function (s) { return (s.totalClicks || 0) >= 1e9; } },
    { id: 'shadow_bank_googol', title: 'Googol Bank', desc: 'Hold 1e100 BTC at once.', icon: I.wealth || SHADOW_ICON, shadow: true,
      check: function (s) { return (s.bitcoin || 0) >= 1e100; } },
    { id: 'shadow_hardware_million', title: 'One Million Rigs', desc: 'Own 1,000,000 total hardware units.', icon: I.hardware || SHADOW_ICON, shadow: true,
      check: function (s) { return tm(s) >= 1e6; } },
    { id: 'shadow_rebirth_1000', title: 'Thousand Timelines', desc: 'Rebirth 1,000 times.', icon: I.rebirth || SHADOW_ICON, shadow: true,
      check: function (s) { return (s.rebirths || 0) >= 1000; } },
    { id: 'shadow_zero_bps_rich', title: 'Idle Paradox', desc: 'Hold 1e12 BTC while current production is exactly 0 BPS.', icon: SHADOW_ICON, shadow: true,
      check: function (s) {
        var bps = 0;
        try { if (typeof calculateCurrentBPS === 'function') bps = calculateCurrentBPS(); } catch (e) {}
        return (s.bitcoin || 0) >= 1e12 && bps === 0;
      } },
    { id: 'shadow_all_normal', title: 'Completionist Shadow', desc: 'Unlock every non-shadow achievement.', icon: SHADOW_ICON, shadow: true,
      check: function (s) {
        if (typeof ACHIEVEMENTS === 'undefined') return false;
        var unlocked = s.unlockedAchievements || [];
        for (var i = 0; i < ACHIEVEMENTS.length; i++) {
          var a = ACHIEVEMENTS[i];
          if (a.shadow || a.id === 'shadow_all_normal') continue;
          if (unlocked.indexOf(a.id) === -1) return false;
        }
        return true;
      } },
    { id: 'shadow_name_doge', title: 'Such Minery', desc: 'Name your minery exactly: dogecoin', icon: SHADOW_ICON, shadow: true,
      check: function (s) { return !!(s.mineryName && String(s.mineryName).toLowerCase().trim() === 'dogecoin'); } }
  ];

  function register() {
    if (typeof ACHIEVEMENTS === 'undefined') return false;
    SHADOWS.forEach(function (a) {
      if (!ACHIEVEMENTS.some(function (x) { return x.id === a.id; })) ACHIEVEMENTS.push(a);
    });
    return true;
  }

  // ~0.000000000000000000000000001% every 10 minutes
  setInterval(function () {
    if (!window.gameData) return;
    if (Math.random() < 1e-29) {
      window.gameData._shadowLuckyDust = true;
      if (typeof checkAchievements === 'function') checkAchievements(window.gameData);
      if (typeof saveGame === 'function') saveGame();
    }
  }, 10 * 60 * 1000);

  function patchAdmin() {
    if (window.__shadowAdminPatched) return;
    var prev = window.toggleDevMenu;
    if (typeof prev !== 'function') return;
    window.__shadowAdminPatched = true;
    window.toggleDevMenu = function (open) {
      var result = prev.apply(this, arguments);
      var isOpen = open;
      if (typeof open === 'undefined') {
        var el = document.getElementById('dev-menu-modal');
        isOpen = el && el.style.display === 'block';
      }
      if (isOpen && window.gameData) {
        window.gameData._shadowOpenedAdmin = true;
        if (typeof checkAchievements === 'function') checkAchievements(window.gameData);
        if (typeof saveGame === 'function') saveGame();
      }
      return result;
    };
  }

  function patchCheck() {
    if (window.__shadowCheckPatched) return;
    if (typeof window.checkAchievements !== 'function') return;
    window.__shadowCheckPatched = true;
    var prev = window.checkAchievements;
    window.checkAchievements = function (stats) {
      trackBankCross(stats || window.gameData);
      return prev.apply(this, arguments);
    };
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  }
  function cardHtml(ach, on, isShadow) {
    var tip = (ach.desc || '').replace(/"/g, '"');
    return '<div class="ach-card ' + (on ? 'unlocked' : 'locked') + (isShadow ? ' shadow-ach' : '') + '" title="' + tip + '">' +
      '<div class="ach-icon">' + (ach.icon || '') + '</div>' +
      '<div class="ach-title">' + escapeHtml(ach.title) + '</div>' +
      '<div class="ach-desc">' + escapeHtml(ach.desc) + '</div>' +
      '<div class="ach-status">' + (on ? 'Unlocked' : 'Locked') + '</div></div>';
  }

  function patchRender() {
    if (window.__shadowRenderPatched) return;
    window.__shadowRenderPatched = true;
    var obs = new MutationObserver(function () {
      var body = document.querySelector('.center-tab-body');
      if (!body || body.getAttribute('data-shadow-sorted') === '1') return;
      var grid = body.querySelector('.ach-grid');
      if (!grid || typeof ACHIEVEMENTS === 'undefined') return;
      body.setAttribute('data-shadow-sorted', '1');
      var unlocked = (window.gameData && window.gameData.unlockedAchievements) || [];
      var normal = ACHIEVEMENTS.filter(function (a) { return !a.shadow; });
      var shadows = ACHIEVEMENTS.filter(function (a) { return !!a.shadow; });
      var html = '<div style="font-size:0.4em;color:#888;margin-bottom:8px;">' + unlocked.length + ' / ' + ACHIEVEMENTS.length + ' Progress</div>';
      html += '<div class="ach-grid">';
      normal.forEach(function (ach) { html += cardHtml(ach, unlocked.indexOf(ach.id) !== -1, false); });
      html += '</div>';
      if (shadows.length) {
        html += '<div class="shadow-ach-header">SHADOW ACHIEVEMENTS</div>';
        html += '<div class="shadow-ach-sub">Nearly impossible. Do not expect these.</div>';
        html += '<div class="ach-grid shadow-ach-grid">';
        shadows.forEach(function (ach) { html += cardHtml(ach, unlocked.indexOf(ach.id) !== -1, true); });
        html += '</div>';
      }
      body.innerHTML = html;
    });
    var host = document.getElementById('center-tab-host') || document.body;
    obs.observe(host, { childList: true, subtree: true });
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.classList && t.classList.contains('center-tab')) {
        var body = document.querySelector('.center-tab-body');
        if (body) body.removeAttribute('data-shadow-sorted');
      }
    }, true);
  }

  function injectCss() {
    if (document.getElementById('shadow-ach-css')) return;
    var s = document.createElement('style');
    s.id = 'shadow-ach-css';
    s.textContent = [
      '.shadow-ach-header{margin:22px 0 6px;font-size:0.55em;color:#9b59b6;letter-spacing:0.12em;text-transform:uppercase;border-top:2px solid #4a2060;padding-top:14px;text-shadow:0 0 8px rgba(155,89,182,0.5);}',
      '.shadow-ach-sub{font-size:0.35em;color:#666;margin-bottom:10px;}',
      '.ach-card.shadow-ach{border-color:#4a2060;background:#12081a;}',
      '.ach-card.shadow-ach.unlocked{border-color:#9b59b6;box-shadow:0 0 12px rgba(155,89,182,0.45);}',
      '.ach-card.shadow-ach .ach-title{color:#c39bd3;}',
      '.ach-card.shadow-ach.unlocked .ach-status{color:#c39bd3;}'
    ].join('');
    document.head.appendChild(s);
  }

  function boot() {
    injectCss();
    register();
    patchAdmin();
    patchCheck();
    patchRender();
    setTimeout(function () { register(); patchAdmin(); patchCheck(); }, 500);
    setTimeout(function () { register(); patchAdmin(); }, 1500);
    if (window.gameData && window.gameData.bitcoin < 1e9) window.__wasBelow1B = true;
    else if (window.gameData && window.gameData.bitcoin >= 1e9) window.__wasBelow1B = false;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 500); });
  else setTimeout(boot, 500);
})();
