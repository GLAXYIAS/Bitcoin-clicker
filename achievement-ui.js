// Achievement hover modal + flavor text + clear shadow how-to
(function () {
  if (window.__achUiLoaded) return;
  window.__achUiLoaded = true;

  var FLAVOR = {
    shadow_1b_15m: 'Speed is a drug. Fifteen minutes to a billion is pure delirium.',
    shadow_1b_30m: 'Half an hour. Still absurd. Still theoretically on the board.',
    shadow_1b_60m: 'An hour to a billion. The patient path to the impossible.',
    shadow_lucky_dust: 'The universe rolled a die with more faces than stars. You waited anyway.',
    shadow_doge: 'The console knows what you did. So does the chain of memes.',
    shadow_click_billion: 'Your finger is a geological event at this point.',
    shadow_bank_googol: 'Numbers this large stop meaning money and start meaning jokes.',
    shadow_hardware_million: 'A million machines humming. The grid files a noise complaint.',
    shadow_rebirth_1000: 'One thousand timelines. Somewhere, one of you is still clicking.',
    shadow_zero_bps_rich: 'Wealth without work. The ultimate idle paradox.',
    shadow_all_normal: 'You finished the map. The shadow still waits.',
    shadow_name_doge: 'Such name. Very minery. Wow.'
  };

  function flavorFor(ach) {
    if (!ach) return '';
    if (ach.flavor) return ach.flavor;
    if (FLAVOR[ach.id]) return FLAVOR[ach.id];
    var id = ach.id || '';
    var title = ach.title || '';
    if (id.indexOf('mc_c_') === 0 || /click/i.test(title)) return 'Each click is a tiny proof of work only you can see.';
    if (id.indexOf('mc_b_') === 0 || /bank/i.test(title)) return 'A full wallet is quiet power until the next upgrade.';
    if (id.indexOf('mc_m_') === 0 || /mined/i.test(title)) return 'Lifetime yield is the story the ledger never forgets.';
    if (id.indexOf('mc_h_') === 0 || /hardware/i.test(title)) return 'More rigs, more heat, more hum in the dark.';
    if (id.indexOf('mc_u_') === 0 || /upgrade/i.test(title)) return 'One permanent tweak. The factory never looks back.';
    if (id.indexOf('mc_r_') === 0 || /rebirth/i.test(title)) return 'Reset is not failure. It is a different kind of progress.';
    if (id.indexOf('mc_sl_') === 0 || id.indexOf('mc_sn_') === 0 || /skill/i.test(title)) return 'The tree remembers every point you spent.';
    if (id.indexOf('mc_mn_') === 0 || /tier/i.test(title)) return 'Specialize enough and one machine becomes an empire.';
    if (id.indexOf('mc_rp_') === 0 || /^RP /i.test(title)) return 'Rebirth points are the only currency that survives the wipe.';
    if (id.indexOf('mc_x') === 0) return 'Two goals, one moment. The ledger likes coincidence.';
    return 'Another mark on the long road through the minery.';
  }

  function howTo(ach) {
    if (!ach) return '';
    if (ach.how) return ach.how;
    return ach.desc || 'Keep playing to unlock.';
  }

  function injectCss() {
    if (document.getElementById('ach-ui-css')) return;
    var s = document.createElement('style');
    s.id = 'ach-ui-css';
    s.textContent = [
      '.ach-card{position:relative!important;cursor:default;transition:border-color 0.15s,box-shadow 0.15s;}',
      '.ach-card:hover{border-color:#ffd700!important;box-shadow:0 0 10px rgba(255,215,0,0.25);}',
      '.ach-card.shadow-ach:hover{border-color:#c39bd3!important;box-shadow:0 0 12px rgba(155,89,182,0.4);}',
      '.ach-card .ach-desc{display:block!important;font-size:0.32em!important;color:#9a9aaa!important;line-height:1.3!important;margin-top:2px!important;max-height:2.8em;overflow:hidden;}',
      '.ach-card .ach-flavor{position:absolute;right:4px;bottom:4px;left:4px;font-size:0.28em;color:#5a5a6a;line-height:1.25;text-align:right;font-style:italic;pointer-events:none;border-top:1px solid #2a2a38;padding-top:3px;margin-top:4px;}',
      '.ach-card.unlocked .ach-flavor{color:#3d6b55;}',
      '.ach-card.shadow-ach .ach-flavor{color:#6a4a7a;}',
      '.ach-card{padding-bottom:28px!important;}',
      '#ach-hover-modal{position:fixed;z-index:9000;min-width:260px;max-width:340px;pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity 0.12s,transform 0.12s;background:linear-gradient(160deg,#14141f 0%,#0c0c14 100%);border:2px solid #ffd700;box-shadow:0 0 24px rgba(255,215,0,0.35),0 12px 40px rgba(0,0,0,0.7);padding:14px 16px;color:#eee;font-family:inherit;}',
      '#ach-hover-modal.show{opacity:1;transform:translateY(0);}',
      '#ach-hover-modal.shadow-modal{border-color:#9b59b6;box-shadow:0 0 24px rgba(155,89,182,0.4),0 12px 40px rgba(0,0,0,0.7);}',
      '#ach-hover-modal .ahm-kicker{font-size:0.32em;letter-spacing:0.14em;text-transform:uppercase;color:#888;margin-bottom:4px;}',
      '#ach-hover-modal.shadow-modal .ahm-kicker{color:#9b59b6;}',
      '#ach-hover-modal .ahm-title{font-size:0.55em;color:#ffd700;margin-bottom:8px;line-height:1.2;}',
      '#ach-hover-modal.shadow-modal .ahm-title{color:#c39bd3;}',
      '#ach-hover-modal .ahm-row{font-size:0.36em;margin:6px 0;line-height:1.4;}',
      '#ach-hover-modal .ahm-label{color:#888;display:block;font-size:0.9em;margin-bottom:2px;letter-spacing:0.06em;text-transform:uppercase;}',
      '#ach-hover-modal .ahm-how{color:#ddd;}',
      '#ach-hover-modal .ahm-flavor{color:#7a9a88;font-style:italic;border-left:2px solid #2a4a3a;padding-left:8px;margin-top:8px;}',
      '#ach-hover-modal.shadow-modal .ahm-flavor{color:#a88bb8;border-left-color:#4a2060;}',
      '#ach-hover-modal .ahm-status{margin-top:10px;font-size:0.34em;font-weight:bold;}',
      '#ach-hover-modal .ahm-status.on{color:#00ff9d;}',
      '#ach-hover-modal .ahm-status.off{color:#666;}'
    ].join('');
    document.head.appendChild(s);
  }

  function ensureModal() {
    var el = document.getElementById('ach-hover-modal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'ach-hover-modal';
    document.body.appendChild(el);
    return el;
  }
  function hideModal() {
    var el = document.getElementById('ach-hover-modal');
    if (el) el.classList.remove('show');
  }
  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function showModal(ach, on, clientX, clientY) {
    var el = ensureModal();
    var isShadow = !!ach.shadow;
    el.className = isShadow ? 'shadow-modal' : '';
    el.innerHTML =
      '<div class="ahm-kicker">' + (isShadow ? 'Shadow Achievement' : 'Achievement') + '</div>' +
      '<div class="ahm-title">' + escapeHtml(ach.title) + '</div>' +
      '<div class="ahm-row"><span class="ahm-label">How to unlock</span><span class="ahm-how">' + escapeHtml(howTo(ach)) + '</span></div>' +
      '<div class="ahm-flavor">' + escapeHtml(flavorFor(ach)) + '</div>' +
      '<div class="ahm-status ' + (on ? 'on' : 'off') + '">' + (on ? 'UNLOCKED' : 'LOCKED') + '</div>';
    el.style.left = '0px'; el.style.top = '0px';
    el.classList.add('show');
    var rect = el.getBoundingClientRect();
    var x = clientX + 16, y = clientY + 16;
    if (x + rect.width > window.innerWidth - 8) x = clientX - rect.width - 12;
    if (y + rect.height > window.innerHeight - 8) y = clientY - rect.height - 12;
    if (x < 8) x = 8; if (y < 8) y = 8;
    el.style.left = x + 'px'; el.style.top = y + 'px';
  }

  function bindCard(card, ach, on) {
    if (!card || !ach || card.__achBound) return;
    card.__achBound = true;
    card.removeAttribute('title');
    if (!card.querySelector('.ach-desc')) {
      var d = document.createElement('div');
      d.className = 'ach-desc';
      d.textContent = howTo(ach);
      var status = card.querySelector('.ach-status');
      if (status) card.insertBefore(d, status); else card.appendChild(d);
    } else {
      card.querySelector('.ach-desc').textContent = howTo(ach);
    }
    var fl = card.querySelector('.ach-flavor');
    if (!fl) { fl = document.createElement('div'); fl.className = 'ach-flavor'; card.appendChild(fl); }
    fl.textContent = flavorFor(ach);
    card.addEventListener('mouseenter', function (e) { showModal(ach, on, e.clientX, e.clientY); });
    card.addEventListener('mousemove', function (e) { showModal(ach, on, e.clientX, e.clientY); });
    card.addEventListener('mouseleave', hideModal);
  }

  function enhanceAll() {
    if (typeof ACHIEVEMENTS === 'undefined') return;
    var unlocked = (window.gameData && window.gameData.unlockedAchievements) || [];
    document.querySelectorAll('.ach-card').forEach(function (card) {
      var titleEl = card.querySelector('.ach-title');
      if (!titleEl) return;
      var title = titleEl.textContent.trim();
      var ach = null;
      for (var i = 0; i < ACHIEVEMENTS.length; i++) {
        if (ACHIEVEMENTS[i].title === title) { ach = ACHIEVEMENTS[i]; break; }
      }
      if (!ach) return;
      bindCard(card, ach, unlocked.indexOf(ach.id) !== -1);
    });
  }

  var obs = new MutationObserver(function () { hideModal(); setTimeout(enhanceAll, 30); });
  function boot() {
    injectCss(); enhanceAll();
    var host = document.getElementById('center-tab-host') || document.body;
    obs.observe(host, { childList: true, subtree: true });
    setInterval(enhanceAll, 2000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 600); });
  else setTimeout(boot, 600);
})();
