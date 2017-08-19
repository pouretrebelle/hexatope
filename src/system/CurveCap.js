import { getEdgePoint } from 'utils/hexagonUtils';
import Point from './Point';

class CurveCap {
  constructor(curve, point, controlMagnitude) {
    this.curve = curve;

    this.point = new Point(point.x, point.y);

    this.point.controlDirection = getEdgePoint(point.edge, 0).normalise();
    this.point.controlMagnitude = controlMagnitude;
    this.point.cap = this;

    this.pair = undefined;
    this.extenders = [];
    this.aligners = [];
  }

  setDepthOverlap(depth) {
    this.point.setDepthOverlap(depth);
  }

  setDepthCurvature(depth) {
    this.point.setDepthCurvature(depth);
  }

  getOppositeCap() {
    if (this.curve.start == this) return this.curve.end;
    return this.curve.start;
  }

  getOverlapAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().point.depthOverlap - this.point.depthOverlap) / this.curve.estLength);
  }

  getCurvatureAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().point.depthCurvature - this.point.depthCurvature) / this.curve.estLength);
  }

  angleControlPos(angleOverlap, angleCurvature) {
    this.point.angleOverlap = angleOverlap;
    this.point.angleCurvature = angleCurvature;
  }
}

export default CurveCap;
