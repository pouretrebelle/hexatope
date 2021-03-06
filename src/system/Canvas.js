import C2S from 'canvas2svg';
import { saveAs } from 'file-saver';
import Vector2 from 'utils/Vector2';
import settings from './settings';
import { drawFilledHexagon } from 'utils/hexagonUtils';
import SettingsStore from 'stores/SettingsStore';
import { TOOL_MODES, GRID_ROTATION } from 'constants/options';

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

    this.SettingsStore = SettingsStore;
  }

  setup(canvas, wrapperElement, UIStore) {
    this.canvas = canvas;
    this.c = canvas.getContext('2d');
    this.c.scale(this.pixelRatio, this.pixelRatio);

    const hexHeight = Math.sqrt(3) * settings.hexRadius;
    this.internalWidth = (this.system.columns + 1 / 4) * (settings.hexRadius * 3);
    this.internalHeight = (this.system.rows + 1) * (hexHeight / 2);

    this.updateDimensions(wrapperElement, UIStore);
  }

  updateMousePos({ mouseX, mouseY, canvasBoundingBox }) {
    // pixel position of mouse relative to canvas wrapper
    let absoluteMouseX = mouseX - canvasBoundingBox.left;
    let absoluteMouseY = mouseY - canvasBoundingBox.top;

    // margin between the canvas and its wrapper (negative)
    const widthOverflowDiff = (canvasBoundingBox.width - this.externalWidth) / 2;
    const heightOverflowDiff = (canvasBoundingBox.height - this.externalHeight) / 2;

    // this is confusing
    const isHorizontal = (this.SettingsStore.gridRotation === GRID_ROTATION.HORIZONTAL);
    let rotatedMouseX = isHorizontal ? absoluteMouseY - heightOverflowDiff : absoluteMouseX - widthOverflowDiff;
    let rotatedMouseY = isHorizontal ? canvasBoundingBox.width - absoluteMouseX - widthOverflowDiff : absoluteMouseY - heightOverflowDiff;

    // dealing with pixel ratio and the difference between the actual hexagons and the canvas
    this.relativeMousePos.x = rotatedMouseX - (this.externalWidth - this.internalWidth) / (2 * this.pixelRatio);
    this.relativeMousePos.y = rotatedMouseY - (this.externalHeight - this.internalHeight) / (2 * this.pixelRatio);

    let mouseInside = true;
    if (absoluteMouseX > canvasBoundingBox.width || absoluteMouseX < 0) mouseInside = false;
    if (absoluteMouseY > canvasBoundingBox.height || absoluteMouseY < 0) mouseInside = false;
    this.isMouseInside = mouseInside;
  }

  updateDimensions(wrapperElement, UIStore) {
    const boundingBox = wrapperElement.getBoundingClientRect();

    UIStore.updateCanvasBoundingBox(boundingBox);

    this.externalWidth = boundingBox.width > boundingBox.height ? boundingBox.width : boundingBox.height;
    this.externalHeight = this.externalWidth;
    this.canvas.width = this.externalWidth * this.pixelRatio;
    this.canvas.style.width = `${this.externalWidth}px`;
    this.canvas.height = this.externalHeight * this.pixelRatio;
    this.canvas.style.height = `${this.externalHeight}px`;

    // redraw canvas
    this.draw();
  }

  draw(drawMouseHexagon) {
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
    if (drawMouseHexagon && this.isMouseInside) this.drawMouseHexagon();

    if (settings.drawCurves) {
      this.drawAllHexCurves(this.c);
    }

    this.c.restore();
  }

  drawMouseHexagon() {
    switch (this.SettingsStore.toolMode) {
      case TOOL_MODES.DRAW:
        this.c.fillStyle = this.system.isDrawing ? settings.mouseActiveColor : settings.mouseColor;
        break;
      case TOOL_MODES.EDIT:
        this.c.fillStyle = this.system.isDrawing ? settings.mouseEditActiveColor : settings.mouseEditColor;
        break;
      case TOOL_MODES.ERASE:
        this.c.fillStyle = this.system.isDrawing ? settings.mouseEraseActiveColor : settings.mouseEraseColor;
        break;
    }

    const target = this.system.mouseTargetHex;
    if (target) {
      drawFilledHexagon(this.c, target.layoutPos.multiplyNew(settings.hexRadius), this.pixelRatio);
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

  drawAllHexCurves(c) {
    for (let y = 0; y < this.system.rows; y++) {
      for (let x = 0; x < this.system.columns; x++) {
        this.drawHexCurves(this.system.hexagons[x][y], c);
      }
    }
  }

  drawHexCurves(hex, c) {
    // don't do anything if it's not in an active state
    if (!hex.active) return;

    c.save();
    const startX = hex.layoutPos.x * this.pixelRatio * settings.hexRadius;
    const startY = hex.layoutPos.y * this.pixelRatio * settings.hexRadius;
    c.translate(startX, startY);
    const scalar = this.pixelRatio * settings.hexRadius;
    c.lineWidth = settings.hexLineWeight * this.pixelRatio;

    hex.curves.forEach((curve) => {
      const { start, end } = curve;
      c.strokeStyle = settings.lineColor;
      // fade the curves if in erase mode
      // or it's the old curve when in layout cycle mode
      if (curve.drawFaded ||
          (hex === this.system.mouseTargetHex && this.SettingsStore.toolMode === TOOL_MODES.ERASE)) {
        c.strokeStyle = settings.lineColorFaded;
      }
      c.beginPath();
      c.moveTo(start.pos.x * scalar, start.pos.y * scalar);
      c.bezierCurveTo(
        start.controlPos.x * scalar,
        start.controlPos.y * scalar,
        end.controlPos.x * scalar,
        end.controlPos.y * scalar,
        end.pos.x * scalar,
        end.pos.y * scalar,
      );
      c.stroke();
      c.closePath();
    });

    c.restore();
  }

  downloadSVG() {
    // create new svg canvas context
    let svgC = new C2S(this.externalWidth * this.pixelRatio, this.externalHeight * this.pixelRatio);

    // draw all the hex curves to this context
    this.drawAllHexCurves(svgC);

    // create blob of svg content
    const blob = new Blob(
      [svgC.getSerializedSvg()],
      {
        type: 'text/plain',
      }
    );
    saveAs(blob, 'hexatope.svg');
  }
}

export default Canvas;
