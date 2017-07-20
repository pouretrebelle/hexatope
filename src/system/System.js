import settings from './settings';
import Canvas from './Canvas';
import Demo from './Demo';
import Hexagon from './Hexagon';

class System {
  constructor({ windowWidth, windowHeight }) {
    this.hexagons = [];
    this.columns = Math.ceil(windowWidth / (settings.hexRadius * 3));
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

    // don't do anything if the mouse is outside of bounds
    if (this.canvas.isMouseInside &&
        this.isDrawing &&
        this.mouseTargetHexLast !== this.mouseTargetHex) {

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

      this.mouseTargetHexLast = this.mouseTargetHex;
    }

    this.updateHexagons();
    this.canvas.draw();
  }
}

export default System;
