import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { CookiesProvider } from 'react-cookie';
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
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </Provider>
    );
  }
}

export default AppProvider;
