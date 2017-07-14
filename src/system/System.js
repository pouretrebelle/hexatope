import Vector2 from 'utils/Vector2';
import settings from './settings';
import Hexagon from './Hexagon';

class System {
  constructor(canvas) {
    this.mousePos = new Vector2();
    this.hexagons = [];
    this.columns = settings.columns;
    this.rows = settings.rows;
    this.canvas = canvas;
    this.c = undefined;
    this.setup();
  }

  setup() {
    // calculate width and height of hexagons
    const hexHeight = Math.sqrt(3)*settings.hexRadius;

    // set rows and columns to overlap page edge
    // const columns = Math.ceil(window.innerWidth / (settings.hexRadius * 3));
    // const rows = Math.ceil(window.innerHeight / (hexHeight / 2)) + 1;

    // set up canvas

    this.c = this.canvas.getContext('2d');
    this.canvas.width = (this.columns + 1 / 4) * (settings.hexRadius * 3);
    this.canvas.height = (this.rows + 1) * (hexHeight / 2);

    // initialise 2D array of hexagons
    for (let x = 0; x < this.columns; x++) {
      this.hexagons.push([]);
      for (let y = 0; y < this.rows; y++) {
        this.hexagons[x].push(new Hexagon(this.c, this.hexagons, x, y));
      }
    }
    // neighbouring needs to be done after they're all initialised
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.hexagons[x][y].initialiseNeighbours(x, y);
      }
    }

    this.draw();
  }

  // Global Draw
  //======================================

  draw() {
    if (settings.drawGrid) {
      this.c.fillStyle = '#eee';
    } else {
      this.c.fillStyle = '#fff';
    }
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // important to draw all hexagons before lines to avoid overlap
    if (settings.drawHex || settings.drawGrid) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          this.hexagons[x][y].drawHex();
        }
      }
    }

    // draw hexagon at mouse position
    // if (drawMouse) drawMouseHexagon();

    if (settings.drawLines) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          this.hexagons[x][y].drawLines();
        }
      }
    }

    this.update();
  }


  // Global Update
  //======================================

  update() {
    // mousePos.x = mouseX;
    // mousePos.y = mouseY;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.hexagons[x][y].update();
      }
    }
  }
}

export default System;
