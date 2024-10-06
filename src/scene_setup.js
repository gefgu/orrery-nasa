import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
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
  const earthNormalMap = new THREE.TextureLoader().load('./2k_earth_normal_map');
  const earthGeometry = new THREE.SphereGeometry(0.35, 256, 256);
  const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
    normalMap: earthNormalMap,
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);
  return earth
}


export { add_earth, add_lights, initial_setup }