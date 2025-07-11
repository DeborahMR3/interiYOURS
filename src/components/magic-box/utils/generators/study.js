// utils/generators/study.js
export function generateStudyCombos(studyItems) {
  const desks = studyItems.filter((i) => i.item.category === "desk");
  const chairs = studyItems.filter((i) => i.item.category === "desk-chair");
  const combos = [];
  desks.forEach((desk) => {
    chairs.forEach((chair) => combos.push([desk, chair]));
  });
  return combos;
}
