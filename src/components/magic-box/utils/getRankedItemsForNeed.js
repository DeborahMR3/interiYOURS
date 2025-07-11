// utils/getRankedItemsForNeed.js
import { scoreItemForNeed } from "./scoreItemForNeed.js";

export function getRankedItemsForNeed(
  need,
  catalog,
  context,
  { debug = false } = {}
) {
  if (debug) console.debug(`Scoring for need: ${need}`);
  return catalog
    .map((item) => {
      const score = scoreItemForNeed(item, need, context);
      return score > 0 ? { item, score } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);
}
