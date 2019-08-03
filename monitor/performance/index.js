console.log(window.performance)

function showNavigationDetails() {
  // Get the first entry
  const [entry] = performance.getEntriesByType("navigation");
  // Show it in a nice table in the developer console
  console.table(entry.toJSON());
}
