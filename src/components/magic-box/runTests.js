// runTests.js
import { furnitureCatalog } from "./data/furnitureCatalog.js";
import { testUsers } from "./test/testUsers.js";
import { runMagicBox } from "./runMagicBox.js";

// Utility to display packages cleanly
function printPackages(userName, packages) {
  console.log(`\n🧠 Packages for ${userName}:`);
  packages.forEach((pkg, index) => {
    console.log(`\nPackage ${index + 1}:`);
    pkg.items.forEach(({ item }) => {
      console.log(`- ${item.name} [${item.category}] - £${item.price}`);
    });
    console.log(`Total Price: £${pkg.price}`);
    console.log(`Estimated Area: ${pkg.area?.toFixed(2)} m²`);
  });
}

// Loop through test users and run the magic box for each
testUsers.forEach((user) => {
  const packages = runMagicBox(user, furnitureCatalog);
  if (packages.length === 0) {
    console.log(`⚠️ No valid packages generated for ${user.name}\n`);
  }

  printPackages(user.name, packages);
});
console.log("Catalog length:", furnitureCatalog.length);
