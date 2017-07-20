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
    const light = new THREE.PointLight(0xFFFFFF, 1);
    light.position.set(50, 0, 20);
    this.scene.add(light);
    const lightTwo = new THREE.PointLight(0xFFFFFF, 1);
    lightTwo.position.set(-50, 0, 20);
    this.scene.add(lightTwo);
    const ambLight = new THREE.AmbientLight(0x666666);
    this.scene.add(ambLight);

    // initialise geometry
    this.setupGeometry();

    // initialise render loop
    this.render();
  }

  updateDimensions({ windowWidth, windowHeight }) {
    this.renderer.setSize(windowWidth / 2, windowHeight);
  }

  draw() {
  }

  update() {
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.update();
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
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }
}

export default Demo;
