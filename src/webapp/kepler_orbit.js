// kepler_orbit.js
import * as THREE from 'three';

// Helper function to convert degrees to radians
function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

// Function to calculate the position of the comet in 3D space
export function calculateCometPosition(keplerParams, timeInYears) {
  const { e, i_deg, w_deg, node_deg, q_au_1, p_yr } = keplerParams;

  // Adjust time by dividing it by the orbital period, so time is scaled
  const adjustedTime = timeInYears / p_yr;

  // Semi-major axis (a) in AU (Kepler's 3rd law approximation)
  const a = q_au_1 / (1 - e);

  // Mean anomaly (M) at given time (in radians)
  const meanAnomaly = (2 * Math.PI * (adjustedTime % 1)); // time scaled to fractional orbit

  // Solve for Eccentric anomaly (E) using Kepler's Equation: M = E - e*sin(E)
  let E = meanAnomaly;
  for (let i = 0; i < 10; i++) {  // Simple iterative solver
    E = meanAnomaly + e * Math.sin(E);
  }

  // True anomaly (v), the angle from perihelion
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  // Distance (r) from the focus (in AU)
  const r = a * (1 - e * Math.cos(E));

  // Convert to Cartesian coordinates in the orbital plane
  const x_orbit = r * Math.cos(trueAnomaly);
  const y_orbit = r * Math.sin(trueAnomaly);

  // Now rotate the orbit based on inclination, argument of perihelion, and longitude of ascending node
  const inclination = degToRad(i_deg);
  const argPerihelion = degToRad(w_deg);
  const longAscNode = degToRad(node_deg);

  // Apply rotation matrices for orbital plane
  const cosNode = Math.cos(longAscNode);
  const sinNode = Math.sin(longAscNode);
  const cosIncl = Math.cos(inclination);
  const sinIncl = Math.sin(inclination);
  const cosArg = Math.cos(argPerihelion);
  const sinArg = Math.sin(argPerihelion);

  const x = (cosNode * cosArg - sinNode * sinArg * cosIncl) * x_orbit
    + (-cosNode * sinArg - sinNode * cosArg * cosIncl) * y_orbit;
  const y = (sinNode * cosArg + cosNode * sinArg * cosIncl) * x_orbit
    + (-sinNode * sinArg + cosNode * cosArg * cosIncl) * y_orbit;
  const z = sinArg * sinIncl * x_orbit + cosArg * sinIncl * y_orbit;

  return new THREE.Vector3(x, z, y);
}



// Function to generate the comet's orbit as a series of points
export function calculateOrbitPoints(keplerParams, numPoints = 5000) {
  const points = [];

  for (let i = 0; i <= numPoints; i++) {
    // Calculate the time value along the orbit (fraction of the period)
    const t = (i / numPoints) * keplerParams.p_yr;

    // Calculate the comet position at this point in time
    const position = calculateCometPosition(keplerParams, t);

    // Add the position as a THREE.Vector3 point
    points.push(position);
  }

  return points;
}

// Helper function to convert date to Julian Day (JD)
function dateToJulianDate(date) {
  const JD_UNIX_EPOCH = 2440587.5; // JD for 1970-01-01T00:00:00Z
  const msPerDay = 86400000; // Number of milliseconds in one day
  return JD_UNIX_EPOCH + date.getTime() / msPerDay;
}

// Function to calculate the position of the comet based on a date
export function calculateCometPositionByDate(keplerParams, targetDate) {
  const { e, i_deg, w_deg, node_deg, q_au_1, p_yr, epochDate } = keplerParams;

  // console.log(keplerParams, targetDate)

  // Convert the target date and epoch date to Julian dates
  const jdTarget = dateToJulianDate(new Date(targetDate));
  const jdEpoch = dateToJulianDate(new Date(epochDate));

  // Calculate time (in years) since epoch date
  const timeSinceEpoch = (jdTarget - jdEpoch) / 365.25;

  // Semi-major axis (a) in AU (Kepler's 3rd law approximation)
  const a = q_au_1 / (1 - e);

  // Mean anomaly (M) at given time (in radians)
  const meanAnomaly = (2 * Math.PI * (timeSinceEpoch % p_yr)) / p_yr;

  // Solve for Eccentric anomaly (E) using Kepler's Equation: M = E - e*sin(E)
  let E = meanAnomaly;
  for (let i = 0; i < 10; i++) {
    E = meanAnomaly + e * Math.sin(E);
  }

  // True anomaly (v), which is the angle from perihelion
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  // Distance (r) from the focus (in AU)
  const r = a * (1 - e * Math.cos(E));

  // Convert to Cartesian coordinates in the orbital plane
  const x_orbit = r * Math.cos(trueAnomaly);
  const y_orbit = r * Math.sin(trueAnomaly);
  let z_orbit = 0; // Assuming we're in 2D orbit plane for now

  // Now rotate the orbit based on inclination, argument of perihelion, and longitude of ascending node
  const inclination = degToRad(i_deg);
  const argPerihelion = degToRad(w_deg);
  const longAscNode = degToRad(node_deg);

  // Apply rotation matrices for orbital plane
  const cosNode = Math.cos(longAscNode);
  const sinNode = Math.sin(longAscNode);
  const cosIncl = Math.cos(inclination);
  const sinIncl = Math.sin(inclination);
  const cosArg = Math.cos(argPerihelion);
  const sinArg = Math.sin(argPerihelion);

  const x =
    (cosNode * cosArg - sinNode * sinArg * cosIncl) * x_orbit +
    (-cosNode * sinArg - sinNode * cosArg * cosIncl) * y_orbit;
  const y =
    (sinNode * cosArg + cosNode * sinArg * cosIncl) * x_orbit +
    (-sinNode * sinArg + cosNode * cosArg * cosIncl) * y_orbit;
  z_orbit = sinArg * sinIncl * x_orbit + cosArg * sinIncl * y_orbit;

  return new THREE.Vector3(x, z_orbit, y);
}