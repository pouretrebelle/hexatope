import { getEdgePoint } from 'utils/hexagonUtils';
import Point from './Point';

class CurveCap {
  constructor(curve, point, controlMagnitude) {
    this.curve = curve;

    this.capPos = point;
    this.controlMagnitude = controlMagnitude;
    this.controlPos = new Point(point.x, point.y);
    this.controlPos.minusEq(getEdgePoint(point.edge, 0).normalise().multiplyEq(controlMagnitude));

    this.pair = undefined;
    this.extenders = [];
    this.aligners = [];
  }

  setDepthOverlap(depth) {
    this.capPos.setDepthOverlap(depth);
    this.controlPos.setDepthOverlap(depth);
  }

  setDepthCurvature(depth) {
    this.capPos.setDepthCurvature(depth);
    this.controlPos.setDepthCurvature(depth);
  }

  getOppositeCap() {
    if (this.curve.start == this) return this.curve.end;
    return this.curve.start;
  }

  getOverlapAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().capPos.depthOverlap - this.capPos.depthOverlap) / this.curve.estLength);
  }

  getCurvatureAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().capPos.depthCurvature - this.capPos.depthCurvature) / this.curve.estLength);
  }

  angleControlPos(depthAngle, curvatureAngle) {
    const depth = Math.sin(depthAngle) * this.controlMagnitude;
    const length = Math.cos(depthAngle) * this.controlMagnitude;

    this.controlPos = new Point(this.capPos.x, this.capPos.y);
    this.controlPos.minusEq(getEdgePoint(this.capPos.edge, 0).normalise().multiplyEq(length));
    this.controlPos.setDepthOverlap(this.capPos.depthOverlap + depth);
  }
}

export default CurveCap;
