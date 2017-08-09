class CurveCap {
  constructor( curve, pos, control ) {
    this.curve = curve;

    this.capPos = pos;
    this.controlPos = control;

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
}

export default CurveCap;
