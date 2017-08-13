import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import styles from './Settings.sass';

@inject('SettingsStore') @observer
class Settings extends Component {

  constructor(props) {
    super(props);
  }

  onDepthChanged = (e) => {
    this.props.SettingsStore.updateDepth(e.target.value);
    return true;
  }

  render() {
    return (
      <div className={styles.settings}>
        <input
          type={'range'}
          className={styles.range}
          onChange={this.onDepthChanged}
          value={this.props.SettingsStore.depthScalar}
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
