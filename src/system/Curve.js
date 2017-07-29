class Curve {
  constructor({ hexagon, pos1, pos1Control, pos2Control, pos2, joinType }) {
    this.hexagon = hexagon;

    this.pos1 = pos1;
    this.pos1Control = pos1Control;
    this.pos2Control = pos2Control;
    this.pos2 = pos2;

    this.divergeAtPos1 = joinType === 1;
    this.divergeAtPos2 = joinType === 2;

    this.hasPair = !!joinType; // if joinType is 0 then it's a single line
    this.pair = undefined;

    // set when getting hexagon data
    this.hexagonPosition = undefined;

    this.pos1Extensions = [];
    this.pos1Aligners = [];
    this.pos2Extensions = [];
    this.pos2Aligners = [];
  }

  assignPair(curve) {
    this.pair = curve;
  }
}

export default Curve;
