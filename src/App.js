import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import System from 'system/System';
import Canvas from 'components/Canvas';

@inject('UIStore') @observer
class App extends Component {

  constructor(props) {
    super(props);
    this.system = new System(this.props.UIStore);
  }

  render() {
    return (
      <div>
        <Canvas
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
