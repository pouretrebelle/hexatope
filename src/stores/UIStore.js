import { observable, action } from 'mobx';

class UIStore {

  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable mouseX = 0;
  @observable mouseY = 0;
  @observable lastMouseButton = 0;
  @observable isMouseDownOverCanvas = false;
  @observable isMouseOverDemo = false;
  @observable curvesChangedSinceDemoUpdate = true;

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
    this.curvesChangedSinceDemoUpdate = true;
  }

  @action
  demoHasBeenUpdated = () => {
    this.curvesChangedSinceDemoUpdate = false;
  }

  onWindowResized = () => this.updateDimensions();
  onMouseMoved = (e) => this.updateMousePosition(e);
  onTouchMoved = (e) => this.updateMousePosition(e.touches[0]);
}

export default new UIStore();
