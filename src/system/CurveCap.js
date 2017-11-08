import { observable, computed } from 'mobx';
import SettingsStore from 'stores/SettingsStore';
import { getEdgePoint } from 'utils/hexagonUtils';

class CurveCap {
  constructor(curve, point, controlMagnitude) {
    this.curve = curve;

    this.pos = point;

    this.controlDirection = getEdgePoint(point.edge, 0).normalise();
    this.controlMagnitude = controlMagnitude * (0.6 + Math.random() * 0.8);

    this.pair = undefined;
    this.extenders = [];
    this.aligners = [];
  }

  @observable depthOverlap = 0;
  @observable depthCurvature = 0;
  @observable angleOverlap = 0;
  @observable angleCurvature = 0;

  @computed get posZ() {
    return SettingsStore.depthOverlapScalar * this.depthOverlap + SettingsStore.depthCurvatureScalar * this.depthCurvature;
  }

  @computed get controlPos() {
    if (this.angleOverlap === undefined && this.angleCurvature === undefined) return this.x;

    const averageAngle = SettingsStore.depthOverlapScalar * this.angleOverlap + SettingsStore.depthCurvatureScalar * this.angleCurvature;
    const depth = Math.sin(averageAngle) * this.controlMagnitude;
    const length = Math.cos(averageAngle) * this.controlMagnitude;

    let controlPos = this.pos.minusNew(this.controlDirection.multiplyNew(length));
    controlPos.z = this.posZ + depth;

    return controlPos;
  }

  setDepthOverlap(depth) {
    this.depthOverlap = depth;
  }

  setDepthCurvature(depth) {
    this.depthCurvature = depth;
  }

  getOppositeCap() {
    if (this.curve.start == this) return this.curve.end;
    return this.curve.start;
  }

  getOverlapAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().depthOverlap - this.depthOverlap) / this.curve.estLength);
  }

  getCurvatureAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().depthCurvature - this.depthCurvature) / this.curve.estLength);
  }

  angleControlPos(angleOverlap, angleCurvature) {
    this.angleOverlap = angleOverlap;
    this.angleCurvature = angleCurvature;
  }
}

export default CurveCap;
