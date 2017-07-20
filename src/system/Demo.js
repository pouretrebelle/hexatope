import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

class Demo {
  constructor(system) {
    this.system = system;
    this.canvas = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
  }

  setup(canvas, UIStore) {
    this.canvas = canvas;


    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // camera
    // (fov, aspect, near, far)
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = window.innerHeight * 0.13;

    // controls
    this.controls = new OrbitControls(this.camera, this.canvas);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });

    this.updateDimensions(UIStore);

    // lights
    const light1 = new THREE.PointLight(0xffffff, 1);
    light1.position.set(100, 0, 0);
    this.scene.add(light1);
    const light2 = new THREE.PointLight(0xffffff, 1);
    light2.position.set(-100, 0, 0);
    this.scene.add(light2);
    const light3 = new THREE.PointLight(0xffffff, 0.5);
    light3.position.set(0, -20, 50);
    this.scene.add(light3);
    const ambLight = new THREE.AmbientLight(0xaaaaaa);
    this.scene.add(ambLight);

    // initialise geometry
    this.setupGeometry();

    // initialise render loop
    this.render();
  }

  updateDimensions({ windowWidth, windowHeight }) {
    this.renderer.setSize(windowWidth / 2, windowHeight);
  }

  updateCurves() {
    // console.log('update curves');
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }

  setupGeometry() {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-5, 15, 0),
      new THREE.Vector3(20, 15, 0),
      new THREE.Vector3(10, 0, 0)
    );

    const geometry = new THREE.TubeGeometry(curve, 20, 3, 8, false);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }
}

export default Demo;
