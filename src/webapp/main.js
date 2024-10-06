import * as THREE from 'three';
import { setup_slider } from "./slider_controller.js"
import { add_earth, initial_setup } from "./scene_setup.js"
import { update_comet_pos, getComets } from "./comets_handler.js"
import { handle_toggles } from './buttons_controller.js';
import { handleCometClick, handleStory } from './story_handler.js';


async function main() {
  // Scene, Camera, Renderer
  const { scene, camera, renderer, controls } = initial_setup()

  const earth = add_earth(scene);

  let comets = await getComets(scene);

  // Handle mouse clicks
  window.addEventListener('click', (event) => handleCometClick(event, camera, comets));

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
      handleStory(comet, camera);
    });


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
