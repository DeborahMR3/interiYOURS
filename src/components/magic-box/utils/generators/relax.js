// utils/generators/relax.js
export function generateRelaxCombos(relaxItems) {
  const sofas = relaxItems.filter((i) => i.item.category === "sofa");
  const loungeChairs = relaxItems.filter(
    (i) => i.item.category === "lounge-chair"
  );
  const sideTables = relaxItems.filter((i) => i.item.category === "side-table");

  const combos = [];
  // Single sofa
  sofas.forEach((sofa) => combos.push([sofa]));
  // Lounge chair + side table
  loungeChairs.forEach((chair) => {
    sideTables.forEach((table) => combos.push([chair, table]));
  });
  // Sofa + side table
  sofas.forEach((sofa) => {
    sideTables.forEach((table) => combos.push([sofa, table]));
  });
  return combos;
}
