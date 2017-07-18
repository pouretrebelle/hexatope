import { observable, action } from 'mobx';

class UIStore {

  @observable windowWidth = 0;
  @observable windowHeight = 0;
  @observable mouseX = 0;
  @observable mouseY = 0;
  @observable lastMouseButton = 0;
  @observable isMouseDown = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.createListeners();
      this.updateDimensions();
    }
  }

  createListeners() {
    window.addEventListener('resize', this.onWindowResized);
    window.addEventListener('mousemove', this.onMouseMoved);
    window.addEventListener('mousedown', this.onClickStarted);
    window.addEventListener('mouseup', this.onClickEnded);

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
  startClick = (e) => {
    this.lastMouseButton = e.button;
    this.isMouseDown = true;
  }

  @action
  endClick = () => {
    this.isMouseDown = false;
  }

  onWindowResized = () => this.updateDimensions();
  onMouseMoved = (e) => this.updateMousePosition(e);
  onClickStarted = (e) => this.startClick(e);
  onClickEnded = () => this.endClick();
}

export default UIStore;
