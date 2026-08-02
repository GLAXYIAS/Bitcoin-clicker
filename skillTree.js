// Skill tree spiderweb — hover a node for name, description, and cost
const SKILL_TREE = {
    node_start: {
        id: 'node_start', name: 'The Awakening',
        desc: 'Unlocks the skill matrix. Required before any other node can be purchased.',
        maxLevel: 1, cost: 1, reqs: [],
        x: 50, y: 50,
        getEffect: (lvl) => lvl
    },
    node_click_mult: {
        id: 'node_click_mult', name: 'Quantum Clicks',
        desc: 'Base click power increased by +50% per level.',
        maxLevel: 5, cost: 1, reqs: ['node_start'],
        x: 22, y: 28,
        getEffect: (lvl) => 1 + (lvl * 0.5)
    },
    node_crit_chance: {
        id: 'node_crit_chance', name: 'Crit Protocol',
        desc: 'Chance to land a critical click. +1.5% chance per level.',
        maxLevel: 10, cost: 2, reqs: ['node_click_mult'],
        x: 8, y: 14,
        getEffect: (lvl) => lvl * 0.015
    },
    node_crit_power: {
        id: 'node_crit_power', name: 'Overload Strike',
        desc: 'Critical clicks deal extra damage. +2x crit multiplier per level (base crit is 10x).',
        maxLevel: 5, cost: 3, reqs: ['node_crit_chance'],
        x: 5, y: 5,
        getEffect: (lvl) => 10 + (lvl * 2)
    },
    node_click_flat: {
        id: 'node_click_flat', name: 'Manual Override',
        desc: 'Adds a flat +2 BTC to every click, before multipliers, per level.',
        maxLevel: 8, cost: 1, reqs: ['node_click_mult'],
        x: 18, y: 48,
        getEffect: (lvl) => lvl * 2
    },
    node_idle_boost: {
        id: 'node_idle_boost', name: 'Overclocked Miners',
        desc: 'All automatic miner production increased by +25% per level.',
        maxLevel: 5, cost: 1, reqs: ['node_start'],
        x: 78, y: 28,
        getEffect: (lvl) => 1 + (lvl * 0.25)
    },
    node_idle_deep: {
        id: 'node_idle_deep', name: 'Deep Hash Wells',
        desc: 'Further multiplies miner output by +40% per level.',
        maxLevel: 5, cost: 2, reqs: ['node_idle_boost'],
        x: 92, y: 14,
        getEffect: (lvl) => 1 + (lvl * 0.40)
    },
    node_offline: {
        id: 'node_offline', name: 'Ghost Mining',
        desc: 'Offline efficiency improved. +5% offline rate per level (base offline is 10%).',
        maxLevel: 6, cost: 2, reqs: ['node_idle_boost'],
        x: 88, y: 48,
        getEffect: (lvl) => 0.10 + (lvl * 0.05)
    },
    node_discount: {
        id: 'node_discount', name: 'Wholesale Hack',
        desc: 'Reduces the cost of all miners and store upgrades by 5% per level.',
        maxLevel: 5, cost: 2, reqs: ['node_start'],
        x: 50, y: 78,
        getEffect: (lvl) => 1 - (lvl * 0.05)
    },
    node_starting_capital: {
        id: 'node_starting_capital', name: 'Seed Wallet',
        desc: 'After each rebirth, start with bonus BTC. +500 BTC per level.',
        maxLevel: 5, cost: 2, reqs: ['node_discount'],
        x: 32, y: 92,
        getEffect: (lvl) => lvl * 500
    },
    node_airdrop_value: {
        id: 'node_airdrop_value', name: 'Signal Amplifier',
        desc: 'Airdrop BTC rewards increased by +20% per level.',
        maxLevel: 5, cost: 2, reqs: ['node_discount'],
        x: 68, y: 92,
        getEffect: (lvl) => 1 + (lvl * 0.20)
    },
    node_hybrid: {
        id: 'node_hybrid', name: 'Dual Core Link',
        desc: 'Both clicks and miner production gain +15% per level. Requires Quantum Clicks and Overclocked Miners.',
        maxLevel: 4, cost: 3, reqs: ['node_click_mult', 'node_idle_boost'],
        x: 50, y: 18,
        getEffect: (lvl) => 1 + (lvl * 0.15)
    },
    node_prestige_power: {
        id: 'node_prestige_power', name: 'Loop Resonance',
        desc: 'Each rebirth permanently adds +3% global production per level of this node.',
        maxLevel: 5, cost: 3, reqs: ['node_hybrid'],
        x: 50, y: 6,
        getEffect: (lvl) => lvl * 0.03
    }
};

let skillTreeInitialized = false;

function initSkillTreeUI() {
    const container = document.getElementById('skill-tree-nodes');
    if (!container) return;

    container.innerHTML = `
        <div class="st-wrapper" id="st-wrapper">
            <svg class="st-svg-layer" id="st-svg-layer"></svg>
            <div id="st-nodes-layer"></div>
        </div>
        <div class="st-info-panel" id="st-info-panel">
            <div class="st-info-title">HOVER OVER A NODE</div>
            <div class="st-info-desc">Explore the web to see upgrade names, effects, and costs.</div>
            <div class="st-info-cost"></div>
        </div>
    `;

    const svgLayer = document.getElementById('st-svg-layer');
    const nodesLayer = document.getElementById('st-nodes-layer');
    let svgLines = '';

    Object.keys(SKILL_TREE).forEach(key => {
        const node = SKILL_TREE[key];
        node.reqs.forEach(reqKey => {
            const parent = SKILL_TREE[reqKey];
            if (!parent) return;
            svgLines += `<line id="line-${reqKey}-${key}" class="st-line"
                               x1="${parent.x}%" y1="${parent.y}%"
                               x2="${node.x}%" y2="${node.y}%" />`;
        });
        const div = document.createElement('div');
        div.id = `st-node-${key}`;
        div.className = 'st-node locked';
        div.style.left = `${node.x}%`;
        div.style.top = `${node.y}%`;
        div.title = node.name;
        div.onmouseenter = () => updateSkillInfoPanel(key);
        div.onmouseleave = resetSkillInfoPanel;
        div.onclick = () => buySkillNode(key);
        nodesLayer.appendChild(div);
    });

    svgLayer.innerHTML = svgLines;
    skillTreeInitialized = true;
}

function renderSkillTree() {
    if (!skillTreeInitialized) initSkillTreeUI();
    const rpEl = document.getElementById('st-rp-display');
    if (rpEl) rpEl.innerText = window.gameData.rebirthPoints;

    Object.keys(SKILL_TREE).forEach(key => {
        const node = SKILL_TREE[key];
        const uiNode = document.getElementById(`st-node-${key}`);
        if (!uiNode) return;
        const currentLevel = window.gameData.skillTreeLevels[key] || 0;
        uiNode.innerText = `${currentLevel}/${node.maxLevel}`;
        const reqsMet = node.reqs.length === 0 ||
            node.reqs.every(req => (window.gameData.skillTreeLevels[req] || 0) > 0);
        uiNode.className = 'st-node';
        if (currentLevel >= node.maxLevel) uiNode.classList.add('maxed');
        else if (currentLevel > 0) uiNode.classList.add('unlocked');
        else if (reqsMet && window.gameData.rebirthPoints >= node.cost) uiNode.classList.add('available');
        else uiNode.classList.add('locked');
        node.reqs.forEach(reqKey => {
            const line = document.getElementById(`line-${reqKey}-${key}`);
            if (!line) return;
            const parentLevel = window.gameData.skillTreeLevels[reqKey] || 0;
            if (parentLevel > 0) line.classList.add('active');
            else line.classList.remove('active');
        });
    });
}

function buySkillNode(key) {
    const node = SKILL_TREE[key];
    const currentLevel = window.gameData.skillTreeLevels[key] || 0;
    if (currentLevel >= node.maxLevel) return;
    if (window.gameData.rebirthPoints < node.cost) return;
    const reqsMet = node.reqs.length === 0 ||
        node.reqs.every(req => (window.gameData.skillTreeLevels[req] || 0) > 0);
    if (!reqsMet) return;
    window.gameData.rebirthPoints -= node.cost;
    window.gameData.skillTreeLevels[key] = currentLevel + 1;
    if (typeof saveGame === 'function') saveGame();
    renderSkillTree();
    updateSkillInfoPanel(key);
    if (typeof updateDisplay === 'function') updateDisplay();
    if (typeof fastColorCheck === 'function') fastColorCheck();
}

function updateSkillInfoPanel(key) {
    const node = SKILL_TREE[key];
    if (!node) return;
    const currentLevel = window.gameData.skillTreeLevels[key] || 0;
    const panel = document.getElementById('st-info-panel');
    if (!panel) return;
    const reqsMet = node.reqs.length === 0 ||
        node.reqs.every(req => (window.gameData.skillTreeLevels[req] || 0) > 0);
    let costText;
    if (currentLevel >= node.maxLevel) {
        costText = '<span style="color:#00ff9d;">[MAXED]</span>';
    } else if (!reqsMet) {
        const need = node.reqs
            .filter(r => !(window.gameData.skillTreeLevels[r] || 0))
            .map(r => SKILL_TREE[r] ? SKILL_TREE[r].name : r)
            .join(', ');
        costText = `<span style="color:#ff6666;">Requires: ${need}</span>`;
    } else {
        costText = `Cost: ${node.cost} RP` +
            (window.gameData.rebirthPoints < node.cost
                ? ' <span style="color:#ff6666;">(not enough RP)</span>'
                : '');
    }
    const status = currentLevel > 0
        ? ` (Level ${currentLevel}/${node.maxLevel})`
        : ' (Locked)';
    panel.innerHTML = `
        <div class="st-info-title">${node.name}${status}</div>
        <div class="st-info-desc">${node.desc}</div>
        <div class="st-info-cost">${costText}</div>
    `;
}

function resetSkillInfoPanel() {
    const panel = document.getElementById('st-info-panel');
    if (!panel) return;
    panel.innerHTML = `
        <div class="st-info-title">HOVER OVER A NODE</div>
        <div class="st-info-desc">Explore the web to see upgrade names, effects, and costs.</div>
        <div class="st-info-cost"></div>
    `;
}

function loadSkillTree() {
    if (!window.gameData.skillTreeLevels) {
        window.gameData.skillTreeLevels = {};
    }
}
