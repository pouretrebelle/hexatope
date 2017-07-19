class Demo {
  constructor(system) {
    this.system = system;
    this.canvas = undefined;
    this.c = undefined;
  }

  setup(canvas, UIStore) {
    this.canvas = canvas;
    this.c = canvas.getContext('2d');

    this.updateDimensions(UIStore);
  }

  updateDimensions({ windowWidth, windowHeight }) {
    this.canvas.width = windowWidth / 2;
    this.canvas.height = windowHeight;
  }

  draw() {
    if (!this.c) return;

    this.c.fillStyle = 'crimson';
    this.c.fillRect(0, 0, 100, 100);
  }
}

export default Demo;
