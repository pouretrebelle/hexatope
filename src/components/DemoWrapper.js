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
  }

  onDownloadButtonClicked = () => {
    this.props.system.demo.downloadSTL();
  }

  render() {
    return (
      <div>
        <canvas
          ref={element => this.demoElement = element}
          style={{ cursor: 'pointer' }}
        />
        <button
          onClick={this.onDownloadButtonClicked}
          style={{ position: 'absolute', right: 0, bottom: 0 }}
        >
          Download STL
        </button>
      </div>
    );
  }
}

Demo.propTypes = {
  system: PropTypes.object,
  UIStore: PropTypes.object,
};

export default Demo;
