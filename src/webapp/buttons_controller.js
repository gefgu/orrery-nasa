function handle_toggles(comets) {
  // Toggle labels
  document.getElementById('toggle-labels').addEventListener('click', () => {
    comets.forEach(comet => {
      comet.nameSprite.visible = !comet.nameSprite.visible; // Toggle visibility
    });
  });

  // Toggle trajectories
  document.getElementById('toggle-trajectories').addEventListener('click', () => {
    comets.forEach(comet => {
      comet.orbitLine.visible = !comet.orbitLine.visible; // Toggle visibility
      comet.glowLine.visible = !comet.glowLine.visible; // Toggle visibility
    });
  });

  // Toggle stories
  document.getElementById('toggle-stories').addEventListener('click', () => {
    comets.forEach(comet => {
      // Check if the comet does not have a "story_0" key
      if (!comet.hasOwnProperty('story_0')) {
        comet.comet_object.visible = !comet.comet_object.visible; // Toggle visibility
        comet.nameSprite.visible = !comet.nameSprite.visible; // Toggle visibility
        comet.orbitLine.visible = !comet.orbitLine.visible; // Toggle visibility
        comet.glowLine.visible = !comet.glowLine.visible; // Toggle visibility
      }
    });
  });

}

export { handle_toggles };

