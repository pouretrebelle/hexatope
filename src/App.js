import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import Typekit from 'react-typekit';
import TagManager from 'react-gtm-module';

import styles from 'styles/application.sass';

import GTMTracking from './GTMTracking';
import System from 'system/System';
import Header from 'components/Header';
import CanvasWrapper from 'components/CanvasWrapper';
import DemoWrapper from 'components/DemoWrapper';
import DownloadButtons from 'components/DownloadButtons';

@inject('UIStore') @observer
class App extends Component {

  constructor(props) {
    super(props);

    if (process.env.NODE_ENV === 'production') {
      TagManager.initialize({ gtmId: 'GTM-5HJ5GVK' });
      GTMTracking.initialize(TagManager);
      window.fbq('track', 'ViewContent');
    }

    this.title = 'Hexatope.io';
    this.metaDescription = 'Hexatope is a system that allows you to design your own unique jewellery using intuitive interaction with a hexagonal grid. Designs are fabricated using cutting-edge 3D-printing technology and cast into Sterling Silver or 18ct Gold.';
    this.favicon = require('assets/favicon.png');
    this.metaOpenGraph = require('assets/opengraph.jpg');
    this.metaTwitterCard = require('assets/twittercard.jpg');

    // show download buttons if url is /?buttons
    this.showDownloadButtons = /^\?buttons/.test(window.location.search);

    this.system = new System(this.props.UIStore, this.showDownloadButtons);
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

        <div className={styles.page}>
          <Header />
          <div className={styles.content}>
            <CanvasWrapper
              system={this.system}
            />
            <DemoWrapper
              system={this.system}
            />
            { this.showDownloadButtons && <DownloadButtons
              system={this.system}
            /> }
          </div>
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
