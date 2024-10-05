export async function getCometsData(): Promise<Object[]> {
  const response = await fetch("/comets.json");
  const comets = await response.json(); // Parse JSON
  return comets;
}
