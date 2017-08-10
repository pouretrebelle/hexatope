import Point from './Point';
import { wrap6, random } from 'utils/numberUtils';
import { getEdgePoint, getControlMagnitudeAdjacent, getControlMagnitudeWide } from 'utils/hexagonUtils';
import { getPushDepth, getForceDepth } from 'utils/curveUtils';
import settings from './settings';
import curveLayouts from 'constants/curveLayouts';
import { LAYOUT_PROGRESSION_DELAY, LAYOUT_PROGRESSION_INTERVAL } from 'constants/timing';
import Curve from './Curve';

class Hexagon {
  constructor(system, x, y) {
    this.system = system;
    this.hexagons = system.hexagons;

    // establish grid position
    this.pos = new Point(x, y);

    // establish position in layout
    this.layoutPos = new Point();
    this.layoutPos.x = 3 * x + 0.5 + y % 2 * 1.5;
    this.layoutPos.y = Math.sqrt(3) * (y * 0.5 + 0.5);

    // establish state
    // active can be 0, 1, 2
    // double active results in double lines
    this.active = 0;
    this.nextActive = 0;

    // establish neighbours
    this.neighbours = [];


    // chose random layout seed
    // regenerated when hex goes from inactive to active
    this.layoutSeed = random();
    // to return to layout on mouse out
    this.initialLayoutSeed = this.layoutSeed;
    this.layoutWaitTimer = undefined;
    this.layoutProgressionTimer = undefined;
    this.isLongHovering = false;

    this.curves = [];
  }

  initialiseNeighbours(x, y) {
    // initialise neighbours called after all hexagons are constructed
    // because otherwise the hexagons array isn't full yet
    // lots of conditionals to allow for edge hexagons

    // start with array of falses
    let n = [false, false, false, false, false, false];
    const odd = y % 2;

    // above
    if (y >= 2) {
      n[0] = this.hexagons[x][y - 2];
    }

    // top right
    if (y >= 1) {
      if (!odd || x < this.system.columns - 1) {
        n[1] = this.hexagons[x + odd][y - 1];
      }
    }

    // bottom right
    if (y < this.system.rows - 1) {
      if (!odd || x < this.system.columns - 1) {
        n[2] = this.hexagons[x + odd][y + 1];
      }
    }

    // bottom
    if (y < this.system.rows - 2) {
      n[3] = this.hexagons[x][y + 2];
    }

    // bottom left
    if (y < this.system.rows - 1) {
      if (odd || x >= 1) {
        n[4] = this.hexagons[x - 1 + odd][y + 1];
      }
    }

    // top left
    if (y >= 1) {
      if (odd || x >= 1) {
        n[5] = this.hexagons[x - 1 + odd][y - 1];
      }
    }

    this.neighbours = n;
  }

  update() {
    // ransomise layout if hex is becoming active
    if (!this.active && this.nextActive) {
      this.layoutSeed = Math.random();
    }

    // update active from next active
    this.active = this.nextActive;

    // check whether the mouse is in this hex
    this.checkMouseTarget();

    // update the curves to draw
    this.planCurves();
  }

  checkMouseTarget() {
    // roughly check whether the mouse is inside the hexagon
    const mouseIsInside = (this.system.canvas.relativeMousePos.dist(this.layoutPos.multiplyNew(settings.hexRadius)) < settings.hexRadius);

    // init if it is inside
    // and it's active
    // and not in the process at all
    // and it's not already the hovered hexagon
    if (mouseIsInside &&
        this.active &&
        !this.layoutWaitTimer &&
        !this.layoutProgressionTimer &&
        this.system.mouseTargetHex != this) {
      const timeout = (LAYOUT_PROGRESSION_DELAY > LAYOUT_PROGRESSION_INTERVAL) ? LAYOUT_PROGRESSION_DELAY - LAYOUT_PROGRESSION_INTERVAL : 0;
      this.layoutWaitTimer = setTimeout(() => {
        this.initialiseLayoutProgression();
      }, timeout);
    }

    // cancel if it's not inside
    // and is anywhere along the process
    else if (!mouseIsInside &&
             (!!this.layoutProgressionTimer ||
             !!this.layoutWaitTimer)) {
      this.cancelLayoutProgression();
    }

    // set system target to this hex
    if (mouseIsInside) {
      this.system.mouseTargetHex = this;
    }

    return mouseIsInside;
  }

  initialiseLayoutProgression = () => {
    // return if already initialised, aka nailed it
    if (this.isLongHovering) return;

    // reset wait timer
    this.layoutWaitTimer = undefined;

    // set initial seed to current seet
    this.initialLayoutSeed = this.layoutSeed;

    // start progression timer
    this.layoutProgressionTimer = setInterval(() => {
      this.progressLayout();
    }, LAYOUT_PROGRESSION_INTERVAL);
  }

  cancelLayoutProgression = () => {
    // remove state, oh no
    this.isLongHovering = false;

    // reset current layout to initial
    this.layoutSeed = this.initialLayoutSeed;

    // cancel and clear timers
    clearInterval(this.layoutProgressionTimer);
    this.layoutProgressionTimer = undefined;
    this.layoutWaitTimer = undefined;
  }

  freezeLayout() {
    // set current layout to initial
    this.initialLayoutSeed = this.layoutSeed;

    // update demo
    this.system.demo.updateCurves();

    // cancel progression
    this.cancelLayoutProgression();
  }

  progressLayout = () => {
    if (!this.checkMouseTarget()) {
      this.cancelLayoutProgression();
      return;
    }

    // set hovering now and not at the start of timer
    this.isLongHovering = true;

    const formation = this.getFormation();
    if (formation > 0) {

      const layoutCount = curveLayouts[formation].layouts.length;
      // increment is enough to forward the layout by 7/6ths of a layout
      // the extra is so the rotation that relies on seeds also progresses
      const increment = 1 / (layoutCount + 1 / (6 * layoutCount));
      this.layoutSeed = (this.layoutSeed + increment) % 1;

      this.planCurves();
      this.system.canvas.draw();
    }
  }

  countActiveNeighbours() {
    // returns number of active neighbours
    let activeNeighbours = 0;
    for (let i = 0; i < 6; i++) {
      if (this.neighbours[i] && this.neighbours[i].active) {
        activeNeighbours++;
      }
    }

    return activeNeighbours;
  }

  getActiveNeighbours() {
    // returns array of booleans for active neighbours
    let activeNeighbours = [];
    for (let i = 0; i < 6; i++) {
      // if neighbour exists and is active
      if (this.neighbours[i] && this.neighbours[i].active) {
        activeNeighbours.push(true);
      } else {
        activeNeighbours.push(false);
      }
    }

    return activeNeighbours;
  }

  planCurves() {
    // reset curves property
    this.curves = [];

    const activeNeighbours = this.getActiveNeighbours();
    const formation = this.getFormation();

    // get array of active neighbour indexes
    const edgePositionsArray = activeNeighbours.map((pos, i) => {
      if (pos) return i;
    }).filter(pos => pos !== undefined);

    // one neighbour
    if (formation === 0) {
      let activeEdge = activeNeighbours.indexOf(true);
      let activeNeighbour = this.neighbours[activeEdge];
      // if it is double active
      // or the active neighbour is double active
      if (activeNeighbour.active == 2 ||
        this.active == 2) {
        // the neighbour must have > 1 active neighbour to avoid ellipses on an active edge
        if (activeNeighbour.countActiveNeighbours() > 1) {
          // get two edge points
          const point1 = getEdgePoint(activeEdge, 1);
          const point2 = getEdgePoint(activeEdge, -1);
          // add to curves property
          this.curves.push(new Curve({
            hexagon: this,
            point1,
            point2,
            controlMagnitude: settings.hexDoubleLineOffset,
          }));
        }
      }
    }

    // two neighbours
    else if (formation === 1) {
      this.addCurves(formation, edgePositionsArray);
    }

    // three neighbours
    else if (formation === 2) {
      this.addCurves(formation, edgePositionsArray);
    }

    // four neighbours
    else if (formation === 3 || formation === 4) {
      // get the index of each inactive edge
      let skipped1 = activeNeighbours.indexOf(false);
      let skipped2 = activeNeighbours.slice(skipped1 + 1).indexOf(false) + skipped1 + 1;

      // make list of active edge positions
      // making sure to loop from the most clockwise edge to avoid 0/5 problem
      let orderedEdgePositionsArray = [];
      let skippedClockwise = (skipped1 == 0) ? skipped1 : skipped2;
      for (let i = skippedClockwise; i < skippedClockwise + 6; i++) {
        if (wrap6(i) != skipped1 && wrap6(i) != skipped2) {
          orderedEdgePositionsArray.push(wrap6(i));
        }
      }

      // skips are adjacent
      if (formation === 3) {
        this.addCurves(formation, orderedEdgePositionsArray);
      }

      // 1 and 3 situation
      // or 2 and 2
      else if (formation === 4) {
        this.addCurves(formation, orderedEdgePositionsArray);
      }
    }

    // five neighbours
    else if (formation === 5) {
      let skipped = activeNeighbours.indexOf(false);
      const positions = [
        skipped + 1,
        skipped + 2,
        skipped + 3,
        skipped + 4,
        skipped + 5,
      ];
      this.addCurves(formation, positions);
    }

    // 6 neighbours
    else if (formation === 6) {
      // make an array of 1-6 that start at a random value
      // start position determined by layout seed
      const randomStart = Math.floor((this.layoutSeed * 10 - 9) * 6);
      const randomPositions = Array.from({ length: 6 }, (v, i) => wrap6(i + randomStart));
      this.addCurves(formation, randomPositions);
    }
  }

  getFormation() {
    const activeNeighboursCount = this.countActiveNeighbours();

    // one neighbour
    if (activeNeighboursCount == 1) {
      return 0;
    }

    // two neighbours
    else if (activeNeighboursCount == 2) {
      return 1;
    }

    // three neighbours
    else if (activeNeighboursCount == 3) {
      return 2;
    }

    // four neighbours
    else if (activeNeighboursCount == 4) {
      // get the index of each inactive edge
      const activeNeighbours = this.getActiveNeighbours();
      let skipped1 = activeNeighbours.indexOf(false);
      let skipped2 = activeNeighbours.slice(skipped1 + 1).indexOf(false) + skipped1 + 1;

      // skips are adjacent
      if ((skipped2 == wrap6(skipped1 + 1))
        || (skipped1 == 0 && skipped2 == 5)) {
        return 3;
      }

      // 1 and 3 situation
      // or 2 and 2
      else {
        return 4;
      }
    }

    // five neighbours
    else if (activeNeighboursCount == 5) {
      return 5;
    }

    // 6 neighbours
    else if (activeNeighboursCount == 6) {
      return 6;
    }

    return false;
  }

  getLayout(formation) {
    // if formation not passed in go get it
    formation = formation || this.getFormation();

    // get potential layouts from formation
    const layouts = curveLayouts[formation].layouts;

    // chose layout based on seed
    const layoutChoice = Math.floor(layouts.length * this.layoutSeed);

    return layouts[layoutChoice];
  }

  addCurves(formation, edgeOrder) {
    const layout = this.getLayout(formation);

    // loop through chosen layout's pairs
    layout.pairs.forEach(pair => {
      // use order array to map edges if it exists
      // otherwise just use the numbers
      const start = edgeOrder ? edgeOrder[pair[0]] : pair[0];
      const end = edgeOrder ? edgeOrder[pair[1]] : pair[1];
      this.addCurveBetweenEdges({
        edge1: start,
        edge2: end,
        edge1DepthPush: getPushDepth(layout, pair[0]),
        edge1DepthForce: getForceDepth(layout, pair[0]),
        edge2DepthPush: getPushDepth(layout, pair[1]),
        edge2DepthForce: getForceDepth(layout, pair[1]),
      });
    });
  }

  addCurveBetweenEdges({ edge1, edge2, ...depths }) {
    // called by planCurves()
    // used to determine whether they should be single, double, or diverging
    // also used to set curve offsets for inner/outer lines

    // empty curves to be filled
    let curve1 = undefined;
    let curve2 = undefined;

    // make sure edges are between 0-5
    edge1 = wrap6(edge1);
    edge2 = wrap6(edge2);

    // merge edges with depth data to pass into function more easily
    const edgesData = Object.assign(
      {},
      { edge1, edge2 },
      depths,
    );

    // should we draw it as a double line?
    let double = false;
    // if the tile is double active
    if (this.active == 2) double = true;
    // if both of the edge tiles exist and are double active
    if ((this.neighbours[edge1] && this.neighbours[edge1].active == 2) &&
      (this.neighbours[edge2] && this.neighbours[edge2].active == 2)) {
      double = true;
    }

    if (double) {
      // double rainbow
      curve1 = this.makeCurveWithOffset(edgesData, 1, 1, 3);
      curve2 = this.makeCurveWithOffset(edgesData, -1, -1, 3);
    }

    // if tile is single active
    // and not both of the edges are double active
    else {
      // if edge1 hexagon exists and is double active
      if ((this.neighbours[edge1] && this.neighbours[edge1].active == 2)) {
        curve1 = this.makeCurveWithOffset(edgesData, 1, 0, 2);
        curve2 = this.makeCurveWithOffset(edgesData, -1, 0, 2);
      }
      // if edge2 hexagon exists and is double active
      else if ((this.neighbours[edge2] && this.neighbours[edge2].active == 2)) {
        curve1 = this.makeCurveWithOffset(edgesData, 0, 1, 1);
        curve2 = this.makeCurveWithOffset(edgesData, 0, -1, 1);
      }
      // if everything is single
      else {
        curve1 = this.makeCurveWithOffset(edgesData, 0, 0, 0);
      }
    }

    // if there is more than one curve assign pairs
    if (curve2) {
      curve1.setPair(curve2);
      curve2.setPair(curve1);
    }

    // add to curves array
    this.curves.push(curve1);
    if (curve2) this.curves.push(curve2);
  }

  makeCurveWithOffset({ edge1, edge2, ...depths }, offset1, offset2, joinType) {
    // called by addCurveBetweenEdges()
    // determines which is the inner and outer line
    // sets offset and draws line accordingly

    // we use edgeSeparation to estimate the curve's length, it describes the relation between the two edges
    let edgeSeparation = 2;

    // set up positions as per offsets
    let point1 = getEdgePoint(edge1, offset1);
    let point2 = getEdgePoint(edge2, offset2);
    let point1ControlMagnitude = 0;
    let point2ControlMagnitude = 0;

    // if edge 2 is one clockwise from edge 1
    if (edge1 == wrap6(edge2 - 1)) {
      // flips offset 2
      point2 = getEdgePoint(edge2, -offset2);
      point1ControlMagnitude = getControlMagnitudeAdjacent(offset1);
      point2ControlMagnitude = getControlMagnitudeAdjacent(offset2);
      edgeSeparation = 0;
    }
    // if edge 2 is one anti-clockwise from edge 1
    else if (edge1 == wrap6(edge2 + 1)) {
      // flips offset 1
      point1 = getEdgePoint(edge1, -offset1);
      point1ControlMagnitude = getControlMagnitudeAdjacent(offset1);
      point2ControlMagnitude = getControlMagnitudeAdjacent(offset2);
      edgeSeparation = 0;
    }

    // if edge 2 is two clockwise from edge 1
    else if (edge1 == wrap6(edge2 - 2)) {
      // flips offset 2
      point2 = getEdgePoint(edge2, -offset2);
      point1ControlMagnitude = getControlMagnitudeWide(offset1);
      point2ControlMagnitude = getControlMagnitudeWide(offset2);
      edgeSeparation = 1;
    }
    // if edge 2 is two anti-clockwise from edge 1
    else if (edge1 == wrap6(edge2 + 2)) {
      // flips offset 1
      point1 = getEdgePoint(edge1, -offset1);
      point1ControlMagnitude = getControlMagnitudeWide(offset1);
      point2ControlMagnitude = getControlMagnitudeWide(offset2);
      edgeSeparation = 1;
    }

    // if edges are opposites we add weak control points perpendicular to the point's edge
    // this is so converging/diverging lines meet perpendicularly
    if (Math.abs(edge2 - edge1) == 3) {
      // flip the offset 2 to create parallel lines
      point2 = getEdgePoint(edge2, -offset2);
      // make control points the start and end of line
      point1ControlMagnitude = 0.5;
      point2ControlMagnitude = 0.5;
    }

    // average magnitude of control points
    const controlMagnitude = (point1ControlMagnitude + point2ControlMagnitude) / 2;

    return new Curve({
      hexagon: this,
      point1,
      point2,
      controlMagnitude,
      joinType: joinType,
      edgeSeparation: edgeSeparation,
      depths,
    });
  }
}

export default Hexagon;
