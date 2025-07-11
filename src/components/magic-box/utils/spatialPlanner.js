// utils/spatialPlanner.js

/*
 Spatial planning module for furniture placement in a rectangular room.
 Enforces category-specific placement rules and a 40cm clearance between items.
 Exports a single function `placePackage` that returns placements for each item.
 */

const CLEARANCE = 40; // 40cm buffer around each piece

// Inflate an item's footprint by the clearance on all sides
function inflate(dim) {
  return {
    W: dim.width + 2 * CLEARANCE,
    L: dim.length + 2 * CLEARANCE,
  };
}

/** Check whether two inflated rectangles overlap */
function overlaps(a, b) {
  return !(
    a.x + a.W / 2 <= b.x - b.W / 2 ||
    b.x + b.W / 2 <= a.x - a.W / 2 ||
    a.y + a.L / 2 <= b.y - b.L / 2 ||
    b.y + b.L / 2 <= a.y - a.L / 2
  );
}

/*
 Try to place an item at (x, y) with rotation, respecting occupied inflated rectangles.
 item: { item: { dimensions: { width, length }, category, id }, ... }
 occupied: array of inflated rects { x, y, W, L }
 */
function tryPlace(item, x, y, rotation, occupied) {
  const dim = inflate(item.item.dimensions);
  const rect = { x, y, W: dim.W, L: dim.L };

  // Check collisions
  for (const occ of occupied) {
    if (overlaps(occ, rect)) {
      return false;
    }
  }

  // Place
  occupied.push(rect);
  return { id: item.item.id, x, y, rotation, modelRef: item.item.modelRef };
}

/*
 Main entry: place all furniture items according to rules.
 @param {Array} items - array of { item, score } objects
 item.item.category must be one of: 'desk', 'desk-chair', 'sofa', 'lounge-chair', 'side-table', 'bed'
 @param {Object} roomDims - { width, length } in cm
 @returns {Array|null} placements or null if placement fails
 */
export function placePackage(items, roomDims) {
  const occupied = [];
  const placements = [];

  // Helper to attempt placement and record the returned placement
  function place(item, x, y, rotation) {
    const pl = tryPlace(item, x, y, rotation, occupied);
    if (!pl) return null;
    placements.push(pl);
    return pl;
  }

  // 1. Place desk + chair
  const desk = items.find((i) => i.item.category === "desk");
  const chair = items.find((i) => i.item.category === "desk-chair");
  if (desk && chair) {
    // Place desk against north wall, centered
    const deskX = roomDims.width / 2;
    const deskY = CLEARANCE + desk.item.dimensions.length / 2;
    const deskRot = 180; // facing south
    if (!place(desk, deskX, deskY, deskRot)) return null;

    // Place chair in front of desk (south side)
    const chairY =
      deskY +
      desk.item.dimensions.length / 2 +
      CLEARANCE +
      chair.item.dimensions.length / 2;
    if (!place(chair, deskX, chairY, deskRot)) return null;
  }

  // 2. Place sofa/lounge + side-table
  const seat = items.find((i) =>
    ["sofa", "lounge-chair"].includes(i.item.category)
  );
  const table = items.find((i) => i.item.category === "side-table");
  if (seat) {
    // Place seat against east wall, centered
    const seatX = roomDims.width - CLEARANCE - seat.item.dimensions.width / 2;
    const seatY = roomDims.length / 2;
    const seatRot = 270; // facing west
    if (!place(seat, seatX, seatY, seatRot)) return null;

    // Place side-table 40cm to the right of seat
    if (table) {
      const tableX =
        seatX -
        seat.item.dimensions.width / 2 -
        CLEARANCE -
        table.item.dimensions.width / 2;
      const tableY = seatY;
      if (!place(table, tableX, tableY, seatRot)) {
        // fallback: place to the left
        const altX =
          seatX +
          seat.item.dimensions.width / 2 +
          CLEARANCE +
          table.item.dimensions.width / 2;
        if (!place(table, altX, tableY, seatRot)) return null;
      }
    }
  }

  // 3. Place bed
  const bed = items.find((i) => i.item.category === "bed");
  if (bed) {
    // Place bed against south wall, centered
    const bedX = roomDims.width / 2;
    const bedY = roomDims.length - CLEARANCE - bed.item.dimensions.length / 2;
    const bedRot = 0; // facing north
    if (!place(bed, bedX, bedY, bedRot)) return null;
  }

  // Successful placement
  return placements;
}
