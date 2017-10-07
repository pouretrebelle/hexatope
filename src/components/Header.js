import React from 'react';
import styles from './Header.sass';

import Logo from 'components/icons/Logo';

const Header = () => (
  <header className={styles.header}>
    <a href={'/'} className={styles.logoLink}>
      <Logo className={styles.logo} />
    </a>
  </header>
);

export default Header;
