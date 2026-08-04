// Holiday power-ups + force holiday Bitcoin to same size as normal coin
(function () {
  if (window.__holidayPowerLoaded) return;
  window.__holidayPowerLoaded = true;

  var HOLIDAY_POWER = {
    halloween: { bps: 1.5, click: 1.4, discount: 0.9, label: 'SPOOKY HASH +50% mine / +40% click / 10% cheaper', color: '#ff6b00' },
    thanksgiving: { bps: 1.45, click: 1.25, discount: 0.92, label: 'FEAST MODE +45% mine / +25% click / 8% cheaper', color: '#c45c26' },
    christmas: { bps: 1.75, click: 1.5, discount: 0.85, label: "SANTA'S HASH +75% mine / +50% click / 15% cheaper", color: '#e82525' },
    newyear: { bps: 1.6, click: 1.6, discount: 0.9, label: 'RESOLUTION RUSH +60% mine / +60% click / 10% cheaper', color: '#ffd700' },
    valentine: { bps: 1.3, click: 2.0, discount: 0.95, label: 'LOVE BYTES +30% mine / +100% click / 5% cheaper', color: '#ff4d6d' },
    patrick: { bps: 1.55, click: 1.35, discount: 0.88, label: 'LUCKY HASH +55% mine / +35% click / 12% cheaper', color: '#00c853' },
    easter: { bps: 1.4, click: 1.45, discount: 0.9, label: 'EGG HUNT +40% mine / +45% click / 10% cheaper', color: '#b388ff' },
    july4: { bps: 1.65, click: 1.55, discount: 0.9, label: 'FREEDOM HASH +65% mine / +55% click / 10% cheaper', color: '#1565c0' }
  };

  window.holidayBpsMult = 1;
  window.holidayClickMult = 1;
  window.holidayCostMult = 1;

  function injectCss() {
    if (document.getElementById('holiday-power-css')) return;
    var s = document.createElement('style');
    s.id = 'holiday-power-css';
    s.textContent = [
      '#bitcoin{width:250px!important;height:250px!important;min-width:250px!important;min-height:250px!important;max-width:250px!important;max-height:250px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;}',
      '#bitcoin img{width:250px!important;height:250px!important;min-width:250px!important;min-height:250px!important;max-width:250px!important;max-height:250px!important;object-fit:contain!important;object-position:center!important;display:block!important;}',
      '#bitcoin.holiday-active img{transform:scale(1.22)!important;transform-origin:center center!important;}',
      '#bitcoin:not(.holiday-active) img{transform:none!important;}',
      '.active-effect-chip.holiday{border-color:var(--hol-color,#ffd700);color:var(--hol-color,#ffd700);background:rgba(0,0,0,0.75);}',
      '.active-effect-chip.holiday .active-effect-timer{opacity:0.85;}'
    ].join('');
    document.head.appendChild(s);
  }

  function currentHoliday() {
    return typeof getActiveHoliday === 'function' ? getActiveHoliday() : null;
  }

  function applyPower() {
    var h = currentHoliday();
    var power = h && HOLIDAY_POWER[h.id] ? HOLIDAY_POWER[h.id] : null;
    window.holidayBpsMult = power ? power.bps : 1;
    window.holidayClickMult = power ? power.click : 1;
    window.holidayCostMult = power ? power.discount : 1;
    var host = document.getElementById('bitcoin');
    if (host) host.classList.toggle('holiday-active', !!power);
    updateHolidayHud(h, power);
  }

  function updateHolidayHud(h, power) {
    var hud = document.getElementById('active-effects-hud');
    if (!hud) return;
    var existing = document.getElementById('holiday-passive-chip');
    if (!power || !h) {
      if (existing) existing.remove();
      return;
    }
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'holiday-passive-chip';
      existing.className = 'active-effect-chip holiday';
      hud.appendChild(existing);
    }
    existing.style.setProperty('--hol-color', power.color || h.color || '#ffd700');
    existing.innerHTML =
      '<span class="active-effect-name">' + (h.name || 'HOLIDAY') + '</span>' +
      '<span class="active-effect-timer">' + (power.label || 'Active') + '</span>';
  }

  function patchBPS() {
    if (window.__holidayBpsPatched) return;
    if (typeof window.calculateCurrentBPS !== 'function') return;
    window.__holidayBpsPatched = true;
    var prev = window.calculateCurrentBPS;
    window.calculateCurrentBPS = function () {
      return prev.apply(this, arguments) * (window.holidayBpsMult || 1);
    };
  }

  function patchClick() {
    if (window.__holidayClickPatched) return;
    if (typeof window.getClickValue !== 'function') return;
    window.__holidayClickPatched = true;
    var prev = window.getClickValue;
    window.getClickValue = function () {
      return prev.apply(this, arguments) * (window.holidayClickMult || 1);
    };
  }

  function patchCostFunctions() {
    if (typeof window.getMinerCost === 'function' && !window.__holidayMinerCostPatched) {
      window.__holidayMinerCostPatched = true;
      var prev = window.getMinerCost;
      window.getMinerCost = function (m) {
        return Math.floor(prev(m) * (window.holidayCostMult || 1));
      };
    }
    if (typeof window.getUpgradeCost === 'function' && !window.__holidayUpgCostPatched) {
      window.__holidayUpgCostPatched = true;
      var prevU = window.getUpgradeCost;
      window.getUpgradeCost = function (u) {
        return Math.floor(prevU(u) * (window.holidayCostMult || 1));
      };
    }
  }

  function patchEngineCosts() {
    if (window.__holidayEngineCostPatched) return;
    if (typeof window.renderMiners !== 'function') return;
    window.__holidayEngineCostPatched = true;
    var origRM = window.renderMiners;
    window.renderMiners = function () {
      var scaled = [];
      if (window.miners && window.holidayCostMult && window.holidayCostMult !== 1) {
        window.miners.forEach(function (m) {
          scaled.push({ m: m, base: m.baseCost });
          m.baseCost = m.baseCost * window.holidayCostMult;
        });
      }
      try { return origRM.apply(this, arguments); }
      finally { scaled.forEach(function (s) { s.m.baseCost = s.base; }); }
    };
    var origRU = window.renderUpgrades;
    if (typeof origRU === 'function') {
      window.renderUpgrades = function () {
        var scaled = [];
        if (window.upgrades && window.holidayCostMult && window.holidayCostMult !== 1) {
          window.upgrades.forEach(function (u) {
            scaled.push({ u: u, base: u.baseCost });
            u.baseCost = u.baseCost * window.holidayCostMult;
          });
        }
        try { return origRU.apply(this, arguments); }
        finally { scaled.forEach(function (s) { s.u.baseCost = s.base; }); }
      };
    }
  }

  function sizeBitcoinImg() {
    var img = document.querySelector('#bitcoin img');
    if (!img) return;
    img.style.width = '250px';
    img.style.height = '250px';
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
    img.setAttribute('width', '250');
    img.setAttribute('height', '250');
  }

  function wrapApplyHolidayBitcoin() {
    var prev = window.applyHolidayBitcoin;
    window.applyHolidayBitcoin = function () {
      if (typeof prev === 'function') prev();
      sizeBitcoinImg();
      applyPower();
    };
  }

  function boot() {
    injectCss();
    applyPower();
    sizeBitcoinImg();
    patchBPS();
    patchClick();
    patchCostFunctions();
    patchEngineCosts();
    wrapApplyHolidayBitcoin();
    setInterval(function () {
      applyPower();
      sizeBitcoinImg();
      patchBPS();
      patchClick();
      patchEngineCosts();
    }, 2000);
    setTimeout(function () {
      applyPower(); sizeBitcoinImg(); patchBPS(); patchClick(); patchEngineCosts();
      if (typeof window.applyHolidayBitcoin === 'function') window.applyHolidayBitcoin();
    }, 500);
    setTimeout(function () { applyPower(); sizeBitcoinImg(); patchEngineCosts(); }, 1500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 350); });
  else setTimeout(boot, 350);
})();
