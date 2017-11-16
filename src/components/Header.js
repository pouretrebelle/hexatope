import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import { KICKSTARTER_URL } from 'constants/urls';

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

            { kickstarterUrl &&
              <a
                href={kickstarterUrl}
                target={'_blank'}
                title={'Hexatope was fully funded on Kickstarter'}
                className={styles.kickstarterLink}
              >
                <svg className={styles.kickstarterLogo} viewBox={'0 0 32 32'}>
                  <path d={'M22.8,16l2.2-2.2c2.3-2.2,2.3-5.9,0-8.1s-5.9-2.2-8.2,0l-0.8,0.8C14.9,5,13.1,4,11.2,4C8,4,5.4,6.6,5.4,9.8v12.5	c0,3.2,2.6,5.8,5.8,5.8c2,0,3.7-1,4.8-2.5l0.8,0.8c2.3,2.2,5.9,2.2,8.2,0c2.3-2.2,2.3-5.9,0-8.1L22.8,16L22.8,16z'}/>
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
