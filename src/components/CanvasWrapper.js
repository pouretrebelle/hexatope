import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';

import UIStore from 'stores/UIStore';
import CanvasSettings from './CanvasSettings';

import styles from './CanvasWrapper.sass';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
    this.canvasWrapperElement = undefined;
    this.mouseReaction = undefined;
  }

  componentDidMount() {
    this.props.system.canvas.setup(this.canvasElement, this.canvasWrapperElement, UIStore);
    this.renderCanvas();

    // render canvas when mouse position is changed
    this.mouseReaction = reaction(
      () => [
        UIStore.mouseY,
        UIStore.mouseX,
        UIStore.isMouseDownOverCanvas,
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
    this.props.system.canvas.updateDimensions(this.canvasWrapperElement, UIStore);
  }

  render() {
    this.renderCanvas();

    return (
      <div
        className={styles.canvasWrapper}
        ref={element => this.canvasWrapperElement = element}
      >
        <CanvasSettings system={this.props.system} />
        <canvas
          ref={element => this.canvasElement = element}
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
