import * as THREE from 'three';

// Helper function to create text sprite
export function createTextSprite(message) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const fontSize = 64;  // Even larger font size for more visibility

  // Set canvas size based on text width and height
  context.font = `bold ${fontSize}px Arial`;
  const textWidth = context.measureText(message).width;
  canvas.width = textWidth + 40; // Add some padding
  canvas.height = fontSize + 20; // Adjust height based on font size

  // Ensure a transparent background
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set text shadow for readability
  context.shadowColor = 'rgba(0, 0, 0, 0.5)';
  context.shadowBlur = 8;

  // Set text styling (white text)
  context.fillStyle = 'white';
  context.textAlign = 'center';  // Center-align the text horizontally
  context.textBaseline = 'middle';  // Center-align vertically

  // Draw the text on the canvas (centered)
  context.fillText(message, canvas.width / 2, canvas.height / 2);  // Center text in the canvas

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
