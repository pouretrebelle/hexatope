import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { TOOL_MODES } from 'constants/options';

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
            className={buttonClasses(TOOL_MODES.PENCIL)}
            onClick={this.onPencilButtonClicked}
          >
            <PencilIcon className={styles.icon} />
          </button>
        </Tooltip>
        <Tooltip label={'erase'}>
          <button
            className={buttonClasses(TOOL_MODES.ERASER)}
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
