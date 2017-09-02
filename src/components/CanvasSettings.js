import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

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
    return (
      <div className={styles.settings}>
        <button onClick={this.onPencilButtonClicked}>
          Pencil
        </button>
        <button onClick={this.onEraserButtonClicked}>
          Eraser
        </button>
        <button onClick={this.onClearButtonClicked}>
          Clear
        </button>
        <button onClick={this.onDownloadButtonClicked}>
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
