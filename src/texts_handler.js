import * as THREE from 'three';

// Helper function to create text sprite
export function createTextSprite(message) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 18;  // Font size

  // Set the font for text measurement
  context.font = `bold ${fontSize}px Arial`;

  // Split the message into lines where there are \n
  const lines = message.split('\n');

  // Calculate canvas size based on the widest line of text and total number of lines
  const textWidth = Math.max(...lines.map(line => context.measureText(line).width));
  canvas.width = textWidth + 40;  // Add padding
  canvas.height = fontSize * lines.length + 20;  // Adjust height based on number of lines

  // Ensure a transparent background
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set text shadow for readability
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 8;

  // Set text styling (white text)
  context.fillStyle = 'white';
  context.textAlign = 'center';  // Center-align the text horizontally
  context.textBaseline = 'middle';  // Center-align vertically

  // Draw each line of the message
  lines.forEach((line, i) => {
    context.fillText(line, canvas.width / 2, (fontSize * (i + 1)) + 10);  // Adjust line spacing
  });

  // Create texture and sprite material from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true; // Ensure the texture updates

  // Create sprite material with transparent background
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });

  // Create sprite and scale it to fit the text
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(canvas.width / 50, canvas.height / 50, 1);  // Scale based on canvas size

  return sprite;
}

