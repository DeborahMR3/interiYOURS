// src/components/magic-box/utils/spatialPlanner.js

console.log("🐛 Loaded spatialPlanner.js v2");

/**
 * Spatial Planner Module (Backtracking)
 * Places furniture items flush against walls, sliding them along walls if needed,
 * enforces clearance rules, and handles exhaustive side-table placement.
 */

import { placeAlongWall } from "./placeAlongWall.js";
import {
  MIN_CLEARANCE,
  TABLE_CLEARANCE_FRONT,
  TABLE_CLEARANCE_SIDE,
  WALLS,
} from "./spatialPlannerConfig.js";

/**
 * Inflate an item's footprint by adding MIN_CLEARANCE around it.
 * Two inflated footprints ensure at least MIN_CLEARANCE clearance between original items.
 */
function inflate(dim) {
  return {
    width: dim.width + MIN_CLEARANCE,
    length: dim.length + MIN_CLEARANCE,
  };
}

/**
 * Check if two axis-aligned rectangles overlap.
 * @param {Object} a - { x, y, width, length }
 * @param {Object} b - same shape
 */
function overlaps(a, b) {
  return !(
    a.x + a.width / 2 <= b.x - b.width / 2 ||
    b.x + b.width / 2 <= a.x - a.width / 2 ||
    a.y + a.length / 2 <= b.y - b.length / 2 ||
    b.y + b.length / 2 <= a.y - a.length / 2
  );
}

/**
 * Try to place an item at (x,y) with rotation, respecting occupied spaces.
 * @param {Object} item - raw catalog item with dimensions, id, modelRef
 * @param {number} x     - center x
 * @param {number} y     - center y
 * @param {number} rotation - degrees
 * @param {Array} occupied - array of inflated rects
 * @returns {Object|false} placement or false
 */
export function tryPlace(item, x, y, rotation, occupied) {
  const inflated = inflate(item.dimensions);
  const rect = { x, y, width: inflated.width, length: inflated.length };
  for (const occ of occupied) {
    if (overlaps(occ, rect)) return false;
  }
  occupied.push(rect);
  // Return both position and original dims:
  return {
    id: item.id,
    x,
    y,
    rotation,
    modelRef: item.modelRef,
    width: item.dimensions.width,
    length: item.dimensions.length,
  };
}

/**
 * Main entry: place all furniture items according to rules via backtracking.
 * @param {Array} items    - Array of raw catalog items
 * @param {Object} roomDims - { width, length } in cm
 * @returns {Array|null} placements or null
 */
export function placePackage(items, roomDims) {
  const desk = items.find((i) => i.category === "desk");
  const chair = items.find((i) => i.category === "desk-chair");
  const seat = items.find((i) => ["sofa", "lounge-chair"].includes(i.category));
  const table = items.find((i) => i.category === "side-table");
  const bed = items.find((i) => i.category === "bed");

  // initial state
  const initial = { placements: [], occupied: [] };

  // --- Desk + Chair states ---
  const deskStates = [];
  if (desk && chair) {
    for (let w = 0; w < WALLS.length; w++) {
      const rotD = (180 + w * 90) % 360;
      const occ1 = [...initial.occupied];
      const rec1 = [];
      console.log(
        `🏷️ Trying DESK on wall ${WALLS[w].name} (index ${w}) at rot ${rotD}`
      );
      const pD = placeAlongWall(desk, roomDims, w, rotD, occ1);
      console.log(`→ placeAlongWall returned`, pD);
      if (!pD) continue;
      rec1.push(pD);
      // place chair flush in front
      const shift = (desk.dimensions.length + chair.dimensions.length) / 2;
      const wall = WALLS[w];
      const cx = pD.x + wall.normal[0] * shift;
      const cy = pD.y + wall.normal[1] * shift;
      const pC = tryPlace(chair, cx, cy, rotD, occ1);
      if (!pC) continue;
      rec1.push(pC);
      deskStates.push({ placements: rec1, occupied: occ1, deskWall: w });
    }
  } else {
    deskStates.push({ ...initial, deskWall: null });
  }
  if (deskStates.length === 0) {
    console.log("❌ No desk+chair state — perhaps no desk or chair fits?");
    return null;
  }

  // --- Sofa/Lounge + Table + Bed backtracking ---
  for (const ds of deskStates) {
    const { placements: pDs, occupied: occD, deskWall } = ds;

    // Sofa/Lounge states
    const seatStates = [];
    if (seat) {
      for (let w = 0; w < WALLS.length; w++) {
        if (w === deskWall) continue;
        const rotS = (270 + w * 90) % 360;
        const occ2 = [...occD];
        const rec2 = [...pDs];
        console.log(`🏷️ Trying SEAT on wall ${WALLS[w].name} at rot ${rotS}`);
        const pS = placeAlongWall(seat, roomDims, w, rotS, occ2);
        console.log(`→ placeAlongWall returned`, pS);
        if (!pS) continue;
        rec2.push(pS);
        seatStates.push({
          placements: rec2,
          occupied: occ2,
          seatWall: w,
          seatPlac: pS,
        });
      }
    } else {
      seatStates.push({
        placements: [...pDs],
        occupied: [...occD],
        seatWall: null,
      });
    }
    if (seatStates.length === 0) {
      console.log("❌ No seat state for deskWall", deskWall);
      continue;
    }

    // Side-table states
    for (const ss of seatStates) {
      const { placements: pSs, occupied: occS, seatWall, seatPlac } = ss;
      const tableStates = [];
      if (table && seatWall !== null) {
        const wobj = WALLS[seatWall];
        const base = { placements: pSs, occupied: occS };
        // front
        const tf = attemptTablePlacement(base, table, seatPlac, wobj, "front");
        if (tf) tableStates.push(tf);
        // side+ and side-
        const ts1 = attemptTablePlacement(base, table, seatPlac, wobj, "side+");
        if (ts1) tableStates.push(ts1);
        const ts2 = attemptTablePlacement(base, table, seatPlac, wobj, "side-");
        if (ts2) tableStates.push(ts2);
      } else {
        tableStates.push({ placements: [...pSs], occupied: [...occS] });
      }
      if (table && tableStates.length === 0) {
        console.log(
          "❌ Failed all side‑table placements for seatWall",
          seatWall
        );
        continue;
      }

      // Bed placement
      for (const ts of tableStates) {
        const { placements: pTs, occupied: occT } = ts;
        if (!bed) return pTs;
        const origDim = { ...bed.dimensions };
        for (const rotB of [0, 90]) {
          bed.dimensions =
            rotB === 90
              ? { width: origDim.length, length: origDim.width }
              : origDim;
          for (let w = 0; w < WALLS.length; w++) {
            if ([deskWall, ss.seatWall].includes(w)) continue;
            const occ3 = [...occT];
            const rec3 = [...pTs];
            console.log(
              `🏷️ Trying BED on wall ${WALLS[w].name}, rot ${rotB}, dims`,
              bed.dimensions
            );
            const pB = placeAlongWall(bed, roomDims, w, rotB, occ3);
            console.log(`→ placeAlongWall returned`, pB);
            if (!pB) continue;
            rec3.push(pB);
            bed.dimensions = origDim;
            return rec3;
          }
        }
        bed.dimensions = origDim;
      }
    }
  }
  console.log("❌ Exhausted all bed placements");

  return null;
}

/**
 * Helper to generate a side-table placement given mode ('front', 'side+', 'side-').
 */
function attemptTablePlacement(state, table, seatPlac, wall, mode) {
  const pList = [...state.placements];
  const occList = [...state.occupied];
  const baseRot = (270 + WALLS.indexOf(wall) * 90) % 360;
  let tx, ty;
  if (mode === "front") {
    tx =
      seatPlac.x +
      wall.normal[0] *
        (seatPlac.length / 2 +
          TABLE_CLEARANCE_FRONT +
          table.dimensions.width / 2);
    ty =
      seatPlac.y +
      wall.normal[1] *
        (seatPlac.width / 2 +
          TABLE_CLEARANCE_FRONT +
          table.dimensions.length / 2);
  } else {
    const tangent = [-wall.normal[1], wall.normal[0]];
    const sign = mode === "side+" ? 1 : -1;
    tx =
      seatPlac.x +
      tangent[0] *
        (seatPlac.length / 2 +
          TABLE_CLEARANCE_SIDE +
          table.dimensions.length / 2) *
        sign;
    ty =
      seatPlac.y +
      tangent[1] *
        (seatPlac.width / 2 +
          TABLE_CLEARANCE_SIDE +
          table.dimensions.width / 2) *
        sign;
  }
  const pt = tryPlace(table, tx, ty, baseRot, occList);
  if (!pt) return null;
  pList.push(pt);
  return { placements: pList, occupied: occList };
}
