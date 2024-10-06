

export function setup_slider() {
  // Grabbing elements
  const speedSlider = document.getElementById("speed-slider");
  const speedDisplay = document.getElementById("speed-display");
  function handle_input() {
    const speed = parseInt(speedSlider.value);
    let displayText = "";

    if (speed === 0) {
      displayText = "Paused (0 days/s)";
    } else if (speed > 0) {
      displayText = `${speed} days/s`;
    } else {
      displayText = `-${Math.abs(speed)} days/sec`;
    }

    // Updating the text dynamically
    speedDisplay.textContent = displayText;
  }

  handle_input();

  // Update the speed display based on the slider value
  speedSlider.addEventListener("input", handle_input);
}

