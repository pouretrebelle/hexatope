import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { KICKSTARTER_URL, TWITTER_URL, INSTAGRAM_URL, FACEBOOK_URL } from 'constants/urls';

import styles from './Header.sass';

import Tooltip from 'components/common/Tooltip';
import Logo from 'components/icons/Logo';

@inject('UIStore') @observer
class Header extends Component {

  constructor(props) {
    super(props);
  }

  showCanvas = () => {
    this.props.UIStore.demoIsVisibleOnMobile(false);
  }

  showDemo = () => {
    this.props.UIStore.demoIsVisibleOnMobile(true);
  }

  render() {
    const buttonClasses = (isActive) => classNames({
      [styles.mobileSelectorItem]: true,
      [styles.mobileSelectorItemActive]: isActive,
    });
    const { showChain, isChosingHangingPoint, demoVisibleOnMobile, rewardVolumeApproved } = this.props.UIStore;
    let kickstarterUrl = KICKSTARTER_URL;
    if (showChain && !isChosingHangingPoint) {
      kickstarterUrl += '?utm_keyword=ctaVisible';
    }

    return (
      <div className={styles.header}>
        <header className={styles.navbar}>
          <a href={'/'} className={styles.logoLink}>
            <Logo className={styles.logo} />
          </a>
          <aside className={styles.navbarRight}>
            { !rewardVolumeApproved &&
              <Tooltip label={'This design is too large to qualify for a Kickstarter reward, please email charlotte@hexatope.io if you still want it and we can arrange something'} direction={'down'} mobileTilt={'left'}>
                <span className={styles.volumeWarning}>
                  !
                </span>
              </Tooltip>
            }

            <a
              href={TWITTER_URL}
              target={'_blank'}
              title={'Follow Hexatope on Twitter'}
              className={styles.socialLink}
            >
              <svg className={styles.socialLogo} viewBox={'0 0 100 100'}>
                <path d={'M97.3,13.2c-4,2.3-8.4,4-13,4.9c-3.7-4-9.1-6.5-14.9-6.5c-11.3,0-20.5,9.2-20.5,20.5c0,1.6,0.1,3.2,0.5,4.7 c-17-0.9-32.1-9.1-42.2-21.4c-1.7,2.9-2.8,6.5-2.8,10.3c0,7.1,3.6,13.3,9.1,17c-3.5-0.1-6.5-0.9-9.3-2.5c0,0.1,0,0.1,0,0.3 c0,10,7.1,18.2,16.4,20.1c-1.7,0.4-3.6,0.7-5.5,0.7c-1.3,0-2.7-0.1-3.9-0.4c2.7,8.1,10.3,14.1,19.2,14.2c-7.1,5.5-15.8,8.8-25.4,8.8 c-1.7,0-3.3-0.1-4.9-0.3c9.1,5.9,19.8,9.2,31.4,9.2c37.7,0,58.3-31.3,58.3-58.3c0-0.9,0-1.7,0-2.7c4-2.9,7.5-6.5,10.3-10.4 c-3.6,1.6-7.6,2.7-11.7,3.2C92.5,22,95.9,18,97.3,13.2z'} />
              </svg>
            </a>

            <a
              href={INSTAGRAM_URL}
              target={'_blank'}
              title={'Follow Hexatope on Insta'}
              className={styles.socialLink}
            >
              <svg className={styles.socialLogo} viewBox={'0 0 512 512'}>
                <path d={'M256,49.471c67.266,0,75.233.257,101.8,1.469,24.562,1.121,37.9,5.224,46.778,8.674a78.052,78.052,0,0,1,28.966,18.845,78.052,78.052,0,0,1,18.845,28.966c3.45,8.877,7.554,22.216,8.674,46.778,1.212,26.565,1.469,34.532,1.469,101.8s-0.257,75.233-1.469,101.8c-1.121,24.562-5.225,37.9-8.674,46.778a83.427,83.427,0,0,1-47.811,47.811c-8.877,3.45-22.216,7.554-46.778,8.674-26.56,1.212-34.527,1.469-101.8,1.469s-75.237-.257-101.8-1.469c-24.562-1.121-37.9-5.225-46.778-8.674a78.051,78.051,0,0,1-28.966-18.845,78.053,78.053,0,0,1-18.845-28.966c-3.45-8.877-7.554-22.216-8.674-46.778-1.212-26.564-1.469-34.532-1.469-101.8s0.257-75.233,1.469-101.8c1.121-24.562,5.224-37.9,8.674-46.778A78.052,78.052,0,0,1,78.458,78.458a78.053,78.053,0,0,1,28.966-18.845c8.877-3.45,22.216-7.554,46.778-8.674,26.565-1.212,34.532-1.469,101.8-1.469m0-45.391c-68.418,0-77,.29-103.866,1.516-26.815,1.224-45.127,5.482-61.151,11.71a123.488,123.488,0,0,0-44.62,29.057A123.488,123.488,0,0,0,17.3,90.982C11.077,107.007,6.819,125.319,5.6,152.134,4.369,179,4.079,187.582,4.079,256S4.369,333,5.6,359.866c1.224,26.815,5.482,45.127,11.71,61.151a123.489,123.489,0,0,0,29.057,44.62,123.486,123.486,0,0,0,44.62,29.057c16.025,6.228,34.337,10.486,61.151,11.71,26.87,1.226,35.449,1.516,103.866,1.516s77-.29,103.866-1.516c26.815-1.224,45.127-5.482,61.151-11.71a128.817,128.817,0,0,0,73.677-73.677c6.228-16.025,10.486-34.337,11.71-61.151,1.226-26.87,1.516-35.449,1.516-103.866s-0.29-77-1.516-103.866c-1.224-26.815-5.482-45.127-11.71-61.151a123.486,123.486,0,0,0-29.057-44.62A123.487,123.487,0,0,0,421.018,17.3C404.993,11.077,386.681,6.819,359.866,5.6,333,4.369,324.418,4.079,256,4.079h0Z'} />
                <path d={'M256,126.635A129.365,129.365,0,1,0,385.365,256,129.365,129.365,0,0,0,256,126.635Zm0,213.338A83.973,83.973,0,1,1,339.974,256,83.974,83.974,0,0,1,256,339.973Z'} />
              </svg>
            </a>

            <a
              href={FACEBOOK_URL}
              target={'_blank'}
              title={'Follow Hexatope on Facebook'}
              className={styles.socialLink}
            >
              <svg className={styles.socialLogo} viewBox={'0 0 24 24'}>
                <path d={'M21.8,1H2.2C1.5,1,1,1.5,1,2.2v19.6C1,22.5,1.5,23,2.2,23h10.5v-8.5H9.9v-3.3h2.9V8.7c0-2.8,1.7-4.4,4.3-4.4 c1.2,0,2.3,0.1,2.6,0.1v3l-1.8,0c-1.4,0-1.6,0.7-1.6,1.6v2.1h3.3L19,14.5h-2.9V23h5.6c0.7,0,1.2-0.5,1.2-1.2V2.2 C23,1.5,22.5,1,21.8,1z'} />
              </svg>
            </a>

            { kickstarterUrl &&
              <a
                href={kickstarterUrl}
                target={'_blank'}
                title={'Hexatope was fully funded on Kickstarter'}
                className={styles.socialLink}
              >
                <svg className={styles.socialLogo} viewBox={'0 0 24 24'}>
                  <path d={'M18.2,12l2-2c2.1-2.1,2.1-5.4,0-7.5s-5.4-2.1-7.5,0l-0.7,0.7C11,1.9,9.4,1,7.6,1C4.6,1,2.3,3.4,2.3,6.3v11.4 c0,2.9,2.4,5.3,5.3,5.3c1.8,0,3.4-0.9,4.4-2.3l0.7,0.7c2.1,2.1,5.4,2.1,7.5,0c2.1-2.1,2.1-5.4,0-7.5L18.2,12L18.2,12z'} />
                </svg>
              </a>
            }
          </aside>
        </header>

        <aside className={styles.mobileSelectorWrapper}>
          <nav className={styles.mobileSelector}>
            <button
              onClick={this.showCanvas}
              className={buttonClasses(!demoVisibleOnMobile)}
            >
              Canvas
            </button>
            <button
              onClick={this.showDemo}
              className={buttonClasses(demoVisibleOnMobile)}
            >
              Demo
            </button>
          </nav>
        </aside>
      </div>
    );
  }
}

Header.propTypes = {
  UIStore: PropTypes.object,
};

export default Header;
