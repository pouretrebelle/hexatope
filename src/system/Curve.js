import CurveCap from './CurveCap';

class Curve {
  constructor({
    hexagon,
    pos1,
    pos1Control,
    pos2Control,
    pos2,
    joinType,
    edgeSeparation,
    depths,
  }) {
    this.hexagon = hexagon;

    this.start = new CurveCap(this, pos1, pos1Control);
    this.end = new CurveCap(this, pos2, pos2Control);

    // joinType
    // 0 - a single line without a pair
    // 1 - its pair is touching at start
    // 2 - its pair is touching at end
    // 3 - it has a parallel pair
    this.divergeAtStart = joinType === 1;
    this.divergeAtEnd = joinType === 2;
    this.hasPair = !!joinType;
    this.pair = undefined;

    // edgeSeparation
    // 0 - adjacent edges
    // 1 - two away
    // 2 - opposite edges
    switch (edgeSeparation) {
      case 0:
        this.estLength = 1.05; // a third of 0.5r circle
        break;
      case 1:
        this.estLength = 1.57; // a sixth of 1.5r circle
        break;
      case 2:
        this.estLength = 2;
        break;
    }

    // set when getting hexagon data
    this.hexagonPosition = undefined;

    if (depths) this.setupDepths(depths, joinType);
  }

  setupDepths(
    {
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
    this.start.setDepth((edge1DepthPush && (joinType == 3 || joinType == 2)) ? edge1DepthPush : edge1DepthForce);
    this.end.setDepth((edge2DepthPush && (joinType == 3 || joinType == 1)) ? edge2DepthPush : edge2DepthForce);
  }

  setPair(curve) {
    this.pair = curve;
    if (this.divergeAtStart) this.start.pair = curve.start;
    if (this.divergeAtEnd) this.end.pair = curve.end;
  }
}

export default Curve;
