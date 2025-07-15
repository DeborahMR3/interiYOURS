// src/components/magic-box/utils/placeAlongWall.js
import { tryPlace } from "./spatialPlanner.js";
import { WALLS, SLIDE_STEP } from "./spatialPlannerConfig.js";

/**
 * Try to place `item` along the specified wall.
 * If it fits, returns the placement object (and records the buffer),
 * else returns null.
 */
export function placeAlongWall(item, roomDims, wallIndex, rotation, occupied) {
  const wall = WALLS[wallIndex];
  const dim = item.dimensions;
  // half size along wall-normal and wall-tangent
  const halfNormal = (wall.axis === "x" ? dim.width : dim.length) / 2;
  const halfTangent = (wall.axis === "x" ? dim.length : dim.width) / 2;

  // compute coordinate perpendicular to wall using correct roomDims
  const axisDim = wall.axis === "x" ? roomDims.width : roomDims.length;
  const coordNormal = wall.sign > 0 ? axisDim - halfNormal : halfNormal;

  // build tangent candidates along wall
  const tangentKey = wall.axis === "x" ? "length" : "width";
  const centerTangent = roomDims[tangentKey] / 2;
  const maxShift = centerTangent - halfTangent;
  const cands = [centerTangent];
  for (let d = SLIDE_STEP; d <= maxShift; d += SLIDE_STEP) {
    cands.push(centerTangent + d, centerTangent - d);
  }

  // try each candidate along tangent
  for (const t of cands) {
    const x = wall.axis === "x" ? coordNormal : t;
    const y = wall.axis === "y" ? coordNormal : t;
    const placement = tryPlace(item, x, y, rotation, occupied);
    if (placement) {
      return placement;
    }
  }
  return null;
}
