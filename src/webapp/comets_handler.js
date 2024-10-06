import * as THREE from 'three';
import { calculateOrbitPoints, calculateCometPosition, calculateCometPositionByDate } from './kepler_orbit.js';  // Import the Kepler function
import { createTextSprite } from "./texts_handler.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

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

  return new Promise((resolve, reject) => {
    // Load the 3D model
    loader.load(
      './halley.obj', // Path to your OBJ file
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = grayMaterial; // Apply gray material to the mesh
            child.material.needsUpdate = true; // Ensure the material is updated
          }
        });
        object.scale.set(0.025, 0.025, 0.025); // Adjust the scale factors as needed (2 is just an example)

        // Position the comet in the scene
        // object.position.set(10, 0, 0); // You may want to adjust this based on your needs
        scene.add(object);

        // Create the comet's orbit line using calculated points
        const orbitPoints = calculateOrbitPoints(c);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);

        // Create a text sprite for the comet's object name
        const nameSprite = createTextSprite(c.object_name); // Assume this function creates a text sprite
        scene.add(nameSprite);
        // Position the text above the comet
        nameSprite.position.copy(object.position).add(new THREE.Vector3(0, 0.2, 0)); // Adjust Y value for height

        // Resolve the promise with comet data
        resolve({ comet_object: object, nameSprite: nameSprite, orbitLine: orbitLine, ...c });
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
  comet.nameSprite.position.copy(cometPos).add(new THREE.Vector3(0, 0.05, 0));  // Adjust height for label
}





export { update_comet_pos, create_comet, getComets }