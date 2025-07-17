console.log("🤛 Loaded spatialPlanner.js v3 (refactored)");

/**
 * Spatial Planner Module (Backtracking)
 * Places furniture items flush against walls, sliding them along walls if needed,
 * supports corner‑hug for sofas/chairs, enforces clearance rules,
 * and handles exhaustive side‑table placement with fallback.
 */

import { placeAlongWall } from "./placeAlongWall.js";
import {
  MIN_CLEARANCE,
  TABLE_CLEARANCE_FRONT,
  TABLE_CLEARANCE_SIDE,
  WALLS,
} from "./spatialPlannerConfig.js";

function inflate(dim) {
  return {
    width: dim.width + MIN_CLEARANCE,
    length: dim.length + MIN_CLEARANCE,
  };
}

function overlaps(a, b) {
  return !(
    a.x + a.width / 2 <= b.x - b.width / 2 ||
    b.x + b.width / 2 <= a.x - a.width / 2 ||
    a.y + a.length / 2 <= b.y - b.length / 2 ||
    b.y + b.length / 2 <= a.y - a.length / 2
  );
}

export function tryPlace(item, x, y, rotation, occupied) {
  const inflated = inflate(item.dimensions);
  const rect = { x, y, width: inflated.width, length: inflated.length };
  for (const occ of occupied) {
    if (overlaps(occ, rect)) return false;
  }
  occupied.push(rect);
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

export function placePackage(items, roomDims) {
  const desk = items.find((i) => i.category === "desk");
  const chair = items.find((i) => i.category === "desk-chair");
  const seat = items.find((i) => ["sofa", "lounge-chair"].includes(i.category));
  const table = items.find((i) => i.category === "side-table");
  const bed = items.find((i) => i.category === "bed");

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
      const pD = placeAlongWall(desk, roomDims, w, rotD, occ1, {
        requireFlush: true,
      });
      console.log(`→ placeAlongWall returned`, pD);
      if (!pD) continue;
      // flip desk
      pD.rotation = (pD.rotation + 180) % 360;
      rec1.push(pD);

      // place chair in front
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

    // Sofa/Lounge placement
    const seatStates = [];
    if (seat) {
      for (let w = 0; w < WALLS.length; w++) {
        if (w === deskWall) continue;
        const rotBase = (270 + w * 90) % 360;

        // 1) CORNER HUG (sofa only)
        if (seat.category === "sofa") {
          const perp = [(w + 1) % 4, (w + 3) % 4];
          let placedCorner = false;
          for (const pw of perp) {
            const rotC =
              seat.category === "lounge-chair" ? (rotBase + 90) % 360 : rotBase;
            const wallA = WALLS[w],
              wallB = WALLS[pw];
            const halfW = seat.dimensions.width / 2;
            const halfL = seat.dimensions.length / 2;
            // corner X
            const x =
              wallA.axis === "x"
                ? wallA.sign > 0
                  ? roomDims.width - halfL
                  : halfL
                : wallB.sign > 0
                ? roomDims.width - halfL
                : halfL;
            // corner Y
            const y =
              wallA.axis === "y"
                ? wallA.sign > 0
                  ? roomDims.length - halfW
                  : halfW
                : wallB.sign > 0
                ? roomDims.length - halfW
                : halfW;

            const occ2 = [...occD];
            console.log(`🧩 Trying SOFA corner at ${wallA.name}/${wallB.name}`);
            const pC = tryPlace(seat, x, y, rotC, occ2);
            if (pC) {
              pC.rotation = rotC;
              seatStates.push({
                placements: [...pDs, pC],
                occupied: occ2,
                seatWall: w,
                seatPlac: pC,
              });
              placedCorner = true;
              break;
            }
          }
          if (placedCorner) continue;
        }

        // 2) SINGLE-WALL FALLBACK
        const occ2 = [...occD];
        const rotS =
          seat.category === "lounge-chair" ? (rotBase + 90) % 360 : rotBase;
        console.log(`🏷️ Trying SEAT on wall ${WALLS[w].name} at rot ${rotS}`);
        const pS = placeAlongWall(seat, roomDims, w, rotS, occ2, {
          requireFlush: seat.category === "lounge-chair",
          preferFlush: true,
        });
        if (!pS) continue;
        seatStates.push({
          placements: [...pDs, pS],
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

    // Side-table + Bed
    for (const ss of seatStates) {
      const { placements: pSs, occupied: occS, seatWall, seatPlac } = ss;
      const tableStates = [];
      if (table && seatWall !== null) {
        const wobj = WALLS[seatWall];
        const base = { placements: pSs, occupied: occS };
        const modes =
          seat.category === "lounge-chair"
            ? ["side+", "side-"]
            : ["front", "side+", "side-"];
        for (const mode of modes) {
          const result = attemptTablePlacement(
            base,
            table,
            seatPlac,
            wobj,
            mode,
            roomDims
          );
          if (result) tableStates.push(result);
        }
      } else {
        tableStates.push({ placements: [...pSs], occupied: [...occS] });
      }
      if (table && tableStates.length === 0) {
        console.log(
          "❌ Failed all side-table placements for seatWall",
          seatWall
        );
        continue;
      }

      // Bed placement
      for (const ts of tableStates) {
        const { placements: pTs, occupied: occT } = ts;
        if (!bed) return pTs;
        const orig = { ...bed.dimensions };
        for (const rotB of [0, 90]) {
          bed.dimensions =
            rotB === 90 ? { width: orig.length, length: orig.width } : orig;
          for (let w = 0; w < WALLS.length; w++) {
            if ([deskWall, ss.seatWall].includes(w)) continue;
            const occ3 = [...occT];
            const rec3 = [...pTs];
            console.log(`🏷️ Trying BED on wall ${WALLS[w].name}, rot ${rotB}`);
            const pB = placeAlongWall(bed, roomDims, w, rotB, occ3, {
              requireFlush: false,
            });
            if (!pB) continue;
            pB.rotation = (pB.rotation + 180) % 360;
            rec3.push(pB);
            bed.dimensions = orig;
            return rec3;
          }
        }
        bed.dimensions = orig;
      }
    }
  }

  console.log("❌ Exhausted all placements");
  return null;
}

function attemptTablePlacement(state, table, seatPlac, wall, mode, roomDims) {
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
  let pt = tryPlace(table, tx, ty, baseRot, occList);
  if (!pt) {
    pt = placeAlongWall(
      table,
      roomDims,
      WALLS.indexOf(wall),
      baseRot,
      occList,
      { requireFlush: false, preferFlush: false }
    );
  }
  if (!pt) return null;
  pList.push(pt);
  return { placements: pList, occupied: occList };
}
