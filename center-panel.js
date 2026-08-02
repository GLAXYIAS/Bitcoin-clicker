// Center panel tabs: Achievements | Stats | Dev | Options
(function () {
  if (window.__centerPanelLoaded) return;
  window.__centerPanelLoaded = true;

  var UPDATE_LOG = [
    { v: '0.5.0', date: '2026-08-02', notes: 'Center tabs (Achievements, Stats, Dev, Options). Achievement-gated upgrades. Upgrade hover tooltips.' },
    { v: '0.4.2', date: '2026-08-02', notes: 'Cookie Clicker one-time upgrades, 32 miners, skill tree expand, rarer crates (45.972% / 10 min).' },
    { v: '0.4.0', date: '2026-08-01', notes: 'Holiday events, boost HUD timers, offline mining 10% / 24h cap.' },
    { v: '0.3.0', date: '2026-07-30', notes: 'Gambling (2x/5x/10x), unbreakable localStorage saves, rebirth skill tree.' },
    { v: '0.2.0', date: '2026-07-28', notes: 'Achievements system, more hardware tiers.' },
    { v: '0.1.0', date: '2026-07-20', notes: 'Initial Bitcoin Minery idle clicker release.' }
  ];

  var STRINGS = {
    en: {
      tabAch: 'ACHIEVEMENTS', tabStats: 'STATS', tabDev: 'DEV', tabOpt: 'OPTIONS',
      achUnlocked: 'Unlocked', achLocked: 'Locked', achProgress: 'Progress',
      sound: 'Sound effects', lang: 'Language', on: 'ON', off: 'OFF',
      consoleTitle: 'System console', updateTitle: 'Update log',
      statsBank: 'Bitcoins in bank', statsTotal: 'Total mined', statsClicks: 'Total clicks',
      statsBps: 'BTC / sec', statsRebirths: 'Times rebirthed'
    },
    es: {
      tabAch: 'LOGROS', tabStats: 'STATS', tabDev: 'DEV', tabOpt: 'OPCIONES',
      achUnlocked: 'Desbloqueado', achLocked: 'Bloqueado', achProgress: 'Progreso',
      sound: 'Efectos de sonido', lang: 'Idioma', on: 'SI', off: 'NO',
      consoleTitle: 'Consola del sistema', updateTitle: 'Registro de actualizaciones',
      statsBank: 'BTC en banco', statsTotal: 'Total minado', statsClicks: 'Clics totales',
      statsBps: 'BTC / seg', statsRebirths: 'Renacimientos'
    }
  };

  function t(key) {
    var lang = (window.gameData && window.gameData.settings && window.gameData.settings.lang) || 'en';
    return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
  }
  function ensureSettings() {
    if (!window.gameData) return { sound: true, lang: 'en' };
    if (!window.gameData.settings) window.gameData.settings = { sound: true, lang: 'en' };
    return window.gameData.settings;
  }
  function playUiSound() {
    var s = ensureSettings();
    if (!s.sound) return;
    try {
      var ctx = window.__audioCtx || (window.__audioCtx = new (window.AudioContext || window.webkitAudioContext)());
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; g.gain.value = 0.04;
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      o.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  var consoleLines = [];
  window.devLog = function (msg, level) {
    consoleLines.push({ t: new Date().toISOString().slice(11, 19), msg: String(msg), level: level || 'info' });
    if (consoleLines.length > 80) consoleLines.shift();
    var el = document.getElementById('dev-console-log');
    if (el) renderConsole(el);
  };
  function renderConsole(el) {
    el.innerHTML = consoleLines.map(function (l) {
      var c = l.level === 'error' ? '#ff6666' : l.level === 'ok' ? '#00ff9d' : '#ccc';
      return '<div style="color:' + c + ';margin:2px 0;"><span style="color:#666">[' + l.t + ']</span> ' + escapeHtml(l.msg) + '</div>';
    }).join('');
    el.scrollTop = el.scrollHeight;
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
  }
  function runLoadChecks() {
    window.devLog('Running load diagnostics...', 'info');
    [
      ['gameData', !!window.gameData],
      ['miners', !!(window.miners && window.miners.length)],
      ['upgrades', !!(window.upgrades && window.upgrades.length)],
      ['ACHIEVEMENTS', typeof ACHIEVEMENTS !== 'undefined'],
      ['SKILL_TREE', typeof SKILL_TREE !== 'undefined'],
      ['calculateCurrentBPS', typeof calculateCurrentBPS === 'function'],
      ['saveGame', typeof saveGame === 'function'],
      ['spawnAirdrop', typeof spawnAirdrop === 'function'],
      ['renderMiners', typeof window.renderMiners === 'function'],
      ['renderUpgrades', typeof window.renderUpgrades === 'function']
    ].forEach(function (c) {
      window.devLog(c[0] + ': ' + (c[1] ? 'OK' : 'MISSING'), c[1] ? 'ok' : 'error');
    });
  }

  function injectCss() {
    if (document.getElementById('center-panel-css')) return;
    var s = document.createElement('style');
    s.id = 'center-panel-css';
    s.textContent = '.center-tabs{display:flex;gap:4px;padding:8px 10px 0;background:#0c0c12;border-bottom:2px solid #333;}.center-tab{flex:1;padding:8px 4px;font-family:inherit;font-size:0.38em;background:#1a1a26;color:#888;border:2px solid #333;cursor:pointer;text-align:center;}.center-tab:hover{border-color:#666;color:#ccc;}.center-tab.active{background:#252538;color:#00ff9d;border-color:#00ff9d;}.center-tab-body{flex:1;overflow-y:auto;padding:12px;min-height:0;}.ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;}.ach-card{background:#1a1a26;border:2px solid #333;padding:10px;min-height:90px;}.ach-card.unlocked{border-color:#00ff9d;}.ach-card.locked{opacity:0.45;}.ach-card .ach-icon svg{width:28px;height:28px;}.ach-card .ach-title{font-size:0.42em;color:#ffd700;margin-bottom:4px;}.ach-card .ach-desc{font-size:0.35em;color:#aaa;line-height:1.35;}.ach-card .ach-status{font-size:0.32em;margin-top:6px;color:#666;}.ach-card.unlocked .ach-status{color:#00ff9d;}.stats-panel-line{display:flex;justify-content:space-between;margin:10px 0;font-size:0.45em;color:#fff;border-bottom:1px solid #333;padding-bottom:6px;}.stats-panel-line span:last-child{color:#00ff9d;font-family:monospace;}.dev-console{background:#050508;border:2px solid #333;padding:8px;height:140px;overflow-y:auto;font-family:monospace;font-size:0.38em;margin-bottom:10px;}.dev-btn-row{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;}.dev-btn-row button{font-family:inherit;font-size:0.35em;padding:6px 10px;background:#252538;color:#00ff9d;border:1px solid #00ff9d;cursor:pointer;}.update-log-item{margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #333;}.update-log-item .uv{color:#ffd700;font-size:0.42em;}.update-log-item .ud{color:#666;font-size:0.35em;margin-left:8px;}.update-log-item .un{color:#ccc;font-size:0.38em;line-height:1.4;margin-top:4px;}.opt-row{display:flex;align-items:center;justify-content:space-between;margin:12px 0;font-size:0.45em;color:#ddd;}.opt-toggle{padding:6px 14px;font-family:inherit;font-size:0.9em;border:2px solid #00ff9d;background:#000;color:#00ff9d;cursor:pointer;}.opt-toggle.off{border-color:#666;color:#666;}.opt-select{background:#000;border:2px solid #444;color:#00ff9d;font-family:inherit;font-size:0.9em;padding:4px 8px;}.center-panel{display:flex;flex-direction:column;}#center-tab-host{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;}';
    document.head.appendChild(s);
  }

  function renderAchievements(body) {
    var unlocked = (window.gameData && window.gameData.unlockedAchievements) || [];
    var list = (typeof ACHIEVEMENTS !== 'undefined') ? ACHIEVEMENTS : [];
    var html = '<div style="font-size:0.4em;color:#888;margin-bottom:8px;">' + unlocked.length + ' / ' + list.length + ' ' + t('achProgress') + '</div><div class="ach-grid">';
    list.forEach(function (ach) {
      var on = unlocked.indexOf(ach.id) !== -1;
      html += '<div class="ach-card ' + (on ? 'unlocked' : 'locked') + '"><div class="ach-icon">' + (ach.icon || '') + '</div><div class="ach-title">' + escapeHtml(ach.title) + '</div><div class="ach-desc">' + escapeHtml(ach.desc) + '</div><div class="ach-status">' + (on ? t('achUnlocked') : t('achLocked')) + '</div></div>';
    });
    html += '</div>';
    body.innerHTML = html;
  }
  function renderStats(body) {
    if (!window.gameData) { body.innerHTML = ''; return; }
    var g = window.gameData;
    var bps = typeof calculateCurrentBPS === 'function' ? calculateCurrentBPS() : 0;
    var fmt = typeof formatNum === 'function' ? formatNum : String;
    body.innerHTML =
      '<div class="stats-panel-line"><span>' + t('statsBank') + '</span><span>' + fmt(g.bitcoin) + '</span></div>' +
      '<div class="stats-panel-line"><span>' + t('statsTotal') + '</span><span>' + fmt(g.totalMined) + '</span></div>' +
      '<div class="stats-panel-line"><span>' + t('statsClicks') + '</span><span>' + g.totalClicks + '</span></div>' +
      '<div class="stats-panel-line"><span>' + t('statsBps') + '</span><span>' + fmt(bps) + '</span></div>' +
      '<div class="stats-panel-line"><span>' + t('statsRebirths') + '</span><span>' + (g.rebirths || 0) + '</span></div>';
  }
  function renderDev(body) {
    body.innerHTML =
      '<div style="font-size:0.45em;color:#bc34fa;margin-bottom:6px;">' + t('consoleTitle') + '</div>' +
      '<div class="dev-console" id="dev-console-log"></div>' +
      '<div class="dev-btn-row"><button type="button" id="dev-run-checks">RUN LOAD CHECKS</button><button type="button" id="dev-clear-console">CLEAR</button></div>' +
      '<div style="font-size:0.45em;color:#ffd700;margin:12px 0 6px;">' + t('updateTitle') + '</div><div id="update-log-list"></div>';
    var logEl = document.getElementById('dev-console-log');
    if (logEl) renderConsole(logEl);
    var ul = document.getElementById('update-log-list');
    if (ul) ul.innerHTML = UPDATE_LOG.map(function (u) {
      return '<div class="update-log-item"><span class="uv">v' + u.v + '</span><span class="ud">' + u.date + '</span><div class="un">' + escapeHtml(u.notes) + '</div></div>';
    }).join('');
    var btn = document.getElementById('dev-run-checks');
    if (btn) btn.onclick = function () { runLoadChecks(); playUiSound(); };
    var clr = document.getElementById('dev-clear-console');
    if (clr) clr.onclick = function () { consoleLines = []; if (logEl) renderConsole(logEl); };
  }
  function renderOptions(body) {
    var s = ensureSettings();
    body.innerHTML =
      '<div class="opt-row"><span>' + t('sound') + '</span><button type="button" class="opt-toggle ' + (s.sound ? '' : 'off') + '" id="opt-sound">' + (s.sound ? t('on') : t('off')) + '</button></div>' +
      '<div class="opt-row"><span>' + t('lang') + '</span><select class="opt-select" id="opt-lang"><option value="en"' + (s.lang === 'en' ? ' selected' : '') + '>English</option><option value="es"' + (s.lang === 'es' ? ' selected' : '') + '>Espanol</option></select></div>';
    var soundBtn = document.getElementById('opt-sound');
    if (soundBtn) soundBtn.onclick = function () {
      s.sound = !s.sound;
      soundBtn.textContent = s.sound ? t('on') : t('off');
      soundBtn.className = 'opt-toggle ' + (s.sound ? '' : 'off');
      if (typeof saveGame === 'function') saveGame();
      playUiSound();
    };
    var langSel = document.getElementById('opt-lang');
    if (langSel) langSel.onchange = function () {
      s.lang = langSel.value;
      if (typeof saveGame === 'function') saveGame();
      refreshTabLabels();
      showTab(window.__centerTab || 'achievements');
      playUiSound();
    };
  }
  function showTab(id) {
    window.__centerTab = id;
    document.querySelectorAll('.center-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === id);
    });
    var body = document.getElementById('center-tab-body');
    if (!body) return;
    if (id === 'achievements') renderAchievements(body);
    else if (id === 'stats') renderStats(body);
    else if (id === 'dev') renderDev(body);
    else if (id === 'options') renderOptions(body);
  }
  function refreshTabLabels() {
    var map = { achievements: 'tabAch', stats: 'tabStats', dev: 'tabDev', options: 'tabOpt' };
    Object.keys(map).forEach(function (id) {
      var el = document.querySelector('.center-tab[data-tab="' + id + '"]');
      if (el) el.textContent = t(map[id]);
    });
  }
  function buildHost() {
    var panel = document.querySelector('.center-panel');
    if (!panel || document.getElementById('center-tab-host')) return;
    injectCss();
    var oldStats = document.querySelector('button[onclick="toggleStats(true)"]');
    if (oldStats) oldStats.style.display = 'none';
    var host = document.createElement('div');
    host.id = 'center-tab-host';
    host.innerHTML = '<div class="center-tabs">' +
      '<button type="button" class="center-tab active" data-tab="achievements">' + t('tabAch') + '</button>' +
      '<button type="button" class="center-tab" data-tab="stats">' + t('tabStats') + '</button>' +
      '<button type="button" class="center-tab" data-tab="dev">' + t('tabDev') + '</button>' +
      '<button type="button" class="center-tab" data-tab="options">' + t('tabOpt') + '</button></div>' +
      '<div class="center-tab-body" id="center-tab-body"></div>';
    var news = panel.querySelector('.news-ticker-container');
    if (news && news.nextSibling) panel.insertBefore(host, news.nextSibling);
    else panel.insertBefore(host, panel.firstChild);
    Array.prototype.forEach.call(panel.children, function (ch) {
      if (ch === host || (ch.classList && (ch.classList.contains('news-ticker-container') || ch.classList.contains('rebirth-center-box')))) return;
      if (ch.style && ch.style.flex === '1' && !ch.id) ch.style.display = 'none';
    });
    host.querySelectorAll('.center-tab').forEach(function (btn) {
      btn.onclick = function () { playUiSound(); showTab(btn.getAttribute('data-tab')); };
    });
    showTab('achievements');
    window.devLog('Center panel UI ready', 'ok');
  }
  var _origShow = typeof showAchievementToast === 'function' ? showAchievementToast : null;
  if (_origShow) {
    window.showAchievementToast = function (ach) {
      _origShow(ach);
      if (window.__centerTab === 'achievements') {
        var body = document.getElementById('center-tab-body');
        if (body) renderAchievements(body);
      }
      playUiSound();
    };
  }
  function boot() {
    ensureSettings();
    buildHost();
    setTimeout(runLoadChecks, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
})();
