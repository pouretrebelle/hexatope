import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import classNames from 'classnames';

import DemoSettings from 'components/DemoSettings';

import styles from './DemoWrapper.sass';

@inject('SettingsStore', 'UIStore') @observer
class Demo extends Component {

  constructor(props) {
    super(props);
    this.demoElement = undefined;
    this.demoWrapperElement = undefined;
  }

  componentDidMount() {
    const { system, UIStore, SettingsStore } = this.props;

    system.demo.setup(this.demoElement, this.demoWrapperElement, UIStore);

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
    const { UIStore } = this.props;
    const boundingBox = this.demoWrapperElement.getBoundingClientRect();
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

  renderDemo = () => {
    if (!this.props.system || !this.props.system.demo) return;
    this.props.system.demo.updateCurves();
  }

  resizeDemo = () => {
    if (!this.props.system || !this.props.system.demo) return;
    this.props.system.demo.updateDimensions(this.demoWrapperElement);
  }

  render() {
    const { system, UIStore } = this.props;
    const wrapperClasses = classNames({
      [styles.demoWrapper]: true,
      [styles.demoHiddenOnMobile]: !UIStore.demoVisibleOnMobile,
    });

    return (
      <div
        className={wrapperClasses}
        ref={element => this.demoWrapperElement = element}
      >
        <DemoSettings system={system} />
        <canvas ref={element => this.demoElement = element} />
      </div>
    );
  }
}

Demo.propTypes = {
  UIStore: PropTypes.object,
  SettingsStore: PropTypes.object,
  system: PropTypes.object,
};

export default Demo;
