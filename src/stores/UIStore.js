import { observable, computed, action } from 'mobx';

class UIStore {

  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable mouseX = 0;
  @observable mouseY = 0;
  @observable canvasBoundingBox = undefined;
  @observable demoBoundingBox = undefined;
  @observable lastMouseButton = 0;
  @observable isMouseDownOverCanvas = false;
  @observable isMouseOverDemo = false;
  @observable demoIsAnimating = false;
  @observable demoIsEmpty = true;
  @observable curvesExist = false;
  @observable curvesChangedSinceDemoUpdate = true;
  @observable demoVisibleOnMobile = false;
  @observable drawMouseHexagon = true;
  @observable showChain = false;
  @observable hangingPointAngle = 0;
  @observable isChosingHangingPoint = false;
  initialHangingPointAngle = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.createListeners();
      this.updateDimensions();
    }
  }

  createListeners() {
    window.addEventListener('resize', this.onWindowResized);
    window.addEventListener('mousemove', this.onMouseMoved);
    window.addEventListener('touchmove', this.onTouchMoved);

    // don't open menu on right click, for manual dragging
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  @computed
  get angleToCenterOfDemo() {
    return - Math.atan2(
      this.mouseY - (this.demoBoundingBox.top + this.demoBoundingBox.height / 2),
      this.mouseX - (this.demoBoundingBox.left + this.demoBoundingBox.width / 2),
    ) - Math.PI / 2;
  }

  @action
  updateDimensions = () => {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = undefined;
    }
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  @action
  updateMousePosition = (e) => {
    this.mouseX = e.pageX;
    this.mouseY = e.pageY;
  }

  @action
  updateCanvasBoundingBox = (boundingBox) => {
    this.canvasBoundingBox = boundingBox;
  }

  @action
  updateDemoBoundingBox = (boundingBox) => {
    this.demoBoundingBox = boundingBox;
  }

  @action
  startPoint = (e) => {
    this.lastMouseButton = e.button || 0; // default to left button
    this.isMouseDownOverCanvas = true;
  }

  @action
  endPoint = () => {
    this.isMouseDownOverCanvas = false;
  }

  @action
  mouseIsOverDemo = () => {
    this.isMouseOverDemo = true;
  }

  @action
  mouseNotOverDemo = () => {
    this.isMouseOverDemo = false;
  }

  @action
  curvesHaveChanged = () => {
    this.curvesExist = true;
    this.curvesChangedSinceDemoUpdate = true;
  }

  @action
  canvasHasBeenCleared = () => {
    this.curvesExist = false;
  }

  @action
  resetDemo = () => {
    this.showChain = false;
    this.hangingPointAngle = 0;
  }

  @action
  demoHasBeenUpdated = () => {
    this.demoIsEmpty = false;
    this.curvesChangedSinceDemoUpdate = false;
  }

  @action
  demoAnimationStarted = () => {
    this.demoIsAnimating = true;
  }

  @action
  demoAnimationEnded = () => {
    this.demoIsAnimating = false;
  }

  @action
  demoIsVisibleOnMobile = (isDemoVisible) => {
    this.demoVisibleOnMobile = isDemoVisible;
  }

  @action
  startDrawingMouseHexagon = () => {
    this.drawMouseHexagon = true;
  }

  @action
  stopDrawingMouseHexagon = () => {
    this.drawMouseHexagon = false;
  }

  @action
  startChosingHangingPoint = () => {
    this.isChosingHangingPoint = true;
    this.showChain = true;
    // update initial hanging point to avoid jerkiness
    this.initialHangingPointAngle = this.angleToCenterOfDemo;
  }

  @action
  endChosingHangingPoint = () => {
    this.initialHangingPointAngle = 0;
    this.isChosingHangingPoint = false;
  }

  @action
  updateHangingPointAngle = (angle) => {
    this.hangingPointAngle = angle;
  }

  onWindowResized = () => this.updateDimensions();
  onMouseMoved = (e) => this.updateMousePosition(e);
  onTouchMoved = (e) => this.updateMousePosition(e.touches[0]);
}

export default new UIStore();
