import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculateCometPosition, calculateOrbitPoints } from './kepler_orbit.js';  // Import the Kepler function
import { getCometsData } from './comets_handler.js';
import { createTextSprite } from "./texts_handler.js"

async function main() {
  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Space background
  // const spaceTexture = new THREE.TextureLoader().load('./starmap_2020_4k_print');
  scene.background = new THREE.Color(0x000000);  // Black color;

  // Earth setup (same as before)
  const earthTexture = new THREE.TextureLoader().load('./8081_earthmap2k.jpg');
  const earthNormalMap = new THREE.TextureLoader().load('https://threejs.org/examples/textures/earth_normal_2048.jpg');
  const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormalMap,
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);


  // Lighting (same as before)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Point light for Earth
  const pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.set(3, 0, 5);
  scene.add(pointLight);

  let comets_data = await getCometsData();
  comets_data = comets_data.map((c) => {
    const cometGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const cometMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const comet = new THREE.Mesh(cometGeometry, cometMaterial);

    // Add each comet to the scene
    scene.add(comet);

    // Create the comet's orbit line using calculated points
    const orbitPoints = calculateOrbitPoints(c, 200);  // 200 points for a smooth orbit
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });  // Green line
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // Create sprite for story_0
    const storyText = createTextSprite(c.story_0);
    scene.add(storyText);
    storyText.visible = false; // Start invisible

    return { "comet_object": comet, story_sprite: storyText, timer: 0, showStory: false, ...c };
  });


  // Camera positioning
  camera.position.set(5, 3, 7);
  controls.update();

  // Time variable for orbit calculation
  let time = 0;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth
    earth.rotation.y += 0.005;
    // Update comet positions
    comets_data.forEach((comet) => {
      const cometPos = calculateCometPosition(comet, time);
      comet.comet_object.position.copy(cometPos);
      comet.story_sprite.position.copy(cometPos.clone().add(new THREE.Vector3(0, 0.2, 0))); // Position the story above the comet

      // Story timer logic: show for 2s every 5s
      comet.timer += 0.01;
      if (comet.timer >= 1) {
        comet.timer = 0; // Reset timer after 5 seconds
        comet.showStory = !comet.showStory; // Toggle story visibility
      }
      comet.story_sprite.visible = comet.showStory && comet.timer < 2; // Show for the first 2 seconds
    });
    // Increment time
    time += 0.01;

    // Render scene
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

}

main();