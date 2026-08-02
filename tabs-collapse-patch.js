// Collapsible tabs: closed by default, expand to rebirth, X to close, scroll if needed
(function () {
  if (window.__tabsCollapseLoaded) return;
  window.__tabsCollapseLoaded = true;

  function injectCss() {
    if (document.getElementById('tabs-collapse-css')) return;
    var s = document.createElement('style');
    s.id = 'tabs-collapse-css';
    s.textContent = [
      '#center-tab-host{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;overflow:hidden;}',
      '#center-tab-host.closed{flex:0 0 auto;}',
      '.center-tabs{display:flex;gap:3px;padding:6px 8px;background:#0c0c12;border-bottom:2px solid #333;flex-shrink:0;align-items:center;}',
      '.center-tab{flex:1;padding:10px 4px;font-family:inherit;font-size:0.55em;background:#1a1a26;color:#888;border:2px solid #333;cursor:pointer;text-align:center;}',
      '.center-tab:hover{border-color:#666;color:#ccc;}',
      '.center-tab.active{background:#252538;color:#00ff9d;border-color:#00ff9d;}',
      '.center-tab-close{flex:0 0 auto;width:36px;height:36px;padding:0;font-family:inherit;font-size:0.7em;background:#1a0a12;color:#ff6666;border:2px solid #ff4d4d;cursor:pointer;display:none;align-items:center;justify-content:center;}',
      '.center-tab-close.visible{display:inline-flex;}',
      '.center-tab-close:hover{background:#ff4d4d;color:#000;}',
      '.center-tab-body{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;padding:10px 12px;display:none;}',
      '.center-tab-body.open{display:block;}',
      '.ach-grid{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))!important;gap:6px!important;}',
      '.ach-card{padding:6px 7px!important;min-height:0!important;}',
      '.ach-card .ach-icon,.ach-card .ach-icon svg{width:18px!important;height:18px!important;}',
      '.ach-card .ach-title{font-size:0.34em!important;}',
      '.ach-card .ach-desc{display:none!important;}',
      '.floating-text{color:#1a6b3a!important;text-shadow:0 0 4px #0a2e18,0 1px 2px #000!important;font-size:1.45em!important;font-weight:bold!important;}'
    ].join('');
    document.head.appendChild(s);
  }

  function closePanel() {
    window.__centerTab = null;
    document.querySelectorAll('.center-tab').forEach(function (tab) { tab.classList.remove('active'); });
    var body = document.getElementById('center-tab-body');
    if (body) { body.classList.remove('open'); body.style.display = 'none'; body.innerHTML = ''; }
    var host = document.getElementById('center-tab-host');
    if (host) host.classList.add('closed');
    var x = document.getElementById('center-tab-close');
    if (x) x.classList.remove('visible');
  }

  function enhance() {
    injectCss();
    var host = document.getElementById('center-tab-host');
    if (!host) return false;
    var tabsBar = host.querySelector('.center-tabs');
    var body = document.getElementById('center-tab-body');
    if (!tabsBar || !body) return false;

    // Move host between news and rebirth so it fills space
    var panel = document.querySelector('.center-panel');
    var rebirth = panel && panel.querySelector('.rebirth-center-box');
    if (panel && rebirth && host.nextElementSibling !== rebirth) {
      panel.insertBefore(host, rebirth);
    }
    // Hide empty flex spacer
    if (panel) {
      Array.prototype.forEach.call(panel.children, function (ch) {
        if (ch === host || (ch.classList && (ch.classList.contains('news-ticker-container') || ch.classList.contains('rebirth-center-box')))) return;
        if (ch.style && ch.style.flex === '1' && !ch.id) ch.style.display = 'none';
      });
    }

    // Add X button once
    if (!document.getElementById('center-tab-close')) {
      var x = document.createElement('button');
      x.type = 'button';
      x.id = 'center-tab-close';
      x.className = 'center-tab-close';
      x.title = 'Close panel';
      x.textContent = 'X';
      x.onclick = function () { closePanel(); };
      tabsBar.appendChild(x);
    }

    // Wrap original tab clicks: open expands body; re-click same tab closes
    host.querySelectorAll('.center-tab').forEach(function (btn) {
      if (btn.dataset.collapseBound) return;
      btn.dataset.collapseBound = '1';
      var orig = btn.onclick;
      btn.onclick = function (ev) {
        var id = btn.getAttribute('data-tab');
        if (window.__centerTab === id && document.getElementById('center-tab-body') && document.getElementById('center-tab-body').classList.contains('open')) {
          closePanel();
          return;
        }
        if (typeof orig === 'function') orig.call(btn, ev);
        host.classList.remove('closed');
        body.classList.add('open');
        body.style.display = 'block';
        var xbtn = document.getElementById('center-tab-close');
        if (xbtn) xbtn.classList.add('visible');
        // Achievement hover: ensure title attribute has how-to
        if (id === 'achievements') {
          setTimeout(function () {
            body.querySelectorAll('.ach-card').forEach(function (card) {
              if (card.title) return;
              var title = (card.querySelector('.ach-title') || {}).textContent || '';
              var desc = (card.querySelector('.ach-desc') || {}).textContent || '';
              card.title = title + (desc ? ' — ' + desc : '');
            });
          }, 50);
        }
      };
    });

    // Start closed
    closePanel();
    return true;
  }

  var tries = 0;
  function tryEnhance() {
    tries++;
    if (enhance()) return;
    if (tries < 30) setTimeout(tryEnhance, 200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(tryEnhance, 400); });
  else setTimeout(tryEnhance, 400);
})();
