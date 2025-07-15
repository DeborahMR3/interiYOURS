// src/components/magic-box/utils/spatialPlannerConfig.js

export const MIN_CLEARANCE = 20; // cm
export const TABLE_CLEARANCE_FRONT = 40; // cm
export const TABLE_CLEARANCE_SIDE = 5; // cm
export const SLIDE_STEP = 5; // cm

export const WALLS = [
  { name: "north", normal: [0, -1], axis: "y", sign: +1 },
  { name: "east", normal: [-1, 0], axis: "x", sign: +1 },
  { name: "south", normal: [0, +1], axis: "y", sign: -1 },
  { name: "west", normal: [+1, 0], axis: "x", sign: -1 },
];
