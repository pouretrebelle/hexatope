import Vector2 from 'utils/Vector2';
import settings from './settings';
import { drawHexagon } from 'utils/hexagonUtils';

class Canvas {
  constructor(system) {
    this.system = system;
    this.canvas = undefined;
    this.c = undefined;
    this.internalWidth = undefined;
    this.internalHeight = undefined;
    this.relativeMousePos = new Vector2();
  }

  setup(canvas, UIStore) {
    this.canvas = canvas;
    this.c = canvas.getContext('2d');

    const hexHeight = Math.sqrt(3) * settings.hexRadius;
    this.internalWidth = (this.system.columns + 1 / 4) * (settings.hexRadius * 3);
    this.internalHeight = (this.system.rows + 1) * (hexHeight / 2);

    this.updateDimensions(UIStore);
  }

  updateMousePos({ mouseX, mouseY }) {
    this.relativeMousePos.x = mouseX - (this.canvas.width - this.internalWidth) / 2;
    this.relativeMousePos.y = mouseY - (this.canvas.height - this.internalHeight) / 2;
  }

  updateDimensions({ windowWidth, windowHeight }) {
    this.canvas.width = windowWidth / 2;
    this.canvas.height = windowHeight;
  }

  draw() {
    if (!this.c) return;

    this.c.fillStyle = settings.gridColor;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.c.save();
    // center hexagons in canvas
    this.c.translate(
      (this.canvas.width - this.internalWidth) / 2,
      (this.canvas.height - this.internalHeight) / 2,
    );

    // draw all hexagons before lines to avoid overlap
    if (settings.drawHex || settings.drawGrid) {
      for (let y = 0; y < this.system.rows; y++) {
        for (let x = 0; x < this.system.columns; x++) {
          this.drawHex(this.system.hexagons[x][y]);
        }
      }
    }

    // draw hexagon at mouse position
    if (settings.drawMouse) this.drawMouseHexagon();

    if (settings.drawCurves) {
      for (let y = 0; y < this.system.rows; y++) {
        for (let x = 0; x < this.system.columns; x++) {
          this.drawHexCurves(this.system.hexagons[x][y]);
        }
      }
    }

    this.c.restore();
  }

  drawMouseHexagon() {
    this.c.fillStyle = settings.mouseColor;
    if (this.system.mouseTargetHex) {
      drawHexagon(this.c, this.system.mouseTargetHex.pixelPos);
    }
  }

  drawHex(hex) {
    // even if drawHex is inactive we need to draw them blank
    // if drawGrid is active
    switch (hex.active) {
      case 0:
        this.c.fillStyle = settings.inactiveColor;
        break;
      case 1:
        this.c.fillStyle = settings.activeColor;
        break;
      case 2:
        this.c.fillStyle = settings.doubleActiveColor;
        break;
    }
    drawHexagon(this.c, hex.pixelPos);
  }

  drawHexCurves(hex) {
    // don't do anything if it's not in an active state
    if (!hex.active) return;

    this.c.save();
    this.c.translate(hex.pixelPos.x, hex.pixelPos.y);
    this.c.strokeStyle = '#000';
    this.c.lineWidth = settings.hexLineWeight;

    hex.curves.forEach(({ pos1, pos1Control, pos2Control, pos2 }) => {
      this.c.beginPath();
      this.c.moveTo(pos1.x, pos1.y);
      this.c.bezierCurveTo(
        pos1Control.x,
        pos1Control.y,
        pos2Control.x,
        pos2Control.y,
        pos2.x,
        pos2.y,
      );
      this.c.stroke();
      this.c.closePath();
    });

    this.c.restore();
  }
}

export default Canvas;
