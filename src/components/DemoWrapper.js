import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import classNames from 'classnames';

import NewsletterPopup from 'components/NewsletterPopup';
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

    // render demo and update chain position when settings are changed
    this.settingsReaction = reaction(
      () => [
        SettingsStore.depthOverlapScalar,
        SettingsStore.depthCurvatureScalar,
      ],
      () => this.reactToSettingsChange(),
    );

    // render demo and update chain material when settings are changed
    this.materialReaction = reaction(
      () => [
        SettingsStore.material,
      ],
      () => this.reactToMaterialChange(),
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

  reactToSettingsChange = () => {
    const { system, UIStore } = this.props;

    // don't update the chain or render anything if we're importing
    if (UIStore.isImporting) return;
    // use raycasting to position chain instead of edge points
    system.demo.updateChainPosition(0, true);
    this.renderDemo(false);
  }

  reactToMaterialChange = () => {
    const { system, UIStore } = this.props;

    // don't do anything if we're importing
    if (UIStore.isImporting) return;
    system.demo.updateChainMaterial();
    this.renderDemo(false);
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

  render() {
    const { system, UIStore, kickstarterRewardPage } = this.props;
    const wrapperClasses = classNames({
      [styles.demoWrapper]: true,
      [styles.demoHiddenOnMobile]: !UIStore.demoVisibleOnMobile,
    });

    return (
      <div
        className={wrapperClasses}
        ref={element => this.demoWrapperElement = element}
      >
        <div style={{position: 'absolute', left: '35%', top: '30%', width: 2, height: 2, border: '1px solid crimson', zIndex: 100}} />
        <div style={{position: 'absolute', left: '65%', top: '40%', width: 2, height: 2, border: '1px solid crimson', zIndex: 100}} />
        <NewsletterPopup />
        <DemoSettings
          system={system}
          kickstarterRewardPage={kickstarterRewardPage}
        />
        <canvas
          ref={element => this.demoElement = element}
        />
      </div>
    );
  }
}

Demo.propTypes = {
  UIStore: PropTypes.object,
  SettingsStore: PropTypes.object,
  system: PropTypes.object,
  kickstarterRewardPage: PropTypes.bool,
};

export default Demo;
