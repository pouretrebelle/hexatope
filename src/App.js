import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import styles from 'styles/layout.css';

import System from 'system/System';
import CanvasWrapper from 'components/CanvasWrapper';
import DemoWrapper from 'components/DemoWrapper';

@inject('UIStore') @observer
class App extends Component {

  constructor(props) {
    super(props);
    this.system = new System(this.props.UIStore);
  }

  render() {
    return (
      <div className={styles.content}>
        <CanvasWrapper
          system={this.system}
        />
        <DemoWrapper
          system={this.system}
        />
      </div>
    );
  }
}

App.propTypes = {
  UIStore: PropTypes.object,
};

export default App;
