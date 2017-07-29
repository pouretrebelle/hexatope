import Vector2 from 'utils/Vector2';
import settings from './settings';
import { drawFilledHexagon, drawOutlinedHexagon } from 'utils/hexagonUtils';

class Canvas {
  constructor(system) {
    this.system = system;
    this.canvas = undefined;
    this.c = undefined;

    this.internalWidth = undefined;
    this.internalHeight = undefined;
    this.externalWidth = undefined;
    this.externalHeight = undefined;

    this.relativeMousePos = new Vector2();
    this.isMouseInside = false;
    this.pixelRatio = window.devicePixelRatio || 1;
  }

  setup(canvas, UIStore) {
    this.canvas = canvas;
    this.c = canvas.getContext('2d');
    this.c.scale(this.pixelRatio, this.pixelRatio);

    const hexHeight = Math.sqrt(3) * settings.hexRadius;
    this.internalWidth = (this.system.columns + 1 / 4) * (settings.hexRadius * 3);
    this.internalHeight = (this.system.rows + 1) * (hexHeight / 2);

    this.updateDimensions(UIStore);
  }

  updateMousePos({ mouseX, mouseY }) {
    this.relativeMousePos.x = mouseX - (this.externalWidth - this.internalWidth) / (2 * this.pixelRatio);
    this.relativeMousePos.y = mouseY - (this.externalHeight - this.internalHeight) / (2 * this.pixelRatio);

    let mouseInside = true;
    if (mouseX > this.externalWidth) mouseInside = false;
    if (mouseY > this.externalHeight) mouseInside = false;
    this.isMouseInside = mouseInside;
  }

  updateDimensions({ windowWidth, windowHeight }) {
    this.externalWidth = windowWidth / 2;
    this.externalHeight = windowHeight;
    this.canvas.width = this.externalWidth * this.pixelRatio;
    this.canvas.style.width = `${this.externalWidth}px`;
    this.canvas.height = this.externalHeight * this.pixelRatio;
    this.canvas.style.height = `${this.externalHeight}px`;
  }

  draw() {
    if (!this.c) return;

    this.c.fillStyle = settings.gridColor;
    this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.c.save();
    // center hexagons in canvas
    this.c.translate(
      (this.externalWidth - this.internalWidth) / 2,
      (this.externalHeight - this.internalHeight) / 2,
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
    if (settings.drawMouse && this.isMouseInside) this.drawMouseHexagon();

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
    const target = this.system.mouseTargetHex;
    if (target) {
      drawFilledHexagon(this.c, target.layoutPos.multiplyNew(settings.hexRadius), this.pixelRatio);

      if (target.isLongHovering) {
        this.c.strokeStyle = settings.focusColor;
        this.c.lineWidth = settings.hexFocusLineWeight;
        drawOutlinedHexagon(this.c, target.layoutPos.multiplyNew(settings.hexRadius), this.pixelRatio);
      }
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
    drawFilledHexagon(this.c, hex.layoutPos.multiplyNew(settings.hexRadius), this.pixelRatio);
  }

  drawHexCurves(hex) {
    // don't do anything if it's not in an active state
    if (!hex.active) return;

    this.c.save();
    const startX = hex.layoutPos.x * this.pixelRatio * settings.hexRadius;
    const startY = hex.layoutPos.y * this.pixelRatio * settings.hexRadius;
    this.c.translate(startX, startY);
    this.c.strokeStyle = '#000';
    const scalar = this.pixelRatio * settings.hexRadius;
    this.c.lineWidth = settings.hexLineWeight * this.pixelRatio;

    hex.curves.forEach(({ pos1, pos1Control, pos2Control, pos2 }) => {
      this.c.beginPath();
      this.c.moveTo(pos1.x * scalar, pos1.y * scalar);
      this.c.bezierCurveTo(
        pos1Control.x * scalar,
        pos1Control.y * scalar,
        pos2Control.x * scalar,
        pos2Control.y * scalar,
        pos2.x * scalar,
        pos2.y * scalar,
      );
      this.c.stroke();
      this.c.closePath();
    });

    this.c.restore();
  }
}

export default Canvas;
