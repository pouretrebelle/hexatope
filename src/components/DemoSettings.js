import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
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

  onHangingPointButtonClicked = () => {
    this.props.system.demo.startChosingHangingPoint();
  }

  render() {
    const { SettingsStore, UIStore } = this.props;

    const refreshButtonClasses = classNames({
      [styles.refreshButton]: true,
      [styles.refreshButtonCentered]: UIStore.demoIsEmpty,
      [styles.refreshButtonVisible]: UIStore.curvesChangedSinceDemoUpdate && UIStore.curvesExist,
    });

    const settingsGroupMaterialClasses = classNames({
      [styles.settingsGroupWrapper]: true,
      [styles.settingsGroupHidden]: UIStore.curvesChangedSinceDemoUpdate || UIStore.demoIsAnimating,
    });

    const settingsGroupDepthClasses = classNames({
      [styles.settingsGroupWrapper]: true,
      [styles.settingsGroupDepth]: true,
      [styles.settingsGroupHidden]: UIStore.curvesChangedSinceDemoUpdate || UIStore.demoIsAnimating,
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
        <button
          className={refreshButtonClasses}
          onClick={this.refreshDemo}
        >
          Animate
        </button>
        <div className={styles.settings}>

          <div className={settingsGroupMaterialClasses}>
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

          <div className={settingsGroupDepthClasses}>
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

          <div className={settingsGroupDepthClasses}>
            <legend className={styles.settingsGroupTitle}>
              Pendant
            </legend>
            <div className={styles.settingsGroup}>
              <button
                onClick={this.onHangingPointButtonClicked}
                className={hangingButtonClasses}
              >
                Chose Hanging Position
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

DemoSettings.propTypes = {
  system: PropTypes.object,
  SettingsStore: PropTypes.object,
  UIStore: PropTypes.object,
};

export default DemoSettings;
