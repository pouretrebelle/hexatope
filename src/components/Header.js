import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import styles from './Header.sass';

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
    const { demoVisibleOnMobile, rewardVolumeApproved } = this.props.UIStore;

    return (
      <div className={styles.header}>
        <header className={styles.navbar}>
          <a href={'/'} className={styles.logoLink}>
            <Logo className={styles.logo} />
          </a>
          <aside className={styles.navbarRight}>
            { !rewardVolumeApproved &&
              <span>Too Big</span>
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
