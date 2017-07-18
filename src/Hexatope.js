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
    this.system = new System(this.canvasElement);
  }

  render() {
    return (
      <div>
        <canvas ref={element => this.canvasElement = element} />
      </div>
    );
  }
}

Hexatope.propTypes = {
  UIStore: PropTypes.object,
};

export default Hexatope;
