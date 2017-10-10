import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { saveAs } from 'file-saver';
import { clamp } from 'utils/numberUtils';
import STLExporter from 'utils/STLExporter';
import settings, { demoModelSettings, exportModelSettings } from './settings';
import UIStore from 'stores/UIStore';
import SettingsStore from 'stores/SettingsStore';
import { MATERIALS } from 'constants/options';

class Demo {
  constructor(system) {
    this.system = system;
    this.canvas = undefined;
    this.scene = undefined;
    this.camera = undefined;
    this.renderer = undefined;
    this.materials = {};
    this.mesh = undefined;
  }

  setup(canvas, wrapperElement, UIStore) {
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
    this.controls.minDistance = settings.cameraMinDistance;
    this.controls.maxDistance = settings.cameraMaxDistance;

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: settings.showDownloadButtons, // only for png capture
    });
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

    this.updateDimensions(wrapperElement);

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
    this.materials[MATERIALS.SILVER] = new THREE.MeshStandardMaterial({
      color: 0xf7fafc,
      roughness: 0.6,
      metalness: 0.7,
      envMap: envMap,
      envMapIntensity: 1,
    });
    this.materials[MATERIALS.GOLD] = new THREE.MeshStandardMaterial({
      color: 0xf7d491,
      roughness: 0.5,
      metalness: 0.7,
      envMap: envMap,
      envMapIntensity: 1,
    });

    // initialise render loop
    this.render();
  }

  getMaterial() {
    return this.materials[SettingsStore.material];
  }

  updateDimensions(wrapperElement) {
    const boundingBox = wrapperElement.getBoundingClientRect();

    this.renderer.setSize(boundingBox.width, boundingBox.height);

    // update camera aspect ratio
    this.camera.aspect = boundingBox.width / boundingBox.height;
    this.camera.updateProjectionMatrix();
  }

  updateCurves() {
    this.scene.remove(this.mesh);
    this.mesh = this.generateMeshes(demoModelSettings, false);
    this.scene.add(this.mesh);
    this.system.UIStore.demoHasBeenUpdated();
  }

  updateAndAnimateCurves() {
    // reset position and rotation of orbit controls
    this.controls.reset();
    this.system.UIStore.demoHasBeenUpdated();

    this.scene.remove(this.mesh);
    this.mesh = this.generateMeshes(demoModelSettings, true);
    this.scene.add(this.mesh);
  }

  generateMeshes(modelSettings, animate) {
    const curves = this.system.getCurvesData();
    const tubeRadius = settings.tubeThickness / (2 * settings.hexRadius);
    let group = new THREE.Group();

    // draw each curve as a tube
    curves.forEach(curve => {
      const bezier = new THREE.CubicBezierCurve3(
        this.getVec3PointMerge(curve.hexagonPosition, curve.start.pos, modelSettings.scale, curve.start.posZ),
        this.getVec3PointMerge(curve.hexagonPosition, curve.start.controlPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.end.controlPos, modelSettings.scale),
        this.getVec3PointMerge(curve.hexagonPosition, curve.end.pos, modelSettings.scale, curve.end.posZ)
      );
      const tube = new THREE.TubeBufferGeometry(bezier, modelSettings.tubeSegments, tubeRadius * modelSettings.scale, modelSettings.tubeRadiusSegments, false);

      const tubeMesh = new THREE.Mesh(tube, this.getMaterial());
      curve.tubeMesh = tubeMesh;
      group.add(tubeMesh);

      // check whether the caps need capping
      [curve.start, curve.end].forEach((cap) => {
        if (cap.extenders.length === 0) {
          // if it has no extenders it needs a sphere at the end
          const point = this.getVec3PointMerge(curve.hexagonPosition, cap.pos, modelSettings.scale, cap.posZ);
          const sphere = new THREE.SphereBufferGeometry(tubeRadius * modelSettings.scale, modelSettings.tubeRadiusSegments, modelSettings.tubeRadiusSegments);
          sphere.translate(point.x, point.y, point.z);
          const sphereMesh = new THREE.Mesh(sphere, this.getMaterial());
          cap.sphereMesh = sphereMesh;
          group.add(sphereMesh);
        }
      });
    });

    const bBox = new THREE.Box3().setFromObject(group);
    const bBoxCenter = bBox.getCenter();
    group.translateX(-bBoxCenter.x);
    group.translateY(-bBoxCenter.y);
    group.translateZ(-bBoxCenter.z);

    if (animate) this.initialiseAnimation(curves, settings.animationStep, settings.animationRangeMax);

    return group;
  }

  getVec3PointMerge(one, two, scale, twoZ) {
    // we have to flip the x-axis, no idea why
    // also we're swapping the x and z axes so orbit control resets to the z plane
    // makes animation fold forwards instead of away
    return new THREE.Vector3(-scale * (twoZ ? twoZ : two.z), scale * (-one.y - two.y), scale * (one.x + two.x));
  }

  initialiseAnimation(curves, step, rangeMax) {
    if (curves.length === 0) return;

    UIStore.demoAnimationStarted();
    this.animatingCurves = curves;
    this.animationStep = step / rangeMax;
    this.animationRangeMax = rangeMax;

    curves.forEach(curve => {
      // start at invisible
      curve.tubeMesh.geometry.setDrawRange(0, 0);

      curve.animationProgress = 0;
      curve.isAnimating = false;
      curve.isAnimatingFromStart = false;
      curve.isAnimatingFromEnd = false;
      curve.isAnimatingFromMiddle = false;
      curve.finishedAnimating = false;

      // hide any capping spheres
      if (curve.start.sphereMesh) curve.start.sphereMesh.visible = false;
      if (curve.end.sphereMesh) curve.end.sphereMesh.visible = false;
    });

    // start midway through the pack
    // TODO: chose this with intelligence?
    const chosenCurve = Math.floor(curves.length/2);
    curves[chosenCurve].isAnimating = true;
    curves[chosenCurve].isAnimatingFromMiddle = true;
  }

  updateAnimation() {
    this.animatingCurves.forEach(curve => {
      // skip if it's not animating at all
      if (!curve.isAnimating) return;

      // increase progress according to speed and curve length
      curve.animationProgress = clamp(
        (curve.animationProgress + this.animationStep * settings.animationSpeed / curve.estLength),
        0,
        1
      );
      // round the progress to the nearest step
      const steppedProgress = Math.round(curve.animationProgress / this.animationStep) * this.animationStep;

      // set the ranges
      if (curve.isAnimatingFromStart) {
        curve.tubeMesh.geometry.setDrawRange(
          0,
          Math.round(steppedProgress * this.animationRangeMax)
        );
      }
      else if (curve.isAnimatingFromEnd) {
        curve.tubeMesh.geometry.setDrawRange(
          Math.round((1 - steppedProgress) * this.animationRangeMax),
          this.animationRangeMax
        );
      }
      else if (curve.isAnimatingFromMiddle) {
        curve.tubeMesh.geometry.setDrawRange(
          Math.round((1 - steppedProgress) * this.animationRangeMax / 2),
          Math.round(steppedProgress * this.animationRangeMax)
        );
      }

      if (curve.animationProgress >= 1) this.finishCurveAnimation(curve);
    });

    // end animation if there aren't any curves left animating
    if (this.animatingCurves.filter(curve => curve.isAnimating).length === 0) {
      this.endAnimation();
    }
  }

  finishCurveAnimation(curve) {
    // start the dominoes
    if (curve.isAnimatingFromStart) {
      this.triggerAnimationFromCap(curve.end);
      curve.isAnimatingFromStart = false;
    }
    else if (curve.isAnimatingFromEnd) {
      this.triggerAnimationFromCap(curve.start);
      curve.isAnimatingFromEnd = false;
    }
    else if (curve.isAnimatingFromMiddle) {
      this.triggerAnimationFromCap(curve.start);
      this.triggerAnimationFromCap(curve.end);
      curve.isAnimatingFromMiddle = false;
    }

    // make sure it's set at max
    curve.tubeMesh.geometry.setDrawRange(0, this.animationRangeMax);
    curve.isAnimating = false;
    curve.finishedAnimating = true;
  }

  triggerAnimationFromCap(cap) {
    if (cap.extenders.length === 0) {
      // make the capping sphere visible
      cap.sphereMesh.visible = true;
      return;
    }

    cap.extenders.forEach(extenderCap => {
      // don't try if it's already been hit
      if (extenderCap.curve.isAnimating || extenderCap.curve.finishedAnimating) return;
      if (extenderCap === extenderCap.curve.start) {
        extenderCap.curve.isAnimatingFromStart = true;
      }
      else {
        extenderCap.curve.isAnimatingFromEnd = true;
      }
      extenderCap.curve.isAnimating = true;
    });

    // we have to set off the aligners as well or we might miss something
    cap.aligners.forEach(alignerCap => {
      // don't try if it's already been hit
      if (alignerCap.curve.isAnimating || alignerCap.curve.finishedAnimating) return;
      if (alignerCap === alignerCap.curve.start) {
        alignerCap.curve.isAnimatingFromStart = true;
      }
      else {
        alignerCap.curve.isAnimatingFromEnd = true;
      }
      alignerCap.curve.isAnimating = true;
    });
  }

  endAnimation() {
    UIStore.demoAnimationEnded();
  }

  render = () => {
    // autorotate when animating and when the mouse is over the canvas
    this.controls.autoRotate = UIStore.demoIsAnimating || !UIStore.isMouseOverDemo;
    this.controls.update();

    if (UIStore.demoIsAnimating) this.updateAnimation();

    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
  }

  downloadPNG() {
    const pngData = this.canvas.toDataURL();
    let link = document.createElement('a');
    link.download = 'hexatope.png';
    link.href = pngData;
    link.click();
  }

  downloadSTL() {
    const exporter = new STLExporter();
    const meshes = this.generateMeshes(exportModelSettings);
    let exportGeometry = new THREE.Geometry();
    meshes.children.forEach(mesh =>
      exportGeometry.merge(new THREE.Geometry().fromBufferGeometry(mesh.geometry))
    );

    const exportMesh = new THREE.Mesh(exportGeometry, this.getMaterial());

    const blob = new Blob(
      [exporter.parse(exportMesh)],
      {
        type: 'application/sla',
      }
    );
    saveAs(blob, 'hexatope.stl');
  }
}

export default Demo;
