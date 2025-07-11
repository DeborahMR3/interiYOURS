// utils/generators/sleep.js
export function generateSleepCombos(sleepItems) {
  // All items tagged for sleep fulfill the need alone
  return sleepItems.map((item) => [item]);
}
