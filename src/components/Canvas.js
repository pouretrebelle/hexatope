import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('UIStore') @observer
class Canvas extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
  }

  componentDidMount() {
    this.props.system.setupCanvas(this.canvasElement, this.props.UIStore);
    this.props.system.draw();
  }

  renderCanvas = () => {
    if (!this.props.system || !this.props.system.canvas) return;
    this.props.system.render(this.props.UIStore);
  }

  render() {
    const UIStore = this.props.UIStore;
    this.renderCanvas();

    return (
      <div>
        <canvas
          ref={element => this.canvasElement = element}
        />
        <dl>
          <dt>Window Width</dt>
          <dd>{UIStore.windowWidth}</dd>
          <dt>Window Height</dt>
          <dd>{UIStore.windowHeight}</dd>
          <dt>Mouse X</dt>
          <dd>{UIStore.mouseX}</dd>
          <dt>Mouse Y</dt>
          <dd>{UIStore.mouseY}</dd>
        </dl>
      </div>
    );
  }
}

Canvas.propTypes = {
  system: PropTypes.object,
  UIStore: PropTypes.object,
};

export default Canvas;
