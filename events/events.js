// RANDOM EVENTS + HOLIDAY EVENTS
let airdropActive = false;
let eventBoostActive = false;
window.eventMultiplier = 1;
window.clickEventMultiplier = 1;
let clickBoostActive = false;
let bpsBoostEndsAt = 0;
let clickBoostEndsAt = 0;
let bpsBoostLabel = '';
let clickBoostLabel = '';
let boostHudInterval = null;

function getActiveHoliday() {
  const now = new Date(), m = now.getMonth(), d = now.getDate();
  if ((m === 9 && d >= 25) || (m === 10 && d === 1))
    return { id:'halloween', name:'HALLOWEEN', tagline:'Spooky Hash Season', color:'#ff6b00', airdropClass:'holiday-halloween',
      news:['SPOOKY ALERT: Phantom wallets dumping coins.'],
      rewards:[{type:'btc',minutes:8,label:'TRICK OR TREAT!\n\nA haunted airdrop yields '},{type:'bps',mult:4,duration:90,label:'GHOST PROTOCOL!\n\nMining 4x for 90 seconds!'}]};
  if (m === 10 && d >= 20)
    return { id:'thanksgiving', name:'THANKSGIVING', tagline:'Feast of Coins', color:'#c45c26', airdropClass:'holiday-thanksgiving',
      news:['FEAST MODE: Annual block banquet.'],
      rewards:[{type:'btc',minutes:10,label:'FEAST SECURED!\n\nA generous spread grants '},{type:'bps',mult:3.5,duration:120,label:'HARVEST BOOM!\n\nProduction 3.5x for 2 minutes!'}]};
  if (m === 11 && d >= 20 && d <= 26)
    return { id:'christmas', name:'CHRISTMAS', tagline:"Santa's Hashrate", color:'#e82525', airdropClass:'holiday-christmas',
      news:['HO HO HO: Gift-wrapped UTXOs tonight.'],
      rewards:[{type:'btc',minutes:12,label:'GIFT UNWRAPPED!\n\nSanta left you '},{type:'bps',mult:5,duration:90,label:"SANTA'S BLESSING!\n\nProduction 5x for 90 seconds!"}]};
  if ((m === 11 && d === 31) || (m === 0 && d <= 2))
    return { id:'newyear', name:'NEW YEAR', tagline:'Resolution Rush', color:'#ffd700', airdropClass:'holiday-newyear',
      news:['COUNTDOWN: New cycle begins.'],
      rewards:[{type:'btc',minutes:10,label:'NEW YEAR BONUS!\n\nFresh year, fresh coins: '},{type:'bps',mult:4,duration:100,label:'RESOLUTION BOOST!\n\nProduction 4x for 100 seconds!'}]};
  if (m === 1 && d >= 13 && d <= 15)
    return { id:'valentine', name:"VALENTINE'S", tagline:'Love Bytes', color:'#ff4d6d', airdropClass:'holiday-valentine',
      news:['LOVE ON-CHAIN: Sweet satoshis.'],
      rewards:[{type:'btc',minutes:6,label:'SWEET DROP!\n\nA love letter contains '},{type:'click',mult:5,duration:60,label:'CUPID CLICKS!\n\nClicks 5x for 60 seconds!'}]};
  if (m === 2 && d >= 16 && d <= 18)
    return { id:'patrick', name:"ST. PATRICK'S", tagline:'Lucky Hash', color:'#00c853', airdropClass:'holiday-patrick',
      news:['LUCKY BLOCKS: Green candles.'],
      rewards:[{type:'btc',minutes:8,label:'POT OF GOLD!\n\nYou found '},{type:'bps',mult:3.5,duration:80,label:'LUCKY STREAK!\n\nProduction 3.5x for 80 seconds!'}]};
  if ((m === 2 && d >= 22) || (m === 3 && d <= 20))
    return { id:'easter', name:'EASTER', tagline:'Egg Hunt', color:'#b388ff', airdropClass:'holiday-easter',
      news:['EGG HUNT: Colored coin caches.'],
      rewards:[{type:'btc',minutes:7,label:'GOLDEN EGG!\n\nInside you find '},{type:'bps',mult:3,duration:100,label:'SPRING SURGE!\n\nProduction 3x for 100 seconds!'}]};
  if (m === 6 && d >= 3 && d <= 5)
    return { id:'july4', name:'4TH OF JULY', tagline:'Freedom Hash', color:'#1565c0', airdropClass:'holiday-july4',
      news:['FIREWORKS: Explosive hashrate.'],
      rewards:[{type:'btc',minutes:10,label:'FIREWORK PAYOUT!\n\nA spectacular yield of '},{type:'bps',mult:4,duration:90,label:'LIBERTY BOOST!\n\nProduction 4x for 90 seconds!'}]};
  return null;
}

const REGULAR_REWARDS = [
  { type:'btc', minutes:2.5, weight:40, label:'AIRDROP SECURED!\n\n+' },
  { type:'bps', mult:3, duration:60, weight:25, label:'BULL MARKET!\n\nProduction 3x for 60 seconds!' },
  { type:'click', mult:4, duration:45, weight:20, label:'CLICK FRENZY!\n\nClicks 4x for 45 seconds!' },
  { type:'btc', minutes:1.5, weight:10, label:'WHALE ALERT!\n\nA friendly whale sent you ' },
  { type:'bps', mult:2, duration:120, weight:5, label:'STEADY RALLY!\n\nProduction 2x for 2 minutes!' }
];

function pickWeighted(list) {
  const total = list.reduce((s,r)=>s+(r.weight||1),0);
  let roll = Math.random()*total;
  for (const r of list) { roll -= (r.weight||1); if (roll<=0) return r; }
  return list[0];
}
function formatBoostTime(msLeft) {
  const s = Math.max(0, Math.ceil(msLeft/1000));
  const m = Math.floor(s/60), r = s%60;
  return m>0 ? (m+':'+String(r).padStart(2,'0')) : (s+'s');
}
function updateBoostHUD() {
  const hud = document.getElementById('active-effects-hud');
  if (!hud) return;
  const now = Date.now();
  let html = '';
  if (eventBoostActive && bpsBoostEndsAt > now)
    html += '<div class="active-effect-chip bps"><span class="active-effect-name">'+(bpsBoostLabel||('PRODUCTION '+window.eventMultiplier+'x'))+'</span><span class="active-effect-timer">'+formatBoostTime(bpsBoostEndsAt-now)+'</span></div>';
  else if (eventBoostActive && bpsBoostEndsAt <= now) { window.eventMultiplier=1; eventBoostActive=false; bpsBoostEndsAt=0; }
  if (clickBoostActive && clickBoostEndsAt > now)
    html += '<div class="active-effect-chip click"><span class="active-effect-name">'+(clickBoostLabel||('CLICKS '+window.clickEventMultiplier+'x'))+'</span><span class="active-effect-timer">'+formatBoostTime(clickBoostEndsAt-now)+'</span></div>';
  else if (clickBoostActive && clickBoostEndsAt <= now) { window.clickEventMultiplier=1; clickBoostActive=false; clickBoostEndsAt=0; }
  hud.innerHTML = html;
}
function ensureBoostHudTicker() {
  if (boostHudInterval) return;
  boostHudInterval = setInterval(()=>{
    updateBoostHUD();
    if (!eventBoostActive && !clickBoostActive) { clearInterval(boostHudInterval); boostHudInterval=null; updateBoostHUD(); }
  }, 250);
}
function applyReward(reward, holiday) {
  let message = '';
  if (reward.type === 'btc') {
    let currentBPS = 1;
    if (typeof calculateCurrentBPS === 'function') {
      const raw = calculateCurrentBPS();
      const mult = (typeof window.eventMultiplier==='number' && window.eventMultiplier>0) ? window.eventMultiplier : 1;
      currentBPS = raw / mult;
    }
    let airMult = 1;
    if (typeof SKILL_TREE !== 'undefined' && SKILL_TREE.node_airdrop_value && window.gameData)
      airMult = SKILL_TREE.node_airdrop_value.getEffect(window.gameData.skillTreeLevels['node_airdrop_value']||0);
    const amount = Math.max(25, currentBPS * 60 * (reward.minutes||3) * airMult);
    window.gameData.bitcoin += amount; window.gameData.totalMined += amount;
    message = (reward.label||'REWARD!\n\n+') + (typeof formatNum==='function'?formatNum(amount):amount.toFixed(2)) + ' BTC';
  } else if (reward.type === 'bps') {
    if (!eventBoostActive) {
      eventBoostActive = true; window.eventMultiplier = reward.mult||3;
      const dur = (reward.duration||60)*1000; bpsBoostEndsAt = Date.now()+dur;
      bpsBoostLabel = ('MINING '+window.eventMultiplier+'x').toUpperCase();
      message = reward.label || ('BOOST!\n\nProduction '+window.eventMultiplier+'x!');
      ensureBoostHudTicker(); updateBoostHUD();
      setTimeout(()=>{ window.eventMultiplier=1; eventBoostActive=false; bpsBoostEndsAt=0; updateBoostHUD(); showEventNotification('Boost ended. Production normalized.'); }, dur);
    } else {
      let currentBPS = 1;
      if (typeof calculateCurrentBPS==='function') { const raw=calculateCurrentBPS(); const mult=(typeof window.eventMultiplier==='number'&&window.eventMultiplier>0)?window.eventMultiplier:1; currentBPS=raw/mult; }
      const amount = Math.max(40, currentBPS*60*3);
      window.gameData.bitcoin += amount; window.gameData.totalMined += amount;
      message = 'STACKED LUCK!\n\n+'+(typeof formatNum==='function'?formatNum(amount):amount)+' BTC';
    }
  } else if (reward.type === 'click') {
    if (!clickBoostActive) {
      clickBoostActive = true; window.clickEventMultiplier = reward.mult||3;
      const dur = (reward.duration||45)*1000; clickBoostEndsAt = Date.now()+dur;
      clickBoostLabel = ('CLICKS '+window.clickEventMultiplier+'x').toUpperCase();
      message = reward.label || ('CLICK BOOST!\n\nClicks '+window.clickEventMultiplier+'x!');
      ensureBoostHudTicker(); updateBoostHUD();
      setTimeout(()=>{ window.clickEventMultiplier=1; clickBoostActive=false; clickBoostEndsAt=0; updateBoostHUD(); showEventNotification('Click boost ended.'); }, dur);
    } else {
      let currentBPS = 1;
      if (typeof calculateCurrentBPS==='function') { const raw=calculateCurrentBPS(); const mult=(typeof window.eventMultiplier==='number'&&window.eventMultiplier>0)?window.eventMultiplier:1; currentBPS=raw/mult; }
      const amount = Math.max(40, currentBPS*60*2.5);
      window.gameData.bitcoin += amount; window.gameData.totalMined += amount;
      message = 'DOUBLE DIP!\n\n+'+(typeof formatNum==='function'?formatNum(amount):amount)+' BTC';
    }
  }
  showEventNotification(message, holiday ? holiday.color : null);
  if (typeof updateDisplay==='function') updateDisplay();
  if (typeof saveGame==='function') saveGame();
}
function spawnAirdrop() {
  if (airdropActive) return;
  const holiday = getActiveHoliday();
  const airdrop = document.createElement('div');
  airdrop.className = 'crypto-airdrop'+(holiday?' '+holiday.airdropClass:'');
  airdrop.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.2L2.2 7l9.8 4.8L21.8 7 12 2.2z"/><path fill="currentColor" opacity="0.75" d="M2.2 9v6l9.8 4.8V14L2.2 9z"/><path fill="currentColor" opacity="0.55" d="M21.8 9l-9.8 4.8v5.8l9.8-4.8V9z"/></svg>';
  airdrop.style.left = (Math.floor(Math.random()*70)+15)+'vw';
  airdrop.style.top = (Math.floor(Math.random()*70)+15)+'vh';
  document.body.appendChild(airdrop); airdropActive = true;
  const t = setTimeout(()=>{ if (document.body.contains(airdrop)) { airdrop.remove(); airdropActive=false; } }, 15000);
  airdrop.onclick = ()=>{ clearTimeout(t); airdrop.remove(); airdropActive=false; triggerRandomReward(holiday); };
}
function triggerRandomReward(holiday) {
  let reward;
  if (holiday && holiday.rewards && holiday.rewards.length)
    reward = Math.random()<0.7 ? holiday.rewards[Math.floor(Math.random()*holiday.rewards.length)] : pickWeighted(REGULAR_REWARDS);
  else reward = pickWeighted(REGULAR_REWARDS);
  applyReward(reward, holiday);
}
function showEventNotification(msg, color) {
  const notif = document.createElement('div');
  notif.className = 'event-notification'; notif.innerText = msg;
  if (color) { notif.style.borderColor=color; notif.style.color=color; notif.style.boxShadow='0 0 30px '+color+'66'; }
  document.body.appendChild(notif);
  setTimeout(()=>{ if (document.body.contains(notif)) notif.remove(); }, 4500);
}
function injectHolidayBanner(holiday) {
  if (document.getElementById('holiday-banner')) return;
  const banner = document.createElement('div');
  banner.id = 'holiday-banner'; banner.className = 'holiday-banner '+holiday.airdropClass;
  banner.innerHTML = '<span class="holiday-banner-title">'+holiday.name+'</span><span class="holiday-banner-sub">'+holiday.tagline+' — special airdrops active!</span>';
  document.body.appendChild(banner);
}
function startEventLoop() {
  const holiday = getActiveHoliday();
  if (holiday) {
    injectHolidayBanner(holiday);
    if (typeof newsMessages!=='undefined' && Array.isArray(newsMessages) && holiday.news)
      holiday.news.forEach(n=>{ if (newsMessages.indexOf(n)===-1) newsMessages.push(n); });
    showEventNotification(holiday.name+' EVENT LIVE!\n\n'+holiday.tagline, holiday.color);
  }
  const spawnChance = 0.45972;
  setInterval(()=>{ if (Math.random()<spawnChance) spawnAirdrop(); }, 600000);
  setTimeout(()=>{ if (Math.random()<spawnChance) spawnAirdrop(); }, 120000);
  setInterval(()=>{
    if (eventBoostActive||clickBoostActive) return;
    if (Math.random()>0.04) return;
    const passive=[{type:'bps',mult:2,duration:40,label:'SUDDEN RALLY!\n\nProduction 2x for 40 seconds!'},{type:'click',mult:3,duration:30,label:'HOT KEYS!\n\nClicks 3x for 30 seconds!'}];
    applyReward(passive[Math.floor(Math.random()*passive.length)], null);
  }, 300000);
  function loadOnce(src, attr) {
    if (document.querySelector('script['+attr+']')) return null;
    const s = document.createElement('script'); s.src = src; s.setAttribute(attr,'1'); document.body.appendChild(s); return s;
  }
  loadOnce('boost-ui.js','data-boost-ui');
  const gd = loadOnce('game-data.js','data-game-data');
  if (gd) {
    gd.onload = function(){ loadOnce('game-engine-patch.js','data-engine-patch'); loadOnce('runtime-fixes.js','data-runtime-fixes'); loadOnce('feature-boot.js','data-feature-boot'); };
  } else {
    loadOnce('game-engine-patch.js','data-engine-patch');
    loadOnce('runtime-fixes.js','data-runtime-fixes');
    loadOnce('feature-boot.js','data-feature-boot');
  }
}
