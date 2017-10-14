import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import classNames from 'classnames';

import CanvasSettings from './CanvasSettings';

import { GRID_ROTATION } from 'constants/options';
import { CANVAS_ROTATION_TRANSITION_DURATION } from 'constants/timing';

import styles from './CanvasWrapper.sass';

@inject('UIStore', 'SettingsStore') @observer
class Canvas extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
    this.canvasWrapperElement = undefined;
    this.mouseReaction = undefined;
  }

  componentDidMount() {
    const { system, UIStore, SettingsStore } = this.props;

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

    this.windowRotationReaction = reaction(
      () => [
        SettingsStore.gridRotation,
      ],
      () => this.canvasRotated(),
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

  canvasRotated = () => {
    const { UIStore } = this.props;

    // temporarily disable drawing the mouse hexagon
    UIStore.stopDrawingMouseHexagon();
    setTimeout(UIStore.startDrawingMouseHexagon, CANVAS_ROTATION_TRANSITION_DURATION);

    // make animate button reappear because orientation has changed
    UIStore.curvesHaveChanged();
  }

  render() {
    const { system, UIStore, SettingsStore } = this.props;
    const wrapperClasses = classNames({
      [styles.canvasWrapper]: true,
      [styles.canvasHiddenOnMobile]: UIStore.demoVisibleOnMobile,
    });
    const canvasClasses = classNames({
      [styles.canvas]: true,
      [styles.canvasVertical]: SettingsStore.gridRotation === GRID_ROTATION.VERTICAL,
      [styles.canvasHorizontal]: SettingsStore.gridRotation === GRID_ROTATION.HORIZONTAL,
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
          className={canvasClasses}
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
  SettingsStore: PropTypes.object,
  UIStore: PropTypes.object,
  system: PropTypes.object,
};

export default Canvas;
