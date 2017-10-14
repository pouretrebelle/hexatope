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

    // render and animate demo when mobile tabs are changed
    this.mobileTabsReaction = reaction(
      () => [
        UIStore.demoVisibleOnMobile,
      ],
      () => this.renderDemo(true),
    );

    // render demo when settings are changed
    this.settingsReaction = reaction(
      () => [
        SettingsStore.depthOverlapScalar,
        SettingsStore.depthCurvatureScalar,
        SettingsStore.material,
      ],
      () => this.renderDemo(false),
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
    const { UIStore, system } = this.props;
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

    if (UIStore.isChosingHangingPoint) system.demo.updateHangingPointAngle();
  }

  renderDemo = (animate) => {
    const { system } = this.props;

    if (!system || !system.demo) return;

    if (animate) {
      system.demo.updateAndAnimateCurves();
    }
    else {
      system.demo.updateCurves();
    }
  }

  resizeDemo = () => {
    if (!this.props.system || !this.props.system.demo) return;
    this.props.system.demo.updateDimensions(this.demoWrapperElement, this.props.UIStore);
  }

  endChosingHangingPoint = () => {
    const { UIStore } = this.props;

    if (UIStore.isChosingHangingPoint) {
      UIStore.endChosingHangingPoint();
    }
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
        <canvas
          ref={element => this.demoElement = element}
          onMouseOut={this.endChosingHangingPoint}
          onMouseUp={this.endChosingHangingPoint}
        />
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
