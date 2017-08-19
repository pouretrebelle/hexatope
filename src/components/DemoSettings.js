import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';

import styles from './DemoSettings.sass';

@inject('SettingsStore', 'UIStore') @observer
class DemoSettings extends Component {

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
    const { SettingsStore, UIStore } = this.props;

    const wrapperClasses = classNames({
      [styles.settings]: true,
      [styles.settingsVisible]: UIStore.isMouseOverDemo,
    });

    return (
      <div className={wrapperClasses}>
        <input
          type={'range'}
          className={styles.range}
          onChange={this.onDepthOverlapChanged}
          value={SettingsStore.depthOverlapScalar}
          min={'0'}
          max={'1'}
          step={'any'}
        />
        <input
          type={'range'}
          className={styles.range}
          onChange={this.onDepthCurvatureChanged}
          value={SettingsStore.depthCurvatureScalar}
          min={'0'}
          max={'1'}
          step={'any'}
        />
      </div>
    );
  }
}

DemoSettings.propTypes = {
  SettingsStore: PropTypes.object,
  UIStore: PropTypes.object,
};

export default DemoSettings;
