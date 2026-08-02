// Boost UI bootstrap — loaded after events.js via dynamic inject from events if present,
// or include this file after events/events.js in index.html
(function bootstrapBoostUI() {
    function injectHudCss() {
        if (document.getElementById('boost-hud-css')) return;
        var style = document.createElement('style');
        style.id = 'boost-hud-css';
        style.textContent = [
            '.active-effects-hud{position:absolute;top:58px;left:12px;z-index:50;display:flex;flex-direction:column;gap:6px;pointer-events:none;max-width:260px}',
            '.center-panel{position:relative}',
            '.active-effect-chip{background:rgba(10,5,20,.92);border:2px solid #ffd700;border-radius:6px;padding:8px 10px;font-family:\'Press Start 2P\',monospace;box-shadow:0 0 14px rgba(255,215,0,.25)}',
            '.active-effect-chip.bps{border-color:#00ff9d;box-shadow:0 0 14px rgba(0,255,157,.35)}',
            '.active-effect-chip.click{border-color:#ff6b9d;box-shadow:0 0 14px rgba(255,107,157,.35)}',
            '.active-effect-name{display:block;font-size:.42em;color:#ffd700;margin-bottom:5px;letter-spacing:.5px}',
            '.active-effect-chip.bps .active-effect-name{color:#00ff9d}',
            '.active-effect-chip.click .active-effect-name{color:#ff6b9d}',
            '.active-effect-timer{display:block;font-size:.55em;color:#fff;font-family:monospace}'
        ].join('');
        document.head.appendChild(style);
    }

    function injectHudEl() {
        if (document.getElementById('active-effects-hud')) return;
        var center = document.querySelector('.center-panel');
        if (!center) return;
        var hud = document.createElement('div');
        hud.id = 'active-effects-hud';
        hud.className = 'active-effects-hud';
        hud.setAttribute('aria-live', 'polite');
        var ticker = center.querySelector('.news-ticker-container');
        if (ticker) center.insertBefore(hud, ticker.nextSibling);
        else center.prepend(hud);
    }

    function wireClickMultiplier() {
        var el = document.getElementById('bitcoin');
        if (!el || el.__clickMultWired) return;
        var prev = el.onclick;
        el.onclick = function (e) {
            if (typeof prev === 'function') {
                var m = (typeof window.clickEventMultiplier === 'number' && window.clickEventMultiplier > 0)
                    ? window.clickEventMultiplier : 1;
                if (m !== 1 && window.gameData) {
                    var old = window.gameData.clickValue;
                    window.gameData.clickValue = old * m;
                    try { prev.call(this, e); } finally { window.gameData.clickValue = old; }
                } else {
                    prev.call(this, e);
                }
            }
        };
        el.__clickMultWired = true;
    }

    function wireRebirthOpensTree() {
        if (typeof window.triggerRebirth !== 'function' || window.triggerRebirth.__opensTree) return;
        var orig = window.triggerRebirth;
        var wrapped = function () {
            var before = (window.gameData && window.gameData.rebirths) || 0;
            var beforeRp = (window.gameData && window.gameData.rebirthPoints) || 0;
            orig();
            if (window.gameData && (window.gameData.rebirths > before || window.gameData.rebirthPoints > beforeRp)) {
                if (typeof toggleSkillTree === 'function') {
                    setTimeout(function () { toggleSkillTree(true); }, 150);
                }
            }
        };
        wrapped.__opensTree = true;
        window.triggerRebirth = wrapped;
    }

    function run() {
        injectHudCss();
        injectHudEl();
        wireClickMultiplier();
        wireRebirthOpensTree();
        if (typeof updateBoostHUD === 'function') updateBoostHUD();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 400); });
    } else {
        setTimeout(run, 400);
    }
})();
