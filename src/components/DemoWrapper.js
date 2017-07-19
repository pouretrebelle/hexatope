import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

@inject('UIStore') @observer
class Demo extends Component {

  constructor(props) {
    super(props);
    this.demoElement = undefined;
  }

  componentDidMount() {
    this.props.system.demo.setup(this.demoElement, this.props.UIStore);
    this.renderDemo();
  }

  renderDemo = () => {
    if (!this.props.system || !this.props.system.demo.c) return;
    this.props.system.demo.draw();
  }

  render() {
    this.renderDemo();

    return (
      <div>
        <canvas
          ref={element => this.demoElement = element}
        />
      </div>
    );
  }
}

Demo.propTypes = {
  system: PropTypes.object,
  UIStore: PropTypes.object,
};

export default Demo;
