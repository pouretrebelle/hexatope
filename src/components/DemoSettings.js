import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import GTMTracking from 'GTMTracking';
import { MATERIALS } from 'constants/options';

import styles from './Settings.sass';

@inject('SettingsStore', 'UIStore') @observer
class DemoSettings extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // randomise depth sliders on load
    this.props.SettingsStore.updateDepthOverlap(Math.random());
    this.props.SettingsStore.updateDepthCurvature(Math.random());
  }

  onDepthOverlapChanged = (e) => {
    this.props.SettingsStore.updateDepthOverlap(e.target.value);
  }

  onDepthCurvatureChanged = (e) => {
    this.props.SettingsStore.updateDepthCurvature(e.target.value);
  }

  refreshDemo = () => {
    this.props.system.demo.updateAndAnimateCurves();
  }

  onAnimateButtonClicked = () => {
    GTMTracking.trackEvent('clickAnimate');
    this.refreshDemo();
  }

  onHangingPointButtonClicked = () => {
    GTMTracking.trackEvent('clickHangingPoint');
    this.props.system.demo.startChosingHangingPoint();
  }

  onDownloadButtonClicked = () => {
    this.props.system.exportTXT();
  }

  render() {
    const { SettingsStore, UIStore, kickstarterRewardPage } = this.props;

    const refreshButtonClasses = classNames({
      [styles.refreshButton]: true,
      [styles.refreshButtonCentered]: UIStore.demoIsEmpty,
      [styles.refreshButtonVisible]: UIStore.curvesChangedSinceDemoUpdate && UIStore.curvesExist,
    });

    const scaleClasses = classNames({
      [styles.scale]: true,
      [styles.scaleHidden]: !UIStore.isChosingHangingPoint && SettingsStore.hangingPointAngle === undefined,
    });

    const settingsGroupMaterialClasses = classNames({
      [styles.settingsGroupWrapper]: true,
      [styles.withSectionBubble]: true,
      [styles.settingsGroupHidden]: UIStore.curvesChangedSinceDemoUpdate || UIStore.demoIsAnimating,
    });

    const settingsGroupDepthClasses = classNames({
      [styles.settingsGroupWrapper]: true,
      [styles.settingsGroupDepth]: true,
      [styles.withSectionBubble]: true,
      [styles.settingsGroupHidden]: UIStore.curvesChangedSinceDemoUpdate || UIStore.demoIsAnimating,
    });

    const settingsGroupDownloadClasses = classNames({
      [styles.settingsGroupWrapper]: true,
      [styles.settingsGroupDownload]: true,
      [styles.settingsGroupHidden]: !UIStore.rewardVolumeApproved || UIStore.curvesChangedSinceDemoUpdate || UIStore.demoIsAnimating || UIStore.isChosingHangingPoint || SettingsStore.hangingPointAngle === undefined,
    });

    const materialButtonClasses = (material) => classNames({
      [styles.button]: true,
      [styles.buttonActive]: SettingsStore.material === material,
    });

    const hangingButtonClasses = classNames({
      [styles.button]: true,
      [styles.buttonActive]: UIStore.isChosingHangingPoint,
    });

    return (
      <div>

        <div className={scaleClasses}>
          <span className={styles.scaleUnit} />
          <span className={styles.scaleUnit} />
          <span className={styles.scaleUnit} />
          <span className={styles.scaleUnit} />
          <span className={styles.scaleUnit} />
        </div>

        <button
          className={refreshButtonClasses}
          onClick={this.onAnimateButtonClicked}
        >
          Animate
        </button>
        <div className={styles.settings}>

          <div className={settingsGroupMaterialClasses} data-section={2}>
            <legend className={styles.settingsGroupTitle}>
              Material
            </legend>
            <div className={styles.settingsGroup}>
              <div className={styles.buttonGroup}>
                <button
                  onClick={SettingsStore.setMaterialToSilver}
                  className={materialButtonClasses(MATERIALS.SILVER)}
                >
                  Silver
                </button>
                <button
                  onClick={SettingsStore.setMaterialToGold}
                  className={materialButtonClasses(MATERIALS.GOLD)}
                >
                  Gold
                </button>
              </div>
            </div>
          </div>

          <div className={settingsGroupDepthClasses} data-section={3}>
            <legend className={styles.settingsGroupTitle}>
              Depth control
            </legend>
            <div className={styles.settingsGroup}>
              <input
                type={'range'}
                className={styles.range}
                onChange={this.onDepthOverlapChanged}
                value={SettingsStore.depthOverlapScalar}
                min={'0'}
                max={'1'}
                step={'any'}
                title={'Overlap'}
              />
              <input
                type={'range'}
                className={styles.range}
                onChange={this.onDepthCurvatureChanged}
                value={SettingsStore.depthCurvatureScalar}
                min={'0'}
                max={'1'}
                step={'any'}
                title={'Double Curve'}
              />
            </div>
          </div>

          <div className={settingsGroupDepthClasses} data-section={4}>
            <legend className={styles.settingsGroupTitle}>
              Pendant
            </legend>
            <div className={styles.settingsGroup}>
              <button
                onClick={this.onHangingPointButtonClicked}
                className={hangingButtonClasses}
              >
                Choose Hanging Point
              </button>
            </div>
          </div>

          { kickstarterRewardPage &&
            <div className={settingsGroupDownloadClasses}>
              <div className={styles.withSectionBubble} data-section={5}>
                <legend className={styles.settingsGroupTitle}>
                  Complete
                </legend>
                <div className={styles.settingsGroup}>
                  <button
                    onClick={this.onDownloadButtonClicked}
                    className={styles.button}
                  >
                    Download Design File
                  </button>
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    );
  }
}

DemoSettings.propTypes = {
  system: PropTypes.object,
  SettingsStore: PropTypes.object,
  UIStore: PropTypes.object,
  kickstarterRewardPage: PropTypes.bool,
};

export default DemoSettings;
