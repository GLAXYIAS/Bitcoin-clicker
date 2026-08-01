// ==========================================
// SVG ICON LIBRARY (NO EMOJIS)
// ==========================================
const ICONS = {
    click: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#ffd700"><path d="M13 2v8h8L13 2zm-2 0H5v20h14v-8h-8V2z"/></svg>`,
    cursor: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#00ff9d"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 4.3z"/></svg>`,
    wealth: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#ffd700"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
    hardware: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#bc34fa"><path d="M20 13H4v-2h16v2zm0-7H4v2h16V6zm0 12H4v-2h16v2zM22 2H2v20h20V2zM4 4h16v16H4V4z"/></svg>`,
    upgrade: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#ff4d4d"><path d="M16 13h-3V19h-2v-6H8l4-5 4 5zm-4-9C6.48 4 2 8.48 2 14s4.48 10 10 10 10-4.48 10-10S17.52 4 12 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`,
    rebirth: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#00ffcc"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>`,
    skill: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#bc34fa"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm1-11h-2v3H8v2h3v3h2v-3h3v-2h-3V8z"/></svg>`,
    crown: `<svg viewBox="0 0 24 24" width="28" height="28" fill="#ffd700"><path d="M5 16h14l-2.1-9.4L14 9l-2-4-2 4-2.9-2.4L5 16zm0 2h14v2H5v-2z"/></svg>`
};

// ==========================================
// HELPER FUNCTIONS FOR STAT CHECKS
// ==========================================
function getTotalMiners(stats) {
    return Object.values(stats.ownedMiners || {}).reduce((a, b) => a + b, 0);
}

function getTotalUpgrades(stats) {
    return Object.values(stats.upgradeLevels || {}).reduce((a, b) => a + b, 0);
}

// ==========================================
// ACHIEVEMENTS CONFIGURATION
// ==========================================
const ACHIEVEMENTS = [
    // --- CLICKING ACHIEVEMENTS ---
    { id: "click_1", title: "Genesis Block", desc: "Click the Bitcoin for the first time.", icon: ICONS.cursor, check: (stats) => stats.totalClicks >= 1 },
    { id: "click_100", title: "Carpal Tunnel Warning", desc: "Click the Bitcoin 100 times.", icon: ICONS.cursor, check: (stats) => stats.totalClicks >= 100 },
    { id: "click_1000", title: "Autoclicker Suspect", desc: "Click the Bitcoin 1,000 times.", icon: ICONS.cursor, check: (stats) => stats.totalClicks >= 1000 },
    { id: "click_10000", title: "Matrix Breaker", desc: "Click the Bitcoin 10,000 times.", icon: ICONS.cursor, check: (stats) => stats.totalClicks >= 10000 },

    // --- WEALTH ACHIEVEMENTS ---
    { id: "btc_1k", title: "Stacking Sats", desc: "Mine a total of 1,000 BTC.", icon: ICONS.wealth, check: (stats) => stats.totalMined >= 1000 },
    { id: "btc_1m", title: "Millionaire Club", desc: "Mine a total of 1,000,000 BTC.", icon: ICONS.wealth, check: (stats) => stats.totalMined >= 1000000 },
    { id: "btc_1b", title: "Whale Alert", desc: "Mine a total of 1 Billion BTC.", icon: ICONS.wealth, check: (stats) => stats.totalMined >= 1e9 },
    { id: "btc_1t", title: "Global Economy", desc: "Mine a total of 1 Trillion BTC.", icon: ICONS.wealth, check: (stats) => stats.totalMined >= 1e12 },
    { id: "btc_1q", title: "Singularity Nears", desc: "Mine a total of 1 Quintillion BTC.", icon: ICONS.crown, check: (stats) => stats.totalMined >= 1e18 },

    // --- HARDWARE ACHIEVEMENTS ---
    { id: "hard_1", title: "Booting Up", desc: "Purchase your first hardware miner.", icon: ICONS.hardware, check: (stats) => getTotalMiners(stats) >= 1 },
    { id: "hard_50", title: "Server Farm", desc: "Own a total of 50 hardware miners.", icon: ICONS.hardware, check: (stats) => getTotalMiners(stats) >= 50 },
    { id: "hard_200", title: "Data Center", desc: "Own a total of 200 hardware miners.", icon: ICONS.hardware, check: (stats) => getTotalMiners(stats) >= 200 },
    { id: "hard_500", title: "Global Network", desc: "Own a total of 500 hardware miners.", icon: ICONS.hardware, check: (stats) => getTotalMiners(stats) >= 500 },
    { id: "hard_quantum", title: "Quantum Supremacy", desc: "Purchase the final Quantum storage cluster.", icon: ICONS.hardware, check: (stats) => (stats.ownedMiners['miner_15'] || 0) >= 1 },

    // --- UPGRADE ACHIEVEMENTS ---
    { id: "upg_1", title: "Script Kiddie", desc: "Purchase your first upgrade.", icon: ICONS.upgrade, check: (stats) => getTotalUpgrades(stats) >= 1 },
    { id: "upg_25", title: "Sysadmin", desc: "Purchase 25 total upgrades.", icon: ICONS.upgrade, check: (stats) => getTotalUpgrades(stats) >= 25 },
    { id: "upg_100", title: "Overclocked Network", desc: "Purchase 100 total upgrades.", icon: ICONS.upgrade, check: (stats) => getTotalUpgrades(stats) >= 100 },
    { id: "upg_liquid", title: "Absolute Zero", desc: "Buy the Liquid Nitrogen Cooling upgrade.", icon: ICONS.upgrade, check: (stats) => (stats.upgradeLevels['u5'] || 0) >= 1 },

    // --- REBIRTH ACHIEVEMENTS ---
    { id: "rebirth_1", title: "Time Traveler", desc: "Perform your first Rebirth.", icon: ICONS.rebirth, check: (stats) => stats.rebirths >= 1 },
    { id: "rebirth_5", title: "Multiverse Explorer", desc: "Perform 5 Rebirths.", icon: ICONS.rebirth, check: (stats) => stats.rebirths >= 5 },
    { id: "rebirth_10", title: "Timeline Master", desc: "Perform 10 Rebirths.", icon: ICONS.crown, check: (stats) => stats.rebirths >= 10 },

    // --- SKILL TREE ACHIEVEMENTS ---
    { id: "skill_1", title: "Neural Link", desc: "Unlock your first Rebirth Skill.", icon: ICONS.skill, check: (stats) => Object.values(stats.skillTreeLevels || {}).some(lvl => lvl > 0) },
    { id: "skill_max", title: "Specialized Node", desc: "Max out a node in the Skill Tree.", icon: ICONS.skill, check: (stats) => {
        // Checks if any skill has reached level 5 (or level 10 for crit)
        return Object.entries(stats.skillTreeLevels || {}).some(([key, lvl]) => {
            if (key === 'node_crit_chance' && lvl >= 10) return true;
            if (key !== 'node_crit_chance' && key !== 'node_start' && lvl >= 5) return true;
            return false;
        });
    }},
    { id: "skill_mastery", title: "Ascended Mind", desc: "Spend a total of 15 Rebirth Points in the Skill Tree.", icon: ICONS.crown, check: (stats) => Object.values(stats.skillTreeLevels || {}).reduce((a, b) => a + b, 0) >= 15 }
];

// ==========================================
// CORE LOGIC 
// ==========================================

function loadAchievements() {
    if (!window.gameData.unlockedAchievements) {
        window.gameData.unlockedAchievements = [];
    }
}

function checkAchievements(stats) {
    if (!stats) return;
    
    ACHIEVEMENTS.forEach(ach => {
        if (!stats.unlockedAchievements.includes(ach.id) && ach.check(stats)) {
            stats.unlockedAchievements.push(ach.id);
            showAchievementToast(ach);
        }
    });
}

function showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="toast-icon">${ach.icon}</div>
        <div class="toast-details">
            <span class="toast-title">Achievement Unlocked!</span>
            <span class="toast-name">${ach.title}</span>
            <span class="toast-desc">${ach.desc}</span>
        </div>
    `;
    document.body.appendChild(toast);

    // Slide in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Slide out and remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}
