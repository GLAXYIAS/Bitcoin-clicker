(function(){
if(typeof ACHIEVEMENTS==='undefined'||window.__massAchA)return;window.__massAchA=true;
var I=typeof ICONS!=='undefined'?ICONS:{};
function tm(s){return Object.values(s.ownedMiners||{}).reduce(function(a,b){return a+b;},0);}
function tu(s){var b=Object.keys(s.boughtUpgrades||{}).filter(function(k){return s.boughtUpgrades[k];}).length;var l=Object.values(s.upgradeLevels||{}).reduce(function(a,b){return a+b;},0);return b+l;}
function own(s,id){return(s.ownedMiners&&s.ownedMiners[id])||0;}
function skills(s){var n=0,L=s.skillTreeLevels||{};Object.keys(L).forEach(function(k){n+=L[k]||0;});return n;}
function skillNodes(s){var n=0,L=s.skillTreeLevels||{};Object.keys(L).forEach(function(k){if((L[k]||0)>0)n++;});return n;}
var list=[];
[5,10,25,50,75,150,200,250,300,400,600,750,800,900,1500,2000,3000,4000,7500,10000,15000,20000,30000,40000,50000,75000,100000,150000,250000,500000,1000000].forEach(function(n){list.push({id:'mc_c_'+n,title:'Clicks '+n,desc:'Click the Bitcoin '+n+' times.',icon:I.cursor,check:function(s){return s.totalClicks>=n;}});});
[1,5,25,50,250,500,2500,5000,25000,50000,250000,500000,2.5e6,5e6,2.5e7,5e7,2.5e8,5e8,2.5e9,5e9,1e10,5e10,1e11,5e11,1e12,1e13,1e14,1e15,1e16,1e17,1e18,1e19,1e20,1e21,1e22].forEach(function(n){list.push({id:'mc_b_'+String(n),title:'Bank '+n,desc:'Hold '+n+' BTC at once.',icon:I.wealth,check:function(s){return s.bitcoin>=n;}});});
[10,50,100,500,2500,10000,50000,100000,500000,2.5e6,1e7,5e7,1e8,5e8,1e9,5e9,1e10,1e11,1e12,1e13,1e14,1e15,1e16,1e17,1e19,1e20,1e21,1e22,1e24].forEach(function(n){list.push({id:'mc_m_'+String(n),title:'Mined '+n,desc:'Mine a lifetime total of '+n+' BTC.',icon:I.wealth,check:function(s){return s.totalMined>=n;}});});
[2,3,8,10,15,20,30,40,50,60,75,90,125,150,175,200,250,300,350,400,450,600,700,800,900,1000,1250,1500,2000,2500,3000,5000].forEach(function(n){list.push({id:'mc_h_'+n,title:'Hardware '+n,desc:'Own '+n+' total hardware units.',icon:I.hardware,check:function(s){return tm(s)>=n;}});});
list.forEach(function(a){if(!ACHIEVEMENTS.some(function(x){return x.id===a.id;}))ACHIEVEMENTS.push(a);});
})();
