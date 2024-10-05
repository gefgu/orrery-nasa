export async function getCometsData() {
  const response = await fetch("./comets.json");
  const comets = await response.json(); // Parse JSON
  return comets;
}
