// src/components/magic-box/utils/placeAlongWall.js
import { tryPlace } from "./spatialPlanner.js";
import { WALLS, SLIDE_STEP } from "./spatialPlannerConfig.js";

/**
 * Try to place `item` along the specified wall.
 * Attempts flush placement first (item's back to the wall),
 * then tries incremental offsets inward (away from wall) if allowed.
 * Reuses unoccupied segments of the wall (for multi-item support).
 *
 * @param {Object} item - catalog item with dimensions
 * @param {Object} roomDims - { width, length } in cm
 * @param {number} wallIndex - 0 to 3, index into WALLS
 * @param {number} rotation - degrees
 * @param {Array} occupied - array of inflated rects
 * @param {Object} opts - { requireFlush: boolean, preferFlush: boolean }
 * @returns {Object|null} placement or null
 */
export function placeAlongWall(
  item,
  roomDims,
  wallIndex,
  rotation,
  occupied,
  opts = { requireFlush: false, preferFlush: false }
) {
  const wall = WALLS[wallIndex];
  const dim = item.dimensions;
  const normalSize = wall.axis === "x" ? dim.width : dim.length;
  const tangentSize = wall.axis === "x" ? dim.length : dim.width;
  const tangentKey = wall.axis === "x" ? "length" : "width";
  const axisDim = wall.axis === "x" ? roomDims.width : roomDims.length;

  const centerTangent = roomDims[tangentKey] / 2;
  const maxShift = centerTangent - tangentSize / 2;
  const tangentCands = [centerTangent];
  for (let d = SLIDE_STEP; d <= maxShift; d += SLIDE_STEP) {
    tangentCands.push(centerTangent + d, centerTangent - d);
  }

  // How far from the wall we allow (0 = flush)
  const offsetSteps = opts.requireFlush ? [0] : [0, 10, 20, 30, 40, 50, 60];

  for (const offset of offsetSteps) {
    const coordNormal =
      wall.sign > 0
        ? axisDim - normalSize / 2 - offset
        : normalSize / 2 + offset;

    for (const t of tangentCands) {
      const x = wall.axis === "x" ? coordNormal : t;
      const y = wall.axis === "y" ? coordNormal : t;
      const placement = tryPlace(item, x, y, rotation, occupied);
      if (placement) return placement;
    }

    if (opts.requireFlush) break; // Don't try non-flush offsets
    if (opts.preferFlush && offset === 0) continue; // Try flush first, then relax
  }

  return null;
}
