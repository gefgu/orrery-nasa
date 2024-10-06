import * as THREE from 'three';
import { calculateOrbitPoints, calculateCometPosition, calculateCometPositionByDate } from './kepler_orbit.js';  // Import the Kepler function
import { createTextSprite } from "./texts_handler.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const name_sprite_distance = 0.001;

async function getComets(scene) {
  const response = await fetch("./comets.json");
  let comets = await response.json(); // Parse JSON
  comets = await Promise.all(comets.map((c) =>
    create_comet(c, scene)
  ));
  return comets;
}

// Modify the create_comet function to return a Promise
function create_comet(c, scene) {
  const loader = new OBJLoader();
  const grayMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Define gray material

  // Generate a random number between 0 and 10
  const random_number = Math.floor(Math.random() * 3); // Generates a number between 0 and 10
  console.log(`./comet${random_number}.obj`);

  return new Promise((resolve, reject) => {
    // Load the 3D model
    loader.load(
      `./comet${random_number}.obj`, // Path to your OBJ file
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = grayMaterial; // Apply gray material to the mesh
            child.material.needsUpdate = true; // Ensure the material is updated
          }
        });
        object.scale.set(0.005, 0.005, 0.005); // Adjust the scale factors as needed (2 is just an example)

        // Position the comet in the scene
        // object.position.set(10, 0, 0); // You may want to adjust this based on your needs
        scene.add(object);

        // Create the comet's orbit line using calculated points
        const orbitPoints = calculateOrbitPoints(c);

        // Create geometry from the calculated orbit points
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);

        // Holographic material using LineDashedMaterial
        const orbitMaterial = new THREE.LineDashedMaterial({
          color: 0x00ff00,       // Green holographic color
          linewidth: 1,          // Line thickness
          dashSize: 3,           // Length of the dash
          gapSize: 0.1,          // Length of the gap between dashes
          opacity: 0.6,          // Slightly transparent
          transparent: true,     // Make the line transparent
          emissive: 0x00ff00,    // Add a glow-like effect
          emissiveIntensity: 1,  // Make the glow brighter
        });

        // Create the line object using geometry and material
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);

        // Add glow effect by creating an outer line with slightly bigger thickness
        const outerGlowMaterial = new THREE.LineBasicMaterial({
          color: 0x00ff00,
          opacity: 0.3,          // More transparent to act like glow
          transparent: true,
          linewidth: 3,          // Thicker to create the glow effect
        });

        // Create a glow line
        const glowLine = new THREE.Line(orbitGeometry, outerGlowMaterial);

        // Add both the orbit line and the glow line to the scene
        scene.add(glowLine);
        scene.add(orbitLine);

        // To enable dashes on the orbit line, call this function after adding to the scene
        orbitLine.computeLineDistances();

        // Create a text sprite for the comet's object name
        const nameSprite = createTextSprite(c.object_name); // Assume this function creates a text sprite
        scene.add(nameSprite);
        // Position the text above the comet
        nameSprite.position.copy(object.position).add(new THREE.Vector3(0, 0.001, 0)); // Adjust Y value for height
        const date = new Date("2024-10-06")
        const cometPos = calculateCometPositionByDate(c, date.toDateString());
        // Update the comet's 3D object and label position
        object.position.copy(cometPos);
        nameSprite.position.copy(cometPos).add(new THREE.Vector3(0, name_sprite_distance, 0));  // Adjust height for label


        // Resolve the promise with comet data
        resolve({ comet_object: object, nameSprite: nameSprite, orbitLine: orbitLine, glowLine: glowLine, ...c });
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the OBJ model:', error);
        reject(error); // Reject the promise on error
      }
    );
  });
}

function update_comet_pos(comet, time) {
  // Convert simulation time (days) to years
  const timeInYears = time / 365.25;

  // Calculate comet position with respect to its orbital period
  const cometPos = calculateCometPosition(comet, timeInYears);

  // Update the comet's 3D object and label position
  comet.comet_object.position.copy(cometPos);
  comet.nameSprite.position.copy(cometPos).add(new THREE.Vector3(0, name_sprite_distance, 0));  // Adjust height for label
}





export { update_comet_pos, create_comet, getComets }