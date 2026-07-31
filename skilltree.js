// Define the spiderweb structure, connections, and math effects
const SKILL_TREE = {
    // ROOT NODE (Center)
    node_start: {
        id: 'node_start', name: "The Awakening", 
        desc: "Unlocks the true potential of the matrix. Allows you to branch out into the Skill Tree.",
        maxLevel: 1, cost: 1, reqs: [], 
        x: 50, y: 50, // Positioned at 50% left, 50% top (Center)
        getEffect: (lvl) => lvl // Just a gateway node
    },
    // BRANCH 1 (Top Left) -> Clicking
    node_click_mult: {
        id: 'node_click_mult', name: "Quantum Clicks", 
        desc: "Base click power is multiplied by +50% per level.",
        maxLevel: 5, cost: 1, reqs: ['node_start'], 
        x: 25, y: 25, 
        getEffect: (lvl) => 1 + (lvl * 0.5) // Lvl 1 = 1.5x, Lvl 2 = 2.0x, etc.
    },
    node_crit_chance: {
        id: 'node_crit_chance', name: "Crit Protocol", 
        desc: "Grants a chance to land a massive 10x Critical Click. (+1% chance per level)",
        maxLevel: 10, cost: 2, reqs: ['node_click_mult'], // Requires Quantum Clicks to be unlocked
        x: 10, y: 10, 
        getEffect: (lvl) => lvl * 0.01 // Lvl 1 = 1%, Lvl 10 = 10%
    },
    // BRANCH 2 (Top Right) -> Idle Generation
    node_idle_boost: {
        id: 'node_idle_boost', name: "Overclocked Miners", 
        desc: "Passive automatic BTC production increased by +25% per level.",
        maxLevel: 5, cost: 1, reqs: ['node_start'], 
        x: 75, y: 25, 
        getEffect: (lvl) => 1 + (lvl * 0.25)
    },
    // BRANCH 3 (Bottom) -> Store Discounts
    node_discount: {
        id: 'node_discount', name: "Wholesale Hack", 
        desc: "Permanently reduces the BTC cost of ALL hardware miners and upgrades by 5% per level.",
        maxLevel: 5, cost: 2, reqs: ['node_start'], 
        x: 50, y: 85, 
        getEffect: (lvl) => 1 - (lvl * 0.05) // Lvl 1 = 0.95 (5% off), Lvl 5 = 0.75 (25% off)
    }
};

let skillTreeInitialized = false;

function initSkillTreeUI() {
    const container = document.getElementById('skill-tree-nodes');
    if (!container) return;

    // Build the structural HTML for the web and the info panel
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

    // Loop through the tree to draw lines and create node circles
    Object.keys(SKILL_TREE).forEach(key => {
        const node = SKILL_TREE[key];
        
        // 1. Draw SVG lines connecting this node to its requirements
        node.reqs.forEach(reqKey => {
            const parent = SKILL_TREE[reqKey];
            svgLines += `<line id="line-${reqKey}-${key}" class="st-line" 
                               x1="${parent.x}%" y1="${parent.y}%" 
                               x2="${node.x}%" y2="${node.y}%" />`;
        });

        // 2. Create the HTML Node
        const div = document.createElement('div');
        div.id = `st-node-${key}`;
        div.className = 'st-node locked';
        div.style.left = `${node.x}%`;
        div.style.top = `${node.y}%`;
        
        // Hover Events for the Info Panel
        div.onmouseenter = () => updateSkillInfoPanel(key);
        div.onmouseleave = resetSkillInfoPanel;
        
        // Click Event to Upgrade
        div.onclick = () => buySkillNode(key);

        nodesLayer.appendChild(div);
    });

    svgLayer.innerHTML = svgLines;
    skillTreeInitialized = true;
}

function renderSkillTree() {
    if (!skillTreeInitialized) initSkillTreeUI();

    // Fix the bug where RP wasn't displaying when opening the modal!
    document.getElementById('st-rp-display').innerText = window.gameData.rebirthPoints;

    Object.keys(SKILL_TREE).forEach(key => {
        const node = SKILL_TREE[key];
        const uiNode = document.getElementById(`st-node-${key}`);
        const currentLevel = window.gameData.skillTreeLevels[key] || 0;
        
        // Update text to show multi-level progress (e.g. 1/5)
        uiNode.innerText = `${currentLevel}/${node.maxLevel}`;

        // Determine if node is available to buy (has no reqs, OR at least one requirement has level > 0)
        const reqsMet = node.reqs.length === 0 || node.reqs.some(req => (window.gameData.skillTreeLevels[req] || 0) > 0);

        // Reset classes
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

        // Illuminate the connecting lines if the parent node is unlocked
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

    // Validation checks
    if (currentLevel >= node.maxLevel) return; // Already maxed
    if (window.gameData.rebirthPoints < node.cost) return; // Can't afford
    
    const reqsMet = node.reqs.length === 0 || node.reqs.some(req => (window.gameData.skillTreeLevels[req] || 0) > 0);
    if (!reqsMet) return; // Path hasn't been connected yet

    // Process Purchase
    window.gameData.rebirthPoints -= node.cost;
    window.gameData.skillTreeLevels[key] = currentLevel + 1;
    
    // Save & Refresh everything
    saveGame();
    renderSkillTree();
    updateSkillInfoPanel(key); // Refresh hover text so level updates instantly
    updateDisplay(); // Sync standard game stats
    fastColorCheck(); // Re-check if we can suddenly afford hardware because of a discount node
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

// Function triggered by index.html to load up tree data on boot
function loadSkillTree() {
    if (!window.gameData.skillTreeLevels) {
        window.gameData.skillTreeLevels = {};
    }
}
