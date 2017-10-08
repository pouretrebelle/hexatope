import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { TOOL_MODES } from 'constants/options';

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
    this.props.system.clearHexagons();
    this.props.UIStore.canvasHasBeenCleared();
  }

  render() {
    const { toolMode } = this.props.SettingsStore;

    const buttonClasses = (editMode) => classNames({
      [styles.button]: true,
      [styles.buttonActive]: toolMode === editMode,
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
                className={buttonClasses(TOOL_MODES.DRAW)}
                onClick={this.onDrawButtonClicked}
              >
                Draw
              </button>
              <button
                className={buttonClasses(TOOL_MODES.EDIT)}
                onClick={this.onEditButtonClicked}
              >
                Edit
              </button>
              <button
                className={buttonClasses(TOOL_MODES.ERASE)}
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
