import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

let scene, camera, renderer, cube;
let gui;
let gui_x, gui_y, gui_z;
let axisHelper;
let axisHelper_absolute = null;
let duck = null;

const euler_angle = {
  x: 0.0,
  y: 0.0,
  z: 0.0,
  type: 'XYZ',
  reset: function(){
    this.x = 0.0; this.y = 0.0; this.z = 0.0;
    gui_x.updateDisplay();
    gui_y.updateDisplay();
    gui_z.updateDisplay();
  }
};

const axishelper_coordinate = {
  x: 3,
  y: 0,
  z: 0 
};


function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshNormalMaterial();
  //cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);

  axisHelper = new THREE.AxesHelper(2);
  scene.add(axisHelper);

  axisHelper_absolute = new THREE.AxesHelper(1);
  scene.add(axisHelper_absolute);
  axisHelper_absolute.position.x = axishelper_coordinate.x;
  axisHelper_absolute.geometry.y = axishelper_coordinate.y;
  axisHelper_absolute.geometry.z = axishelper_coordinate.z;

  const loader = new GLTFLoader();
  loader.load(
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
      duck = gltf.scene;
      scene.add(gltf.scene);
    },
    undefined,
    (error) => console.error(error)
  );

  const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
  scene.add(light);
  const directional_light = new THREE.DirectionalLight(0xFFFFFF, 1);
  scene.add(directional_light);

  const controls = new OrbitControls(camera, renderer.domElement);

  // lil-gui による GUI
  gui = new GUI();
  //euler_angle_folder = gui.addFolder('Euler Angle');
  let euler_angle_folder = gui.addFolder('Euler Angle');
  gui_x = euler_angle_folder.add(euler_angle, 'x', -180, 180).name('Rotate X');
  gui_y = euler_angle_folder.add(euler_angle, 'y', -180, 180).name('Rotate Y');
  gui_z = euler_angle_folder.add(euler_angle, 'z', -180, 180).name('Rotate Z');
  euler_angle_folder.add(euler_angle, 'type', ['XYZ', 'YZX', 'ZXY', 'XZV', 'YXZ', 'ZYX']);
  euler_angle_folder.add(euler_angle, 'reset').name('Reset');

  let axishelper_folder = gui.addFolder('Axis of World Coordinate')
  axishelper_folder.add(axishelper_coordinate, 'x', -3, 3).name('Axis X');
  axishelper_folder.add(axishelper_coordinate, 'y', -3, 3).name('Axis Y');
  axishelper_folder.add(axishelper_coordinate, 'z', -3, 3).name('Axis Z');

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const x_rad = euler_angle.x * Math.PI / 180;
  const y_rad = euler_angle.y * Math.PI / 180;
  const z_rad = euler_angle.z * Math.PI / 180;
  const r = new THREE.Euler(x_rad, y_rad, z_rad, euler_angle.type);
  //cube.rotation.copy(r);
  if (duck != null) {
    duck.rotation.copy(r);
  }
  axisHelper.rotation.copy(r);

  axisHelper_absolute.position.x = axishelper_coordinate.x;
  axisHelper_absolute.position.y = axishelper_coordinate.y;
  axisHelper_absolute.position.z = axishelper_coordinate.z;

  renderer.render(scene, camera);
}

init();
