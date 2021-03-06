import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import { Helmet } from 'react-helmet';
import Typekit from 'react-typekit';
import TagManager from 'react-gtm-module';
import { withCookies, Cookies } from 'react-cookie';
import { GOOGLE_TAG_MANAGER_ID, TYPEKIT_KIT_ID } from 'constants/external';

import styles from 'styles/application.sass';

import GTMTracking from './GTMTracking';
import System from 'system/System';
import Header from 'components/Header';
import CanvasWrapper from 'components/CanvasWrapper';
import DemoWrapper from 'components/DemoWrapper';
import DownloadButtons from 'components/DownloadButtons';
import VideoModal from 'components/VideoModal';

@inject('UIStore') @observer
class App extends Component {

  constructor(props) {
    super(props);

    if (process.env.NODE_ENV === 'production') {
      TagManager.initialize({ gtmId: GOOGLE_TAG_MANAGER_ID });
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
    this.kickstarterRewardPage = /^\?kickstarter-reward/.test(window.location.search) || /^\?gift/.test(window.location.search);

    this.system = new System(this.props.UIStore, this.showDownloadButtons);

    this.pageWrapperElement = undefined;
  }

  componentDidMount() {
    this.windowHeightReaction = reaction(
      () => this.props.UIStore.windowHeight,
      (windowHeight) => this.reactToWindowHeightChange(windowHeight),
      {
        fireImmediately: true,
      },
    );
  }

  reactToWindowHeightChange = (windowHeight) => {
    // hard set page height to stop mobile 100vh bug
    if (this.pageWrapperElement) this.pageWrapperElement.style.height = `${windowHeight}px`;
  }

  render() {
    const { cookies } = this.props;
    const modalClosed = cookies.get('hexatopeTutorialModalClosed');

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

        <div className={styles.page} ref={element => this.pageWrapperElement = element}>
          <Header />
          <div className={styles.content}>
            <CanvasWrapper
              system={this.system}
            />
            <DemoWrapper
              system={this.system}
              kickstarterRewardPage={this.kickstarterRewardPage}
            />
            { this.showDownloadButtons && <DownloadButtons
              system={this.system}
            /> }
            { !modalClosed &&
              <VideoModal />
            }
          </div>
          <Typekit kitId={TYPEKIT_KIT_ID} />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  UIStore: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(App);
