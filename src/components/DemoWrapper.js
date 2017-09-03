import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reaction } from 'mobx';

import UIStore from 'stores/UIStore';
import SettingsStore from 'stores/SettingsStore';
import DemoSettings from 'components/DemoSettings';

import styles from './DemoWrapper.sass';

class Demo extends Component {

  constructor(props) {
    super(props);
    this.demoElement = undefined;
  }

  componentDidMount() {
    this.props.system.demo.setup(this.demoElement, UIStore);

    // resize canvas when window size is changed
    this.windowSizeReaction = reaction(
      () => [
        UIStore.windowWidth,
        UIStore.windowHeight,
      ],
      () => this.resizeDemo(),
    );

    // render demo when settings are changed
    this.settingsReaction = reaction(
      () => [
        SettingsStore.depthOverlapScalar,
        SettingsStore.depthCurvatureScalar,
      ],
      () => this.renderDemo(true),
    );

    // check mouse position
    // render canvas when mouse position is changed
    this.mouseReaction = reaction(
      () => [
        UIStore.mouseY,
        UIStore.mouseX,
      ],
      () => this.checkMousePosition(),
    );
  }

  checkMousePosition = () => {
    const boundingBox = this.demoElement.getBoundingClientRect();
    if (boundingBox.left <= UIStore.mouseX &&
        UIStore.mouseX <= boundingBox.right &&
        boundingBox.top <= UIStore.mouseY &&
        UIStore.mouseY <= boundingBox.bottom
    ) {
      if (!UIStore.isMouseOverDemo) UIStore.mouseIsOverDemo();
    } else {
      if (UIStore.isMouseOverDemo) UIStore.mouseNotOverDemo();
    }
  }

  onDownloadButtonClicked = () => {
    this.props.system.demo.downloadSTL();
  }

  renderDemo = () => {
    if (!this.props.system || !this.props.system.demo) return;
    this.props.system.demo.updateCurves();
  }

  resizeDemo = () => {
    if (!this.props.system || !this.props.system.demo) return;
    this.props.system.demo.updateDimensions(UIStore);
  }

  render() {
    return (
      <div className={styles.demoWrapper}>
        <DemoSettings system={this.props.system} />
        <canvas ref={element => this.demoElement = element} />
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
};

export default Demo;
