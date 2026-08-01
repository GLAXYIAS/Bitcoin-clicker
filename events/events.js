// ==========================================
// RANDOM EVENTS MANAGER (AIRDROPS)
// ==========================================

let airdropActive = false;
let eventBoostActive = false;
window.eventMultiplier = 1; // Global multiplier 

function spawnAirdrop() {
    // Don't spawn if one is already on screen
    if (airdropActive) return;

    const airdrop = document.createElement('div');
    airdrop.className = 'crypto-airdrop';
    
    // Custom Isometric Loot Crate SVG (No Emojis!)
    airdrop.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffd700" d="M12 2.2L2.2 7l9.8 4.8L21.8 7 12 2.2z"/>
            <path fill="#d4af37" d="M2.2 9v6l9.8 4.8V14L2.2 9z"/>
            <path fill="#b8972e" d="M21.8 9l-9.8 4.8v5.8l9.8-4.8V9z"/>
            <path fill="#ffffff" opacity="0.5" d="M12 13.2L3.5 9.1v3.2L12 16.3l8.5-4v-3.2L12 13.2z"/>
        </svg>
    `;

    // Pick a random location on the screen
    const randomX = Math.floor(Math.random() * 70) + 15; 
    const randomY = Math.floor(Math.random() * 70) + 15; 
    
    airdrop.style.left = `${randomX}vw`;
    airdrop.style.top = `${randomY}vh`;

    document.body.appendChild(airdrop);
    airdropActive = true;

    // Disappear after 15 seconds if the player doesn't click it
    const despawnTimer = setTimeout(() => {
        if (document.body.contains(airdrop)) {
            airdrop.remove();
            airdropActive = false;
        }
    }, 15000);

    // When the player successfully clicks the Airdrop
    airdrop.onclick = (e) => {
        clearTimeout(despawnTimer);
        airdrop.remove();
        airdropActive = false;
        triggerRandomReward();
    };
}

function triggerRandomReward() {
    const roll = Math.random(); // Rolls a number between 0.0 and 1.0
    let message = "";

    if (roll < 0.6) {
        // 60% CHANCE: Instant BTC (Grants 15 minutes worth of your current BPS)
        const currentBPS = typeof calculateCurrentBPS === 'function' ? calculateCurrentBPS() : 1;
        const reward = Math.max(100, currentBPS * 60 * 15);
        
        window.gameData.bitcoin += reward;
        window.gameData.totalMined += reward;
        message = `AIRDROP SECURED!\n\n+${formatNum(reward)} BTC`;
    } else {
        // 40% CHANCE: Bull Market! (Production x3 for 60 seconds)
        if (!eventBoostActive) {
            eventBoostActive = true;
            window.eventMultiplier = 3; 
            message = "BULL MARKET STARTED!\n\nProduction 3x for 60 seconds!";
            
            // Revert back to normal after 60 seconds
            setTimeout(() => {
                window.eventMultiplier = 1;
                eventBoostActive = false;
                showEventNotification("Bull market has ended. Production normalized.");
            }, 60000);
        } else {
            // Fallback if a boost is already active
            window.gameData.bitcoin += 15000;
            message = "LUCKY FIND!\n\n+15,000 BTC";
        }
    }

    showEventNotification(message);
    if (typeof updateDisplay === 'function') updateDisplay(); 
}

function showEventNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'event-notification';
    notif.innerText = msg;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        if (document.body.contains(notif)) notif.remove();
    }, 4000);
}

// Start the background loop when the game loads
function startEventLoop() {
    // Check every 60 seconds if we should spawn an airdrop
    setInterval(() => {
        if (Math.random() < 0.35) { // 35% chance
            spawnAirdrop();
        }
    }, 60000); 

    // Spawns one exactly 15 seconds after you open the game for testing!
    setTimeout(spawnAirdrop, 15000);
}
