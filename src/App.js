import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Typekit from 'react-typekit';

import styles from 'styles/application.sass';

import System from 'system/System';
import CanvasWrapper from 'components/CanvasWrapper';
import DemoWrapper from 'components/DemoWrapper';
import DownloadButtons from 'components/DownloadButtons';

import wall from './wall.jpg';

@inject('UIStore') @observer
class App extends Component {

  constructor(props) {
    super(props);
    this.system = new System(this.props.UIStore);
  }

  render() {
    return (
      <div className={styles.content}>
        <img src={wall} style={{
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 100,
          width: 'auto',
          height: '100vh',
          mixBlendMode: 'darken',
        }}/>
        <CanvasWrapper
          system={this.system}
        />
        <DownloadButtons
          system={this.system}
        />
        <Typekit kitId='req1ouh' />
      </div>
    );
  }
}

App.propTypes = {
  UIStore: PropTypes.object,
};

export default App;
