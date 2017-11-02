import settings from './settings';
import Canvas from './Canvas';
import Demo from './Demo';
import Hexagon from './Hexagon';
import GTMTracking from 'GTMTracking';
import { saveAs } from 'file-saver';
import { matchCurves, configureDepth, getTotalLength, isolateLargestShape } from 'utils/curveUtils';
import { exportDesignData } from 'utils/exportUtils';
import { getRandomExampleDesign, importDesignData } from 'utils/importUtils';

class System {
  constructor(UIStore, preserveDrawingBuffer) {
    this.hexagons = [];
    this.columns = undefined;
    this.rows = undefined;
    this.canvas = new Canvas(this);
    this.demo = new Demo(this);
    this.mouseTargetHex = undefined;
    this.mouseTargetHexLast = undefined;
    this.isDrawing = false;
    this.UIStore = UIStore;
    this.preserveDrawingBuffer = preserveDrawingBuffer; // for three screenshotting

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
  }

  render({ isMouseDownOverCanvas, lastMouseButton, drawMouseHexagon, ...props }) {
    this.canvas.updateMousePos(props);

    if (this.mouseTargetHex) {

      const wasDrawing = this.isDrawing;
      const isDrawing = isMouseDownOverCanvas;

      const isNewTargetHex = this.mouseTargetHex !== this.mouseTargetHexLast;

      if (wasDrawing && !isDrawing) {
        // reset last target for multiple clicks
        this.mouseTargetHexLast = undefined;
      }

      if (!wasDrawing && isDrawing) {
        this.mouseTargetHex.onMouseClicked(lastMouseButton);
      }

      if (isNewTargetHex) {
        if (this.mouseTargetHexLast) this.mouseTargetHexLast.onMouseLeft();
        this.mouseTargetHex.onMouseEntered(this.isDrawing, lastMouseButton);
      }

      // update global var for mouse colours
      this.isDrawing = isDrawing;

      this.mouseTargetHex.update();
      this.mouseTargetHexLast = this.mouseTargetHex;
    }

    this.updateHexagons();
    this.canvas.draw(drawMouseHexagon);

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
      // reduce to main piece
      curves = isolateLargestShape(curves);

      this.calculateVolume(curves);
    }

    return curves;
  }

  calculateVolume(curves) {
    const volumeCm3 = getTotalLength(curves) / settings.wireLengthPerCm3;
    this.UIStore.setRewardVolumeApproval(volumeCm3 < settings.maxRewardVolumeCm3);

    GTMTracking.trackEvent(
      'volumeCalculated',
      {
        volume: volumeCm3,
      }
    );
  }

  clearHexagons = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.hexagons[x][y].clear();
      }
    }

    this.canvas.draw();
  }

  curvesHaveChanged() {
    this.UIStore.curvesHaveChanged();
  }

  exportJSON() {
    const json = JSON.stringify(exportDesignData(this));

    const blob = new Blob(
      [json],
      {
        type: 'application/json',
      }
    );
    saveAs(blob, 'hexatope.json');
  }

  importRandomDesign = () => {
    this.importJSONDesign(getRandomExampleDesign());
  }

  importJSONDesign(json) {
    importDesignData(this, json);
  }
}

export default System;
