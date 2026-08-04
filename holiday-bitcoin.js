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

    var current = img.getAttribute('src') || '';
    var same = current.indexOf(src) !== -1 || current.endsWith(src.split('/').pop());
    if (!same) {
      img.setAttribute('src', src);
      img.setAttribute('alt', holiday ? (holiday.name + ' Bitcoin') : 'Bitcoin');
    }

    // Always match normal Bitcoin footprint (250x250)
    img.style.width = '250px';
    img.style.height = '250px';
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
    img.setAttribute('width', '250');
    img.setAttribute('height', '250');
    var host = document.getElementById('bitcoin');
    if (host) host.classList.toggle('holiday-active', !!(holiday && HOLIDAY_IMAGES[holiday.id]));

    img.onerror = function () {
      if (img.getAttribute('src') !== DEFAULT_SRC) {
        img.setAttribute('src', DEFAULT_SRC);
        img.onerror = null;
        if (host) host.classList.remove('holiday-active');
      }
    };
  }

  window.applyHolidayBitcoin = applyHolidayBitcoin;

  function boot() {
    applyHolidayBitcoin();
    setInterval(applyHolidayBitcoin, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 200); });
  } else {
    setTimeout(boot, 200);
  }
  setTimeout(applyHolidayBitcoin, 800);
  setTimeout(applyHolidayBitcoin, 2000);
})();
