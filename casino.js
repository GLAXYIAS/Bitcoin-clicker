// Expanded casino: Double-or-Nothing, Coin Flip, High-Low, Blackjack, Poker
(function () {
  if (window.__casinoLoaded) return;
  window.__casinoLoaded = true;
  function fmt(n) { return typeof formatNum === 'function' ? formatNum(n) : String(n); }
  function injectCasinoCss() {
    if (document.getElementById('casino-css')) return;
    var s = document.createElement('style');
    s.id = 'casino-css';
    s.textContent = '.casino-modes{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;}.casino-mode-btn{padding:10px 6px;font-family:inherit;font-size:0.4em;background:#1a0a12;color:#ffaaaa;border:2px solid #ff4d4d;cursor:pointer;line-height:1.35;text-align:center;}.casino-mode-btn:hover,.casino-mode-btn.active{background:#ff4d4d;color:#000;}.casino-mode-btn .sub{display:block;font-size:0.85em;color:#888;margin-top:3px;}.casino-mode-btn.active .sub{color:#333;}#casino-mode-panel{min-height:120px;margin-top:8px;}.casino-card-row{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:8px 0;}.casino-card{width:36px;height:50px;background:#fff;color:#111;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:0.55em;font-weight:bold;border:1px solid #333;}.casino-card.red{color:#c00;}.casino-actions{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:8px;}.casino-actions button{font-family:inherit;font-size:0.4em;padding:8px 12px;background:#000;color:#ffd700;border:2px solid #ffd700;cursor:pointer;}.casino-actions button:hover{background:#ffd700;color:#000;}.casino-actions button:disabled{opacity:0.3;cursor:not-allowed;}';
    document.head.appendChild(s);
  }
  function getBet() {
    var input = document.getElementById('gamble-amount');
    var bet = parseFloat(input && input.value);
    if (isNaN(bet) || bet <= 0) return { err: 'Enter a valid bet amount.' };
    if (!window.gameData || bet > window.gameData.bitcoin) return { err: 'Not enough BTC!' };
    return { bet: bet };
  }
  function takeBet(bet) { window.gameData.bitcoin -= bet; }
  function pay(bet, mult) { var win = bet * mult; window.gameData.bitcoin += win; return win; }
  function showResult(text, ok) {
    var el = document.getElementById('gamble-result');
    if (!el) return;
    el.innerText = text; el.style.color = ok ? '#00ff9d' : '#ff4d4d';
    var bal = document.getElementById('gamble-balance');
    if (bal) bal.innerText = fmt(window.gameData.bitcoin);
    if (typeof updateDisplay === 'function') updateDisplay();
    if (typeof fastColorCheck === 'function') fastColorCheck();
    if (typeof saveGame === 'function') saveGame();
  }
  function playDouble(mult, chance) {
    var g = getBet(); if (g.err) return showResult(g.err, false);
    takeBet(g.bet);
    if (Math.random() < chance) { var w = pay(g.bet, mult); showResult('WON +' + fmt(w - g.bet) + ' BTC (' + mult + 'x)', true); }
    else showResult('BUST! Lost ' + fmt(g.bet) + ' BTC', false);
  }
  function playCoin(side) {
    var g = getBet(); if (g.err) return showResult(g.err, false);
    takeBet(g.bet);
    var flip = Math.random() < 0.5 ? 'heads' : 'tails';
    if (flip === side) { pay(g.bet, 2); showResult('FLIP: ' + flip.toUpperCase() + ' — you win 2x!', true); }
    else showResult('FLIP: ' + flip.toUpperCase() + ' — lost bet', false);
  }
  function playHighLow(pick) {
    var g = getBet(); if (g.err) return showResult(g.err, false);
    takeBet(g.bet);
    var roll = 1 + Math.floor(Math.random() * 100);
    var win = (pick === 'high' && roll > 50) || (pick === 'low' && roll <= 50);
    if (win) { pay(g.bet, 1.95); showResult('Roll ' + roll + ' — ' + pick.toUpperCase() + ' pays 1.95x', true); }
    else showResult('Roll ' + roll + ' — ' + pick.toUpperCase() + ' loses', false);
  }
  var bj = { player: [], dealer: [], done: false, bet: 0 };
  function cardVal(c) { if (c.r >= 10) return 10; if (c.r === 1) return 11; return c.r; }
  function handTotal(hand) {
    var t = 0, aces = 0;
    hand.forEach(function (c) { t += cardVal(c); if (c.r === 1) aces++; });
    while (t > 21 && aces > 0) { t -= 10; aces--; }
    return t;
  }
  function drawCard() { return { r: 1 + Math.floor(Math.random() * 13), suit: ['S','H','D','C'][Math.floor(Math.random()*4)] }; }
  function cardLabel(c) { var f = {1:'A',11:'J',12:'Q',13:'K'}; return (f[c.r]||String(c.r))+c.suit; }
  function isRed(c) { return c.suit === 'H' || c.suit === 'D'; }
  function renderHand(hand, hideFirst) {
    return hand.map(function (c, i) {
      if (hideFirst && i === 0) return '<div class="casino-card">?</div>';
      return '<div class="casino-card' + (isRed(c)?' red':'') + '">' + cardLabel(c) + '</div>';
    }).join('');
  }
  function startBlackjack() {
    var g = getBet(); if (g.err) return showResult(g.err, false);
    takeBet(g.bet); bj.bet = g.bet; bj.player = [drawCard(), drawCard()]; bj.dealer = [drawCard(), drawCard()]; bj.done = false;
    updateBjUI(true);
    if (handTotal(bj.player) === 21) finishBlackjack(true);
  }
  function updateBjUI(hideDealer) {
    var panel = document.getElementById('casino-mode-panel'); if (!panel) return;
    var pt = handTotal(bj.player), dt = hideDealer ? '?' : handTotal(bj.dealer);
    panel.innerHTML = '<div style="font-size:0.4em;color:#aaa;text-align:center;">Dealer: ' + dt + '</div><div class="casino-card-row">' + renderHand(bj.dealer, hideDealer) + '</div><div style="font-size:0.4em;color:#aaa;text-align:center;">You: ' + pt + '</div><div class="casino-card-row">' + renderHand(bj.player, false) + '</div><div class="casino-actions">' + (bj.done ? '' : '<button type="button" id="bj-hit">HIT</button><button type="button" id="bj-stand">STAND</button>') + '</div>';
    var hit = document.getElementById('bj-hit'), stand = document.getElementById('bj-stand');
    if (hit) hit.onclick = function () { bj.player.push(drawCard()); if (handTotal(bj.player) > 21) finishBlackjack(false); else updateBjUI(true); };
    if (stand) stand.onclick = function () { finishBlackjack(false); };
  }
  function finishBlackjack(playerBj) {
    bj.done = true;
    while (handTotal(bj.dealer) < 17) bj.dealer.push(drawCard());
    updateBjUI(false);
    var pt = handTotal(bj.player), dt = handTotal(bj.dealer);
    if (playerBj) { pay(bj.bet, 2.5); showResult('BLACKJACK! 2.5x', true); return; }
    if (pt > 21) { showResult('BUST (' + pt + ') — lost ' + fmt(bj.bet), false); return; }
    if (dt > 21 || pt > dt) { pay(bj.bet, 2); showResult('You ' + pt + ' vs dealer ' + dt + ' — WIN 2x', true); }
    else if (pt === dt) { window.gameData.bitcoin += bj.bet; showResult('PUSH ' + pt + ' — bet returned', true); }
    else showResult('You ' + pt + ' vs dealer ' + dt + ' — lose', false);
  }
  function pokerRank(hand) {
    var ranks = hand.map(function (c) { return c.r; }).sort(function (a,b){return a-b;});
    var counts = {}; ranks.forEach(function (r) { counts[r] = (counts[r]||0)+1; });
    var vals = Object.keys(counts).map(Number);
    var freq = vals.map(function (r) { return counts[r]; }).sort(function (a,b){return b-a;});
    var flush = hand.every(function (c) { return c.suit === hand[0].suit; });
    var straight = ranks.every(function (r,i){ return i===0 || r===ranks[i-1]+1; }) || ranks.join(',')==='1,10,11,12,13';
    if (flush && straight) return { name: 'Straight Flush', mult: 20 };
    if (freq[0]===4) return { name: 'Four of a Kind', mult: 12 };
    if (freq[0]===3 && freq[1]===2) return { name: 'Full House', mult: 8 };
    if (flush) return { name: 'Flush', mult: 5 };
    if (straight) return { name: 'Straight', mult: 4 };
    if (freq[0]===3) return { name: 'Three of a Kind', mult: 3 };
    if (freq[0]===2 && freq[1]===2) return { name: 'Two Pair', mult: 2 };
    if (freq[0]===2) return { name: 'Pair', mult: 1.5 };
    return { name: 'High Card', mult: 0 };
  }
  function playPoker() {
    var g = getBet(); if (g.err) return showResult(g.err, false);
    takeBet(g.bet);
    var hand = [drawCard(),drawCard(),drawCard(),drawCard(),drawCard()];
    var rank = pokerRank(hand);
    var panel = document.getElementById('casino-mode-panel');
    if (panel) panel.innerHTML = '<div class="casino-card-row">' + renderHand(hand, false) + '</div><div style="text-align:center;font-size:0.45em;color:#ffd700;margin-top:6px;">' + rank.name + '</div>';
    if (rank.mult > 0) { var w = pay(g.bet, rank.mult); showResult(rank.name + ' — +' + fmt(w - g.bet) + ' BTC (' + rank.mult + 'x)', true); }
    else showResult(rank.name + ' — lost ' + fmt(g.bet), false);
  }
  var currentMode = 'double';
  function renderModePanel() {
    var panel = document.getElementById('casino-mode-panel'); if (!panel) return;
    if (currentMode === 'double') {
      panel.innerHTML = '<div class="gamble-mult-row"><button class="gamble-mult-btn" type="button" data-d="2" data-c="0.48">2x<span class="odds">~48%</span></button><button class="gamble-mult-btn" type="button" data-d="5" data-c="0.18">5x<span class="odds">~18%</span></button><button class="gamble-mult-btn" type="button" data-d="10" data-c="0.09">10x<span class="odds">~9%</span></button></div>';
      panel.querySelectorAll('[data-d]').forEach(function (b) { b.onclick = function () { playDouble(parseFloat(b.getAttribute('data-d')), parseFloat(b.getAttribute('data-c'))); }; });
    } else if (currentMode === 'coin') {
      panel.innerHTML = '<div class="casino-actions"><button type="button" id="coin-h">HEADS (2x)</button><button type="button" id="coin-t">TAILS (2x)</button></div>';
      document.getElementById('coin-h').onclick = function () { playCoin('heads'); };
      document.getElementById('coin-t').onclick = function () { playCoin('tails'); };
    } else if (currentMode === 'highlow') {
      panel.innerHTML = '<div style="font-size:0.38em;color:#aaa;text-align:center;margin-bottom:6px;">Roll 1-100. High >50 / Low <=50. Pays 1.95x</div><div class="casino-actions"><button type="button" id="hl-high">HIGH</button><button type="button" id="hl-low">LOW</button></div>';
      document.getElementById('hl-high').onclick = function () { playHighLow('high'); };
      document.getElementById('hl-low').onclick = function () { playHighLow('low'); };
    } else if (currentMode === 'blackjack') {
      panel.innerHTML = '<div style="font-size:0.38em;color:#aaa;text-align:center;margin-bottom:6px;">Beat the dealer. Blackjack 2.5x, win 2x.</div><div class="casino-actions"><button type="button" id="bj-deal">DEAL</button></div>';
      document.getElementById('bj-deal').onclick = startBlackjack;
    } else if (currentMode === 'poker') {
      panel.innerHTML = '<div style="font-size:0.38em;color:#aaa;text-align:center;margin-bottom:6px;">5-card draw. Pair 1.5x up to Straight Flush 20x.</div><div class="casino-actions"><button type="button" id="pk-deal">DEAL HAND</button></div>';
      document.getElementById('pk-deal').onclick = playPoker;
    }
  }
  function enhanceGambleModal() {
    var modal = document.getElementById('gamble-modal');
    if (!modal || document.getElementById('casino-modes')) return;
    injectCasinoCss();
    var modes = document.createElement('div');
    modes.id = 'casino-modes'; modes.className = 'casino-modes';
    modes.innerHTML = '<button type="button" class="casino-mode-btn active" data-mode="double">DOUBLE<span class="sub">or nothing</span></button><button type="button" class="casino-mode-btn" data-mode="coin">COIN FLIP<span class="sub">heads / tails</span></button><button type="button" class="casino-mode-btn" data-mode="highlow">HIGH-LOW<span class="sub">1-100 roll</span></button><button type="button" class="casino-mode-btn" data-mode="blackjack">BLACKJACK<span class="sub">vs dealer</span></button><button type="button" class="casino-mode-btn" data-mode="poker">POKER<span class="sub">5-card draw</span></button>';
    var panel = document.createElement('div'); panel.id = 'casino-mode-panel';
    var oldRow = modal.querySelector('.gamble-mult-row'); if (oldRow) oldRow.style.display = 'none';
    var result = document.getElementById('gamble-result');
    if (result) { result.parentNode.insertBefore(modes, result); result.parentNode.insertBefore(panel, result); }
    else { modal.appendChild(modes); modal.appendChild(panel); }
    var h2 = modal.querySelector('h2'); if (h2) h2.textContent = 'CRYPTO CASINO';
    modes.querySelectorAll('.casino-mode-btn').forEach(function (btn) {
      btn.onclick = function () {
        currentMode = btn.getAttribute('data-mode');
        modes.querySelectorAll('.casino-mode-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderModePanel();
      };
    });
    renderModePanel();
  }
  window.openCasinoMode = function (mode) { currentMode = mode || 'double'; renderModePanel(); };
  var tries = 0;
  function tryHook() { tries++; enhanceGambleModal(); if (!document.getElementById('casino-modes') && tries < 20) setTimeout(tryHook, 200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(tryHook, 300); });
  else setTimeout(tryHook, 300);
})();
