import CurveCap from './CurveCap';

class Curve {
  constructor({ hexagon, pos1, pos1Control, pos2Control, pos2, joinType, depths }) {
    this.hexagon = hexagon;

    this.start = new CurveCap(this, pos1, pos1Control);
    this.end = new CurveCap(this, pos2, pos2Control);

    // joinType =
    // 0 is a single line without a pair
    // 1 means its pair is touching at start
    // 2 means its pair is touching at end
    // 3 means it has a parallel pair
    this.divergeAtStart = joinType === 1;
    this.divergeAtEnd = joinType === 2;
    this.hasPair = !!joinType;
    this.pair = undefined;

    // set when getting hexagon data
    this.hexagonPosition = undefined;

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
