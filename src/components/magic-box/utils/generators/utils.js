// utils/generators/utils.js
export function getTotalPrice(items) {
  return items.reduce((sum, { item }) => sum + item.price, 0);
}

export function getTotalArea(items) {
  return items.reduce((sum, { item }) => {
    const l = item.dimensions?.length ?? 0;
    const w = item.dimensions?.width ?? 0;
    return sum + (l * w) / 10000; // cm² to m²
  }, 0);
}

export function combineNeedCombos(needCombosList) {
  return needCombosList.reduce((acc, current) => {
    const combined = [];
    acc.forEach((a) => {
      current.forEach((b) => {
        combined.push([...a, ...b]);
      });
    });
    return combined;
  });
}
