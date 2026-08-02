// Miners + Cookie Clicker-style one-time upgrades (no emojis, SVG icons only)
// 32 hardware tiers — costs and production scale exponentially
window.minerDefs = [
    { name: "Resistive Logic Breadboard", baseCost: 15, production: 0.1, svg: "hardware" },
    { name: "Low-Voltage Silicon Gate", baseCost: 100, production: 0.5, svg: "chip" },
    { name: "Refurbished Thin-Client Terminal", baseCost: 500, production: 2, svg: "hardware" },
    { name: "Cascaded Copper Array", baseCost: 3000, production: 10, svg: "network" },
    { name: "Synchronous Micro-Controller", baseCost: 10000, production: 40, svg: "processor" },
    { name: "Dedicated Coprocessor Node", baseCost: 40000, production: 100, svg: "chip" },
    { name: "Integrated Core Workstation", baseCost: 200000, production: 400, svg: "server" },
    { name: "High-Throughput Bus Array", baseCost: 1.2e6, production: 1500, svg: "network" },
    { name: "Overclocked Logic Cluster", baseCost: 6e6, production: 5000, svg: "bolt" },
    { name: "Regulated Multi-Thread Rig", baseCost: 3e7, production: 20000, svg: "processor" },
    { name: "Direct-Injected Silicon Matrix", baseCost: 1.5e8, production: 80000, svg: "chip" },
    { name: "Monolithic ASIC Die", baseCost: 8e8, production: 3e5, svg: "processor" },
    { name: "Parallel Processing Engine", baseCost: 4e9, production: 1.2e6, svg: "server" },
    { name: "Cryogenic Storage Interconnect", baseCost: 2e10, production: 5e6, svg: "storage" },
    { name: "Modular Enterprise Node", baseCost: 1e11, production: 2e7, svg: "server" },
    { name: "High-Density Storage Cluster", baseCost: 5e11, production: 8e7, svg: "storage" },
    { name: "Photonic Switch Fabric", baseCost: 2.5e12, production: 3e8, svg: "network" },
    { name: "Orbital Relay Antenna", baseCost: 1.2e13, production: 1.2e9, svg: "satellite" },
    { name: "Stratospheric Mesh Hub", baseCost: 6e13, production: 5e9, svg: "satellite" },
    { name: "Quantum Dot Lattice", baseCost: 3e14, production: 2e10, svg: "quantum" },
    { name: "Entangled Qubit Array", baseCost: 1.5e15, production: 8e10, svg: "atom" },
    { name: "Superconducting Loop Bank", baseCost: 8e15, production: 3.5e11, svg: "quantum" },
    { name: "Neutrino Capture Array", baseCost: 4e16, production: 1.5e12, svg: "atom" },
    { name: "Dark Matter Hash Filter", baseCost: 2e17, production: 6e12, svg: "quantum" },
    { name: "Temporal Buffer Cache", baseCost: 1e18, production: 2.5e13, svg: "storage" },
    { name: "Event Horizon Router", baseCost: 5e18, production: 1e14, svg: "network" },
    { name: "Singularity Compute Core", baseCost: 2.5e19, production: 4e14, svg: "atom" },
    { name: "Multiverse Shard Miner", baseCost: 1.2e20, production: 1.6e15, svg: "quantum" },
    { name: "Causal Loop Accelerator", baseCost: 6e20, production: 7e15, svg: "bolt" },
    { name: "Prime Reality Forge", baseCost: 3e21, production: 3e16, svg: "atom" },
    { name: "Omega Consensus Engine", baseCost: 1.5e22, production: 1.2e17, svg: "server" },
    { name: "Absolute Hash Horizon", baseCost: 8e22, production: 5e17, svg: "quantum" }
];

window.miners = window.minerDefs.map(function (d, i) {
    return {
        id: 'miner_' + i,
        name: d.name,
        baseCost: d.baseCost,
        production: d.production,
        svgType: d.svg
    };
});

// Cookie Clicker style: one-time upgrades unlocked by owning N of a miner
// Tiers unlock at 1, 5, 25, 50, 100 owned of that miner; each doubles that miner's output
window.UPGRADE_TIERS = [
    { count: 1,   costMul: 10,    label: "Prototype" },
    { count: 5,   costMul: 50,    label: "Calibrated" },
    { count: 25,  costMul: 500,   label: "Industrial" },
    { count: 50,  costMul: 50000, label: "Enterprise" },
    { count: 100, costMul: 5e6,   label: "Planetary" }
];

window.upgrades = [];
window.miners.forEach(function (m, mi) {
    window.UPGRADE_TIERS.forEach(function (tier, ti) {
        var shortName = m.name.split(' ').slice(-2).join(' ');
        window.upgrades.push({
            id: 'up_' + m.id + '_t' + ti,
            name: tier.label + ' ' + shortName,
            desc: 'Doubles output of all ' + m.name + ' units. Unlocks at ' + tier.count + ' owned.',
            baseCost: Math.floor(m.baseCost * tier.costMul),
            svg: m.svgType || 'boost',
            requireMiner: m.id,
            requireCount: tier.count,
            effect: 'double_miner',
            minerId: m.id,
            mult: 2
        });
    });
});

// Global one-time upgrades unlocked by total buildings owned
var globalTiers = [
    { id: 'g_click1', name: 'Reinforced Actuator', desc: 'Clicks produce +50% more BTC.', cost: 1000, needTotal: 10, effect: 'click_mult', mult: 1.5, svg: 'boost' },
    { id: 'g_click2', name: 'Servo Feedback Loop', desc: 'Clicks produce +100% more BTC.', cost: 100000, needTotal: 50, effect: 'click_mult', mult: 2, svg: 'boost' },
    { id: 'g_click3', name: 'Neural Trigger Matrix', desc: 'Clicks produce +200% more BTC.', cost: 5e9, needTotal: 150, effect: 'click_mult', mult: 3, svg: 'bolt' },
    { id: 'g_bps1', name: 'Facility Power Grid', desc: 'All miner production +25%.', cost: 50000, needTotal: 25, effect: 'global_bps', mult: 1.25, svg: 'server' },
    { id: 'g_bps2', name: 'Continental Backbone', desc: 'All miner production +50%.', cost: 5e8, needTotal: 100, effect: 'global_bps', mult: 1.5, svg: 'network' },
    { id: 'g_bps3', name: 'Orbital Power Relay', desc: 'All miner production +100%.', cost: 1e15, needTotal: 250, effect: 'global_bps', mult: 2, svg: 'satellite' },
    { id: 'g_bps4', name: 'Planetary Hash Grid', desc: 'All miner production +150%.', cost: 1e18, needTotal: 400, effect: 'global_bps', mult: 2.5, svg: 'quantum' },
    { id: 'g_click4', name: 'Causal Click Buffer', desc: 'Clicks produce +400% more BTC.', cost: 1e16, needTotal: 300, effect: 'click_mult', mult: 5, svg: 'atom' }
];
globalTiers.forEach(function (g) {
    window.upgrades.push({
        id: g.id,
        name: g.name,
        desc: g.desc + ' Unlocks at ' + g.needTotal + ' total hardware owned.',
        baseCost: g.cost,
        svg: g.svg,
        requireMiner: null,
        requireCount: g.needTotal,
        requireTotal: true,
        effect: g.effect,
        mult: g.mult
    });
});
