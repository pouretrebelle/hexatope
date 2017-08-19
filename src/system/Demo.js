import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { saveAs } from 'file-saver';
import STLExporter from 'utils/STLExporter';
import settings, { demoModelSettings, exportModelSettings } from './settings';
import UIStore from 'stores/UIStore';

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

    // camera
    // (fov, aspect, near, far)
    this.camera = new THREE.PerspectiveCamera(20, (UIStore.windowWidth / 2) / UIStore.windowHeight, 1, 10000);
    this.camera.position.z = UIStore.windowHeight * 0.05;
    this.scene.add(this.camera);

    // controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = settings.cameraDampingFactor;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = settings.cameraRotateSpeed * settings.cameraDampingFactor;
    this.controls.rotateSpeed = settings.cameraDampingFactor;

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    this.updateDimensions(UIStore);

    // lights
    const light1 = new THREE.PointLight(0xffffff, 0.6);
    light1.position.set(50, 20, -25 - UIStore.windowHeight * 0.05);
    this.camera.add(light1);
    const light2 = new THREE.PointLight(0xffffff, 0.3);
    light2.position.set(-50, -20, -15 - UIStore.windowHeight * 0.05);
    this.camera.add(light2);
    const light3 = new THREE.PointLight(0xffffff, 0.6);
    light3.position.set(-15, 50, 50 - UIStore.windowHeight * 0.05);
    this.camera.add(light3);
    const light4 = new THREE.PointLight(0xffffff, 0.3);
    light4.position.set(15, -50, 50 - UIStore.windowHeight * 0.05);
    this.camera.add(light4);
    const ambLight = new THREE.AmbientLight(0xffffff);
    this.camera.add(ambLight);

    // load env map for reflection
    // images by Paul Debevec from http://www.pauldebevec.com/Probes/
    var envMapURLs = [
      require('assets/images/left.jpg'),
      require('assets/images/right.jpg'),
      require('assets/images/top.jpg'),
      require('assets/images/bottom.jpg'),
      require('assets/images/front.jpg'),
      require('assets/images/back.jpg'),
    ];
    const envMap = new THREE.CubeTextureLoader().load(envMapURLs);

    // material
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.75,
      envMap: envMap,
      envMapIntensity: 1,
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
    const curves = this.system.getCurvesData();
    const tubeRadius = settings.tubeThickness / (2 * settings.hexRadius);

    // draw each curve as a tube
    curves.forEach(curve => {
      const bezier = new THREE.CubicBezierCurve3(
        this.getVec3PointMerge(curve.hexagonPosition, curve.start.pos, modelSettings.scale, curve.start.posZ),
        this.getVec3PointMerge(curve.hexagonPosition, curve.start.controlPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.end.controlPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.end.pos, modelSettings.scale, curve.end.posZ)
      );
      const tube = new THREE.TubeGeometry(bezier, modelSettings.tubeSegments, tubeRadius * modelSettings.scale, modelSettings.tubeRadiusSegments, false);
      geometry.merge(tube);

      // check whether the caps need capping
      [curve.start, curve.end].forEach((cap) => {
        if (cap.extenders.length === 0) {
          // if it has no extenders it needs a sphere at the end
          const point = this.getVec3PointMerge(curve.hexagonPosition, cap.pos, modelSettings.scale, cap.posZ);
          const sphere = new THREE.SphereGeometry(tubeRadius * modelSettings.scale);
          sphere.translate(point.x, point.y, point.z);
          geometry.merge(sphere);
        }
      });
    });

    // center geometry in viewport
    geometry.center();
    return new THREE.Mesh(geometry, this.material);
  }

  getVec3PointMerge(one, two, scale, twoZ) {
    // we have to flip the x-axis, no idea why
    return new THREE.Vector3(scale * (one.x + two.x), scale * (-one.y - two.y), scale*(twoZ ? twoZ : two.z));
  }

  render = () => {
    this.controls.autoRotate = !UIStore.isMouseOverDemo;
    this.controls.update();

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
