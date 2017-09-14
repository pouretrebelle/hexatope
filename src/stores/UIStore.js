import { observable, action } from 'mobx';

class UIStore {

  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable mouseX = 0;
  @observable mouseY = 0;
  @observable scrollTop = 0;
  @observable lastMouseButton = 0;
  @observable isMouseDownOverCanvas = false;
  @observable isMouseOverDemo = false;
  @observable demoIsAnimating = false;
  @observable curvesExist = false;
  @observable curvesChangedSinceDemoUpdate = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.createListeners();
      this.updateDimensions();
    }
  }

  createListeners() {
    window.addEventListener('resize', this.onWindowResized);
    window.addEventListener('scroll', this.onWindowScrolled);
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
    this.scrollTop = window.pageYOffset || 0;
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
    this.curvesExist = true;
    this.curvesChangedSinceDemoUpdate = true;
  }

  @action
  canvasHasBeenCleared = () => {
    this.curvesExist = false;
  }

  @action
  demoHasBeenUpdated = () => {
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

  onWindowResized = () => this.updateDimensions();
  onWindowScrolled = () => this.updateDimensions();
  onMouseMoved = (e) => this.updateMousePosition(e);
  onTouchMoved = (e) => this.updateMousePosition(e.touches[0]);
}

export default new UIStore();
