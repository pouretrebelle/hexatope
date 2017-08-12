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
    this.props.system.canvas.setup(this.canvasElement, this.props.UIStore);
    this.renderCanvas();

    // render canvas when mouse position is changed
    this.mouseReaction = reaction(
      () => [this.props.UIStore.mouseY, this.props.UIStore.mouseX],
      () => this.renderCanvas()
    );
  }

  renderCanvas = () => {
    if (!this.props.system || !this.props.system.canvas.c) return;
    this.props.system.render(this.props.UIStore);
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
