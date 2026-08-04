(function(){
if(typeof ACHIEVEMENTS==='undefined'||window.__massAchB)return;window.__massAchB=true;
var I=typeof ICONS!=='undefined'?ICONS:{};
function tm(s){return Object.values(s.ownedMiners||{}).reduce(function(a,b){return a+b;},0);}
function tu(s){var b=Object.keys(s.boughtUpgrades||{}).filter(function(k){return s.boughtUpgrades[k];}).length;var l=Object.values(s.upgradeLevels||{}).reduce(function(a,b){return a+b;},0);return b+l;}
function own(s,id){return(s.ownedMiners&&s.ownedMiners[id])||0;}
function skills(s){var n=0,L=s.skillTreeLevels||{};Object.keys(L).forEach(function(k){n+=L[k]||0;});return n;}
function skillNodes(s){var n=0,L=s.skillTreeLevels||{};Object.keys(L).forEach(function(k){if((L[k]||0)>0)n++;});return n;}
var list=[];
[1,2,3,10,15,20,30,40,60,75,100,125,150,200].forEach(function(n){list.push({id:'mc_u_'+n,title:'Upgrades '+n,desc:'Buy '+n+' one-time upgrades.',icon:I.upgrade,check:function(s){return tu(s)>=n;}});});
[1,2,4,6,7,8,9,12,15,20,25,30,40,50,75,100].forEach(function(n){list.push({id:'mc_r_'+n,title:'Rebirth '+n,desc:'Rebirth '+n+' times.',icon:I.rebirth,check:function(s){return (s.rebirths||0)>=n;}});});
[2,3,4,6,8,10,12,15,20,25,30].forEach(function(n){list.push({id:'mc_sl_'+n,title:'Skill levels '+n,desc:'Invest '+n+' total skill levels.',icon:I.skill,check:function(s){return skills(s)>=n;}});});
[2,3,4,6,8,10].forEach(function(n){list.push({id:'mc_sn_'+n,title:'Skill nodes '+n,desc:'Unlock '+n+' different skill nodes.',icon:I.skill,check:function(s){return skillNodes(s)>=n;}});});
for(var mi=0;mi<20;mi++){[1,5,10,25].forEach(function(need){list.push({id:'mc_mn_'+mi+'_'+need,title:'Tier '+(mi+1)+' x'+need,desc:'Own '+need+' of miner tier '+(mi+1)+'.',icon:I.hardware,check:(function(id,n){return function(s){return own(s,id)>=n;};})('miner_'+mi,need)});});}
[1,2,5,10,15,20,25,50,100].forEach(function(n){list.push({id:'mc_rp_'+n,title:'RP '+n,desc:'Hold '+n+' rebirth points at once.',icon:I.rebirth,check:function(s){return (s.rebirthPoints||0)>=n;}});});
list.push({id:'mc_x1',title:'Click and stack',desc:'Have at least 100 clicks and 100 BTC held.',icon:I.crown,check:function(s){return s.totalClicks>=100&&s.bitcoin>=100;}});
list.push({id:'mc_x2',title:'Built and tuned',desc:'Own 25 hardware and 5 upgrades.',icon:I.crown,check:function(s){return tm(s)>=25&&tu(s)>=5;}});
list.push({id:'mc_x3',title:'Reset and learn',desc:'Rebirth once and invest 1 skill level.',icon:I.crown,check:function(s){return (s.rebirths||0)>=1&&skills(s)>=1;}});
list.push({id:'mc_x4',title:'Millionaire finger',desc:'Hold 1e6 BTC and have 1000 clicks.',icon:I.crown,check:function(s){return s.bitcoin>=1e6&&s.totalClicks>=1000;}});
list.push({id:'mc_x5',title:'Named minery',desc:'Set a custom minery name.',icon:I.skill,check:function(s){return !!(s.mineryName&&s.mineryName!=="Bitcoin's Minery");}});
list.push({id:'mc_x6',title:'Rich and deep',desc:'Lifetime mined 1e9 and bank 1e6.',icon:I.wealth,check:function(s){return s.totalMined>=1e9&&s.bitcoin>=1e6;}});
list.forEach(function(a){if(!ACHIEVEMENTS.some(function(x){return x.id===a.id;}))ACHIEVEMENTS.push(a);});
})();
