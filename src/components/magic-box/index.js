// src/components/magic-box/index.js
// Entry point for the Magic Box engine

// main runner
export { runMagicBox } from "./runMagicBox.js";

// catalog data
export { furnitureCatalog } from "./data/furnitureCatalog.js";

// helpers if you need them elsewhere
export { placePackage } from "./utils/spatialPlanner.js";
export { getRankedItemsForNeed } from "./utils/getRankedItemsForNeed.js";
export { scoreItemForNeed } from "./utils/scoreItemForNeed.js";
export { generateValidPackages } from "./utils/generateValidPackages.js";
