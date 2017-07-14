import React, { Component } from 'react';
import System from 'system/System';

export default class App extends Component {

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
