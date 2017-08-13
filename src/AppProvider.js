import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import UIStore from 'stores/UIStore';
import SettingsStore from 'stores/SettingsStore';

import App from './App';

class AppProvider extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider
        UIStore={UIStore}
        SettingsStore={SettingsStore}
      >
        <App />
      </Provider>
    );
  }
}

export default AppProvider;
