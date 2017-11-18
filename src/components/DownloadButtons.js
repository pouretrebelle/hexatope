import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './DownloadButtons.sass';

class DownloadButtons extends Component {

  constructor(props) {
    super(props);
  }

  onExportTXTButtonClicked = () => {
    this.props.system.exportTXT();
  }

  onExportJSONButtonClicked = (withSettings) => {
    this.props.system.exportJSON(withSettings);
  }

  onSVGButtonClicked = () => {
    this.props.system.canvas.downloadSVG();
  }

  onPNGButtonClicked = () => {
    this.props.system.demo.downloadPNG();
  }

  onSTLButtonClicked = () => {
    this.props.system.demo.downloadSTL();
  }

  render() {
    return (
      <div className={styles.buttons}>
        <button className={styles.button} onClick={this.onExportTXTButtonClicked}>
          Export TXT
        </button>
        <button className={styles.button} onClick={() => this.onExportJSONButtonClicked(true)}>
          Export JSON w/settings
        </button>
        <button className={styles.button} onClick={() => this.onExportJSONButtonClicked(false)}>
          Export JSON
        </button>
        <button className={styles.button} onClick={this.onSVGButtonClicked}>
          Download SVG
        </button>
        <button className={styles.button} onClick={this.onPNGButtonClicked}>
          Download PNG
        </button>
        <button className={styles.button} onClick={this.onSTLButtonClicked}>
          Download STL
        </button>
      </div>
    );
  }
}

DownloadButtons.propTypes = {
  system: PropTypes.object.isRequired,
};

export default DownloadButtons;
