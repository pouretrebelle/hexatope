import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import GTMTracking from 'GTMTracking';
import { TOOL_MODES, GRID_ROTATION } from 'constants/options';

import styles from './Settings.sass';

@inject('SettingsStore', 'UIStore') @observer
class CanvasSettings extends Component {

  constructor(props) {
    super(props);
  }

  onDrawButtonClicked = () => {
    this.props.SettingsStore.setModeToDraw();
  }

  onEditButtonClicked = () => {
    this.props.SettingsStore.setModeToEdit();
  }

  onEraseButtonClicked = () => {
    this.props.SettingsStore.setModeToErase();
  }

  onClearButtonClicked = () => {
    GTMTracking.trackEvent('clickClearCanvas');
    this.props.system.clearHexagons();
    this.props.UIStore.canvasHasBeenCleared();
    this.props.SettingsStore.setModeToDraw();
  }

  onRotationVerticalButtonClicked = () => {
    this.props.SettingsStore.setGridRotation(GRID_ROTATION.VERTICAL);
  }

  onRotationHorizontalButtonClicked = () => {
    this.props.SettingsStore.setGridRotation(GRID_ROTATION.HORIZONTAL);
  }

  onRandomDesignButtonClicked = () => {
    this.props.system.importRandomDesign();
  }

  render() {
    const { toolMode, gridRotation } = this.props.SettingsStore;

    const toolButtonClasses = (buttonMode) => classNames({
      [styles.button]: true,
      [styles.buttonActive]: toolMode === buttonMode,
    });

    const rotationButtonClasses = (rotation) => classNames({
      [styles.button]: true,
      [styles.buttonActive]: gridRotation === rotation,
    });

    return (
      <div className={styles.settings}>
        <div className={styles.settingsGroupWrapper}>
          <legend className={styles.settingsGroupTitle}>
            Drawing modes
          </legend>
          <div className={styles.settingsGroup}>
            <div className={styles.buttonGroup}>
              <button
                className={toolButtonClasses(TOOL_MODES.DRAW)}
                onClick={this.onDrawButtonClicked}
              >
                Draw
              </button>
              <button
                className={toolButtonClasses(TOOL_MODES.EDIT)}
                onClick={this.onEditButtonClicked}
              >
                Edit
              </button>
              <button
                className={toolButtonClasses(TOOL_MODES.ERASE)}
                onClick={this.onEraseButtonClicked}
              >
                Erase
              </button>
            </div>
            <button
              className={styles.button}
              onClick={this.onClearButtonClicked}
            >
              Clear
            </button>
          </div>
        </div>

        <div className={styles.settingsGroupWrapper}>
          <legend className={styles.settingsGroupTitle}>
            Orientation
          </legend>
          <div className={styles.settingsGroup}>
            <div className={styles.buttonGroup}>
              <button
                className={rotationButtonClasses(GRID_ROTATION.VERTICAL)}
                onClick={this.onRotationVerticalButtonClicked}
                title={'Columns'}
              >
                <svg viewBox={'0 0 18 18'} className={styles.icon}>
                  <polygon strokeMiterlimit={'10'} points={'13,2.1 5,2.1 1,9 5,15.9 13,15.9 17,9'} />
                </svg>
              </button>
              <button
                className={rotationButtonClasses(GRID_ROTATION.HORIZONTAL)}
                onClick={this.onRotationHorizontalButtonClicked}
                title={'Rows'}
              >
                <svg viewBox={'0 0 18 18'} className={styles.icon}>
                  <polygon strokeMiterlimit={'10'} points={'2.1,5 2.1,13 9,17 15.9,13 15.9,5 9,1'} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.settingsGroupWrapper}>
          <div className={styles.settingsGroup}>
            <button
              onClick={this.onRandomDesignButtonClicked}
              className={styles.button}
            >
              Random Design
            </button>
          </div>
        </div>
      </div>
    );
  }
}

CanvasSettings.propTypes = {
  system: PropTypes.object.isRequired,
  SettingsStore: PropTypes.object,
  UIStore: PropTypes.object,
};

export default CanvasSettings;
