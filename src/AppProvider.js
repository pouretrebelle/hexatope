import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import UIStore from 'stores/UIStore';

import App from './App';

class AppProvider extends Component {

  constructor(props) {
    super(props);
    this.UIStore = new UIStore();
  }

  render() {
    return (
      <Provider
        UIStore={this.UIStore}>
        <App />
      </Provider>
    );
  }
}

export default AppProvider;
