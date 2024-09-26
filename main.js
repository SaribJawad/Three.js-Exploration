import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 9);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// helper for light

//! const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
//! scene.add(lightHelper);

let textureLoader = new THREE.TextureLoader();
let color = textureLoader.load("./texture/color.jpg");
let roughness = textureLoader.load("./texture/roughness.jpg");
let normal = textureLoader.load("./texture/normalOpenGl.png");
let height = textureLoader.load("./texture/height.png");

const geometry = new THREE.BoxGeometry(3, 1.5, 2);
const material = new THREE.MeshStandardMaterial({
  map: color,
  roughnessMap: roughness,
  normalMap: normal,
});
// const material = new THREE.MeshStandardMaterial({
//   color: "grey",
// });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

const canvas = document.querySelector("#box");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  // for preventing squeezing of the model & whenever update the anything related to camera update the projection matrix
  camera.updateProjectionMatrix();
});

// Add HDRI lighting
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/zwartkops_start_morning_1k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  }
);

// Loading 3d Model
const loader = new GLTFLoader();

loader.load("./old_computer.glb", function (gltf) {
  gltf.scene.position.y = -1;
  scene.add(gltf.scene);
});

// orbit controls gives us the power to control model with mouse
const controls = new OrbitControls(camera, renderer.domElement);
//  allows smooth movement on orbit controlls
controls.enableDamping = true;
controls.autoRotate = true;

function animate() {
  window.requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();
