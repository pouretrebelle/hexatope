import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import styles from './Settings.sass';

@inject('SettingsStore') @observer
class Settings extends Component {

  constructor(props) {
    super(props);
  }

  onDepthOverlapChanged = (e) => {
    this.props.SettingsStore.updateDepthOverlap(e.target.value);
    return true;
  }

  onDepthCurvatureChanged = (e) => {
    this.props.SettingsStore.updateDepthCurvature(e.target.value);
    return true;
  }

  render() {
    return (
      <div className={styles.settings}>
        <input
          type={'range'}
          className={styles.range}
          onChange={this.onDepthOverlapChanged}
          value={this.props.SettingsStore.depthOverlapScalar}
          min={'0'}
          max={'1'}
          step={'any'}
        />
        <input
          type={'range'}
          className={styles.range}
          onChange={this.onDepthCurvatureChanged}
          value={this.props.SettingsStore.depthCurvatureScalar}
          min={'0'}
          max={'1'}
          step={'any'}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  system: PropTypes.object,
  SettingsStore: PropTypes.object,
};

export default Settings;
