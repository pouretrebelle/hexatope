import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import Typekit from 'react-typekit';
import ReactGA from 'react-ga';

import styles from 'styles/application.sass';

import settings from 'system/settings';
import System from 'system/System';
import CanvasWrapper from 'components/CanvasWrapper';
import DemoWrapper from 'components/DemoWrapper';
import DownloadButtons from 'components/DownloadButtons';

@inject('UIStore') @observer
class App extends Component {

  constructor(props) {
    super(props);
    this.system = new System(this.props.UIStore);

    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-106084023-1');
    }
  }

  render() {
    return (
      <div>

        <Helmet>
          <title>Hexatope</title>
          <meta name={'description'} content={'Hexatope is an experiment in generative jewellery by Charlotte Dann, opening shop in Winter 2017.'}/>
        </Helmet>

        <div className={styles.content}>
          <CanvasWrapper
            system={this.system}
          />
          <DemoWrapper
            system={this.system}
          />
          { settings.showDownloadButtons && <DownloadButtons
            system={this.system}
          /> }
          <Typekit kitId={'req1ouh'} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  UIStore: PropTypes.object,
};

export default App;
