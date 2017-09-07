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

    this.title = 'Hexatope.io';
    this.metaDescription = 'Hexatope is an experiment in generative jewellery by Charlotte Dann, opening shop in Winter 2017.';
    this.favicon = require('assets/favicon.png');
    this.metaOpenGraph = require('assets/opengraph.jpg');
    this.metaTwitterCard = require('assets/twittercard.jpg');
  }

  render() {
    return (
      <div>

        <Helmet>
          <title>{this.title}</title>
          <link rel={'icon'} type={'image/png'} href={this.favicon} sizes={'32x32'}/>
          <meta property={'og:title'} content={this.title}/>
          <meta name={'twitter:title'} content={this.title}/>
          <meta name={'description'} content={this.metaDescription}/>
          <meta name={'og:description'} content={this.metaDescription}/>
          <meta name={'twitter:description'} content={this.metaDescription}/>
          <meta name={'twitter:card'} content={'summary_large_image'}/>
          <meta property={'og:image'} content={this.metaOpenGraph}/>
          <meta property={'og:image:width'} content={1200}/>
          <meta property={'og:image:height'} content={630}/>
          <meta name={'twitter:image'} content={this.metaTwitterCard}/>
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
