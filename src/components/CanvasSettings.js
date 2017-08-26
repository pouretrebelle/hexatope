import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './CanvasSettings.sass';

class CanvasSettings extends Component {

  constructor(props) {
    super(props);
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
};

export default CanvasSettings;
