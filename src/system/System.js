import Vector2 from 'utils/Vector2';
import settings from './settings';
import { drawHexagon } from 'utils/hexagonUtils';
import Hexagon from './Hexagon';

class System {
  constructor(canvas, { windowWidth, windowHeight }) {
    this.relativeMousePos = new Vector2();
    this.hexagons = [];
    this.columns = Math.ceil(windowWidth / (settings.hexRadius * 3));
    this.rows = Math.ceil(windowHeight / (Math.sqrt(3) * settings.hexRadius / 2)) + 1;
    this.internalWidth = undefined;
    this.internalHeight = undefined;
    this.canvas = canvas;
    this.c = undefined;
    this.mouseTargetHex = undefined;
    this.mouseTargetHexLast = undefined;
    this.isDrawing = false;
    this.setup();
  }

  setup() {
    // calculate width and height of hexagons
    const hexHeight = Math.sqrt(3)*settings.hexRadius;

    // set up canvas
    this.c = this.canvas.getContext('2d');
    this.internalWidth = (this.columns + 1 / 4) * (settings.hexRadius * 3);
    this.internalHeight = (this.rows + 1) * (hexHeight / 2);

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

  // Global Draw
  //======================================

  draw() {
    this.c.fillStyle = settings.gridColor,
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.c.save();
    // center hexagons in canvas
    this.c.translate(
      (this.canvas.width - this.internalWidth) / 2,
      (this.canvas.height - this.internalHeight) / 2,
    );

    // draw all hexagons before lines to avoid overlap
    if (settings.drawHex || settings.drawGrid) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          this.hexagons[x][y].drawHex();
        }
      }
    }

    // draw hexagon at mouse position
    if (settings.drawMouse) this.drawMouseHexagon();

    if (settings.drawCurves) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          this.hexagons[x][y].drawCurves();
        }
      }
    }

    this.c.restore();
  }

  drawMouseHexagon() {
    this.c.fillStyle = settings.mouseColor;
    if (this.mouseTargetHex) {
      drawHexagon(this.c, this.mouseTargetHex.pixelPos);
    }
  }

  // Global Update
  //======================================

  updateDimensions({ windowWidth, windowHeight }) {
    this.canvas.width = windowWidth;
    this.canvas.height = windowHeight;
  }

  updateMousePos({ mouseX, mouseY }) {
    this.relativeMousePos.x = mouseX - (this.canvas.width - this.internalWidth) / 2;
    this.relativeMousePos.y = mouseY - (this.canvas.height - this.internalHeight) / 2;
  }

  updateHexagons() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.hexagons[x][y].update();
      }
    }
  }

  render({ isMouseDown, lastMouseButton, ...props }) {
    this.updateDimensions(props);
    this.updateMousePos(props);

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

    if (this.isDrawing &&
        this.mouseTargetHexLast !== this.mouseTargetHex) {
      // increment and loop on left mouse button
      if (lastMouseButton == 0) {
        this.mouseTargetHex.nextActive = (this.mouseTargetHex.nextActive + 1) % 3;
      }
      // decrement on right mouse button
      else if (lastMouseButton == 2 && this.mouseTargetHex.nextActive > 0) {
        this.mouseTargetHex.nextActive--;
      }

      this.mouseTargetHexLast = this.mouseTargetHex;
    }

    this.updateHexagons();
    this.draw();
  }
}

export default System;
