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

  onPencilButtonClicked = () => {
    this.props.SettingsStore.setModeToPencil();
  }

  onEraserButtonClicked = () => {
    this.props.SettingsStore.setModeToEraser();
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
                className={buttonClasses(TOOL_MODES.PENCIL)}
                onClick={this.onPencilButtonClicked}
              >
                Draw
              </button>
              <button
                className={buttonClasses(TOOL_MODES.ERASER)}
                onClick={this.onEraserButtonClicked}
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
