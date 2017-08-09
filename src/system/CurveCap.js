import { getEdgePoint } from 'utils/hexagonUtils';

class CurveCap {
  constructor(curve, point, controlMagnitude) {
    this.curve = curve;

    this.capPos = point;
    this.controlMagnitude = controlMagnitude;
    this.controlPos = point.minusNew(getEdgePoint(point.edge, 0).normalise().multiplyEq(controlMagnitude));

    this.pair = undefined;
    this.extenders = [];
    this.aligners = [];
  }

  setDepth(depth) {
    this.capPos.z = depth;
    this.controlPos.z = depth;
  }

  getOppositeCap() {
    if (this.curve.start == this) return this.curve.end;
    return this.curve.start;
  }

  getAngleToOppositeCap() {
    return Math.atan((this.getOppositeCap().capPos.z - this.capPos.z) / this.curve.estLength);
  }

  angleControlPos(angle) {
    const depth = Math.sin(angle) * this.controlMagnitude;
    const length = Math.cos(angle) * this.controlMagnitude;

    this.controlPos = this.capPos.minusNew(getEdgePoint(this.capPos.edge, 0).normalise().multiplyEq(length));
    this.controlPos.z = this.capPos.z + depth;
  }
}

export default CurveCap;
