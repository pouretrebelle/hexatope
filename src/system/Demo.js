import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { saveAs } from 'file-saver';
import STLExporter from 'utils/STLExporter';

class Demo {
  constructor(system) {
    this.system = system;
    this.canvas = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.material = undefined;
    this.mesh = undefined;
  }

  setup(canvas, UIStore) {
    this.canvas = canvas;

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // camera
    // (fov, aspect, near, far)
    this.camera = new THREE.PerspectiveCamera(20, (UIStore.windowWidth / 2) / UIStore.windowHeight, 1, 10000);
    this.camera.position.z = UIStore.windowHeight * 1.5;

    // controls
    this.controls = new OrbitControls(this.camera, this.canvas);

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

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

    // material
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.6,
    });

    // initialise render loop
    this.render();
  }

  updateDimensions({ windowWidth, windowHeight }) {
    this.renderer.setSize(windowWidth / 2, windowHeight);
  }

  updateCurves() {
    this.scene.remove(this.mesh);

    let geometry = new THREE.Geometry();
    const curves = this.system.getAllCurves();

    curves.forEach(curve => {
      const startPoint = this.getVec3PointMerge(curve.hexagonPosition, curve.pos1);
      const endPoint = this.getVec3PointMerge(curve.hexagonPosition, curve.pos2);

      const bezier = new THREE.CubicBezierCurve3(
        startPoint,
        this.getVec3PointMerge(curve.hexagonPosition, curve.pos1Control),
        this.getVec3PointMerge(curve.hexagonPosition, curve.pos2Control),
        endPoint
      );
      const tube = new THREE.TubeGeometry(bezier, 20, 3, 8, false);
      geometry.merge(tube);

      const startCap = new THREE.SphereGeometry(3);
      startCap.translate(startPoint.x, startPoint.y, 0);
      geometry.merge(startCap);

      const endCap = new THREE.SphereGeometry(3);
      endCap.translate(endPoint.x, endPoint.y, 0);
      geometry.merge(endCap);
    });

    geometry.center();
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  getVec3PointMerge(one, two) {
    // we have to flip the x-axis, no idea why
    return new THREE.Vector3(one.x+two.x, -one.y-two.y, 0);
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }

  downloadSTL() {
    const exporter = new STLExporter();
    const stlString = exporter.parse(this.scene);
    const blob = new Blob([stlString], { type: 'text/plain' });
    saveAs(blob, 'hexatope.stl');
  }
}

export default Demo;
