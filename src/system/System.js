import settings from './settings';
import Canvas from './Canvas';
import Demo from './Demo';
import Hexagon from './Hexagon';
import { getEdgePos } from 'utils/hexagonUtils';
import { matchCurves } from 'utils/curveUtils';

class System {
  constructor({ windowWidth, windowHeight }) {
    this.hexagons = [];
    this.columns = Math.ceil(windowWidth / 2 / (settings.hexRadius * 3));
    this.rows = Math.ceil(windowHeight / (Math.sqrt(3) * settings.hexRadius / 2)) + 1;
    this.canvas = new Canvas(this);
    this.demo = new Demo(this);
    this.mouseTargetHex = undefined;
    this.mouseTargetHexLast = undefined;
    this.isDrawing = false;
    this.hasChange = false;
    this.setup();
  }

  setup() {
    // initialise 2D array of hexagons
    for (let x = 0; x < this.columns; x++) {
      this.hexagons.push([]);
      for (let y = 0; y < this.rows; y++) {
        this.hexagons[x].push(new Hexagon(this, x, y));
      }
    }

    // neighbouring needs to be done after they're all initialised
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.hexagons[x][y].initialiseNeighbours(x, y);
      }
    }
  }

  updateHexagons() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.hexagons[x][y].update();
      }
    }

    // update the demo
    if (this.hasChanged) {
      this.demo.updateCurves();
      this.hasChanged = false;
    }
  }

  render({ isMouseDown, lastMouseButton, ...props }) {
    this.canvas.updateMousePos(props);

    if (isMouseDown && !this.isDrawing) {
      // start drawing
      this.isDrawing = true;
    }

    if (!isMouseDown && this.isDrawing) {
      // end drawing
      this.isDrawing = false;
      // reset last target for multiple clicks on the same hexagon
      this.mouseTargetHexLast = undefined;
    }

    // don't do any target update if the mouse is out of bounds
    // or if it's long hovering
    // or if it's already been touched
    if (this.canvas.isMouseInside &&
        this.isDrawing &&
        this.mouseTargetHexLast !== this.mouseTargetHex &&
        !this.mouseTargetHex.isLongHovering) {

      // increment and loop on left mouse button
      if (lastMouseButton == 0) {

        // update global change value to propagate 3d redraw
        this.hasChanged = true;

        this.mouseTargetHex.nextActive = (this.mouseTargetHex.nextActive + 1) % 3;
      }
      // decrement on right mouse button
      else if (lastMouseButton == 2 && this.mouseTargetHex.nextActive > 0) {

        // update global change value to propagate 3d redraw
        // only if it's actually removing lines
        this.hasChanged = true;

        this.mouseTargetHex.nextActive--;
      }

      // update current hex before general update so neighbours can propagate
      this.mouseTargetHex.update();
      this.mouseTargetHexLast = this.mouseTargetHex;
    }

    // freeze layout if target is long hovering
    if (this.canvas.isMouseInside &&
        this.isDrawing &&
        this.mouseTargetHex.isLongHovering) {
      this.mouseTargetHex.freezeLayout();
    }

    this.updateHexagons();
    this.canvas.draw();
  }

  getHexagonData() {
    let curves = [];
    let caps = [];

    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        const hexagon = this.hexagons[x][y];
        // don't include curves if it's not active
        if (hexagon.active) {

          // make normalised position of hexagon center
          const hexagonPosition = {
            x: hexagon.layoutPos.x - this.canvas.internalWidth / (2 * settings.hexRadius),
            y: hexagon.layoutPos.y - this.canvas.internalHeight / (2 * settings.hexRadius),
          };

          // add each curve to the curves array
          hexagon.curves.forEach((curve) => {
            curve.hexagonPosition = hexagonPosition;
            curves.push(curve);
          });

          // search for caps
          // check that it has no curves
          if (hexagon.curves.length === 0) {
            const activeNeighbourIndex = hexagon.getActiveNeighbours().indexOf(true);
            const activeNeighbour = hexagon.neighbours[activeNeighbourIndex];
            // check that it has one neighbour
            // and that neighbour has more than one too, otherwise it won't have curves
            if (activeNeighbourIndex !== -1 &&
                activeNeighbour.countActiveNeighbours() > 1) {
              // add to caps array
              caps.push(
                Object.assign(
                  {},
                  {pos: getEdgePos(activeNeighbourIndex)},
                  {hexagonPosition: hexagonPosition},
                )
              );
            }
          }
        }
      }
    }

    // set relations between curves
    curves = matchCurves(curves);

    return {
      curves,
      caps,
    };
  }

}

export default System;
