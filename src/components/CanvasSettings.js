import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as MODES from 'constants/toolModes';

import Tooltip from './common/Tooltip';
import PencilIcon from './icons/PencilIcon';
import EraserIcon from './icons/EraserIcon';
import ClearIcon from './icons/ClearIcon';

import styles from './CanvasSettings.sass';

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

  onDownloadButtonClicked = () => {
    this.props.system.canvas.downloadSVG();
  }

  render() {
    const { toolMode } = this.props.SettingsStore;

    const buttonClasses = (editMode) => classNames({
      [styles.button]: true,
      [styles.buttonActive]: toolMode === editMode,
    });

    return (
      <div className={styles.settings}>
        <Tooltip label={'draw'}>
          <button
            className={buttonClasses(MODES.PENCIL_MODE)}
            onClick={this.onPencilButtonClicked}
          >
            <PencilIcon className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip label={'erase'}>
          <button
            className={buttonClasses(MODES.ERASER_MODE)}
            onClick={this.onEraserButtonClicked}
          >
            <EraserIcon className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip label={'clear'}>
          <button
            className={styles.button}
            onClick={this.onClearButtonClicked}
          >
            <ClearIcon className={styles.icon} />
          </button>
        </Tooltip>
        <button className={styles.button} onClick={this.onDownloadButtonClicked}>
          Download SVG
        </button>
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
