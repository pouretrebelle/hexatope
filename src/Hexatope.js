import React, { Component } from 'react';
import PropTypes from 'prop-types';
import System from 'system/System';
import { inject, observer } from 'mobx-react';

@inject('UIStore') @observer
class Hexatope extends Component {

  constructor(props) {
    super(props);
    this.canvasElement = undefined;
    this.hexSystem = undefined;
  }

  componentDidMount() {
    this.system = new System(this.canvasElement, this.props.UIStore);
    this.updateCanvas();
  }

  updateCanvas = () => {
    if (!this.system) return;
    this.system.update(this.props.UIStore);
    this.drawCanvas();
  }

  drawCanvas = () => {
    if (!this.system) return;
    this.system.draw();
  }

  render() {
    const UIStore = this.props.UIStore;
    this.updateCanvas();

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

Hexatope.propTypes = {
  UIStore: PropTypes.object,
};

export default Hexatope;
