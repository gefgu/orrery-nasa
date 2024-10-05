import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculateCometPosition, calculateOrbitPoints } from './kepler_orbit.js';  // Import the Kepler function
import { getCometsData } from './comets_handler.js';
import { createTextSprite } from "./texts_handler.js";

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

    return { comet_object: comet, story_sprite: storyText, timer: 0, storyIndex: 0, showStory: false, ...c };
  });

  // Camera positioning
  camera.position.set(5, 3, 7);
  controls.update();

  // Raycaster and mouse for click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedComet = null;
  let originalCameraPosition = new THREE.Vector3();  // Store the initial camera position

  // Time variable for orbit calculation
  let time = 0;

  // Handle mouse clicks
  window.addEventListener('click', (event) => {
    // selectedComet = null;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Find intersections with comets
    const intersects = raycaster.intersectObjects(comets_data.map(c => c.comet_object));

    if (intersects.length > 0) {
      // Get the clicked comet
      const clickedComet = comets_data.find(c => c.comet_object === intersects[0].object);

      // If a comet is clicked, start following it
      if (clickedComet && !selectedComet) {
        selectedComet = clickedComet;
        originalCameraPosition.copy(camera.position);  // Store current camera position
        selectedComet.storyIndex = 0;  // Start with the first story
        selectedComet.timer = 0;  // Reset the timer
        selectedComet.showStory = true;
        selectedComet.story_sprite.visible = true;  // Show the story
      }
    }
  });

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

      // Update the story if the comet is being followed
      if (comet === selectedComet) {
        comet.timer += 0.01;
        if (comet.timer >= 2) {  // Change story every 2 seconds
          comet.timer = 0;
          comet.storyIndex++;
          const storyKey = `story_${comet.storyIndex}`;
          if (comet[storyKey]) {
            comet.story_sprite.visible = true;
            comet.story_sprite.text = comet[storyKey];
          } else {
            // If no more stories, stop following the comet and zoom out
            selectedComet = null;
            comet.story_sprite.visible = false;
            camera.position.copy(originalCameraPosition);  // Reset camera position
            controls.enabled = true;  // Re-enable orbit controls
          }
        }
      }
    });

    // Smoothly follow the selected comet
    if (selectedComet) {
      // Disable orbit controls while following the comet
      controls.enabled = false;
      // Get the position of the comet
      const cometPos = selectedComet.comet_object.position;
      console.log("here", cometPos);

      // Calculate a target position for the camera
      // Move the camera to a position slightly above and in front of the comet
      const offset = new THREE.Vector3(-3, 0, -5);  // Adjusted offset values (x: to the side, y: above, z: in front)
      const targetPos = cometPos.clone().add(offset);  // Move the camera in relation to the comet

      // Smoothly interpolate the camera position to this target position
      camera.position.lerp(targetPos, 0.05);

      // Make sure the camera looks at the comet's position using quaternion for better control
      const direction = new THREE.Vector3().subVectors(cometPos, camera.position).normalize();
      camera.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),  // Default forward direction of the camera
        direction                      // The direction towards the comet
      );

      // Disable orbit controls while following the comet
      controls.enabled = false;
    }

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
