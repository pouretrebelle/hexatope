import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';

import UIStore from 'stores/UIStore';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
    this.mouseReaction = undefined;
  }

  componentDidMount() {
    this.props.system.canvas.setup(this.canvasElement, UIStore);
    this.renderCanvas();

    // render canvas when mouse position is changed
    this.mouseReaction = reaction(
      () => [
        UIStore.mouseY,
        UIStore.mouseX,
        UIStore.isMouseDown,
      ],
      () => this.renderCanvas(),
    );

    // resize canvas when window size is changed
    this.windowSizeReaction = reaction(
      () => [
        UIStore.windowWidth,
        UIStore.windowHeight,
      ],
      () => this.resizeCanvas(),
    );
  }

  startDrawing = (e) => {
    UIStore.startPoint(e);
  }

  endDrawing = () => {
    UIStore.endPoint();
  }

  renderCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.render(UIStore);
  }

  resizeCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.canvas.updateDimensions(UIStore);
  }

  render() {
    this.renderCanvas();

    return (
      <div>
        <canvas
          ref={element => this.canvasElement = element}
          style={{ cursor: 'crosshair' }}
          onMouseDown={this.startDrawing}
          onTouchStart={this.startDrawing}
          onMouseOut={this.endDrawing}
          onMouseUp={this.endDrawing}
          onTouchEnd={this.endDrawing}
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  system: PropTypes.object,
};

export default Canvas;
