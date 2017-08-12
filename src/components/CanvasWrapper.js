import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

@inject('UIStore') @observer
class Canvas extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
    this.mouseReaction = undefined;
  }

  componentDidMount() {
    const store = this.props.UIStore;
    this.props.system.canvas.setup(this.canvasElement, store);
    this.renderCanvas();

    // render canvas when mouse position is changed
    this.mouseReaction = reaction(
      () => [store.mouseY, store.mouseX, store.isMouseDown],
      () => this.renderCanvas(),
    );

    // resize canvas when window size is changed
    this.windowSizeReaction = reaction(
      () => [store.windowWidth, store.windowHeight],
      () => this.resizeCanvas(),
    );
  }

  renderCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.render(this.props.UIStore);
  }

  resizeCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.canvas.updateDimensions(this.props.UIStore);
  }

  render() {
    this.renderCanvas();

    return (
      <div>
        <canvas
          ref={element => this.canvasElement = element}
          style={{ cursor: 'crosshair' }}
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  system: PropTypes.object,
  UIStore: PropTypes.object,
};

export default Canvas;
