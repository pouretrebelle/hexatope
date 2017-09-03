import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as MODES from 'constants/toolModes';

import PencilIcon from './icons/PencilIcon';
import EraserIcon from './icons/EraserIcon';
import ClearIcon from './icons/ClearIcon';

import styles from './CanvasSettings.sass';

@inject('SettingsStore') @observer
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
        <button
          className={buttonClasses(MODES.PENCIL_MODE)}
          onClick={this.onPencilButtonClicked}
          title={'draw mode'}
        >
          <PencilIcon className={styles.icon} />
        </button>
        <button
          className={buttonClasses(MODES.ERASER_MODE)}
          onClick={this.onEraserButtonClicked}
          title={'erase mode'}
        >
          <EraserIcon className={styles.icon} />
        </button>
        <button
          className={styles.button}
          onClick={this.onClearButtonClicked}
          title={'clear'}
        >
          <ClearIcon className={styles.icon} />
        </button>
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
};

export default CanvasSettings;
