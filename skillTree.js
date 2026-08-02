// Define the spiderweb structure, connections, and math effects
const SKILL_TREE = {
    // ROOT NODE (Center)
    node_start: {
        id: 'node_start', name: "The Awakening", 
        desc: "Unlocks the true potential of the matrix. Allows you to branch out into the Skill Tree.",
        maxLevel: 1, cost: 1, reqs: [], 
        x: 50, y: 50,
        getEffect: (lvl) => lvl
    },
    node_click_mult: {
        id: 'node_click_mult', name: "Quantum Clicks", 
        desc: "Base click power is multiplied by +50% per level.",
        maxLevel: 5, cost: 1, reqs: ['node_start'], 
        x: 25, y: 25, 
        getEffect: (lvl) => 1 + (lvl * 0.5)
    },
    node_crit_chance: {
        id: 'node_crit_chance', name: "Crit Protocol", 
        desc: "Grants a chance to land a massive 10x Critical Click. (+1% chance per level)",
        maxLevel: 10, cost: 2, reqs: ['node_click_mult'],
        x: 10, y: 10, 
        getEffect: (lvl) => lvl * 0.01
    },
    node_idle_boost: {
        id: 'node_idle_boost', name: "Overclocked Miners", 
        desc: "Passive automatic BTC production increased by +25% per level.",
        maxLevel: 5, cost: 1, reqs: ['node_start'], 
        x: 75, y: 25, 
        getEffect: (lvl) => 1 + (lvl * 0.25)
    },
    node_discount: {
        id: 'node_discount', name: "Wholesale Hack", 
        desc: "Permanently reduces the BTC cost of ALL hardware miners and upgrades by 5% per level.",
        maxLevel: 5, cost: 2, reqs: ['node_start'], 
        x: 50, y: 85, 
        getEffect: (lvl) => 1 - (lvl * 0.05)
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
            <div class="st-info-desc">Explore the web to see potential upgrades and their costs.</div>
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
            svgLines += `<line id="line-${reqKey}-${key}" class="st-line" 
                               x1="${parent.x}%" y1="${parent.y}%" 
                               x2="${node.x}%" y2="${node.y}%" />`;
        });

        const div = document.createElement('div');
        div.id = `st-node-${key}`;
        div.className = 'st-node locked';
        div.style.left = `${node.x}%`;
        div.style.top = `${node.y}%`;
        
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

    document.getElementById('st-rp-display').innerText = window.gameData.rebirthPoints;

    Object.keys(SKILL_TREE).forEach(key => {
        const node = SKILL_TREE[key];
        const uiNode = document.getElementById(`st-node-${key}`);
        const currentLevel = window.gameData.skillTreeLevels[key] || 0;
        
        uiNode.innerText = `${currentLevel}/${node.maxLevel}`;

        const reqsMet = node.reqs.length === 0 || node.reqs.some(req => (window.gameData.skillTreeLevels[req] || 0) > 0);

        uiNode.className = 'st-node';

        if (currentLevel >= node.maxLevel) {
            uiNode.classList.add('maxed');
        } else if (currentLevel > 0) {
            uiNode.classList.add('unlocked');
        } else if (reqsMet && window.gameData.rebirthPoints >= node.cost) {
            uiNode.classList.add('available');
        } else {
            uiNode.classList.add('locked');
        }

        node.reqs.forEach(reqKey => {
            const line = document.getElementById(`line-${reqKey}-${key}`);
            const parentLevel = window.gameData.skillTreeLevels[reqKey] || 0;
            if (parentLevel > 0) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    });
}

function buySkillNode(key) {
    const node = SKILL_TREE[key];
    const currentLevel = window.gameData.skillTreeLevels[key] || 0;

    if (currentLevel >= node.maxLevel) return;
    if (window.gameData.rebirthPoints < node.cost) return;
    
    const reqsMet = node.reqs.length === 0 || node.reqs.some(req => (window.gameData.skillTreeLevels[req] || 0) > 0);
    if (!reqsMet) return;

    window.gameData.rebirthPoints -= node.cost;
    window.gameData.skillTreeLevels[key] = currentLevel + 1;
    
    saveGame();
    renderSkillTree();
    updateSkillInfoPanel(key);
    updateDisplay();
    fastColorCheck();
}

function updateSkillInfoPanel(key) {
    const node = SKILL_TREE[key];
    const currentLevel = window.gameData.skillTreeLevels[key] || 0;
    const panel = document.getElementById('st-info-panel');
    
    let costText = currentLevel >= node.maxLevel 
        ? `<span style="color:#00ff9d;">[MAXED]</span>` 
        : `Cost: ${node.cost} RP`;

    let status = currentLevel > 0 ? ` (Level ${currentLevel}/${node.maxLevel})` : ` (Locked)`;

    panel.innerHTML = `
        <div class="st-info-title">${node.name}${status}</div>
        <div class="st-info-desc">${node.desc}</div>
        <div class="st-info-cost">${costText}</div>
    `;
}

function resetSkillInfoPanel() {
    const panel = document.getElementById('st-info-panel');
    panel.innerHTML = `
        <div class="st-info-title">HOVER OVER A NODE</div>
        <div class="st-info-desc">Explore the web to see potential upgrades and their costs.</div>
        <div class="st-info-cost"></div>
    `;
}

function loadSkillTree() {
    if (!window.gameData.skillTreeLevels) {
        window.gameData.skillTreeLevels = {};
    }
}
