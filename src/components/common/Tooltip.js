import React from 'react';
import PropTypes from 'prop-types';

import styles from './Tooltip.sass';

const Tooltip = ({ label, children }) => (
  <div className={styles.tooltipWrapper}>
    <div className={styles.tooltip}>
      {label}
    </div>
    {children}
  </div>
);

Tooltip.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
