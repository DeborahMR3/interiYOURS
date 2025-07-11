// src/components/magic-box/runMagicBox.js
import { getRankedItemsForNeed } from "./utils/getRankedItemsForNeed.js";
import { generateValidPackages } from "./utils/generateValidPackages.js";
import { furnitureCatalog } from "./data/furnitureCatalog.js";
import { placePackage } from "./utils/spatialPlanner.js";

export function runMagicBox(user) {
  // 1. Build the scoring context
  const context = {
    budget: user.budget,
    roomSize: (user.roomDimensions.length * user.roomDimensions.width) / 10000, // in m²
    needs: user.needs,
  };

  // 2. Rank items for each need
  const scoredByNeed = {};
  user.needs.forEach((need) => {
    scoredByNeed[need] = getRankedItemsForNeed(need, furnitureCatalog, context);
  });

  // 3. Generate A/B/C packages
  let packages = generateValidPackages(scoredByNeed, context);
  if (packages.length === 0) {
    console.log(`No valid packages for ${user.name}`);
  }

  // 4. Attach spatial placements
  const roomDims = {
    width: user.roomDimensions.width, // cm
    length: user.roomDimensions.length, // cm
  };

  const outputPackages = packages.map((pkg) => {
    // Prepare minimal shape for spatial planner
    const spatialItems = pkg.items.map(({ item }) => ({
      item: {
        id: item.id,
        dimensions: item.dimensions,
        category: item.category,
        modelRef: item.modelRef,
      },
    }));

    // Run placement
    const placements = placePackage(spatialItems, roomDims) || [];

    return {
      name: pkg.name,
      totalPrice: pkg.price,
      totalArea: pkg.area,
      score: pkg.score,
      items: pkg.items.map(({ item, score }) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        tier: item.tier,
        price: item.price,
        dimensions: item.dimensions,
        modelRef: item.modelRef,
        score,
      })),
      placements,
    };
  });

  // 5. Return full output
  return {
    userId: user.id,
    userName: user.name,
    room: {
      width: user.roomDimensions.width,
      length: user.roomDimensions.length,
    },
    packages: outputPackages,
  };
}
