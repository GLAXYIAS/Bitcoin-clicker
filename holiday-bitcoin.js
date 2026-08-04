// Holiday Bitcoin skins — swaps the main coin image during active holidays
(function () {
  if (window.__holidayBitcoinLoaded) return;
  window.__holidayBitcoinLoaded = true;

  var DEFAULT_SRC = 'imgs/Bitcoin.png';
  var HOLIDAY_IMAGES = {
    halloween: 'imgs/halloweenbitcoin.png',
    thanksgiving: 'imgs/turkeybitcoin.png',
    christmas: 'imgs/santabitcoin2.png',
    newyear: 'imgs/newyearbitcoin.png',
    valentine: 'imgs/valentinesbitcoin.png',
    patrick: 'imgs/saintpatricksbitcoin.png',
    easter: 'imgs/easterbitcoin.png',
    july4: 'imgs/4thofjulybitcoin.png'
  };

  function getBitcoinImg() {
    var host = document.getElementById('bitcoin');
    if (!host) return null;
    return host.querySelector('img') || null;
  }

  function applyHolidayBitcoin() {
    var img = getBitcoinImg();
    if (!img) return;

    var holiday = typeof getActiveHoliday === 'function' ? getActiveHoliday() : null;
    var src = DEFAULT_SRC;
    if (holiday && holiday.id && HOLIDAY_IMAGES[holiday.id]) {
      src = HOLIDAY_IMAGES[holiday.id];
    }

    // Avoid reloading the same image repeatedly
    var current = img.getAttribute('src') || '';
    if (current.indexOf(src) !== -1 || current.endsWith(src.split('/').pop())) return;

    img.setAttribute('src', src);
    img.setAttribute('alt', holiday ? (holiday.name + ' Bitcoin') : 'Bitcoin');
    img.onerror = function () {
      // Fallback to default if a holiday asset is missing
      if (img.getAttribute('src') !== DEFAULT_SRC) {
        img.setAttribute('src', DEFAULT_SRC);
        img.onerror = null;
      }
    };
  }

  window.applyHolidayBitcoin = applyHolidayBitcoin;

  function boot() {
    applyHolidayBitcoin();
    // Re-check periodically in case the page stays open across midnight
    setInterval(applyHolidayBitcoin, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 200); });
  } else {
    setTimeout(boot, 200);
  }
  // Events may load a bit later
  setTimeout(applyHolidayBitcoin, 800);
  setTimeout(applyHolidayBitcoin, 2000);
})();
