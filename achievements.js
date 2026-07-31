// ==========================================
// ACHIEVEMENTS CONFIGURATION & TRACKER
// ==========================================

const ACHIEVEMENTS = [
    {
        id: "first_click",
        title: "Genesis Block",
        desc: "Click the Bitcoin for the first time.",
        icon: "🪙",
        unlocked: false,
        check: (stats) => stats.totalClicks >= 1
    },
    {
        id: "click_100",
        title: "Satoshi Candidate",
        desc: "Click the Bitcoin 100 times.",
        icon: "⚡",
        unlocked: false,
        check: (stats) => stats.totalClicks >= 100
    },
    {
        id: "btc_1k",
        title: "Stacking Sats",
        desc: "Earn a total of 1,000 Bitcoins.",
        icon: "💰",
        unlocked: false,
        check: (stats) => stats.totalBitcoins >= 1000
    },
    {
        id: "first_rebirth",
        title: "Fork the Chain",
        desc: "Perform your first Rebirth.",
        icon: "🔄",
        unlocked: false,
        check: (stats) => stats.totalRebirths >= 1
    }
];

// Load saved achievements from localStorage
function loadAchievements() {
    const saved = JSON.parse(localStorage.getItem('btc_achievements') || '[]');
    ACHIEVEMENTS.forEach(ach => {
        if (saved.includes(ach.id)) ach.unlocked = true;
    });
}

// Check all achievements against game stats
function checkAchievements(gameStats) {
    ACHIEVEMENTS.forEach(ach => {
        if (!ach.unlocked && ach.check(gameStats)) {
            ach.unlocked = true;
            saveAchievements();
            showAchievementToast(ach);
        }
    });
}

function saveAchievements() {
    const unlockedIds = ACHIEVEMENTS.filter(a => a.unlocked).map(a => a.id);
    localStorage.setItem('btc_achievements', JSON.stringify(unlockedIds));
}

// Visual Toast Banner
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

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}
