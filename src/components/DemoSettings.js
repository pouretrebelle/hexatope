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

  onDepthOverlapChanged = (e) => {
    this.props.SettingsStore.updateDepthOverlap(e.target.value);
    return true;
  }

  onDepthCurvatureChanged = (e) => {
    this.props.SettingsStore.updateDepthCurvature(e.target.value);
    return true;
  }

  refreshDemo = () => {
    this.props.system.demo.updateAndAnimateCurves();
  }

  render() {
    const { SettingsStore, UIStore } = this.props;

    const refreshButtonClasses = classNames({
      [styles.refreshButton]: true,
      [styles.refreshButtonHint]: UIStore.curvesChangedSinceDemoUpdate && UIStore.curvesExist,
      [styles.refreshButtonVisible]: UIStore.isMouseOverDemo && UIStore.curvesChangedSinceDemoUpdate && UIStore.curvesExist,
    });

    const settingsGroupDepthClasses = classNames({
      [styles.settingsGroupWrapper]: true,
      [styles.settingsGroupDepth]: true,
      [styles.settingsGroupDepthHidden]: UIStore.curvesChangedSinceDemoUpdate || UIStore.demoIsAnimating,
    });

    const materialButtonClasses = (material) => classNames({
      [styles.button]: true,
      [styles.buttonActive]: SettingsStore.material === material,
    });

    return (
      <div>
        <button
          className={refreshButtonClasses}
          onClick={this.refreshDemo}
        >
          Render
        </button>
        <div className={styles.settings}>

          <div className={styles.settingsGroupWrapper}>
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
              />
              <input
                type={'range'}
                className={styles.range}
                onChange={this.onDepthCurvatureChanged}
                value={SettingsStore.depthCurvatureScalar}
                min={'0'}
                max={'1'}
                step={'any'}
              />
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
