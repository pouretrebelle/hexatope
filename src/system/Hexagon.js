import Vector2 from 'utils/Vector2';
import { wrap6, random } from 'utils/numberUtils';
import { getEdgePos, getControlMagnitudeAdjacent, getControlMagnitudeWide } from 'utils/hexagonUtils';
import settings from './settings';

class Hexagon {
  constructor(system, x, y) {
    this.system = system;
    this.hexagons = system.hexagons;

    // establish grid position
    this.pos = new Vector2(x, y);

    // establish position in layout
    this.layoutPos = new Vector2();
    this.layoutPos.x = 3 * x + 0.5 + y % 2 * 1.5;
    this.layoutPos.y = Math.sqrt(3) * (y * 0.5 + 0.5);

    // establish state
    // active can be 0, 1, 2
    // double active results in double lines
    this.active = 0;
    this.nextActive = 0;

    // establish neighbours
    this.neighbours = [];

    // chose random layout (1-3) for dense (4/5/6 neighbours) display
    // regenerated when hex goes from inactive to active
    this.denseLayout = Math.ceil(random(3));

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
    // increment layout if hex is becoming active
    if (!this.active && this.nextActive) {
      this.denseLayout = (this.denseLayout == 3) ? 1 : this.denseLayout + 1;
    }

    // update active from next active
    this.active = this.nextActive;

    // roughly check whether the mouse is inside the hexagon
    // update mouse target if so
    if (this.system.canvas.relativeMousePos.dist(this.layoutPos.multiplyNew(settings.hexRadius)) < settings.hexRadius) {
      this.system.mouseTargetHex = this;
    }

    // update the curves to draw
    this.planCurves();
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

    let activeNeighboursCount = this.countActiveNeighbours();
    let activeNeighbours = this.getActiveNeighbours();

    // one neighbour
    if (activeNeighboursCount == 1) {
      let activeEdge = activeNeighbours.indexOf(true);
      let activeNeighbour = this.neighbours[activeEdge];
      // if it is double active
      // or the active neighbour is double active
      if (activeNeighbour.active == 2 ||
        this.active == 2) {
        // the neighbour must have > 1 active neighbour to avoid ellipses on an active edge
        if (activeNeighbour.countActiveNeighbours() > 1) {
          // get two edge points
          const pos1 = getEdgePos(activeEdge, 1);
          const pos2 = getEdgePos(activeEdge, -1);
          // get two control points
          const controlOffset = getEdgePos(activeEdge, 0).normalise().multiplyEq(settings.hexDoubleLineOffset);
          let pos1Control = pos1.minusNew(controlOffset);
          let pos2Control = pos2.minusNew(controlOffset);

          // add to curves property
          this.curves.push({
            pos1,
            pos1Control,
            pos2Control,
            pos2,
          });
        }
      }
    }

    // two or three neighbours
    else if (activeNeighboursCount == 2 || activeNeighboursCount == 3) {
      // link up all the active neighbours
      for (let i = 0; i < 6; i++) {
        if (activeNeighbours[i]) {
          for (let j = i + 1; j < 6; j++) {
            if (activeNeighbours[j]) {
              this.addCurveBetweenEdges(i, j);
            }
          }
        }
      }
    }

    // four neighbours
    else if (activeNeighboursCount == 4) {
      // get the index of each inactive edge
      let skipped1 = activeNeighbours.indexOf(false);
      let skipped2 = activeNeighbours.slice(skipped1 + 1).indexOf(false) + skipped1 + 1;

      // make list of active edge positions
      // making sure to loop from the most clockwise edge to avoid 0/5 problem
      let positions = [];
      let skippedClockwise = (skipped1 == 0) ? skipped1 : skipped2;
      for (let i = skippedClockwise; i < skippedClockwise + 6; i++) {
        if (wrap6(i) != skipped1 && wrap6(i) != skipped2) {
          positions.push(wrap6(i));
        }
      }

      // skips are adjacent
      if ((skipped2 == wrap6(skipped1 + 1))
        || (skipped1 == 0 && skipped2 == 5)) {
        if (this.denseLayout == 3) {
          // connect edges to adjacent edges, ignore straight line
          this.addCurveBetweenEdges(positions[0], positions[1]);
          this.addCurveBetweenEdges(positions[1], positions[2]);
          this.addCurveBetweenEdges(positions[2], positions[3]);
        }
        else if (this.denseLayout == 2) {
          // cross over curves
          this.addCurveBetweenEdges(positions[0], positions[2]);
          this.addCurveBetweenEdges(positions[1], positions[3]);
        }
        else {
          // pair edges with adjacent edges
          this.addCurveBetweenEdges(positions[0], positions[1]);
          this.addCurveBetweenEdges(positions[2], positions[3]);
        }
      }

      // 1 and 3 situation
      // or 2 and 2
      else {
        if (this.denseLayout == 3) {
          // connect edges to adjacent edges
          this.addCurveBetweenEdges(positions[0], positions[1]);
          this.addCurveBetweenEdges(positions[1], positions[2]);
          this.addCurveBetweenEdges(positions[2], positions[3]);
          this.addCurveBetweenEdges(positions[3], positions[0]);
        }
        else if (this.denseLayout == 2) {
          // pair edges with adjacent edges
          this.addCurveBetweenEdges(positions[3], positions[0]);
          this.addCurveBetweenEdges(positions[1], positions[2]);
        }
        else {
          // pair edges with opposite adjacent edges
          this.addCurveBetweenEdges(positions[0], positions[1]);
          this.addCurveBetweenEdges(positions[2], positions[3]);
        }
      }
    }

    // five neighbours
    else if (activeNeighboursCount == 5) {
      let skipped = activeNeighbours.indexOf(false);
      if (this.denseLayout == 3) {
        // connect edges to adjacent edges
        for (let i = skipped; i < 5 + skipped; i++) {
          const edge1 = (i == skipped) ? i + 5 : i;
          this.addCurveBetweenEdges(edge1, i + 1);
        }
      }
      else if (this.denseLayout == 2) {
        // batman logo
        // curve between the two skipped-adjacent edges
        this.addCurveBetweenEdges(skipped + 1, skipped + 5);
        // connect other 3 to eachother
        this.addCurveBetweenEdges(skipped + 2, skipped + 3);
        this.addCurveBetweenEdges(skipped + 3, skipped + 4);
      }
      else if (this.denseLayout == 1) {
        // evil M
        // curve the two skipped-adjacent edges to the skipped-opposite edge
        this.addCurveBetweenEdges(skipped + 1, skipped + 3);
        this.addCurveBetweenEdges(skipped + 5, skipped + 3);
        // curve the other two edges to the skipped-adjacent edges
        this.addCurveBetweenEdges(skipped + 1, skipped + 2);
        this.addCurveBetweenEdges(skipped + 5, skipped + 4);
      }
    }

    // 6 neighbours
    else if (activeNeighboursCount == 6) {
      if (this.denseLayout == 3) {
        // connect edges to adjacent edges
        for (let i = 0; i < 6; i++) {
          this.addCurveBetweenEdges(i, i + 1);
        }
      }
      else {
        // pair edges with adjacent edges
        // alternate using denseLayout == 2 or 1
        for (let i = this.denseLayout - 1; i < 6; i += 2) {
          this.addCurveBetweenEdges(i, i + 1);
        }
      }
    }
  }

  addCurveBetweenEdges(edge1, edge2) {
    // called by planCurves()
    // used to determine whether they should be single, double, or diverging
    // also used to set curve offsets for inner/outer lines

    // make sure edges are between 0-5
    edge1 = wrap6(edge1);
    edge2 = wrap6(edge2);

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
      this.addCurveWithOffset(edge1, edge2, 1, 1);
      this.addCurveWithOffset(edge1, edge2, -1, -1);
    }

    // if tile is single active
    // and not both of the edges are double active
    else {
      // if edge1 hexagon exists and is double active
      if ((this.neighbours[edge1] && this.neighbours[edge1].active == 2)) {
        this.addCurveWithOffset(edge1, edge2, 1, 0);
        this.addCurveWithOffset(edge1, edge2, -1, 0);
      }
      // if edge2 hexagon exists and is double active
      else if ((this.neighbours[edge2] && this.neighbours[edge2].active == 2)) {
        this.addCurveWithOffset(edge1, edge2, 0, 1);
        this.addCurveWithOffset(edge1, edge2, 0, -1);
      }
      // if everything is single
      else {
        this.addCurveWithOffset(edge1, edge2, 0, 0);
      }
    }
  }

  addCurveWithOffset(edge1, edge2, offset1, offset2) {
    // called by addCurveBetweenEdges()
    // determines which is the inner and outer line
    // sets offset and draws line accordingly

    // originOffset is the distance we move the origin point
    // in the opposite direction of the average angle of the two points
    let origin = new Vector2();

    // set up positions as per offsets
    let pos1 = getEdgePos(edge1, offset1);
    let pos2 = getEdgePos(edge2, offset2);
    let pos1ControlMagnitude = 0;
    let pos2ControlMagnitude = 0;

    // if edge 2 is one clockwise from edge 1
    if (edge1 == wrap6(edge2 - 1)) {
      // flips offset 2
      pos2 = getEdgePos(edge2, -offset2);
      // brings offset in smooth curve
      origin.y -= 0.25;
      origin.rotate((edge1 + 0.5) * Math.PI / 3);
      pos1ControlMagnitude = getControlMagnitudeAdjacent(offset1);
      pos2ControlMagnitude = getControlMagnitudeAdjacent(offset2);
    }
    // if edge 2 is one anti-clockwise from edge 1
    else if (edge1 == wrap6(edge2 + 1)) {
      // flips offset 1
      pos1 = getEdgePos(edge1, -offset1);
      // brings offset in smooth curve
      origin.y -= 0.25;
      origin.rotate((edge1 - 0.5) * Math.PI / 3);
      pos1ControlMagnitude = getControlMagnitudeAdjacent(offset1);
      pos2ControlMagnitude = getControlMagnitudeAdjacent(offset2);
    }

    // if edge 2 is two clockwise from edge 1
    else if (edge1 == wrap6(edge2 - 2)) {
      // flips offset 2
      pos2 = getEdgePos(edge2, -offset2);
      origin.rotate((edge1 + 1) * Math.PI / 3);
      pos1ControlMagnitude = getControlMagnitudeWide(offset1);
      pos2ControlMagnitude = getControlMagnitudeWide(offset2);
    }
    // if edge 2 is two anti-clockwise from edge 1
    else if (edge1 == wrap6(edge2 + 2)) {
      // flips offset 1
      pos1 = getEdgePos(edge1, -offset1);
      origin.rotate((edge1 - 1) * Math.PI / 3);
      pos1ControlMagnitude = getControlMagnitudeWide(offset1);
      pos2ControlMagnitude = getControlMagnitudeWide(offset2);
    }

    // if edges are opposites we add weak control points perpendicular to the point's edge
    // this is so converging/diverging lines meet perpendicularly
    if (Math.abs(edge2 - edge1) == 3) {
      // flip the offset 2 to create parallel lines
      pos2 = getEdgePos(edge2, -offset2);
      // make control points the start and end of line
      pos1ControlMagnitude = 0.5;
      pos2ControlMagnitude = 0.5;
    }

    // average magnitude of control points
    const controlMagnitude = (pos1ControlMagnitude + pos2ControlMagnitude) / 2;
    // generate control points by taking them away from the points
    let pos1Control = pos1.minusNew(getEdgePos(edge1, 0).normalise().multiplyEq(controlMagnitude));
    let pos2Control = pos2.minusNew(getEdgePos(edge2, 0).normalise().multiplyEq(controlMagnitude));

    this.curves.push({
      pos1,
      pos1Control,
      pos2Control,
      pos2,
    });
  }
}

export default Hexagon;
