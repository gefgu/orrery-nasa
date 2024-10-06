import * as THREE from 'three';
import { setup_slider } from "./slider_controller.js";
import { add_earth, initial_setup } from "./scene_setup.js";
import { update_comet_pos, getComets } from "./comets_handler.js";
import { handle_toggles } from './buttons_controller.js';
import { exitStoryMode, handleCometClick, handleStory } from './story_handler.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';


function formatDate(daysElapsed) {
  const startDate = new Date("2024-10-06");  // Set simulation start date
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + daysElapsed); // Add elapsed days to the start date
  return currentDate.toDateString();
}

async function main() {
  // Scene, Camera, Renderer
  const { scene, camera, renderer, controls } = initial_setup();
  const earth = add_earth(scene);
  let comets = await getComets(scene);

  // Post-processing Setup
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Bloom Effect
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
  composer.addPass(bloomPass);

  // Vignette Effect
  const vignettePass = new ShaderPass(VignetteShader);
  vignettePass.uniforms['offset'].value = 1.0;
  vignettePass.uniforms['darkness'].value = 1.5;
  composer.addPass(vignettePass);

  // // Camera Tween Transition Example
  // function moveCamera(newX, newY, newZ) {
  //   new TWEEN.Tween(camera.position)
  //     .to({ x: newX, y: newY, z: newZ }, 2000)
  //     .easing(TWEEN.Easing.Cubic.InOut)
  //     .onUpdate(() => camera.lookAt(scene.position))
  //     .start();
  // }



  // Handle mouse clicks
  window.addEventListener('click', (event) => handleCometClick(event, camera, comets));
  // Attach the Exit Story button click event
  document.getElementById('exit-story').addEventListener('click', () =>
    exitStoryMode(camera)
  );
  handle_toggles(comets);

  // Time variables
  let time = 0;
  let lastTime = performance.now();

  // Elements to display date and speed
  const dateDisplay = document.getElementById('date-display');
  const speedDisplay = document.getElementById('speed-display');
  let speedFactor = 1;  // Initial speed value (1 days/sec)

  // Handle slider changes
  const speedSlider = document.getElementById('speed-slider');
  speedSlider.addEventListener('input', (event) => {
    speedFactor = parseInt(event.target.value, 10);  // Get the speed factor from slider
    speedDisplay.textContent = speedFactor === 0 ? "Paused" : `${speedFactor} days/sec`;
  });

  function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000;  // Time since last frame in seconds
    lastTime = currentTime;

    // Update the time based on speed factor (days/sec)
    time += speedFactor * deltaTime;

    // Update the date display
    const daysElapsed = time;
    dateDisplay.textContent = formatDate(Math.floor(daysElapsed));

    // Rotate Earth
    earth.rotation.y += 0.005 * speedFactor;

    // Update comet positions and handle the story for each comet
    comets.forEach((comet) => {
      update_comet_pos(comet, time);  // This uses the new calculateCometPosition function
      handleStory(comet, camera);
    });

    controls.update();
    // TWEEN.update(); // Update tweens
    composer.render();
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
