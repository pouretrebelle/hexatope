class CurveCap {
  constructor( curve, pos, control ) {
    this.curve = curve;

    this.capPos = pos;
    this.controlPos = control;

    this.pair = undefined;
    this.extensions = [];
    this.aligners = [];

    this.depth = 0;
  }

  setDepth(depth) {
    this.depth = depth;
  }
}

export default CurveCap;
