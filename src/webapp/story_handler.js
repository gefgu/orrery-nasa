import * as THREE from 'three'; // Import THREE.js

let selectedComet = null;
let originalCameraPosition = new THREE.Vector3();

export function handleCometClick(event, camera, comets) {
  // Raycaster and mouse for click detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

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
}

// A function to access the selected comet
export function getSelectedComet() {
  return selectedComet;
}

export function handleStory(comet, camera) {
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

    const cometPos = selectedComet.comet_object.position;
    const offset = new THREE.Vector3(-0.5, 0, -0.75);
    const targetPos = cometPos.clone().add(offset);
    camera.position.lerp(targetPos, 0.1);
    camera.lookAt(cometPos);
  }
}