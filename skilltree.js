// ==========================================
// REBIRTH SKILL TREE ENGINE
// ==========================================

const SKILL_TREE = {
    // Tier 1 (Root)
    node_click_mult: {
        id: "node_click_mult",
        title: "ASIC Acceleration",
        desc: "Increases base click power by +50% per level.",
        cost: 1, // Rebirth Points
        maxLevel: 5,
        level: 0,
        requires: [], // No prerequisite
        getEffect: (level) => 1 + (level * 0.5) // Multiplier
    },
    // Tier 2 (Requires Node 1)
    node_idle_boost: {
        id: "node_idle_boost",
        title: "Proof of Stake",
        desc: "Increases passive mining speed by +25% per level.",
        cost: 2,
        maxLevel: 5,
        level: 0,
        requires: ["node_click_mult"],
        getEffect: (level) => 1 + (level * 0.25)
    },
    node_discount: {
        id: "node_discount",
        title: "Cheaper Hardware",
        desc: "Reduces shop item costs by 5% per level.",
        cost: 2,
        maxLevel: 3,
        level: 0,
        requires: ["node_click_mult"],
        getEffect: (level) => 1 - (level * 0.05) // Discount factor
    },
    // Tier 3 (Branching)
    node_crit_chance: {
        id: "node_crit_chance",
        title: "Overclocking",
        desc: "Grants +5% chance to hit a Critical Mine (10x payout).",
        cost: 5,
        maxLevel: 4,
        level: 0,
        requires: ["node_idle_boost"],
        getEffect: (level) => level * 0.05
    }
};

// Purchase a skill node
function buySkillNode(nodeId, playerState) {
    const node = SKILL_TREE[nodeId];
    if (!node) return false;

    // 1. Check prerequisites
    const reqsMet = node.requires.every(reqId => SKILL_TREE[reqId].level > 0);
    if (!reqsMet) {
        alert("Prerequisite nodes must be unlocked first!");
        return false;
    }

    // 2. Check max level
    if (node.level >= node.maxLevel) {
        alert("Node is already maxed out!");
        return false;
    }

    // 3. Check cost
    if (playerState.rebirthPoints < node.cost) {
        alert("Not enough Rebirth Points!");
        return false;
    }

    // Deduct RP and level up node
    playerState.rebirthPoints -= node.cost;
    node.level++;

    saveSkillTree();
    return true;
}

function saveSkillTree() {
    const state = {};
    Object.keys(SKILL_TREE).forEach(key => {
        state[key] = SKILL_TREE[key].level;
    });
    localStorage.setItem('btc_skill_tree', JSON.stringify(state));
}

function loadSkillTree() {
    const saved = JSON.parse(localStorage.getItem('btc_skill_tree') || '{}');
    Object.keys(saved).forEach(key => {
        if (SKILL_TREE[key]) SKILL_TREE[key].level = saved[key];
    });
}
