import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { calculateCometPosition, calculateOrbitPoints } from './kepler_orbit.js';  // Import the Kepler function
import { getCometsData } from './comets_handler.js';
import { createTextSprite } from "./texts_handler.js";


function initial_setup() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  // Orbit controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Space background
  scene.background = new THREE.Color(0x000000);

  add_lights(scene);

  return { scene, camera, renderer, controls }
}

function add_lights(scene) {
  // Lighting (same as before)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 1.2);
  pointLight.position.set(3, 0, 5);
  scene.add(pointLight);
}

function add_earth(scene) {
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
  return earth
}

function create_comet(c, scene) {
  const cometGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const cometMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const comet = new THREE.Mesh(cometGeometry, cometMaterial);

  // Add each comet to the scene
  scene.add(comet);

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
  nameSprite.position.copy(comet.position).add(new THREE.Vector3(0, 0.2, 0)); // Adjust Y value for height

  return { comet_object: comet, timer: 0, storyIndex: 0, showStory: false, nameSprite: nameSprite, ...c };
}

async function main() {
  // Scene, Camera, Renderer
  const { scene, camera, renderer, controls } = initial_setup()

  const earth = add_earth(scene);

  let comets_data = await getCometsData();
  comets_data = comets_data.map((c) =>
    create_comet(c, scene)
  );

  // Camera positioning
  camera.position.set(5, 3, 7);
  controls.update();

  // Raycaster and mouse for click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedComet = null;
  let originalCameraPosition = new THREE.Vector3();

  // Time variable for orbit calculation
  let time = 0;

  // Handle mouse clicks
  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(comets_data.map(c => c.comet_object));

    if (intersects.length > 0) {
      const clickedComet = comets_data.find(c => c.comet_object === intersects[0].object);

      if (clickedComet && !selectedComet) {
        selectedComet = clickedComet;
        originalCameraPosition.copy(camera.position);
        selectedComet.storyIndex = 0;
        selectedComet.timer = 0;
        selectedComet.showStory = true;

        // Show and update the story div
        document.getElementById('comet-story').style.display = 'block';
        document.getElementById('story-text').innerText = selectedComet.story_0;
      }
    }
  });

  function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth
    earth.rotation.y += 0.005;

    comets_data.forEach((comet) => {
      const cometPos = calculateCometPosition(comet, time);
      comet.comet_object.position.copy(cometPos);
      comet.nameSprite.position.copy(cometPos).add(new THREE.Vector3(0, 0.05, 0)); // Adjust Y value for height

      // Update the story if the comet is being followed
      if (comet === selectedComet) {
        comet.timer += 0.01;

        const textLength = selectedComet[`story_${comet.storyIndex}`]?.length || 0;
        const duration = textLength * 0.05; // Adjust multiplier as needed

        if (comet.timer >= duration) {
          comet.timer = 0;
          comet.storyIndex++;
          const storyKey = `story_${comet.storyIndex}`;
          if (comet[storyKey]) {
            document.getElementById('story-text').innerText = comet[storyKey];
          } else {
            // No more stories, stop following and hide the story div
            selectedComet = null;
            document.getElementById('comet-story').style.display = 'none';
            camera.position.copy(originalCameraPosition);
            controls.enabled = true;
          }
        }
      }
    });

    if (selectedComet) {
      const cometPos = selectedComet.comet_object.position;
      const offset = new THREE.Vector3(-0.5, 0, -0.5);
      const targetPos = cometPos.clone().add(offset);
      camera.position.lerp(targetPos, 0.1);
      camera.lookAt(cometPos);
    }

    time += 0.01;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

main();
