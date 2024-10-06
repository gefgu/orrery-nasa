import * as THREE from 'three';
import { setup_slider } from "./slider_controller.js"
import { add_earth, initial_setup } from "./scene_setup.js"
import { create_comet, update_comet_pos, getComets } from "./comets_handler.js"
import { handle_toggles } from './buttons_controller.js';


async function main() {
  // Scene, Camera, Renderer
  const { scene, camera, renderer, controls } = initial_setup()

  const earth = add_earth(scene);

  let comets = await getComets(scene);

  // Camera positioning
  camera.position.set(3, 2, 1);
  controls.update();

  // Raycaster and mouse for click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedComet = null;
  let originalCameraPosition = new THREE.Vector3();

  // Handle mouse clicks
  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(comets.map(c => c.comet_object), true);
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      // Check if the clicked object is a child of the comet object
      const clickedComet = comets.find(c => {
        // Check if the clicked object is among the children of the comet object
        return c.comet_object.children.some(child => child.uuid === clickedObject.uuid);
      });

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

  handle_toggles(comets);


  // Time variable for orbit calculation
  let time = 0;
  let lastTime = performance.now();
  let speedFactor = 10;  // Initial speed value (10 days/sec)

  // Handle slider changes
  const speedSlider = document.getElementById('speed-slider');

  speedSlider.addEventListener('input', (event) => {
    speedFactor = parseInt(event.target.value, 10);  // Get the speed factor from 
  });

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 10000;  // Time since last frame in seconds
    lastTime = currentTime;

    // Update the time based on speed factor (days/sec)
    time += speedFactor * deltaTime;  // Adjusting time progression

    // Rotate Earth
    earth.rotation.y += 0.005;

    comets.forEach((comet) => {
      update_comet_pos(comet, time);
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
      const offset = new THREE.Vector3(-0.5, 0, -0.75);
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

setup_slider();

main();
