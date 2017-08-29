import settings from './settings';
import Canvas from './Canvas';
import Demo from './Demo';
import Hexagon from './Hexagon';
import { matchCurves, configureDepth } from 'utils/curveUtils';

class System {
  constructor(UIStore) {
    this.hexagons = [];
    this.columns = undefined;
    this.rows = undefined;
    this.canvas = new Canvas(this);
    this.demo = new Demo(this);
    this.mouseTargetHex = undefined;
    this.mouseTargetHexLast = undefined;
    this.isDrawing = false;
    this.hasChange = false;

    this.setup(UIStore);
  }

  setup({ windowWidth, windowHeight }) {

    let columns, rows;
    // determnine size by width if width is bigger
    if (windowWidth / 2 > windowHeight) {
      columns = Math.ceil(windowWidth / 2 / (settings.hexRadius * 3));
      rows = Math.ceil(windowWidth / 2 / (Math.sqrt(3) * settings.hexRadius / 2)) + 1;
    }
    // otherwise determine it by height
    else {
      columns = Math.ceil(windowHeight / (settings.hexRadius * 3));
      rows = Math.ceil(windowHeight / (Math.sqrt(3) * settings.hexRadius / 2)) + 1;
    }
    // make sure they're both odd for symmetry's sake
    this.columns = (columns % 2) ? columns : columns + 1;
    this.rows = (rows % 2) ? rows : rows + 1;

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

  render({ isMouseDownOverCanvas, lastMouseButton, ...props }) {
    this.canvas.updateMousePos(props);

    if (isMouseDownOverCanvas && !this.isDrawing) {
      // start drawing
      this.isDrawing = true;
    }

    if (!isMouseDownOverCanvas && this.isDrawing) {
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
        !this.mouseTargetHex.editMode) {

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
        this.mouseTargetHex.editMode) {
      this.mouseTargetHex.freezeLayout();
    }

    this.updateHexagons();
    this.canvas.draw();
  }

  getCurvesData() {
    let curves = [];

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
        }
      }
    }

    if (curves.length) {
      // set relations between curves
      curves = matchCurves(curves);
      // smooth over the depths
      curves = configureDepth(curves);
    }

    return curves;
  }

  clearHexagons() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.hexagons[x][y].clear();
      }
    }

    this.demo.updateCurves();
    this.canvas.draw();
  }

}

export default System;
