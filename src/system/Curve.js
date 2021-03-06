import CurveCap from './CurveCap';
import settings from './settings';

class Curve {
  constructor({
    hexagon,
    point1,
    point2,
    controlMagnitude,
    joinType,
    edgeSeparation,
    depths,
  }) {
    this.hexagon = hexagon;

    this.start = new CurveCap(this, point1, controlMagnitude);
    this.end = new CurveCap(this, point2, controlMagnitude);

    // joinType
    // 0 - a single line without a pair
    // 1 - its pair is touching at start
    // 2 - its pair is touching at end
    // 3 - it has a parallel pair
    this.divergeAtStart = joinType === 1;
    this.divergeAtEnd = joinType === 2;
    this.hasPair = !!joinType;

    // these are defined in setPair() called in Hexagon/addCurveBetweenEdges()
    this.pair = undefined;
    this.insideOfPair = undefined;

    // edgeSeparation
    // 0 - adjacent edges
    // 1 - two away
    // 2 - opposite edges
    this.edgeSeparation = edgeSeparation;
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

    // if it's not defined then it's a double cap
    if (this.estLength === undefined) {
      this.estLength = Math.PI * settings.hexDoubleLineOffset;
    }

    // set when getting hexagon data
    this.hexagonPosition = undefined;

    // set when making curves
    // used to show initial layout when in edit mode
    this.drawFaded = false;

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
    this.start.setDepthOverlap((edge1DepthPush && (joinType == 3 || joinType == 2)) ? edge1DepthPush : edge1DepthForce);
    this.end.setDepthOverlap((edge2DepthPush && (joinType == 3 || joinType == 1)) ? edge2DepthPush : edge2DepthForce);
  }

  getChordLength() {
    return this.start.pos.minusNew(this.end.pos).magnitude();
  }

  setPair(curve) {
    this.pair = curve;
    if (this.divergeAtStart) this.start.pair = curve.start;
    if (this.divergeAtEnd) this.end.pair = curve.end;

    // if they're parallel there's no inner or outer
    if (this.edgeSeparation == 2) return;

    // check whether it's the inner curve or outer curve by comparing chords
    if (this.getChordLength() < curve.getChordLength()) {
      this.insideOfPair = true;
      const depth = (this.edgeSeparation == 0) ? 1 : 0.5;
      this.start.setDepthCurvature(depth);
      this.end.setDepthCurvature(depth);
    }
    else {
      this.insideOfPair = false;
    }
  }
}

export default Curve;
