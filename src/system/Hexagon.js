import Vector2 from 'utils/Vector2';
import { wrap6, random } from 'utils/numberUtils';
import { drawHexagon, getEdgePos } from 'utils/hexagonUtils';
import settings from './settings';

const hexWidth = settings.hexRadius * 2;
const hexHeight = settings.hexRadius * Math.sqrt(3);

class Hexagon {
  constructor(system, x, y) {
    this.system = system;
    this.c = system.c;
    this.hexagons = system.hexagons;

    // establish grid position
    this.pos = new Vector2(x, y);

    // establish pixel position
    this.pixelPos = new Vector2();
    this.pixelPos.x = hexWidth * (1.5 * x + 0.5 + y % 2 * 0.75);
    this.pixelPos.y = hexHeight * (y * 0.5 + 0.5);

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
    if (this.system.relativeMousePos.dist(this.pixelPos) < settings.hexRadius) {
      this.system.mouseTargetHex = this;
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

  drawHex() {
    // called in global draw
    // even if drawHex is inactive we need to draw them blank
    // if drawGrid is active
    if (settings.drawHex && this.active) {
      let brightness = this.active * 15;
      let r = 255 - brightness;
      let g = 255 - brightness;
      let b = 255 - brightness;
      // add colour to visualise which layout it is
      if (this.countActiveNeighbours() > 3) {
        // blue
        if (this.denseLayout == 1) {
          r -= 25;
          g += 5;
          b += 20;
        }
        // pink
        else if (this.denseLayout == 2) {
          r += 20;
          g -= 25;
          b += 5;
        }
        // green
        else if (this.denseLayout == 3) {
          r += 5;
          g += 20;
          b -= 25;
        }
      }
      this.c.fillStyle = `rgb(${r}, ${g}, ${b})`;
    }
    else if (settings.drawHex) {
      this.c.fillStyle = '#fff';
    }
    drawHexagon(this.c, this.pixelPos);
  }

  drawLines() {
    // called in global draw
    this.c.save();
    this.c.translate(this.pixelPos.x, this.pixelPos.y);
    if (this.active) { // truthy
      let activeNeighboursCount = this.countActiveNeighbours();
      let activeNeighbours = this.getActiveNeighbours();
      this.c.strokeStyle = '#000';
      this.c.lineWidth = settings.hexLineWeight;

      // no neighbours
      if (activeNeighboursCount == 0) {
        if (settings.drawPoints && this.active == 2) {
          this.c.ellipse(0, 0, settings.hexDoubleLineOffset, settings.hexDoubleLineOffset, 0, 0, Math.PI*2);
        }
      }

      // one neighbour
      else if (activeNeighboursCount == 1) {
        let activeEdge = activeNeighbours.indexOf(true);
        let activeNeighbour = this.neighbours[activeEdge];
        // if it is double active
        // or the active neighbour is double active
        if (activeNeighbour.active == 2 ||
          this.active == 2) {
          // if drawPoints is inactive the neighbour must have > 1 active neighbour
          // to avoid ellipses on an active edge
          if (settings.drawPoints || activeNeighbour.countActiveNeighbours() > 1) {
            // get two edge points
            const pos1 = getEdgePos(activeEdge, 1);
            const pos2 = getEdgePos(activeEdge, -1);
            // get two control points
            const control1 = new Vector2(settings.hexDoubleLineOffset * 0.5, -hexHeight / 2 + settings.hexDoubleLineOffset).rotate(activeEdge * Math.PI / 3);
            const control2 = new Vector2(-settings.hexDoubleLineOffset * 0.5, -hexHeight / 2 + settings.hexDoubleLineOffset).rotate(activeEdge * Math.PI / 3);
            // draw bezier curve for arc cap
            this.c.beginPath();
            this.c.moveTo(pos1.x, pos1.y);
            this.c.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, pos2.x, pos2.y);
            this.c.closePath();
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
                this.drawCurveBetweenEdges(i, j);
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
            this.drawCurveBetweenEdges(positions[0], positions[1]);
            this.drawCurveBetweenEdges(positions[1], positions[2]);
            this.drawCurveBetweenEdges(positions[2], positions[3]);
          }
          else if (this.denseLayout == 2) {
            // cross over curves
            this.drawCurveBetweenEdges(positions[0], positions[2]);
            this.drawCurveBetweenEdges(positions[1], positions[3]);
          }
          else {
            // pair edges with adjacent edges
            this.drawCurveBetweenEdges(positions[0], positions[1]);
            this.drawCurveBetweenEdges(positions[2], positions[3]);
          }
        }

        // 1 and 3 situation
        // or 2 and 2
        else {
          if (this.denseLayout == 3) {
            // connect edges to adjacent edges
            this.drawCurveBetweenEdges(positions[0], positions[1]);
            this.drawCurveBetweenEdges(positions[1], positions[2]);
            this.drawCurveBetweenEdges(positions[2], positions[3]);
            this.drawCurveBetweenEdges(positions[3], positions[0]);
          }
          else if (this.denseLayout == 2) {
            // pair edges with adjacent edges
            this.drawCurveBetweenEdges(positions[3], positions[0]);
            this.drawCurveBetweenEdges(positions[1], positions[2]);
          }
          else {
            // pair edges with opposite adjacent edges
            this.drawCurveBetweenEdges(positions[0], positions[1]);
            this.drawCurveBetweenEdges(positions[2], positions[3]);
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
            this.drawCurveBetweenEdges(edge1, i + 1);
          }
        }
        else if (this.denseLayout == 2) {
          // batman logo
          // curve between the two skipped-adjacent edges
          this.drawCurveBetweenEdges(skipped + 1, skipped + 5);
          // connect other 3 to eachother
          this.drawCurveBetweenEdges(skipped + 2, skipped + 3);
          this.drawCurveBetweenEdges(skipped + 3, skipped + 4);
        }
        else if (this.denseLayout == 1) {
          // evil M
          // curve the two skipped-adjacent edges to the skipped-opposite edge
          this.drawCurveBetweenEdges(skipped + 1, skipped + 3);
          this.drawCurveBetweenEdges(skipped + 5, skipped + 3);
          // curve the other two edges to the skipped-adjacent edges
          this.drawCurveBetweenEdges(skipped + 1, skipped + 2);
          this.drawCurveBetweenEdges(skipped + 5, skipped + 4);
        }
      }

      // 6 neighbours
      else {
        if (this.denseLayout == 3) {
          // connect edges to adjacent edges
          for (let i = 0; i < 6; i++) {
            this.drawCurveBetweenEdges(i, i + 1);
          }
        }
        else {
          // pair edges with adjacent edges
          // alternate using denseLayout == 2 or 1
          for (let i = this.denseLayout - 1; i < 6; i += 2) {
            this.drawCurveBetweenEdges(i, i + 1);
          }
        }
      }

    }
    this.c.restore();
  }

  drawCurveBetweenEdges(edge1, edge2) {
    // called by drawLines()
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
      // set outer control point slightly further than offset width
      // to create even margin
      // cos bezier curves, son
      this.drawCurveWithOffset(edge1, edge2, 1, 1, -settings.hexDoubleLineOffset * 0.8);
      this.drawCurveWithOffset(edge1, edge2, -1, -1, settings.hexDoubleLineOffset * 0.5);
    }

    // if tile is single active
    // and not both of the edges are double active
    else {
      // if edge1 hexagon exists and is double active
      if ((this.neighbours[edge1] && this.neighbours[edge1].active == 2)) {
        // use half offset width for midpoint of diverging lines
        // set outer control point slightly further to create even margin
        this.drawCurveWithOffset(edge1, edge2, 1, 0, -settings.hexDoubleLineOffset * 0.4);
        this.drawCurveWithOffset(edge1, edge2, -1, 0, settings.hexDoubleLineOffset * 0.25);
      }
      // if edge2 hexagon exists and is double active
      else if ((this.neighbours[edge2] && this.neighbours[edge2].active == 2)) {
        // use half offset width for midpoint between single and double
        // set outer control point slightly further to create even margin
        this.drawCurveWithOffset(edge1, edge2, 0, 1, -settings.hexDoubleLineOffset * 0.4);
        this.drawCurveWithOffset(edge1, edge2, 0, -1, settings.hexDoubleLineOffset * 0.25);
      }
      // if everything is single
      else {
        this.drawCurveWithOffset(edge1, edge2, 0, 0);
      }
    }
  }

  drawCurveWithOffset(edge1, edge2, offset1, offset2, originOffset) {
    // called by drawCurveBetweenEdges()
    // determines which is the inner and outer line
    // sets offset and draws line accordingly

    // originOffset is the distance we move the origin point
    // in the opposite direction of the average angle of the two points
    let origin = new Vector2();
    if (originOffset) {
      origin.y = originOffset;
    }

    // set up positions as per offsets
    let pos1 = getEdgePos(edge1, offset1);
    let pos2 = getEdgePos(edge2, offset2);

    // if edge 2 is one clockwise from edge 1
    if (edge1 == wrap6(edge2 - 1)) {
      // flips offset 2
      pos2 = getEdgePos(edge2, -offset2);
      // brings offset in smooth curve
      origin.y -= settings.hexRadius * 0.25;
      origin.rotate((edge1 + 0.5) * Math.PI / 3);
    }
    // if edge 2 is one anti-clockwise from edge 1
    else if (edge1 == wrap6(edge2 + 1)) {
      // flips offset 1
      pos1 = getEdgePos(edge1, -offset1);
      // brings offset in smooth curve
      origin.y -= settings.hexRadius * 0.25;
      origin.rotate((edge1 - 0.5) * Math.PI / 3);
    }

    // if edge 2 is two clockwise from edge 1
    else if (edge1 == wrap6(edge2 - 2)) {
      // flips offset 2
      pos2 = getEdgePos(edge2, -offset2);
      origin.rotate((edge1 + 1) * Math.PI / 3);
    }
    // if edge 2 is two anti-clockwise from edge 1
    else if (edge1 == wrap6(edge2 + 2)) {
      // flips offset 1
      pos1 = getEdgePos(edge1, -offset1);
      origin.rotate((edge1 - 1) * Math.PI / 3);
    }

    // if edges are opposites
    // using the line function everything is 1px off
    // so we just use the quadratic bezier
    if (Math.abs(edge2 - edge1) == 3) {
      // flip the offset 2 to create parallel lines
      pos2 = getEdgePos(edge2, -offset2);
      // reset origin offset so line is straight
      origin.y = (settings.hexDoubleLineOffset * 0.5) * (offset1 + offset2) * 0.5 * (edge1 - edge2) / 3;
      origin.rotate((edge1 + 1.5) * Math.PI / 3);
    }

    // draw the line
    this.c.beginPath();
    this.c.moveTo(pos1.x, pos1.y);
    this.c.quadraticCurveTo(origin.x, origin.y, pos2.x, pos2.y);
    this.c.closePath();
  }
}

export default Hexagon;
