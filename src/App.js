import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import UIStore from 'stores/UIStore';

import Hexatope from './Hexatope';

class App extends Component {

  constructor(props) {
    super(props);
    this.UIStore = new UIStore();
  }

  render() {
    return (
      <Provider
        UIStore={this.UIStore}>
        <Hexatope />
      </Provider>
    );
  }
}

export default App;
