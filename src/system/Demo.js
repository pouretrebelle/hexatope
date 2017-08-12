import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { saveAs } from 'file-saver';
import STLExporter from 'utils/STLExporter';
import settings, { demoModelSettings, exportModelSettings } from './settings';

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
    this.scene.background = new THREE.Color(settings.demoBackgroundColor);

    // camera
    // (fov, aspect, near, far)
    this.camera = new THREE.PerspectiveCamera(20, (UIStore.windowWidth / 2) / UIStore.windowHeight, 1, 10000);
    this.camera.position.z = UIStore.windowHeight * 0.05;

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

    // update camera aspect ratio
    this.camera.aspect = (windowWidth / 2) / windowHeight;
    this.camera.updateProjectionMatrix();
  }

  updateCurves() {
    this.scene.remove(this.mesh);
    this.mesh = this.generateMesh(demoModelSettings);
    this.scene.add(this.mesh);
  }

  generateMesh(modelSettings) {
    let geometry = new THREE.Geometry();
    const data = this.system.getHexagonData();
    const tubeRadius = settings.tubeThickness / (2 * settings.hexRadius);

    // draw each curve as a tube
    data.curves.forEach(curve => {
      const bezier = new THREE.CubicBezierCurve3(
        this.getVec3PointMerge(curve.hexagonPosition, curve.start.capPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.start.controlPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.end.controlPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.end.capPos, modelSettings.scale)
      );
      const tube = new THREE.TubeGeometry(bezier, modelSettings.tubeSegments, tubeRadius * modelSettings.scale, modelSettings.tubeRadiusSegments, false);
      geometry.merge(tube);
    });

    // draw each cap as a sphere
    data.caps.forEach(cap => {
      const point = this.getVec3PointMerge(cap.hexagonPosition, cap.pos, modelSettings.scale);
      const sphere = new THREE.SphereGeometry(tubeRadius*modelSettings.scale);
      sphere.translate(point.x, point.y, point.z);
      geometry.merge(sphere);
    });

    // center geometry in viewport
    geometry.center();
    return new THREE.Mesh(geometry, this.material);
  }

  getVec3PointMerge(one, two, scale) {
    // we have to flip the x-axis, no idea why
    return new THREE.Vector3(scale * (one.x + two.x), scale * (-one.y - two.y), settings.depthScalar*scale*two.z);
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }

  downloadSTL() {
    const exporter = new STLExporter();
    const exportMesh = this.generateMesh(exportModelSettings);
    const stlString = exporter.parse(exportMesh);
    const blob = new Blob([stlString], { type: 'text/plain' });
    saveAs(blob, 'hexatope.stl');
  }
}

export default Demo;
