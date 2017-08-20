import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './CanvasSettings.sass';

class CanvasSettings extends Component {

  constructor(props) {
    super(props);
  }

  onClearButtonPressed = () => {
    this.props.system.clearHexagons();
  }

  render() {
    return (
      <div className={styles.settings}>
        <button onClick={this.onClearButtonPressed}>
          Clear
        </button>
      </div>
    );
  }
}

CanvasSettings.propTypes = {
  system: PropTypes.object.isRequired,
};

export default CanvasSettings;
