import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './DownloadButtons.sass';

class DownloadButtons extends Component {

  constructor(props) {
    super(props);
  }

  onSVGButtonClicked = () => {
    this.props.system.canvas.downloadSVG();
  }

  onSTLButtonClicked = () => {
    this.props.system.demo.downloadSTL();
  }

  render() {
    return (
      <div className={styles.buttons}>
        <button className={styles.button} onClick={this.onSVGButtonClicked}>
          Download SVG
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
