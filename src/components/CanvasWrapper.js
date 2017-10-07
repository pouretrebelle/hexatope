import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import classNames from 'classnames';

import CanvasSettings from './CanvasSettings';

import styles from './CanvasWrapper.sass';

@inject('UIStore') @observer
class Canvas extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
    this.canvasWrapperElement = undefined;
    this.mouseReaction = undefined;
  }

  componentDidMount() {
    const { system, UIStore } = this.props;

    system.canvas.setup(this.canvasElement, this.canvasWrapperElement, UIStore);
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
    this.props.UIStore.startPoint(e);
  }

  endDrawing = () => {
    this.props.UIStore.endPoint();
  }

  renderCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.render(this.props.UIStore);
  }

  resizeCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.canvas.updateDimensions(this.canvasWrapperElement, this.props.UIStore);
  }

  render() {
    const { system, UIStore } = this.props;
    const wrapperClasses = classNames({
      [styles.canvasWrapper]: true,
      [styles.canvasHiddenOnMobile]: UIStore.demoVisibleOnMobile,
    });

    this.renderCanvas();

    return (
      <div
        className={wrapperClasses}
        ref={element => this.canvasWrapperElement = element}
      >
        <CanvasSettings system={system} />
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
  UIStore: PropTypes.object,
  system: PropTypes.object,
};

export default Canvas;
