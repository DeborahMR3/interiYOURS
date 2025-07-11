// utils/scoreItemForNeed.js

const tierAdjustments = {
  low: { budget: +0.3, mid: +0.1, premium: -0.3 },
  medium: { budget: 0.0, mid: +0.2, premium: +0.1 },
  high: { budget: -0.2, mid: 0.0, premium: +0.3 },
};

function getBudgetBand(budget) {
  if (budget <= 500) return "low";
  if (budget <= 1000) return "medium";
  return "high";
}

function multiRoleBonus(item, roomSize, needCount) {
  if (!item.multiRole) {
    return roomSize > 10 && needCount <= 2 ? +0.2 : 0;
  }
  return roomSize <= 10 || needCount > 2 ? +0.4 : -0.2;
}

export function scoreItemForNeed(item, need, context) {
  const baseScore = item.needScores?.[need] ?? 0;
  if (!item.tags?.includes(need) || baseScore === 0) return 0;

  let score = baseScore;

  // Tier-based adjustment
  const band = getBudgetBand(context.budget);
  score += tierAdjustments[band][item.tier] || 0;

  // Multi-role / single-role logic
  score += multiRoleBonus(item, context.roomSize, context.needs.length);

  return score > 0 ? score : 0;
}
