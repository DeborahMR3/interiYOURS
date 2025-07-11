// utils/generateValidPackages.js
import { generateSleepCombos } from "./generators/sleep.js";
import { generateRelaxCombos } from "./generators/relax.js";
import { generateStudyCombos } from "./generators/study.js";
import {
  getTotalPrice,
  getTotalArea,
  combineNeedCombos,
} from "./generators/utils.js";

// Convert tier string to numeric value
function tierValue(tier) {
  switch (tier) {
    case "budget":
      return 1;
    case "mid":
      return 2;
    case "premium":
      return 3;
    default:
      return 1;
  }
}

// Score a full package of items
function scorePackage(pkg, context) {
  const { items, price, area } = pkg;
  let score = 0;

  // Sum individual item need scores
  items.forEach(({ score: itemScore }) => {
    score += itemScore;
  });

  // Budget closeness: cap contribution at 1 for up to 105% spend
  const budgetRatio = price / context.budget;
  score += Math.min(budgetRatio, 1);

  // Space usage: target 75% of room size
  const maxArea = context.roomSize * 0.75;
  const usageRatio = area / maxArea;
  score += 1 - Math.abs(usageRatio - 1);

  // Penalty for under-utilization below 30%
  const areaRatioFull = area / context.roomSize;
  if (areaRatioFull < 0.3) {
    score -= 0.3 - areaRatioFull;
  }

  // Package-level multi-role bonus for small rooms
  if (context.roomSize <= 10 && items.some((i) => i.item.multiRole)) {
    score += 1;
  }

  // Package-level tier bonus based on average tier
  const avgTier =
    items.reduce((sum, { item }) => sum + tierValue(item.tier), 0) /
    items.length;
  if (context.budget <= 500 && avgTier <= 1.3) {
    score += 0.5;
  } else if (context.budget > 1000 && avgTier >= 2.7) {
    score += 0.5;
  }

  return score;
}

// Ensure packages differ by at least one item id
function isDiverse(baseItems, candidateItems) {
  const baseIds = new Set(baseItems.map((i) => i.item.id));
  return candidateItems.some((i) => !baseIds.has(i.item.id));
}

export function generateValidPackages(scoredByNeed, context) {
  const { roomSize, budget, needs } = context;
  const REUSE_PENALTY = 2.5;

  // Build per-need combos
  const generators = needs.map((need) => {
    const list = scoredByNeed[need] || [];
    if (!list.length) throw new Error(`Missing items for ${need}`);
    switch (need) {
      case "sleep":
        return generateSleepCombos(list);
      case "relax":
        return generateRelaxCombos(list);
      case "study":
        return generateStudyCombos(list);
    }
  });

  // Cartesian product of need combos
  const allCombos = combineNeedCombos(generators);

  // Map combos to package skeletons & apply hard constraints
  const packages = allCombos
    .map((items) => {
      const price = getTotalPrice(items);
      const area = getTotalArea(items);
      return { items, price, area };
    })
    .filter(({ items, price, area }) => {
      const multiCount = items.filter((i) => i.item.multiRole).length;
      return (
        price <= budget * 1.05 && area <= roomSize * 0.75 && multiCount <= 1
      );
    });

  // Attach initial package scores
  packages.forEach((pkg) => {
    pkg.score = scorePackage(pkg, context);
  });

  // Sort by score, then budget usage, then space closeness
  packages.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aBR = a.price / budget;
    const bBR = b.price / budget;
    if (bBR !== aBR) return bBR - aBR;
    const aSD = Math.abs(a.area / (roomSize * 0.75) - 1);
    const bSD = Math.abs(b.area / (roomSize * 0.75) - 1);
    return aSD - bSD;
  });

  const result = [];

  if (!packages.length) return result;

  // Always pick top as A
  const A = { name: "A", ...packages[0] };
  result.push(A);

  // Prepare for B/C selection
  const usedCounts = {};
  A.items.forEach((i) => {
    usedCounts[i.item.id] = (usedCounts[i.item.id] || 0) + 1;
  });
  let nextName = "B";

  // Phase 1: Soft-penalty + hard cap of 2 uses
  for (let i = 1; i < packages.length && result.length < 3; i++) {
    const candidate = { ...packages[i] };
    // Calculate reuse count vs A
    const reuseCount = candidate.items.filter((ci) =>
      A.items.some((ai) => ai.item.id === ci.item.id)
    ).length;
    // Apply reuse penalty
    candidate.score -= reuseCount * REUSE_PENALTY;

    // Check hard cap: no item used more than twice
    const exceedsCap = candidate.items.some(
      (ci) => (usedCounts[ci.item.id] || 0) >= 2
    );
    if (exceedsCap) continue;

    // Ensure diversity vs previous
    if (result.every((prev) => isDiverse(prev.items, candidate.items))) {
      // Accept candidate
      result.push({ name: nextName, ...candidate });
      candidate.items.forEach((i) => {
        usedCounts[i.item.id] = (usedCounts[i.item.id] || 0) + 1;
      });
      nextName = nextName === "B" ? "C" : nextName;
    }
  }

  // Phase 2: Fallback if less than 3 packages (relax cap)
  for (let i = 1; result.length < 3 && i < packages.length; i++) {
    const candidate = { ...packages[i] };
    const reuseCount = candidate.items.filter((ci) =>
      A.items.some((ai) => ai.item.id === ci.item.id)
    ).length;
    candidate.score -= reuseCount * REUSE_PENALTY;
    if (result.every((prev) => isDiverse(prev.items, candidate.items))) {
      result.push({ name: nextName, ...candidate });
      candidate.items.forEach((i) => {
        usedCounts[i.item.id] = (usedCounts[i.item.id] || 0) + 1;
      });
      nextName = nextName === "B" ? "C" : nextName;
    }
  }

  return result;
}
