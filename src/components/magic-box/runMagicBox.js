// runMagicBox.js
import { getRankedItemsForNeed } from "./utils/getRankedItemsForNeed.js";
import { generateValidPackages } from "./utils/generateValidPackages.js";

export function runMagicBox(user, catalog) {
  const context = {
    budget: user.budget,
    roomSize: (user.roomDimensions.length * user.roomDimensions.width) / 10000,
    needs: user.needs,
  };

  const scoredByNeed = {};

  user.needs.forEach((need) => {
    const isNeeded = user.needs.includes(need);
    const ranked = isNeeded
      ? getRankedItemsForNeed(need, catalog, context)
      : [];

    //console.log(`Ranked items for need "${need}":`, ranked);
    scoredByNeed[need] = ranked;
  });

  const packages = generateValidPackages(scoredByNeed, context);
  return packages;
}
