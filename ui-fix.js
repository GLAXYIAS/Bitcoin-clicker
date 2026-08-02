// UI polish: scrollable top-anchored tabs, black click text, fullscreen casino, skill tree modal
(function () {
  if (window.__uiFixLoaded) return;
  window.__uiFixLoaded = true;

  function injectCss() {
    if (document.getElementById('ui-fix-css')) return;
    var s = document.createElement('style');
    s.id = 'ui-fix-css';
    s.textContent = [
      '.center-panel{display:flex!important;flex-direction:column!important;overflow:hidden!important;min-height:0!important;}',
      '.center-panel .news-ticker-container{flex:0 0 auto!important;}',
      '.center-panel .rebirth-center-box{flex:0 0 auto!important;margin-top:auto!important;}',
      '#center-tab-host{display:flex!important;flex-direction:column!important;flex:0 0 auto!important;order:0!important;min-height:0!important;overflow:hidden!important;align-self:stretch!important;}',
      '#center-tab-host.open{flex:1 1 auto!important;min-height:0!important;}',
      '#center-tab-host.closed{flex:0 0 auto!important;}',
      '.center-tabs{flex:0 0 auto!important;position:relative!important;z-index:5!important;}',
      '.center-tab-body{display:none;flex:1 1 auto!important;min-height:120px!important;max-height:none!important;overflow-y:scroll!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}',
      '.center-tab-body.open{display:block!important;}',
      '.ach-grid{overflow:visible!important;}',
      '.dev-console{overflow-y:scroll!important;max-height:160px!important;}',
      '.floating-text{color:#000!important;font-size:20px!important;font-weight:900!important;text-shadow:1px 1px 0 #fff,-1px -1px 0 #fff,1px -1px 0 #fff,-1px 1px 0 #fff!important;font-family:monospace!important;letter-spacing:0.5px!important;opacity:1!important;filter:none!important;}',
      '#gamble-modal.casino-fullscreen{display:block!important;position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;transform:none!important;margin:0!important;padding:24px 28px 40px!important;z-index:5000!important;overflow-y:auto!important;box-sizing:border-box!important;background:#12060c!important;border:none!important;border-radius:0!important;}',
      '#gamble-modal .casino-x{position:fixed;top:14px;right:18px;z-index:5001;width:42px;height:42px;border:3px solid #000;background:#fff;color:#000;font-size:22px;font-weight:900;font-family:monospace;cursor:pointer;line-height:1;display:none;align-items:center;justify-content:center;}',
      '#gamble-modal.casino-fullscreen .casino-x{display:inline-flex;}',
      '#gamble-modal .casino-x:hover{background:#000;color:#fff;}',
      '#gamble-modal.casino-fullscreen h2{font-size:1.1em!important;margin-top:8px;}',
      '#gamble-modal.casino-fullscreen .casino-modes{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))!important;max-width:900px;margin:12px auto;}',
      '#gamble-modal.casino-fullscreen #casino-mode-panel{max-width:900px;margin:0 auto;}',
      '#skill-tree-modal{width:min(720px,94vw)!important;max-height:88vh!important;background:linear-gradient(180deg,#1a0f28 0%,#0a0612 100%)!important;border:3px solid #bc34fa!important;border-radius:12px!important;box-shadow:0 0 40px rgba(188,52,250,0.35),0 20px 50px rgba(0,0,0,0.85)!important;padding:20px 22px 18px!important;}',
      '.st-wrapper{height:520px!important;border-radius:12px!important;border:2px solid #5a2a8a!important;background:radial-gradient(circle at 50% 45%,#241038 0%,#0a0614 70%)!important;}',
      '.st-node{width:52px!important;height:52px!important;border-width:3px!important;box-shadow:0 0 0 2px rgba(0,0,0,0.5)!important;}',
      '.st-node.available{box-shadow:0 0 12px rgba(0,255,157,0.45)!important;}',
      '.st-node.unlocked{box-shadow:0 0 14px rgba(188,52,250,0.55)!important;}',
      '.st-info-panel{display:none!important;}',
      '#st-hover-modal{position:fixed;z-index:6000;min-width:220px;max-width:300px;padding:14px 16px;background:#0e0a16;border:2px solid #bc34fa;border-radius:10px;box-shadow:0 12px 28px rgba(0,0,0,0.85),0 0 18px rgba(188,52,250,0.25);pointer-events:none;display:none;font-family:inherit;}',
      '#st-hover-modal .sthm-title{font-size:0.55em;color:#ffd700;margin-bottom:6px;letter-spacing:0.5px;}',
      '#st-hover-modal .sthm-desc{font-size:0.42em;color:#ddd;line-height:1.45;margin-bottom:8px;}',
      '#st-hover-modal .sthm-meta{font-size:0.38em;color:#00ff9d;font-family:monospace;line-height:1.5;}'
    ].join('');
    document.head.appendChild(s);
  }

  function fixTabsLayout() {
    var panel = document.querySelector('.center-panel');
    var host = document.getElementById('center-tab-host');
    var news = panel && panel.querySelector('.news-ticker-container');
    var rebirth = panel && panel.querySelector('.rebirth-center-box');
    if (!panel || !host || !news) return;
    if (news.nextElementSibling !== host) panel.insertBefore(host, news.nextSibling);
    if (rebirth) panel.appendChild(rebirth);
    Array.prototype.forEach.call(panel.children, function (ch) {
      if (ch === host || ch === news || ch === rebirth) return;
      if (ch.style && ch.style.flex === '1' && !ch.id) ch.style.display = 'none';
    });
    var body = document.getElementById('center-tab-body');
    if (body) { body.style.overflowY = 'scroll'; body.style.webkitOverflowScrolling = 'touch'; }
    if (window.__centerTab) host.classList.add('open');
    else { host.classList.add('closed'); host.classList.remove('open'); }
  }

  function wrapTabClicks() {
    var host = document.getElementById('center-tab-host');
    if (!host) return;
    host.querySelectorAll('.center-tab').forEach(function (btn) {
      if (btn.dataset.uiFixBound) return;
      btn.dataset.uiFixBound = '1';
      var prev = btn.onclick;
      btn.onclick = function (ev) {
        if (typeof prev === 'function') prev.call(btn, ev);
        setTimeout(function () {
          var h = document.getElementById('center-tab-host');
          var body = document.getElementById('center-tab-body');
          if (!h) return;
          if (window.__centerTab && body && (body.classList.contains('open') || body.style.display === 'block')) {
            h.classList.add('open'); h.classList.remove('closed');
            body.classList.add('open'); body.style.display = 'block'; body.style.overflowY = 'scroll';
          } else { h.classList.remove('open'); h.classList.add('closed'); }
          fixTabsLayout();
        }, 0);
      };
    });
    var x = document.getElementById('center-tab-close');
    if (x && !x.dataset.uiFixBound) {
      x.dataset.uiFixBound = '1';
      var px = x.onclick;
      x.onclick = function (ev) {
        if (typeof px === 'function') px.call(x, ev);
        var h = document.getElementById('center-tab-host');
        if (h) { h.classList.remove('open'); h.classList.add('closed'); }
        fixTabsLayout();
      };
    }
  }

  function enhanceCasino() {
    var modal = document.getElementById('gamble-modal');
    if (!modal) return;
    if (!document.getElementById('casino-x-btn')) {
      var x = document.createElement('button');
      x.type = 'button'; x.id = 'casino-x-btn'; x.className = 'casino-x';
      x.setAttribute('aria-label', 'Close casino'); x.textContent = 'X';
      x.onclick = function () {
        if (typeof toggleGamble === 'function') toggleGamble(false);
        else { modal.classList.remove('casino-fullscreen'); modal.style.display = 'none'; }
      };
      modal.appendChild(x);
    }
    var prev = window.toggleGamble;
    if (typeof prev === 'function' && !window.__casinoTogglePatched) {
      window.__casinoTogglePatched = true;
      window.toggleGamble = function (open) {
        prev(open);
        var m = document.getElementById('gamble-modal');
        if (!m) return;
        if (open) {
          m.classList.add('casino-fullscreen'); m.style.display = 'block';
          var bal = document.getElementById('gamble-balance');
          if (bal && window.gameData && typeof formatNum === 'function') bal.innerText = formatNum(window.gameData.bitcoin);
        } else { m.classList.remove('casino-fullscreen'); m.style.display = 'none'; }
      };
    }
  }

  function ensureSkillHoverModal() {
    if (document.getElementById('st-hover-modal')) return document.getElementById('st-hover-modal');
    var m = document.createElement('div');
    m.id = 'st-hover-modal';
    m.innerHTML = '<div class="sthm-title"></div><div class="sthm-desc"></div><div class="sthm-meta"></div>';
    document.body.appendChild(m);
    return m;
  }
  function showSkillHover(node, evt) {
    if (!node) return;
    var m = ensureSkillHoverModal();
    var lvl = (window.gameData && window.gameData.skillTreeLevels && window.gameData.skillTreeLevels[node.id]) || 0;
    var max = node.maxLevel || 1;
    var cost = node.cost || 1;
    var effect = '';
    try { if (typeof node.getEffect === 'function') effect = String(node.getEffect(Math.max(1, lvl || 1))); } catch (e) {}
    m.querySelector('.sthm-title').textContent = node.name || node.id;
    m.querySelector('.sthm-desc').textContent = node.desc || '';
    m.querySelector('.sthm-meta').textContent =
      'Level ' + lvl + ' / ' + max + '  ·  Cost ' + cost + ' RP' +
      (effect ? '  ·  Effect @1+: ' + effect : '') +
      (node.reqs && node.reqs.length ? '  ·  Needs: ' + node.reqs.join(', ') : '');
    m.style.display = 'block';
    positionSkillHover(m, evt);
  }
  function positionSkillHover(m, evt) {
    if (!evt) return;
    var pad = 14, x = evt.clientX + pad, y = evt.clientY + pad;
    m.style.left = '0px'; m.style.top = '0px';
    var w = m.offsetWidth || 240, h = m.offsetHeight || 120;
    if (x + w > window.innerWidth - 8) x = evt.clientX - w - pad;
    if (y + h > window.innerHeight - 8) y = evt.clientY - h - pad;
    if (x < 8) x = 8; if (y < 8) y = 8;
    m.style.left = x + 'px'; m.style.top = y + 'px';
  }
  function hideSkillHover() {
    var m = document.getElementById('st-hover-modal');
    if (m) m.style.display = 'none';
  }
  function bindSkillTreeHover() {
    if (typeof SKILL_TREE === 'undefined') return;
    Object.keys(SKILL_TREE).forEach(function (key) {
      var el = document.getElementById('st-node-' + key);
      if (!el || el.dataset.hoverBound) return;
      el.dataset.hoverBound = '1';
      el.removeAttribute('title');
      el.addEventListener('mouseenter', function (e) { showSkillHover(SKILL_TREE[key], e); });
      el.addEventListener('mousemove', function (e) {
        var m = document.getElementById('st-hover-modal');
        if (m && m.style.display === 'block') positionSkillHover(m, e);
      });
      el.addEventListener('mouseleave', hideSkillHover);
    });
    var panel = document.getElementById('st-info-panel');
    if (panel) panel.style.display = 'none';
  }
  function patchSkillTreeRender() {
    if (window.__stRenderPatched) return;
    ['renderSkillTree', 'buildSkillTree', 'initSkillTree', 'drawSkillTree'].forEach(function (n) {
      if (typeof window[n] === 'function') {
        window.__stRenderPatched = true;
        var orig = window[n];
        window[n] = function () { var r = orig.apply(this, arguments); setTimeout(bindSkillTreeHover, 50); return r; };
      }
    });
    var prev = window.toggleSkillTree;
    if (typeof prev === 'function' && !window.__stTogglePatched) {
      window.__stTogglePatched = true;
      window.toggleSkillTree = function (open) {
        prev(open);
        if (open) setTimeout(bindSkillTreeHover, 100);
        else hideSkillHover();
      };
    }
  }

  function boot() {
    injectCss();
    fixTabsLayout();
    wrapTabClicks();
    enhanceCasino();
    patchSkillTreeRender();
    bindSkillTreeHover();
    setTimeout(function () { fixTabsLayout(); wrapTabClicks(); enhanceCasino(); bindSkillTreeHover(); }, 600);
    setTimeout(function () { fixTabsLayout(); wrapTabClicks(); bindSkillTreeHover(); }, 1500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 300); });
  else setTimeout(boot, 300);
})();
