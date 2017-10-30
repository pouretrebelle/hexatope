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

            { kickstarterUrl && <a href={kickstarterUrl} target={'_blank'} title={'Support Hexatope on Kickstarter'}>
              <div className={styles.kickstarterDesktop}>
                <div className={styles.kickstarterDesktopHint}>
                  support Hexatope on
                </div>
                <svg className={styles.kickstarterDesktopIcon} viewBox='0 0 467.4 54.6'>
                  <path fill='#fff' d='M17.1 18.9l9.6-14C28.5 2.3 30.9 1 33.8 1c2.4 0 4.4.8 6.1 2.5 1.7 1.7 2.6 3.7 2.6 6 0 1.7-.5 3.2-1.4 4.6l-8.7 12.6L43 40.2c1.1 1.3 1.6 2.9 1.6 4.7 0 2.4-.8 4.4-2.5 6.1-1.7 1.7-3.7 2.6-6.1 2.6-2.6 0-4.6-.8-6-2.5L17 34.9v9c0 2.6-.4 4.5-1.3 6-1.6 2.6-4 3.9-7.1 3.9-2.8 0-5-.9-6.5-2.8C.7 49 0 46.7 0 43.8V10.6c0-2.7.7-5 2.2-6.8C3.7 2 5.9 1 8.6 1c2.6 0 4.7 1 6.4 2.8 1 1 1.6 2.1 1.8 3.1.2.7.2 1.9.2 3.7v8.3zm47.8-7.3v32.1c0 2.8-.7 5.1-2.2 6.9-1.5 2-3.7 3-6.4 3-2.5 0-4.6-.9-6.3-2.8-1.4-1.5-2.2-3.9-2.2-7.1V11.6c0-3.6.7-6.2 2.2-7.8C51.7 1.9 53.8 1 56.4 1c2.6 0 4.7.9 6.3 2.7 1.5 1.7 2.2 4.3 2.2 7.9zM95.7 0c6.3 0 12.1 2.1 17.4 6.3 4.1 3.3 6.2 6.8 6.2 10.4 0 3-1.3 5.4-3.8 7.1-1.4 1-3 1.4-4.7 1.4-1.4 0-2.7-.3-4-1-.5-.3-1.8-1.6-3.9-3.8-1.9-2.1-4.4-3.2-7.3-3.2-2.8 0-5.2 1-7.1 2.9-1.9 2-2.9 4.4-2.9 7.2s1 5.2 2.9 7.2 4.3 2.9 7.1 2.9c2.3 0 4.5-.8 6.5-2.4 1.2-1.2 2.5-2.4 3.7-3.6 1.3-1.1 3-1.7 5-1.7 2.3 0 4.3.8 6.1 2.4 1.7 1.6 2.6 3.6 2.6 5.9 0 3.2-1.9 6.4-5.6 9.6-5.2 4.6-11.2 6.8-18.1 6.8-4.2 0-8.2-.9-12-2.7-4.7-2.3-8.5-5.6-11.3-10-2.8-4.4-4.2-9.2-4.2-14.5 0-7.8 2.9-14.5 8.7-20C82.1 2.5 88.3.1 95.7 0zm43.8 18.9l9.6-14c1.8-2.6 4.2-3.9 7.1-3.9 2.4 0 4.4.8 6.1 2.5 1.7 1.7 2.6 3.7 2.6 6 0 1.7-.5 3.2-1.4 4.6l-8.7 12.6 10.6 13.5c1.1 1.3 1.6 2.9 1.6 4.7 0 2.4-.8 4.4-2.5 6.1-1.7 1.7-3.7 2.6-6.1 2.6-2.6 0-4.6-.8-6-2.5l-13-16.2v9c0 2.6-.4 4.5-1.3 6-1.6 2.6-4 3.9-7.1 3.9-2.8 0-5-.9-6.5-2.8-1.4-1.7-2.2-4.1-2.2-6.9V10.6c0-2.7.7-5 2.2-6.8C126.2 2 128.3 1 131 1c2.6 0 4.7.9 6.5 2.8 1 1 1.6 2.1 1.8 3.1.2.7.2 1.9.2 3.7v8.3z' />
                  <path fill='#2bde73' d='M177.7 33.6c1.9 0 3.9.8 6.1 2.5 2.7 2.1 4.5 3.1 5.5 3.1 1.5 0 2.2-.8 2.2-2.3 0-.8-.4-1.5-1.3-2.1-.5-.3-3-1.3-7.7-2.9-7.6-2.7-11.4-7.6-11.4-14.9 0-5.5 2-9.8 6-12.9C180.7 1.4 185 0 190.2 0c4.5 0 8.4 1.1 11.7 3.2 3.3 2.1 5 4.9 5 8.3 0 2-.6 3.7-1.9 5.1-1.3 1.4-2.9 2-4.9 2-2.1 0-4.4-1-7-3-1.6-1.2-2.8-1.9-3.6-1.9-1.4 0-2.1.7-2.1 2s1.7 2.5 5.2 3.5c4.8 1.5 8.4 3.3 11 5.5 3.5 2.9 5.2 6.9 5.2 12.1 0 5.7-1.9 10.1-5.8 13.3-3.6 3-8.3 4.4-14.1 4.4-5.8 0-10.6-1.5-14.4-4.6-3-2.5-4.6-5.3-4.6-8.6 0-2.2.7-4 2.2-5.5 1.6-1.4 3.4-2.2 5.6-2.2zm45.7-16.3h-4.5c-2.5 0-4.6-.7-6.2-2-1.7-1.5-2.6-3.4-2.6-5.9 0-1.5.4-2.9 1.2-4.2.8-1.4 1.9-2.3 3.2-2.9 1.3-.6 4.4-.9 9.3-.9H241c4.2 0 7 .3 8.2.8 1.4.6 2.5 1.5 3.3 2.9.8 1.4 1.3 2.8 1.3 4.3 0 2.4-.9 4.4-2.8 6.1-1.3 1.2-3.5 1.9-6.6 1.9h-3.9v25.8c0 2.8-.5 5-1.4 6.5-1.6 2.6-4 3.9-7 3.9-3.1 0-5.4-1.2-7.1-3.5-1-1.5-1.6-3.7-1.6-6.7V17.3zm41.5 29.2c-.8 1.9-1.6 3.4-2.5 4.3-1.7 1.9-3.8 2.8-6.3 2.8-3 0-5.4-1.2-7-3.6-1-1.4-1.5-3.1-1.5-4.9 0-1.5.4-3 1.1-4.5l16.2-34.5c1.6-3.4 4.2-5 7.9-5s6.4 1.7 8 5.2L297.2 41c.7 1.4 1 2.8 1 4.1 0 2-.7 3.8-2 5.4-1.7 2.1-3.9 3.1-6.6 3.1-2.2 0-4-.7-5.5-2-1.1-1-2.2-2.7-3.3-5h-15.9zm71-13.3l4 6.5c1.1 1.8 1.7 3.6 1.7 5.5 0 2.4-.8 4.4-2.5 6-1.7 1.6-3.7 2.4-6.1 2.4-3.1 0-5.4-1.3-7-3.9L318.9 38v7c0 2.4-.8 4.4-2.4 6.1-1.6 1.7-3.6 2.5-6 2.5-2.9 0-5.2-1-6.7-3.2-1.4-1.8-2-4.3-2-7.3V11.2c0-6.6 3.5-9.8 10.6-9.8h10.9c3.6 0 6.9 1 9.9 3.1 3.1 2.1 5.3 4.7 6.7 8 1.1 2.5 1.6 5 1.6 7.5 0 4.7-1.9 9.1-5.6 13.2zm20.3-15.9h-4.5c-2.5 0-4.6-.7-6.2-2-1.7-1.5-2.6-3.4-2.6-5.9 0-1.5.4-2.9 1.2-4.2.8-1.4 1.9-2.3 3.2-2.9 1.3-.6 4.4-.9 9.3-.9h17.2c4.2 0 7 .3 8.2.8 1.4.6 2.5 1.5 3.3 2.9.8 1.4 1.3 2.8 1.3 4.3 0 2.4-.9 4.4-2.8 6.1-1.3 1.2-3.5 1.9-6.6 1.9h-3.9v25.8c0 2.8-.5 5-1.4 6.5-1.6 2.6-4 3.9-7 3.9-3.1 0-5.4-1.2-7.1-3.5-1-1.5-1.6-3.7-1.6-6.7V17.3zm50.6 19.9h7.8c3.2 0 5.6.7 7.2 2 1.8 1.6 2.8 3.6 2.8 6.1 0 2.5-.9 4.6-2.8 6.1-1.4 1.2-3.8 1.8-7.1 1.8h-13.3c-3.1 0-5.3-.2-6.5-.7-2.3-.9-3.8-2.5-4.5-4.6-.5-1.4-.7-3.6-.7-6.7V13c0-2.4.1-3.9.2-4.7.3-1.6.9-3 2-4.2 1.2-1.3 2.8-2.1 4.6-2.5.9-.2 2.7-.2 5.4-.2h10.2c2.8 0 4.4 0 4.9.1 1.8.2 3.3.7 4.5 1.6 2.1 1.6 3.1 3.6 3.1 6.1 0 2.7-.9 4.8-2.7 6.3-1.6 1.3-3.8 1.9-6.6 1.9h-8.4v3.5h6.7c2 0 3.6.5 4.9 1.6 1.4 1.1 2 2.6 2 4.6 0 4.1-2.5 6.2-7.5 6.2h-6.1v3.9zm54.9-4l4 6.5c1.1 1.8 1.7 3.6 1.7 5.5 0 2.4-.8 4.4-2.5 6-1.7 1.6-3.7 2.4-6.1 2.4-3.1 0-5.4-1.3-7-3.9L444.7 38v7c0 2.4-.8 4.4-2.4 6.1-1.6 1.7-3.6 2.5-6 2.5-2.9 0-5.2-1-6.7-3.2-1.4-1.8-2-4.3-2-7.3V11.2c0-6.6 3.5-9.8 10.6-9.8h10.9c3.6 0 6.9 1 9.9 3.1 3.1 2.1 5.3 4.7 6.7 8 1.1 2.5 1.6 5 1.6 7.5 0 4.7-1.9 9.1-5.6 13.2z' />
                </svg>
              </div>
              <svg className={styles.kickstarterMobile} viewBox='0 0 32 32'>
                <path fill='#151C0E' d='M30.1 32H1.9c-1 0-1.9-.9-1.9-1.9V1.9C0 .9.9 0 1.9 0h28.2c1 0 1.9.9 1.9 1.9v28.2c0 1-.9 1.9-1.9 1.9z' />
                <path fill='#2EDD72' d='M14.6 13.2l3.2-4.6c.6-.9 1.4-1.3 2.3-1.3.8 0 1.5.3 2 .8.6.6.9 1.2.9 2 0 .6-.2 1.1-.5 1.5l-2.9 4.2 3.5 4.5c.4.4.5 1 .5 1.6 0 .8-.3 1.5-.8 2-.6.6-1.2.9-2 .9-.9 0-1.5-.3-2-.8l-4.3-5.4v3c0 .8-.1 1.5-.4 2-.5.9-1.3 1.3-2.3 1.3-.9 0-1.7-.3-2.2-.9-.4-.8-.6-1.5-.6-2.5v-11c0-.9.2-1.7.7-2.2.5-.6 1.2-.9 2.1-.9.9 0 1.6.3 2.1.9.3.3.5.7.6 1 .1.2.1.6.1 1.2v2.7z' />
                <path fill='#151C0E' d='M30.1 32H1.9c-1 0-1.9-.9-1.9-1.9V1.9C0 .9.9 0 1.9 0h28.2c1 0 1.9.9 1.9 1.9v28.2c0 1-.9 1.9-1.9 1.9z' />
                <path fill='#2EDE73' d='M14.6 13.2l3.2-4.6c.6-.9 1.4-1.3 2.3-1.3.8 0 1.5.3 2 .8.6.6.9 1.2.9 2 0 .6-.2 1.1-.5 1.5l-2.9 4.2 3.5 4.5c.4.4.5 1 .5 1.6 0 .8-.3 1.5-.8 2-.6.6-1.2.9-2 .9-.9 0-1.5-.3-2-.8l-4.3-5.4v3c0 .8-.1 1.5-.4 2-.5.9-1.3 1.3-2.3 1.3-.9 0-1.7-.3-2.2-.9-.4-.8-.6-1.6-.6-2.5v-11c0-.9.2-1.7.7-2.2.5-.6 1.2-.9 2.1-.9.9 0 1.6.3 2.1.9.3.3.5.7.6 1 .1.2.1.6.1 1.2v2.7z' />
              </svg>
            </a> }
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
