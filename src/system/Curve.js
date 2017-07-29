class Curve {
  constructor({ hexagon, pos1, pos1Control, pos2Control, pos2, joinType, depths }) {
    this.hexagon = hexagon;

    this.pos1 = pos1;
    this.pos1Control = pos1Control;
    this.pos2Control = pos2Control;
    this.pos2 = pos2;

    // joinType =
    // 0 is a single line without a pair
    // 1 means its pair is touching at pos1
    // 2 means its pair is touching at pos2
    // 3 means it has a parallel pair
    this.divergeAtPos1 = joinType === 1;
    this.divergeAtPos2 = joinType === 2;
    this.hasPair = !!joinType;
    this.pair = undefined;

    // set when getting hexagon data
    this.hexagonPosition = undefined;

    this.pos1Extensions = [];
    this.pos1Aligners = [];
    this.pos2Extensions = [];
    this.pos2Aligners = [];

    if (depths) this.setupDepths(depths, joinType);
  }

  setupDepths({
    edge1DepthPush,
    edge1DepthForce,
    edge2DepthPush,
    edge2DepthForce,
  },
  joinType,
  ) {
    // use push if is double or diverging at the other end
    // otherwise use force value
    // use force value if push isn't defined but force is
    this.pos1.z = (edge1DepthPush && (joinType == 3 || joinType == 2)) ? edge1DepthPush : edge1DepthForce;
    this.pos2.z = (edge2DepthPush && (joinType == 3 || joinType == 1)) ? edge2DepthPush : edge2DepthForce;
  }

  assignPair(curve) {
    this.pair = curve;
  }
}

export default Curve;
