// Append many more miners (load after game-data.js)
(function () {
  if (!window.minerDefs || window.__extraMinersLoaded) return;
  window.__extraMinersLoaded = true;
  var extra = [
    ["Subspace Lattice Drill", 4e23, 2e18, "quantum"],
    ["Tachyon Hash Pipeline", 2e24, 9e18, "bolt"],
    ["Planck-Scale Assembler", 1e25, 4e19, "atom"],
    ["Void-Channel Multiplexer", 5e25, 1.8e20, "network"],
    ["Chronon Stabilizer Bank", 2.5e26, 8e20, "storage"],
    ["Hypercube Mining Array", 1.2e27, 3.5e21, "server"],
    ["Axiom Compiler Farm", 6e27, 1.5e22, "processor"],
    ["Recursive Universe Probe", 3e28, 7e22, "satellite"],
    ["Meta-Stable Reality Rig", 1.5e29, 3e23, "quantum"],
    ["Infinite Regress Miner", 8e29, 1.4e24, "atom"],
    ["Null-Pointer Forge", 4e30, 6e24, "bolt"],
    ["Stack Overflow Reactor", 2e31, 2.5e25, "server"],
    ["Heap Compact Engine", 1e32, 1.1e26, "storage"],
    ["Kernel Panic Bypass", 5e32, 5e26, "chip"],
    ["Bootloader Star Forge", 2.5e33, 2.2e27, "processor"],
    ["Firmware Galaxy Lattice", 1.2e34, 1e28, "network"],
    ["BIOS Nebula Cluster", 6e34, 4.5e28, "satellite"],
    ["UEFI Quasar Array", 3e35, 2e29, "quantum"],
    ["Microcode Black Hole", 1.5e36, 9e29, "atom"],
    ["Instruction Cache Nova", 8e36, 4e30, "bolt"],
    ["Pipeline Supernova Rig", 4e37, 1.8e31, "server"],
    ["Branch Predictor Godcore", 2e38, 8e31, "processor"],
    ["Speculative Execution Sun", 1e39, 3.5e32, "chip"],
    ["Out-of-Order Universe", 5e39, 1.6e33, "quantum"],
    ["Register File Continuum", 2.5e40, 7e33, "storage"],
    ["ALU Multiverse Bank", 1.2e41, 3e34, "atom"],
    ["FPU Eternal Lattice", 6e41, 1.4e35, "bolt"],
    ["SIMD Cosmic Grid", 3e42, 6e35, "network"],
    ["GPU Singularity Farm", 1.5e43, 2.8e36, "server"],
    ["TPU Omega Horizon", 8e43, 1.2e37, "quantum"],
    ["NPU Absolute Limit", 4e44, 5e37, "atom"]
  ];
  var start = window.minerDefs.length;
  extra.forEach(function (row, i) {
    window.minerDefs.push({ name: row[0], baseCost: row[1], production: row[2], svg: row[3] });
    var id = "miner_" + (start + i);
    window.miners.push({ id: id, name: row[0], baseCost: row[1], production: row[2], svgType: row[3] });
    if (window.UPGRADE_TIERS) {
      window.UPGRADE_TIERS.forEach(function (tier, ti) {
        var shortName = row[0].split(" ").slice(-2).join(" ");
        window.upgrades.push({
          id: "up_" + id + "_t" + ti,
          name: tier.label + " " + shortName,
          desc: "Doubles output of all " + row[0] + " units. Unlocks at " + tier.count + " owned.",
          baseCost: Math.floor(row[1] * tier.costMul),
          svg: row[3],
          requireMiner: id,
          requireCount: tier.count,
          effect: "double_miner",
          minerId: id,
          mult: 2
        });
      });
    }
  });
})();
