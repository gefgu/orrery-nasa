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
    });
  });
}

export { handle_toggles };

