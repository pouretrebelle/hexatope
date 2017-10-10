import { observable, action } from 'mobx';

class UIStore {

  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable mouseX = 0;
  @observable mouseY = 0;
  @observable canvasBoundingBox = undefined;
  @observable lastMouseButton = 0;
  @observable isMouseDownOverCanvas = false;
  @observable isMouseOverDemo = false;
  @observable demoIsAnimating = false;
  @observable demoIsEmpty = true;
  @observable curvesExist = false;
  @observable curvesChangedSinceDemoUpdate = true;
  @observable demoVisibleOnMobile = false;
  @observable drawMouseHexagon = true;
  @observable isChosingHangingPoint = false;

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

  startChosingHangingPoint = () => {
    this.isChosingHangingPoint = true;
  }

  @action
  endChosingHangingPoint = () => {
    this.isChosingHangingPoint = false;
  }

  onWindowResized = () => this.updateDimensions();
  onMouseMoved = (e) => this.updateMousePosition(e);
  onTouchMoved = (e) => this.updateMousePosition(e.touches[0]);
}

export default new UIStore();
